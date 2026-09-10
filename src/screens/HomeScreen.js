import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Image,
  useWindowDimensions,
} from 'react-native';
import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';
import {
  MapPin,
  Ticket,
  ChevronRight,
  Flame,
  Bus,
  Sparkles,
  Users,
  Drum,
  ShoppingBag,
  Radio,
  Award,
  Trophy,
  Table,
  IdCard,
  Camera,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { NEXT_MATCH, MATCHDAY_DATA } from '../data/mockData';
import { getNextMatchData } from '../services/matchesService';
import ClubBadge from '../components/ClubBadge';
import DeslocacaoModal from '../components/DeslocacaoModal';
import TabelaModal from '../components/TabelaModal';
import SejaSocioModal from '../components/SejaSocioModal';
import JogosModal from '../components/JogosModal';
import GaleriaModal from '../components/GaleriaModal';

function SoccerBallIcon({ size = 15, color = COLORS.primaryLight }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 7l3.2 2.3-1.2 3.8H10l-1.2-3.8z" fill={color} fillOpacity="0.3" />
      <Path d="M12 7V2" />
      <Path d="M15.2 9.3l4.3-1.4" />
      <Path d="M14 13.1l2.8 3.5" />
      <Path d="M10 13.1l-2.8 3.5" />
      <Path d="M8.8 9.3l-4.3-1.4" />
    </Svg>
  );
}

