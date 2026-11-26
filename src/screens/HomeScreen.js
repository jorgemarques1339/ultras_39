import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  Animated,
  Image,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapPin,
  Clock,
  Navigation,
  ChevronRight,
  Drum,
  Trophy,
  Zap,
  Lock,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { NEXT_MATCH, MATCHDAY_DATA, PAST_RESULTS, CHANT_OF_THE_WEEK } from '../data/mockData';
import {
  getNextMatchData,
  fetchLiveSchedule,
  fetchLiveResults,
  fetchRioAveRoster,
  fetchLigaStandings,
  OFFICIAL_PLAYER_PHOTOS,
} from '../services/matchesService';
import ClubBadge from '../components/ClubBadge';
import JogosModal from '../components/JogosModal';
import ResultadoModal from '../components/ResultadoModal';
import DeslocacaoModal from '../components/DeslocacaoModal';
import PlantelModal, { RioAveJerseyIcon } from '../components/PlantelModal';
import TabelaModal from '../components/TabelaModal';
import TicketsSuspendedModal from '../components/TicketsSuspendedModal';
import HomeTicketModal from '../components/HomeTicketModal';
import MatchCenterCarousel, { SAMPLE_MATCH_CENTER_DATA } from '../components/MatchCenterCarousel';

function HomeScreen({
  user,
  onScroll,
  onOpenChants,
  isDark = true,
  isActive = true,
  isLoggedIn = false,
}) {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 650;
  const isSmallScreen = height < 740;

  // Suspensão temporária da marcação de deslocações pela app (alterar para false para reativar DeslocacaoModal)
  const DESLOCACAO_PURCHASE_SUSPENDED = true;

  // Modo Dia de Jogo: desativado por agora (só será ativo faltando 1 hora para o jogo)
  const isMatchdayActive = false;
  const [jogosModalVisible, setJogosModalVisible] = useState(false);
  const [resultadoModalVisible, setResultadoModalVisible] = useState(false);
  const [deslocacaoModalVisible, setDeslocacaoModalVisible] = useState(false);
  const [ticketsNoticeVisible, setTicketsNoticeVisible] = useState(false);
  const [ticketsNoticeMode, setTicketsNoticeMode] = useState('deslocacao');
  const [homeTicketModalVisible, setHomeTicketModalVisible] = useState(false);
  const [selectedHomeMatch, setSelectedHomeMatch] = useState(null);

  const isBigThreeMatch = useCallback((matchItem) => {
    const names = `${matchItem?.homeTeam?.name || ''} ${matchItem?.awayTeam?.name || ''}`.toLowerCase();
    return names.includes('sporting') || names.includes('porto') || names.includes('benfica');
  }, []);
  const [plantelModalVisible, setPlantelModalVisible] = useState(false);
  const [tabelaModalVisible, setTabelaModalVisible] = useState(false);
  const [votedPlayerId, setVotedPlayerId] = useState(null);
  const [motmList, setMotmList] = useState(MATCHDAY_DATA.motmCandidates);
  const [nextMatch, setNextMatch] = useState(NEXT_MATCH);
  const [liveUpcoming, setLiveUpcoming] = useState([]);
  const [liveResults, setLiveResults] = useState(PAST_RESULTS);
  const mainScrollRef = useRef(null);

  // Carregar dados oficiais do próximo jogo, resultados e pré-carregar Plantel/Tabela em tempo real
  useEffect(() => {
    if (!isActive) return;
    let isMounted = true;
    const syncMatches = (force = false) => {
      getNextMatchData(force)
        .then((liveMatch) => {
          if (isMounted && liveMatch) {
            setNextMatch(liveMatch);
          }
        })
        .catch((err) => console.warn('Erro ao atualizar próximo jogo:', err));

      fetchLiveSchedule(force)
        .then((upcoming) => {
          if (isMounted && Array.isArray(upcoming) && upcoming.length > 0) {
            setLiveUpcoming(upcoming);
          }
        })
        .catch(() => {});

      fetchLiveResults(force)
        .then((results) => {
          if (isMounted && Array.isArray(results) && results.length > 0) {
            setLiveResults(results);
          }
        })
        .catch(() => {});
    };

    syncMatches(false);
    const prefetchTimer = setTimeout(() => {
      if (!isMounted) return;
      fetchRioAveRoster(false).catch(() => {});
      fetchLigaStandings(false).catch(() => {});
      Object.values(OFFICIAL_PLAYER_PHOTOS).forEach((uri) => {
        Image.prefetch(uri).catch(() => {});
      });
    }, 1200);
    const interval = setInterval(() => syncMatches(true), 60000);

    return () => {
      isMounted = false;
      clearTimeout(prefetchTimer);
      clearInterval(interval);
    };
  }, [isActive]);

  const handleVoteMotm = useCallback((playerId) => {
    setVotedPlayerId((current) => {
      if (current === playerId) return current;
      setMotmList((prev) =>
        prev.map((p) => {
          if (p.id === playerId) {
            return { ...p, votes: p.votes + 1, pct: Math.min(100, p.pct + 3) };
          }
          return p;
        })
      );
      return playerId;
    });
  }, []);

  const matchCenterSlides = useMemo(() => {
    const formatShortPt = (rawDate, fallback = '') => {
      if (!rawDate) return fallback || 'A DEFINIR';
      const d = new Date(rawDate);
      if (Number.isNaN(d.getTime())) return fallback || 'A DEFINIR';
      const dias = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dias[d.getDay()]}, ${dd}/${mm}`;
    };

    if (!liveUpcoming || liveUpcoming.length === 0) {
      return SAMPLE_MATCH_CENTER_DATA;
    }

    const pastThree = (liveResults || [])
      .slice(0, 3)
      .reverse()
      .map((r, idx) => ({
        id: r.id || `mc-past-${idx}`,
        type: 'past',
        competition: (r.competition?.split('·')[0] || 'LIGA PORTUGAL BETCLIC').trim().toUpperCase(),
        dateShort: formatShortPt(r.rawDate, (r.date || '').toUpperCase()),
        time: '',
        score: `${r.scoreHome ?? 0} - ${r.scoreAway ?? 0}`,
        homeTeam: { name: r.home, logo: r.homeLogo || null },
        awayTeam: { name: r.away, logo: r.awayLogo || null },
        isHome: String(r.home || '').toLowerCase().includes('rio ave'),
      }));

    const nextAndFuture = liveUpcoming.slice(0, 4).map((m, idx) => ({
      id: m.id || `mc-up-${idx}`,
      type: idx === 0 ? 'next' : 'future',
      competition: (m.competition || 'LIGA PORTUGAL BETCLIC').toUpperCase(),
      dateShort: formatShortPt(m.rawDate || m.date, m.dateFormatted),
      rawDate: m.rawDate || m.date || null,
      time: m.time || '20:30',
      score: null,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      isHome: m.isHome,
    }));

    return [...pastThree, ...nextAndFuture];
  }, [liveResults, liveUpcoming]);

  return (
    <View style={[styles.container, !isDark && styles.containerLight]}>
      {/* LOGÓTIPO DE FUNDO DA CLAQUE (GRUPO 39) */}
      <View style={styles.backgroundContainer} pointerEvents="none">
        <Image
          source={require('../../assets/logo_39.png')}
          style={[styles.backgroundImage, !isDark && styles.backgroundImageLight]}
          resizeMode="contain"
        />
        <View style={[styles.backgroundOverlay, !isDark && styles.backgroundOverlayLight]} />
      </View>

      <ScrollView
        ref={mainScrollRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: isTablet ? 115 : (isSmallScreen ? 100 : 112),
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* CABEÇALHO SUPERIOR: MATCH CENTER CAROUSEL (FULL-WIDTH MARGEM A MARGEM) */}
        <View style={styles.matchCenterBleed}>
          <MatchCenterCarousel
            matches={matchCenterSlides}
            onPressTickets={(m) => {
              if (isBigThreeMatch(m)) {
                setTicketsNoticeMode('big3');
                setTicketsNoticeVisible(true);
                return;
              }
              if (m?.isHome) {
                setSelectedHomeMatch(m);
                setHomeTicketModalVisible(true);
                return;
              }
              if (DESLOCACAO_PURCHASE_SUSPENDED) {
                setTicketsNoticeMode('deslocacao');
                setTicketsNoticeVisible(true);
                return;
              }
              setDeslocacaoModalVisible(true);
            }}
            onPressSummary={() => setResultadoModalVisible(true)}
            isDark={isDark}
            isActive={isActive}
          />
        </View>

        {/* DESTAQUE PRINCIPAL: CÂNTICOS G39 (EM DESENVOLVIMENTO) */}
        <View style={[styles.chantsCenterWrapper, isSmallScreen && styles.chantsCenterWrapperSmall]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWithIcon}>
              <View style={[styles.sectionIconBoxGreen, !isDark && styles.newsHeaderIconBoxLight]}>
                <Drum size={13} color={isDark ? '#00E676' : '#00874E'} />
              </View>
              <Text style={[styles.sectionTitle, styles.newsSectionTitle, !isDark && styles.sectionTitleLight]}>
                Cânticos
              </Text>
            </View>
          </View>
          <View
            style={styles.chantsTouchFull}
            accessibilityState={{ disabled: true }}
            accessibilityLabel="Cânticos Grupo 39 em desenvolvimento"
          >
            <LinearGradient
              colors={
                isDark
                  ? ['#14201A', '#0E1712']
                  : ['#EEF4F0', '#F7FAF8']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.chantsCenteredBtn,
                styles.chantsDisabledCard,
                !isDark && styles.chantsDisabledCardLight,
                isSmallScreen && styles.chantsCenteredBtnSmall,
              ]}
            >
              <View style={styles.chantsLogoWrapper}>
                <Image
                  source={require('../../assets/logo_39.png')}
                  style={styles.chantsLogoImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.chantsTextBoxCentered}>
                <View style={[styles.chantsDevBadge, !isDark && styles.chantsDevBadgeLight]}>
                  <Text style={[styles.chantsDevBadgeText, !isDark && styles.chantsDevBadgeTextLight]}>
                    EM DESENVOLVIMENTO
                  </Text>
                </View>
                <Text style={[styles.shortcutTitleCentered, !isDark && styles.textDark]} numberOfLines={1}>
                  Cânticos Grupo 39
                </Text>
                <Text style={[styles.shortcutDescCentered, !isDark && styles.chantsDisabledDescLight]} numberOfLines={1}>
                  Letra e ritmos disponíveis em breve
                </Text>
              </View>
              <View style={[styles.chantsLockCircle, !isDark && styles.chantsLockCircleLight]}>
                <Lock size={13} color={isDark ? '#8DA397' : '#5A6E63'} />
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* SECÇÃO: ATALHOS RÁPIDOS (PLANTEL & TABELA) */}
        <View style={[styles.quickShortcutsSection, isSmallScreen && styles.quickShortcutsSectionSmall]}>
          <View style={[styles.sectionHeader, styles.quickShortcutsHeaderCentered]}>
            <View style={styles.sectionTitleWithIcon}>
              <View style={[styles.sectionIconBoxGreen, !isDark && styles.newsHeaderIconBoxLight]}>
                <Zap size={13} color={isDark ? '#00E676' : '#00874E'} />
              </View>
              <Text style={[styles.sectionTitle, styles.newsSectionTitle, !isDark && styles.sectionTitleLight]}>
                Atalhos Rápidos
              </Text>
            </View>
          </View>

          <View style={styles.quickShortcutsRow}>
            {/* 1. Botão Plantel (Camisola Verde e Branca) */}
            <Pressable
              style={({ pressed }) => [
                styles.quickShortcutCard,
                isSmallScreen && styles.quickShortcutCardSmall,
                !isDark && styles.quickShortcutCardLight,
                pressed && styles.quickShortcutCardPressed,
              ]}
              onPress={() => setPlantelModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Abrir Plantel do Rio Ave FC"
            >
              <View style={[styles.quickShortcutIconBox, !isDark && styles.quickShortcutIconBoxLight]}>
                <RioAveJerseyIcon size={25} />
              </View>
              <View style={styles.quickShortcutTextCol}>
                <Text style={[styles.quickShortcutTitle, !isDark && styles.textDark]} numberOfLines={2}>
                  Plantel
                </Text>
                <Text style={[styles.quickShortcutSub, !isDark && styles.chantsDisabledDescLight]} numberOfLines={2}>
                  Equipa 26/27
                </Text>
              </View>
            </Pressable>

            {/* 2. Botão Tabela Classificativa */}
            <Pressable
              style={({ pressed }) => [
                styles.quickShortcutCard,
                isSmallScreen && styles.quickShortcutCardSmall,
                !isDark && styles.quickShortcutCardLight,
                pressed && styles.quickShortcutCardPressed,
              ]}
              onPress={() => setTabelaModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Abrir Tabela Classificativa da Liga Portugal Betclic"
            >
              <View style={[styles.quickShortcutIconBox, !isDark && styles.quickShortcutIconBoxLight]}>
                <Trophy size={22} strokeWidth={2.4} color={isDark ? '#00E676' : '#008751'} />
              </View>
              <View style={styles.quickShortcutTextCol}>
                <Text style={[styles.quickShortcutTitle, !isDark && styles.textDark]} numberOfLines={2}>
                  Tabela
                </Text>
                <Text style={[styles.quickShortcutSub, !isDark && styles.chantsDisabledDescLight]} numberOfLines={2}>
                  Liga Betclic
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

      {/* 2. MODO DIA DE JOGO (ATIVO APENAS FALTANDO 1 HORA PARA O JOGO) */}
      {isMatchdayActive && (
        <View style={styles.matchdayCard}>
          <View style={styles.matchdayHeaderRow}>
            <View style={styles.matchdayLiveBadge}>
              <View style={styles.greenLivePulse} />
              <Text style={styles.matchdayLiveBadgeText}>MODO DIA DE JOGO</Text>
            </View>
            <Text style={styles.matchdayStatusText}>{MATCHDAY_DATA.status}</Text>
          </View>

          {/* Marcador em Direto */}
          <View style={styles.liveScoreboardRow}>
            <View style={styles.scoreTeamCol}>
              <Text style={styles.scoreTeamName}>RIO AVE</Text>
            </View>
            <View style={styles.scoreDigitsBox}>
              <Text style={styles.scoreDigitGreen}>{MATCHDAY_DATA.homeScore}</Text>
              <Text style={styles.scoreSeparator}>-</Text>
              <Text style={styles.scoreDigit}>{MATCHDAY_DATA.awayScore}</Text>
            </View>
            <View style={styles.scoreTeamColRight}>
              <Text style={styles.scoreTeamName}>E. AMADORA</Text>
            </View>
          </View>

          {/* Evento Recente */}
          <View style={styles.liveEventNotice}>
            <Text style={styles.liveEventText}>{MATCHDAY_DATA.events[0].text}</Text>
          </View>

          {/* Ponto de Encontro da Bancada Poente */}
          <View style={styles.meetingPointBox}>
            <View style={styles.meetingPointHeader}>
              <MapPin size={13} color={COLORS.gold} />
              <Text style={styles.meetingPointTitle}>{MATCHDAY_DATA.meetingPoint.title}</Text>
            </View>
            <Text style={styles.meetingPointDesc}>{MATCHDAY_DATA.meetingPoint.instructions}</Text>
          </View>

          {/* Votação: Guerreiro da Bancada */}
          <View style={styles.motmSection}>
            <View style={styles.motmHeader}>
              <Trophy size={14} color={COLORS.gold} />
              <Text style={styles.motmTitle}>Eleger "Guerreiro da Bancada"</Text>
            </View>

            <View style={styles.motmGrid}>
              {motmList.map((player) => {
                const hasVoted = votedPlayerId === player.id;
                return (
                  <TouchableOpacity
                    key={player.id}
                    style={[styles.motmCandidateCard, hasVoted && styles.motmCandidateCardActive]}
                    onPress={() => handleVoteMotm(player.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.motmTopLine}>
                      <Text style={styles.motmPlayerNumber}>#{player.number}</Text>
                      <Text style={[styles.motmPlayerName, hasVoted && styles.motmPlayerNameActive]}>
                        {player.name}
                      </Text>
                    </View>
                    <View style={styles.motmBarContainer}>
                      <View style={[styles.motmBarFill, { width: `${player.pct}%` }]} />
                    </View>
                    <View style={styles.motmBottomLine}>
                      <Text style={styles.motmVotesCount}>{player.votes} votos</Text>
                      <Text style={styles.motmPctText}>{player.pct}%</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      </ScrollView>

      {/* Modais montados sob demanda para melhor desempenho em smartphones */}
      {jogosModalVisible && (
        <JogosModal
          visible={jogosModalVisible}
          onClose={() => setJogosModalVisible(false)}
          isDark={isDark}
        />
      )}

      {resultadoModalVisible && (
        <ResultadoModal
          visible={resultadoModalVisible}
          onClose={() => setResultadoModalVisible(false)}
          isDark={isDark}
        />
      )}

      {deslocacaoModalVisible && (
        <DeslocacaoModal
          visible={deslocacaoModalVisible}
          onClose={() => setDeslocacaoModalVisible(false)}
          nextMatch={nextMatch}
          user={user}
          isDark={isDark}
          isLoggedIn={isLoggedIn}
        />
      )}

      {plantelModalVisible && (
        <PlantelModal
          visible={plantelModalVisible}
          onClose={() => setPlantelModalVisible(false)}
          isDark={isDark}
        />
      )}

      {tabelaModalVisible && (
        <TabelaModal
          visible={tabelaModalVisible}
          onClose={() => setTabelaModalVisible(false)}
          isDark={isDark}
        />
      )}

      {ticketsNoticeVisible && (
        <TicketsSuspendedModal
          visible={ticketsNoticeVisible}
          onClose={() => setTicketsNoticeVisible(false)}
          isDark={isDark}
          mode={ticketsNoticeMode}
        />
      )}

      {homeTicketModalVisible && (
        <HomeTicketModal
          visible={homeTicketModalVisible}
          onClose={() => setHomeTicketModalVisible(false)}
          match={selectedHomeMatch}
          user={user}
          isDark={isDark}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1310',
    position: 'relative',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 14,
    paddingTop: 14,
    gap: 16,
  },
  matchCenterBleed: {
    marginHorizontal: -14,
    marginTop: -14,
  },
  sectionIconBoxGreen: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastResultSection: {
    width: '100%',
    marginTop: 0,
    marginBottom: 0,
  },
  quickShortcutsSection: {
    width: '100%',
    marginTop: 14,
    marginBottom: 0,
  },
  quickShortcutsSectionSmall: {
    marginTop: 8,
  },
  quickShortcutsHeaderCentered: {
    justifyContent: 'center',
  },
  quickShortcutsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickShortcutCard: {
    flex: 1,
    minHeight: 114,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: '#14201A',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.24)',
    borderRadius: 20,
    padding: 16,
    opacity: 0.9,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 26px rgba(0, 0, 0, 0.42), 0 2px 8px rgba(0, 230, 118, 0.08)',
        transition: 'transform 140ms ease, opacity 140ms ease',
        cursor: 'pointer',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.34,
        shadowRadius: 14,
        elevation: 6,
      },
    }),
  },
  quickShortcutCardSmall: {
    minHeight: 102,
    padding: 14,
    gap: 8,
  },
  quickShortcutCardLight: {
    backgroundColor: 'rgba(238, 244, 240, 0.85)',
    borderColor: 'rgba(0, 135, 81, 0.16)',
    opacity: 0.9,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 26px rgba(10, 45, 28, 0.10), 0 2px 8px rgba(0, 135, 81, 0.06)',
      },
      default: {
        shadowColor: '#0A2D1C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 4,
      },
    }),
  },
  quickShortcutCardPressed: {
    transform: [{ scale: 0.965 }],
    opacity: 0.86,
  },
  quickShortcutIconBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 135, 81, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickShortcutIconBoxLight: {
    backgroundColor: '#EBF7F0',
    borderColor: 'rgba(0, 135, 81, 0.25)',
  },
  quickShortcutTextCol: {
    width: '100%',
    alignItems: 'flex-start',
  },
  quickShortcutTitle: {
    color: '#FFFFFF',
    fontFamily: Platform.select({
      web: "'Inter', 'Roboto', system-ui, -apple-system, sans-serif",
      default: 'System',
    }),
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  quickShortcutSub: {
    color: '#8FA89B',
    fontFamily: Platform.select({
      web: "'Inter', 'Roboto', system-ui, -apple-system, sans-serif",
      default: 'System',
    }),
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    marginTop: 3,
  },
  newsHeaderIconBox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: 'rgba(242, 182, 0, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.36)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsHeaderIconBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.28)',
  },
  newsSectionTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  newsHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  newsDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  newsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  newsDotActive: {
    width: 16,
    backgroundColor: '#F2B600',
  },
  newsDotLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.2)',
  },
  newsDotActiveLight: {
    width: 16,
    backgroundColor: '#00874E',
  },
  newsFlashscoreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(242, 182, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.28)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  newsFlashscoreLinkLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.24)',
  },
  newsFeaturedCard: {
    borderRadius: 16,
    borderWidth: 1.3,
    borderColor: 'rgba(242, 182, 0, 0.45)',
    overflow: 'hidden',
    position: 'relative',
    minHeight: 94,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 22px rgba(0, 0, 0, 0.4), 0 0 16px rgba(242, 182, 0, 0.14)',
      },
      default: {
        shadowColor: '#F2B600',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
      },
    }),
  },
  newsFeaturedCardLight: {
    borderColor: 'rgba(0, 135, 78, 0.34)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 135, 78, 0.12)',
      },
    }),
  },
  newsAccentLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  newsFeaturedContent: {
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 14,
    gap: 7,
  },
  newsRollCard: {
    overflow: 'hidden',
    minHeight: 74,
    justifyContent: 'center',
  },
  newsTypePillResult: {
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newsTypePillResultLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.28)',
  },
  newsTypePillResultText: {
    color: '#00E676',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  newsTypePillResultTextLight: {
    color: '#00874E',
  },
  newsTypePillArticle: {
    backgroundColor: 'rgba(242, 182, 0, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.32)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newsTypePillArticleLight: {
    backgroundColor: 'rgba(184, 134, 0, 0.12)',
    borderColor: 'rgba(184, 134, 0, 0.28)',
  },
  newsTypePillArticleText: {
    color: '#F2B600',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  newsTypePillArticleTextLight: {
    color: '#9A6E00',
  },
  newsTypePillTransfer: {
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.36)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newsTypePillTransferLight: {
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    borderColor: 'rgba(2, 132, 199, 0.28)',
  },
  newsTypePillTransferText: {
    color: '#38BDF8',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  newsTypePillTransferTextLight: {
    color: '#0284C7',
  },
  newsSlideBody: {
    gap: 5,
  },
  newsArticleTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 17,
  },
  newsArticleTitleLight: {
    color: '#14201A',
  },
  newsArticleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  newsArticleSub: {
    color: '#9CAFA4',
    fontSize: 10.5,
    fontWeight: '600',
    flex: 1,
  },
  newsArticleSubLight: {
    color: '#5A6E63',
  },
  seeAllLink: {
    color: '#00E676',
    fontSize: 11.5,
    fontWeight: '700',
  },
  seeAllLinkLight: {
    color: '#00874E',
  },
  lastResultCard: {
    backgroundColor: 'rgba(17, 26, 20, 0.84)',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  lastResultCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.14)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  lastResultTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  lastResultComp: {
    color: '#9CAFA4',
    fontSize: 10,
    fontWeight: '700',
    flex: 1,
  },
  lastResultCompLight: {
    color: '#5A6E63',
  },
  lastResultDate: {
    color: '#7E9187',
    fontSize: 10,
    fontWeight: '600',
  },
  lastResultDateLight: {
    color: '#7E9187',
  },
  lastResultScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  lastResultTeamGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lastResultTeamGroupRight: {
    justifyContent: 'flex-end',
  },
  lastResultTeam: {
    flexShrink: 1,
    color: '#D5E2DA',
    fontSize: 12.5,
    fontWeight: '700',
  },
  lastResultTeamRight: {
    textAlign: 'right',
  },
  lastResultTeamHighlight: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  lastResultTeamLight: {
    color: '#14201A',
  },
  lastResultScoreBox: {
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lastResultScoreBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.28)',
  },
  lastResultScoreText: {
    color: '#00E676',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  lastResultScoreTextLight: {
    color: '#00874E',
  },
  lastResultScorers: {
    color: '#9CAFA4',
    fontSize: 10.5,
    lineHeight: 15,
    textAlign: 'center',
  },
  lastResultScorersLight: {
    color: '#5A6E63',
  },
  containerLight: {
    backgroundColor: '#F5F8F6',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 64,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 0,
  },
  backgroundImage: {
    width: '88%',
    maxWidth: 380,
    aspectRatio: 1,
    opacity: 0.28,
  },
  backgroundImageLight: {
    opacity: 0.22,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  backgroundOverlayLight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },

  // Hero Match Card
  heroCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 230, 118, 0.32)',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    marginBottom: 0,
    flexShrink: 0,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.42), 0 0 18px rgba(0, 179, 104, 0.18)',
      },
      default: {
        shadowColor: '#00B368',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
  heroCardSmall: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 11,
    marginBottom: 0,
  },
  heroAccentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  heroStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  heroStatusPillLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.28)',
  },
  heroStatusPillLive: {
    backgroundColor: 'rgba(255, 82, 82, 0.18)',
    borderColor: 'rgba(255, 82, 82, 0.45)',
  },
  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
  },
  heroStatusDotLive: {
    backgroundColor: '#FF5252',
  },
  heroStatusText: {
    color: '#00E676',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  heroStatusTextLight: {
    color: '#00874E',
  },
  heroStatusTextLive: {
    color: '#FF5252',
  },
  formPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 999,
  },
  formPillLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderColor: 'rgba(0, 135, 78, 0.16)',
  },
  formLabel: {
    color: '#A5B8AE',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  formLabelLight: {
    color: '#4F665B',
  },
  formDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  formDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formDotWin: {
    backgroundColor: '#00B368',
  },
  formDotDraw: {
    backgroundColor: '#D9A100',
  },
  formDotLoss: {
    backgroundColor: '#D94343',
  },
  formDotText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  emblemHalo: {
    padding: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 230, 118, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 4,
  },
  emblemHaloLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.06)',
    borderColor: 'rgba(0, 135, 78, 0.14)',
  },
  vsBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 4,
  },
  vsBadgeLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.3)',
  },
  heroTopBar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  compInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compName: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  compRoundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  compRound: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 1,
  },
  liveMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryLight,
  },
  liveMatchBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },

  // Equipas
  matchTeamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamColumn: {
    flex: 1.2,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  teamEmblem: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#00874E',
    borderWidth: 2,
    borderColor: '#00B368',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  awayEmblem: {
    backgroundColor: '#A81C21',
    borderColor: '#E31B23',
  },
  teamInitials: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
  },
  awayInitials: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
  },
  teamName: {
    color: COLORS.white,
    fontSize: 12.5,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 15.5,
  },
  teamRole: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    marginTop: 1.5,
  },
  vsColumn: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  vsText: {
    color: '#F2B600',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  stadiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: '#1A2922',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginBottom: 3,
  },
  stadiumTagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  matchTime: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Contagem Decrescente (Countdown) por baixo da data/hora
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    backgroundColor: 'rgba(0, 179, 104, 0.13)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 999,
  },
  countdownPillLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.08)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  countdownPillLive: {
    backgroundColor: 'rgba(255, 82, 82, 0.16)',
    borderColor: 'rgba(255, 82, 82, 0.45)',
  },
  countdownText: {
    color: '#00E676',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  countdownTextLight: {
    color: '#00874E',
  },
  countdownTextLive: {
    color: '#FF5252',
  },

  // Secção Ponto de Encontro / Convívio no Rodapé do Hero Card
  meetingPointBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 2,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.42)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 179, 104, 0.16)',
      },
      default: {
        shadowColor: '#00B368',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  meetingPointBarLight: {
    borderColor: 'rgba(0, 135, 78, 0.32)',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 12px rgba(0, 135, 78, 0.1)',
      },
    }),
  },
  meetingPointBarTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 7,
  },
  meetingPointIconBox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 230, 118, 0.24)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meetingPointIconBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.16)',
    borderColor: 'rgba(0, 135, 78, 0.3)',
  },
  meetingPointTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  meetingPointBarText: {
    color: '#E6F4EC',
    fontSize: 11.5,
    fontWeight: '700',
    textAlign: 'left',
    flexShrink: 1,
  },
  meetingPointSubText: {
    color: '#C7E2D2',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  meetingPointBarTextLight: {
    color: '#1C3527',
  },
  meetingPointBarBold: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  meetingPointBarBoldLight: {
    color: '#006B3E',
  },
  meetingMapTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 5,
    backgroundColor: '#00874E',
    borderWidth: 1,
    borderColor: '#00C86F',
    paddingHorizontal: 16,
    paddingVertical: 5.5,
    borderRadius: 999,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 179, 104, 0.4)',
      },
    }),
  },
  meetingMapTagLight: {
    backgroundColor: '#00874E',
  },
  meetingMapTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.25,
  },
  meetingMapTagTextLight: {
    color: '#FFFFFF',
  },

  // Disponibilidade de Bilhetes no Hero Card
  heroAvailabilityWrapper: {
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 2,
    marginBottom: 6,
  },
  heroAvailabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  heroAvailabilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroAvailabilityPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
  },
  heroAvailabilityText: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroAvailabilityTextLight: {
    color: '#4B6355',
  },
  heroAvailabilityPct: {
    color: '#00E676',
    fontSize: 10,
    fontWeight: '900',
  },
  heroAvailabilityPctLight: {
    color: '#00874E',
  },
  heroAvailabilityTrack: {
    width: '100%',
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  heroAvailabilityTrackLight: {
    backgroundColor: '#E0E8E3',
  },
  heroAvailabilityFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#00B368',
  },

  // Botão Bilhete MB WAY Compacto e Centralizado
  heroBuyBtn: {
    alignSelf: 'center',
    marginTop: 8,
    backgroundColor: '#00874E',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#00B368',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 10px rgba(0, 135, 78, 0.3)',
      },
    }),
  },
  heroBuyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroBuyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketIconBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBuyTitle: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Botão "Bilhete" Adquirido em formato Card Organizado
  heroTicketPurchasedCard: {
    width: '100%',
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(12, 28, 19, 0.92)',
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 230, 118, 0.45)',
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(0, 230, 118, 0.22)',
      },
    }),
  },
  heroTicketPurchasedCardLight: {
    backgroundColor: '#EDF9F2',
    borderColor: 'rgba(0, 135, 78, 0.35)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 135, 78, 0.12)',
      },
    }),
  },
  heroTicketPurchasedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  ticketPurchasedIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 230, 118, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketPurchasedIconBoxLight: {
    backgroundColor: '#D1F2E0',
    borderColor: 'rgba(0, 135, 78, 0.35)',
  },
  ticketPurchasedCol: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  heroBuyTitlePurchased: {
    color: '#00E676',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  heroBuyTitlePurchasedLight: {
    color: '#00874E',
  },
  heroBuySubPurchased: {
    color: '#90ADA0',
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 1.5,
  },
  heroBuySubPurchasedLight: {
    color: '#4C6556',
  },
  heroTicketPurchasedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketPurchasedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 7.5,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: 'rgba(0, 230, 118, 0.35)',
  },
  ticketPurchasedBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  ticketPurchasedBadgeText: {
    color: '#00E676',
    fontSize: 10,
    fontWeight: '800',
  },
  ticketPurchasedBadgeTextLight: {
    color: '#00874E',
  },

  // Headers de Secção
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSeeAll: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },


  // News Card
  newsCard: {
    backgroundColor: '#14201A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    marginBottom: 14,
  },
  newsBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deslocacaoBadge: {
    backgroundColor: 'rgba(0, 179, 104, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deslocacaoBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
  },
  newsTimeAgo: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  newsCardTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 20,
  },
  newsCardDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  quickBookBusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A2922',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.4)',
  },
  quickBookBusText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },

  // Communique
  communiqueCard: {
    flexDirection: 'row',
    backgroundColor: '#14201A',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  communiqueIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communiqueContent: {
    flex: 1,
  },
  communiqueTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  communiqueDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },

  // Atalhos Rápidos da Claque
  // Cartão Bilhete + Deslocação
  deslocacaoCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(242, 182, 0, 0.38)',
    gap: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  deslocacaoCardLight: {
    borderColor: 'rgba(0, 135, 78, 0.28)',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 12px rgba(0, 135, 78, 0.1)',
      },
    }),
  },
  deslocacaoLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  deslocacaoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deslocacaoIconBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  deslocacaoTextCol: {
    flex: 1,
  },
  deslocacaoTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
  },
  deslocacaoSub: {
    color: '#9CAFA4',
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 1,
  },
  deslocacaoSubLight: {
    color: '#5A6E63',
  },
  deslocacaoCtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F2B600',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  deslocacaoCtaText: {
    color: '#0D1310',
    fontSize: 11,
    fontWeight: '900',
  },
  textDark: {
    color: '#14201A',
  },

  chantsCenterWrapper: {
    alignItems: 'center',
    marginBottom: 0,
    flexShrink: 0,
  },
  chantsCenterWrapperSmall: {
    marginBottom: 0,
  },
  chantsTouchFull: {
    width: '100%',
  },
  chantsCenteredBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 230, 118, 0.42)',
    gap: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 135, 78, 0.35)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  chantsCenteredBtnSmall: {
    paddingVertical: 7,
    gap: 9,
  },
  chantsLogoWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F2B600',
  },
  chantsLogoImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  chantsTextBoxCentered: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  chantsBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 1.5,
  },
  chantsWeekBadgeText: {
    color: '#F2B600',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  shortcutHeaderRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  shortcutTitleCentered: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  shortcutDescCentered: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 10,
    marginTop: 1,
  },
  chantsPlayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00E676',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  chantsDisabledCard: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.9,
    paddingVertical: 9,
  },
  chantsDisabledCardLight: {
    borderColor: 'rgba(0, 135, 78, 0.16)',
    opacity: 0.9,
  },
  chantsDevBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(242, 182, 0, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
    marginBottom: 3,
  },
  chantsDevBadgeLight: {
    backgroundColor: 'rgba(184, 134, 0, 0.12)',
    borderColor: 'rgba(184, 134, 0, 0.25)',
  },
  chantsDevBadgeText: {
    color: '#F2B600',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  chantsDevBadgeTextLight: {
    color: '#9A6E00',
  },
  chantsDisabledDescLight: {
    color: '#5A6E63',
  },
  chantsLockCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chantsLockCircleLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.08)',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  shortcutsSection: {
    width: '100%',
    marginTop: 6,
  },
  shortcutsSectionSmall: {
    marginTop: 4,
  },
  shortcutsGridContainer: {
    gap: 9,
    width: '100%',
  },
  singleShortcutRow: {
    width: '100%',
  },
  animatedBusWrapperSingle: {
    width: '100%',
    borderRadius: 13,
  },
  subShortcutCardPulsingSingle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(22, 36, 25, 0.82)',
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#00B368',
    gap: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 0 12px rgba(0, 179, 104, 0.35)',
      },
    }),
  },
  subShortcutCardLockedSingle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(19, 26, 21, 0.82)',
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.35)',
    gap: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      },
    }),
  },
  busLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  busTextRowSingle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  busAvailabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(242, 182, 0, 0.12)',
    paddingHorizontal: 6.5,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: 'rgba(242, 182, 0, 0.3)',
    flexShrink: 0,
  },
  busAvailabilityBadgeLight: {
    backgroundColor: 'rgba(242, 182, 0, 0.14)',
    borderColor: 'rgba(180, 130, 0, 0.28)',
  },
  busAvailabilityMiniTrack: {
    width: 20,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  busAvailabilityMiniFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#FFD700',
  },
  busAvailabilityText: {
    color: '#FFD700',
    fontSize: 9.5,
    fontWeight: '800',
  },
  busAvailabilityTextLight: {
    color: '#8A6200',
  },
  subShortcutTextPulsingSingle: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.1,
  },
  subShortcutTextSingle: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  busSubtitleSingle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  busSubtitleSingleLight: {
    color: '#65786C',
  },
  singleRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  singleRowPriceBadge: {
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '900',
  },
  lockedBadgeTextSingle: {
    color: '#F2B600',
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: 'rgba(242, 182, 0, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.25)',
  },
  subShortcutsRow: {
    flexDirection: 'row',
    gap: 9,
    width: '100%',
  },
  animatedBusWrapper: {
    flex: 1,
    borderRadius: 12,
  },
  subShortcutCardPulsing: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162419',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderWidth: 1.5,
    borderColor: '#00B368',
    gap: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 0 12px rgba(0, 179, 104, 0.35)',
      },
    }),
  },
  subShortcutCardPulsingLight: {
    backgroundColor: '#EDF9F2',
    borderColor: '#00B368',
  },
  busTextRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subShortcutTextPulsing: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.1,
  },
  subShortcutTextPulsingLight: {
    color: '#00874E',
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B368',
  },
  subShortcutCardLocked: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131A15',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.35)',
    gap: 8,
  },
  subShortcutCardLockedLight: {
    backgroundColor: '#FFFDF0',
    borderColor: 'rgba(242, 182, 0, 0.4)',
  },
  subShortcutIconBgLocked: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: 'rgba(242, 182, 0, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busTextRowLocked: {
    flex: 1,
    justifyContent: 'center',
  },
  lockedBadgeText: {
    color: '#F2B600',
    fontSize: 9.5,
    fontWeight: '800',
    marginTop: 0.5,
  },

  subShortcutCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 26, 20, 0.80)',
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 9,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      },
    }),
  },
  subShortcutCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.12)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  subShortcutIconBgBus: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutIconBgCalendar: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutIconBgLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  subShortcutIconBgStore: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: 'rgba(242, 182, 0, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutIconBgStoreLight: {
    backgroundColor: 'rgba(242, 182, 0, 0.16)',
    borderColor: 'rgba(184, 134, 0, 0.26)',
  },
  shortcutTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  subShortcutIconBgCamera: {
    width: 30,
    height: 30,
    borderRadius: 8.5,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutText: {
    color: '#FFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  subShortcutSub: {
    color: '#8DA397',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  subShortcutSubLight: {
    color: '#5A6E63',
  },
  socioBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.35)',
    gap: 10,
  },
  socioBannerCardLight: {
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  socioBannerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subShortcutTextPagamentos: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  subShortcutTextPagamentosCompact: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  pagamentosCardFull: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(17, 26, 20, 0.84)',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    gap: 10,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  pagamentosCardFullLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  pagamentosFullLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pagamentosFullTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  pagamentosFullTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  pagamentosFullSub: {
    color: '#A0B4AA',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  pagamentosFullRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pagamentosCountPill: {
    backgroundColor: 'rgba(0, 179, 104, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.28)',
    paddingHorizontal: 8.5,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  pagamentosCountPillLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.09)',
    borderColor: 'rgba(0, 135, 78, 0.24)',
  },
  pagamentosCountText: {
    color: '#00E676',
    fontSize: 10.5,
    fontWeight: '800',
  },
  pagamentosCountTextLight: {
    color: '#00874E',
  },
  pagamentosCenterTextCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutsRowCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCentered: {
    textAlign: 'center',
  },
  lockedBadgeTextPagamentos: {
    color: '#F2B600',
    fontSize: 8.5,
    fontWeight: '800',
    marginTop: 0.5,
  },
  subShortcutTextLight: {
    color: '#15241C',
  },
  subShortcutCardDisabled: {
    opacity: 0.62,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  subShortcutCardDisabledLight: {
    backgroundColor: '#F0F4F1',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  subShortcutIconBgDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  subShortcutIconBgDisabledLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  subShortcutTextLockedCol: {
    flex: 1,
    justifyContent: 'center',
  },
  subShortcutBadgeSmall: {
    color: COLORS.primaryLight,
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 0.5,
  },
  subShortcutTextDisabled: {
    color: '#8A9E93',
  },
  subShortcutTextDisabledLight: {
    color: '#7A8C82',
  },
  lockedBadgeTextMuted: {
    color: '#7E9187',
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 0.5,
  },
  shortcutIconBgMusic: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00B368',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 179, 104, 0.4)',
      },
    }),
  },
  chantsArrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  shortcutBadgeGold: {
    backgroundColor: 'rgba(0, 179, 104, 0.22)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.4)',
  },
  shortcutBadgeText: {
    color: '#00B368',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  // Modo Dia de Jogo (Matchday Live Hub)
  matchdayCard: {
    backgroundColor: '#0A120D',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 179, 104, 0.4)',
    padding: 14,
    marginBottom: 14,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 0 16px rgba(0, 135, 78, 0.2)',
      },
    }),
  },
  matchdayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchdayLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  greenLivePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryLight,
  },
  matchdayLiveBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  matchdayStatusText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  liveScoreboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121F17',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  scoreTeamCol: {
    flex: 1,
  },
  scoreTeamColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  scoreTeamName: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scoreDigitsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  scoreDigitGreen: {
    color: COLORS.primaryLight,
    fontSize: 22,
    fontWeight: '900',
  },
  scoreDigit: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
  },
  scoreSeparator: {
    color: COLORS.textMuted,
    fontSize: 18,
    fontWeight: '700',
  },
  liveEventNotice: {
    backgroundColor: 'rgba(242, 182, 0, 0.12)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  liveEventText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  meetingPointBox: {
    backgroundColor: '#101A14',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 12,
  },
  meetingPointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  meetingPointTitle: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
  },
  meetingPointDesc: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    lineHeight: 14,
  },
  motmSection: {
    backgroundColor: '#0F1913',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  motmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  motmTitle: {
    color: COLORS.white,
    fontSize: 11.5,
    fontWeight: '800',
  },
  motmGrid: {
    gap: 6,
  },
  motmCandidateCard: {
    backgroundColor: '#16241B',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  motmCandidateCardActive: {
    borderColor: COLORS.primaryLight,
    backgroundColor: '#1A3022',
  },
  motmTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  motmPlayerNumber: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
  },
  motmPlayerName: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  motmPlayerNameActive: {
    color: COLORS.primaryLight,
  },
  motmBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  motmBarFill: {
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 2,
  },
  motmBottomLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  motmVotesCount: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '500',
  },
  motmPctText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
  },

  // Variantes para Modo Claro (Light Theme)
  containerLight: {
    backgroundColor: '#F4F7F5',
  },
  chantsCenteredBtnLight: {
    backgroundColor: '#00874E',
    borderColor: '#00A85F',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 14px rgba(0, 135, 78, 0.3)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  subShortcutCardPulsingLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00874E',
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 0 14px rgba(0, 135, 78, 0.3), 0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  subShortcutTextPulsingLight: {
    color: '#14201A',
  },
  subShortcutCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderColor: 'rgba(0, 135, 78, 0.16)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  subShortcutTextLight: {
    color: '#14201A',
  },
  heroCardLight: {
    borderColor: 'rgba(0, 135, 78, 0.25)',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 22px rgba(0, 135, 78, 0.1)',
      },
    }),
  },
  sectionTitleLight: {
    color: '#14201A',
  },
  communiqueCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.15)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  communiqueTitleLight: {
    color: '#14201A',
  },
  communiqueDescLight: {
    color: '#556960',
  },
  compNameLight: {
    color: '#14201A',
  },
  compRoundLight: {
    color: '#556960',
  },
  teamNameLight: {
    color: '#14201A',
  },
  teamRoleLight: {
    color: '#7E9187',
  },
  vsTextLight: {
    color: '#00874E',
  },
  stadiumTagLight: {
    backgroundColor: '#EDF5F0',
  },
  stadiumTagTextLight: {
    color: '#14201A',
  },
  matchTimeLight: {
    color: '#556960',
  },
});

export default memo(HomeScreen);