function HomeScreen({
  user,
  onBuyTicket,
  onNavigateTab,
  onScroll,
  onOpenChants,
  onOpenStore,
  isDark = true,
  onOpenPwaInstall,
}) {
  // Modo Dia de Jogo: desativado por agora (só será ativo faltando 1 hora para o jogo)
  const isMatchdayActive = false;
  const [deslocacaoModalVisible, setDeslocacaoModalVisible] = useState(false);
  const [tabelaModalVisible, setTabelaModalVisible] = useState(false);
  const [socioModalVisible, setSocioModalVisible] = useState(false);
  const [jogosModalVisible, setJogosModalVisible] = useState(false);
  const [galeriaModalVisible, setGaleriaModalVisible] = useState(false);
  const [votedPlayerId, setVotedPlayerId] = useState(null);
  const [motmList, setMotmList] = useState(MATCHDAY_DATA.motmCandidates);
  const [nextMatch, setNextMatch] = useState(NEXT_MATCH);
  const mainScrollRef = useRef(null);

  // Carregar dados oficiais do próximo jogo em tempo real (mesma API dos Jogos)
  useEffect(() => {
    let isMounted = true;
    getNextMatchData()
      .then((liveMatch) => {
        if (isMounted && liveMatch) {
          setNextMatch(liveMatch);
        }
      })
      .catch((err) => console.warn('Erro ao atualizar próximo jogo:', err));

    const interval = setInterval(() => {
      getNextMatchData()
        .then((liveMatch) => {
          if (isMounted && liveMatch) {
            setNextMatch(liveMatch);
          }
        })
        .catch(() => {});
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Efeito de pulso contínuo no botão Deslocações
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 750,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 750,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

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

  return (
    <ScrollView
      ref={mainScrollRef}
      style={[styles.container, !isDark && styles.containerLight]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews={Platform.OS !== 'web'}
      overScrollMode="never"
    >
      {/* 1. HERO BANNER: PRÓXIMO JOGO COM SÍMBOLOS DOS CLUBES */}
      <View style={[styles.heroCard, !isDark && styles.heroCardLight]}>
        {/* Header do Confronto */}
        <View style={styles.heroTopBar}>
          <View style={styles.compInfo}>
            <Text style={[styles.compName, !isDark && styles.compNameLight]}>{nextMatch.competition || 'LIGA PORTUGAL BETCLIC'}</Text>
            <Text style={[styles.compRound, !isDark && styles.compRoundLight]}>{nextMatch.round || '6.ª Jornada'}</Text>
          </View>
        </View>

        {/* Equipas & Emblemas Reais */}
        <View style={styles.matchTeamsRow}>
          {/* Rio Ave FC */}
          <View style={styles.teamColumn}>
            <ClubBadge
              name={nextMatch.homeTeam.name}
              logo={nextMatch.homeTeam.logo}
              size="md"
              isDark={isDark}
              style={{ marginBottom: 4 }}
            />
            <Text style={[styles.teamName, !isDark && styles.teamNameLight]}>{nextMatch.homeTeam.name}</Text>
            <Text style={[styles.teamRole, !isDark && styles.teamRoleLight]}>Anfitrião</Text>
          </View>

          {/* VS & Detalhes */}
          <View style={styles.vsColumn}>
            <Text style={[styles.vsText, !isDark && styles.vsTextLight]}>VS</Text>
            <View style={[styles.stadiumTag, !isDark && styles.stadiumTagLight]}>
              <MapPin size={10} color={COLORS.primaryLight} />
              <Text style={[styles.stadiumTagText, !isDark && styles.stadiumTagTextLight]}>{nextMatch.stadium}</Text>
            </View>
            <Text style={[styles.matchTime, !isDark && styles.matchTimeLight]}>{nextMatch.dateFormatted}</Text>
          </View>

          {/* Adversário Real */}
          <View style={styles.teamColumn}>
            <ClubBadge
              name={nextMatch.awayTeam.name}
              logo={nextMatch.awayTeam.logo}
              size="md"
              isDark={isDark}
              style={{ marginBottom: 4 }}
            />
            <Text style={[styles.teamName, !isDark && styles.teamNameLight]}>{nextMatch.awayTeam.name}</Text>
            <Text style={[styles.teamRole, !isDark && styles.teamRoleLight]}>Visitante</Text>
          </View>
        </View>

        {/* CTA BILHÉTICA INTEGRADO: COMPRA RÁPIDA MB WAY */}
        <TouchableOpacity
          style={styles.heroBuyBtn}
          onPress={() =>
            onBuyTicket({
              title: `Bilhete Grupo 39 · ${nextMatch.homeTeam.name} vs ${nextMatch.awayTeam.name}`,
              category: 'Bilhética Oficial RAFC',
              amount: nextMatch.ticketPriceMember || 7.50,
              originalPrice: nextMatch.ticketPricePublic || 17.50,
              discount: (nextMatch.ticketPricePublic || 17.50) - (nextMatch.ticketPriceMember || 7.50),
              type: 'ticket',
            })
          }
          activeOpacity={0.85}
        >
          <View style={styles.heroBuyContent}>
            <View style={styles.heroBuyLeft}>
              <View style={styles.ticketIconBox}>
                <Ticket size={13} color="#FFF" />
              </View>
              <Text style={styles.heroBuyTitle}>Comprar Bilhete</Text>
            </View>
            <ChevronRight size={14} color="#FFF" />
          </View>
        </TouchableOpacity>
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

      {/* DESTAQUE PRINCIPAL: CÂNTICOS G39 */}
      <View style={styles.chantsCenterWrapper}>
        <TouchableOpacity
          style={[styles.chantsCenteredBtn, !isDark && styles.chantsCenteredBtnLight]}
          onPress={onOpenChants}
          activeOpacity={0.85}
        >
          <View style={styles.chantsLogoWrapper}>
            <Image
              source={require('../../assets/logo_39.png')}
              style={styles.chantsLogoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.chantsTextBoxCentered}>
            <View style={styles.shortcutHeaderRowCentered}>
              <Text style={styles.shortcutTitleCentered}>Cânticos G39</Text>
            </View>
            <Text style={styles.shortcutDescCentered}>Letra e Ritmos</Text>
          </View>
          <View style={styles.chantsArrowCircle}>
            <ChevronRight size={15} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>

      {/* 3. SECÇÃO: ACESSOS RÁPIDOS */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleWithIcon}>
          <Sparkles size={18} color={COLORS.primaryLight} />
          <Text style={[styles.sectionTitle, !isDark && styles.sectionTitleLight]}>Acessos Rápidos</Text>
        </View>
      </View>

      {/* BOTÕES: AUTOCARRO (SEMPRE A PULSAR) & CALENDÁRIO */}
      <View style={styles.subShortcutsRow}>
        <Animated.View
          style={[
            styles.animatedBusWrapper,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <TouchableOpacity
            style={[styles.subShortcutCardPulsing, !isDark && styles.subShortcutCardPulsingLight]}
            onPress={() => setDeslocacaoModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.subShortcutIconBgBus}>
              <Bus size={15} color={COLORS.primaryLight} />
            </View>
            <View style={styles.busTextRow}>
              <Text style={[styles.subShortcutTextPulsing, !isDark && styles.subShortcutTextPulsingLight]}>Deslocação</Text>
              <View style={styles.livePulseDot} />
            </View>
            <ChevronRight size={13} color={COLORS.primaryLight} />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={[styles.subShortcutCard, !isDark && styles.subShortcutCardLight]}
          onPress={() => setJogosModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.subShortcutIconBgCalendar}>
            <SoccerBallIcon size={16} color={COLORS.primaryLight} />
          </View>
          <Text style={[styles.subShortcutText, !isDark && styles.subShortcutTextLight]}>Jogos</Text>
          <ChevronRight size={13} color={isDark ? COLORS.textMuted : '#7E9187'} />
        </TouchableOpacity>
      </View>

      {/* 2 BOTÕES POR DEBAIXO: TABELA & SEJA SÓCIO */}
      <View style={styles.subShortcutsRow}>
        <TouchableOpacity
          style={[styles.subShortcutCard, !isDark && styles.subShortcutCardLight]}
          onPress={() => setTabelaModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.subShortcutIconBgCalendar}>
            <Table size={16} color={COLORS.primaryLight} />
          </View>
          <Text style={[styles.subShortcutText, !isDark && styles.subShortcutTextLight]}>Tabela</Text>
          <ChevronRight size={13} color={isDark ? COLORS.textMuted : '#7E9187'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subShortcutCard, !isDark && styles.subShortcutCardLight]}
          onPress={() => setSocioModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.subShortcutIconBgCalendar}>
            <IdCard size={16} color={COLORS.primaryLight} />
          </View>
          <Text style={[styles.subShortcutText, !isDark && styles.subShortcutTextLight]}>Seja Sócio</Text>
          <ChevronRight size={13} color={isDark ? COLORS.textMuted : '#7E9187'} />
        </TouchableOpacity>
      </View>

      {/* 3ª LINHA: BOTÃO GALERIA (MESMO TAMANHO QUE OS OUTROS, SOB TABELA) */}
      <View style={styles.subShortcutsRow}>
        <TouchableOpacity
          style={[styles.subShortcutCard, !isDark && styles.subShortcutCardLight]}
          onPress={() => setGaleriaModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.subShortcutIconBgCamera}>
            <Camera size={16} color={COLORS.primaryLight} />
          </View>
          <Text style={[styles.subShortcutText, !isDark && styles.subShortcutTextLight]}>Galeria</Text>
          <ChevronRight size={13} color={isDark ? COLORS.textMuted : '#7E9187'} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>

      {/* Modal Dedicado da Deslocação Oficial */}
      <DeslocacaoModal
        visible={deslocacaoModalVisible}
        onClose={() => setDeslocacaoModalVisible(false)}
        onBuyTicket={onBuyTicket}
        isDark={isDark}
      />

      {/* Modal de Jogos e Calendário Oficial em Direto */}
      <JogosModal
        visible={jogosModalVisible}
        onClose={() => setJogosModalVisible(false)}
        onBuyTicket={onBuyTicket}
        onOpenDeslocacao={() => setDeslocacaoModalVisible(true)}
        isDark={isDark}
      />

      {/* Modal de Tabela Classificativa */}
      <TabelaModal
        visible={tabelaModalVisible}
        onClose={() => setTabelaModalVisible(false)}
        onNavigateTab={(tab) => {
          if (tab === 'calendar') {
            setJogosModalVisible(true);
          } else if (onNavigateTab) {
            onNavigateTab(tab);
          }
        }}
        isDark={isDark}
      />

      {/* Modal Seja Sócio */}
      <SejaSocioModal
        visible={socioModalVisible}
        onClose={() => setSocioModalVisible(false)}
        onJoinMember={onBuyTicket}
        onNavigateTab={onNavigateTab}
        isDark={isDark}
      />

      {/* Modal Galeria / Instagram Ultras Grupo 39 */}
      <GaleriaModal
        visible={galeriaModalVisible}
        onClose={() => setGaleriaModalVisible(false)}
        isDark={isDark}
      />

      {/* Espaço para a barra flutuante */}
      <View style={{ height: 140 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1310',
    overflow: 'hidden',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Hero Match Card
  heroCard: {
    backgroundColor: '#14201A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px rgba(0, 135, 78, 0.1)',
      },
    }),
  },
  heroTopBar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    marginBottom: 10,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
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
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: 100,
  },
  teamRole: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 1,
  },
  vsColumn: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  vsText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 2,
  },
  stadiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#1A2922',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  stadiumTagText: {
    color: COLORS.white,
    fontSize: 9.5,
    fontWeight: '600',
  },
  matchTime: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Botão Bilhete MB WAY Compacto
  heroBuyBtn: {
    backgroundColor: '#00874E',
    borderRadius: 8,
    paddingVertical: 5.5,
    paddingHorizontal: 10,
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
    justifyContent: 'space-between',
  },
  heroBuyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketIconBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBuyTitle: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.2,
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
  chantsCenterWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  chantsCenteredBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00874E',
    borderRadius: 13,
    paddingVertical: 7.5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#00B368',
    gap: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 3px 14px rgba(0, 135, 78, 0.35)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  chantsLogoWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#00B368',
  },
  chantsLogoImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  chantsTextBoxCentered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
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
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  shortcutDescCentered: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10.5,
    marginTop: 1,
    textAlign: 'center',
  },
  subShortcutsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
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
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#00B368',
    gap: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 0 14px rgba(0, 179, 104, 0.45), 0 4px 12px rgba(0, 0, 0, 0.4)',
      },
    }),
  },
  busTextRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subShortcutTextPulsing: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B368',
  },
  subShortcutCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111A14',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  subShortcutIconBgBus: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutIconBgCalendar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutIconBgCamera: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutText: {
    flex: 1,
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
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
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.15)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  subShortcutTextLight: {
    color: '#14201A',
  },
  heroCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.18)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
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
