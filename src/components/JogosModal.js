import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Animated,
} from 'react-native';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Ticket,
  ChevronRight,
  Trophy,
  RefreshCw,
  WifiOff,
  Bus,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import ClubBadge from './ClubBadge';

// Fallback inicial com jogos reais da época 2026/2027
const FALLBACK_UPCOMING = [
  {
    id: 'fix-1',
    date: '2026-09-14T17:45:00Z',
    competition: 'Liga Portugal Betclic',
    round: 'Jornada 6',
    homeTeam: 'Rio Ave FC',
    homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    awayTeam: 'Estrela da Amadora',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3824.png',
    isHome: true,
    venue: 'Estádio do Rio Ave FC (Arcos)',
    city: 'Vila do Conde',
    ticketPrice: '8,00 €',
  },
  {
    id: 'fix-2',
    date: '2026-09-19T17:00:00Z',
    competition: 'Liga Portugal Betclic',
    round: 'Jornada 7',
    homeTeam: 'FC Alverca',
    homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3829.png',
    awayTeam: 'Rio Ave FC',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    isHome: false,
    venue: 'Complexo Desportivo FC Alverca',
    city: 'Alverca',
    busAvailable: true,
  },
  {
    id: 'fix-3',
    date: '2026-10-11T14:30:00Z',
    competition: 'Liga Portugal Betclic',
    round: 'Jornada 8',
    homeTeam: 'Rio Ave FC',
    homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    awayTeam: 'CD Nacional',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3828.png',
    isHome: true,
    venue: 'Estádio do Rio Ave FC (Arcos)',
    city: 'Vila do Conde',
    ticketPrice: '7,50 €',
  },
  {
    id: 'fix-4',
    date: '2026-10-25T18:00:00Z',
    competition: 'Liga Portugal Betclic',
    round: 'Jornada 9',
    homeTeam: 'Rio Ave FC',
    homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    awayTeam: 'FC Famalicão',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/18816.png',
    isHome: true,
    venue: 'Estádio do Rio Ave FC (Arcos)',
    city: 'Vila do Conde',
    ticketPrice: '10,00 €',
  },
  {
    id: 'fix-5',
    date: '2026-11-01T18:00:00Z',
    competition: 'Liga Portugal Betclic',
    round: 'Jornada 10',
    homeTeam: 'Académico de Viseu',
    homeLogo: null,
    awayTeam: 'Rio Ave FC',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    isHome: false,
    venue: 'Estádio do Fontelo',
    city: 'Viseu',
    busAvailable: true,
  },
];

const FALLBACK_RESULTS = [
  {
    id: 'res-1',
    date: '2026-09-06T14:30:00Z',
    competition: 'Liga Portugal Betclic',
    round: 'Jornada 5',
    homeTeam: 'Santa Clara',
    homeScore: 4,
    homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/4260.png',
    awayTeam: 'Rio Ave FC',
    awayScore: 0,
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    outcome: 'loss',
    venue: 'Estádio de São Miguel (Açores)',
  },
  {
    id: 'res-2',
    date: '2026-08-28T19:15:00Z',
    competition: 'Liga Portugal Betclic',
    round: 'Jornada 4',
    homeTeam: 'Rio Ave FC',
    homeScore: 0,
    homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    awayTeam: 'Sporting CP',
    awayScore: 4,
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/2250.png',
    outcome: 'loss',
    venue: 'Estádio do Rio Ave FC (Arcos)',
  },
  {
    id: 'res-3',
    date: '2026-08-22T17:00:00Z',
    competition: 'Liga Portugal Betclic',
    round: 'Jornada 3',
    homeTeam: 'Estoril Praia',
    homeScore: 0,
    homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/4261.png',
    awayTeam: 'Rio Ave FC',
    awayScore: 2,
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    outcome: 'win',
    venue: 'Estádio António Coimbra da Mota',
  },
  {
    id: 'res-4',
    date: '2026-08-15T19:30:00Z',
    competition: 'Liga Portugal Betclic',
    round: 'Jornada 2',
    homeTeam: 'Rio Ave FC',
    homeScore: 0,
    homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    awayTeam: 'FC Porto',
    awayScore: 2,
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/437.png',
    outcome: 'loss',
    venue: 'Estádio do Rio Ave FC (Arcos)',
  },
  {
    id: 'res-5',
    date: '2026-08-09T19:30:00Z',
    competition: 'Liga Portugal Betclic',
    round: 'Jornada 1',
    homeTeam: 'Gil Vicente',
    homeScore: 1,
    homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3826.png',
    awayTeam: 'Rio Ave FC',
    awayScore: 0,
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    outcome: 'loss',
    venue: 'Estádio Cidade de Barcelos',
  },
];

const FIXTURES_API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/por.1/teams/3822/schedule?fixture=true';
const RESULTS_API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/por.1/teams/3822/schedule';

function TeamLogo({ logoUrl, teamName, isRioAve }) {
  const [hasError, setHasError] = useState(false);

  if (!logoUrl || hasError) {
    return <ClubBadge name={teamName} size="xs" style={styles.badgeMargin} />;
  }

  return (
    <View style={[styles.teamLogoBox, isRioAve && styles.teamLogoBoxRioAve]}>
      <Image
        source={{ uri: logoUrl }}
        style={styles.teamLogoImg}
        resizeMode="contain"
        onError={() => setHasError(true)}
      />
    </View>
  );
}

function formatDatePt(dateString) {
  if (!dateString) return 'A definir';
  try {
    const d = new Date(dateString);
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const diaSem = diasSemana[d.getDay()];
    const dia = d.getDate();
    const mes = meses[d.getMonth()];
    const ano = d.getFullYear();
    const horas = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return {
      full: `${diaSem}, ${dia} ${mes} ${ano}`,
      time: `${horas}:${min}`,
      short: `${dia} ${mes}`,
    };
  } catch (e) {
    return { full: dateString, time: '', short: dateString };
  }
}

function JogosModal({
  visible,
  onClose,
  onBuyTicket,
  onOpenDeslocacao,
  isDark = true,
}) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'results'
  const [upcomingMatches, setUpcomingMatches] = useState(FALLBACK_UPCOMING);
  const [pastResults, setPastResults] = useState(FALLBACK_RESULTS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Atualizado');
  const [fetchError, setFetchError] = useState(false);

  // Rotação do ícone de atualização
  const spinAnim = useRef(new Animated.Value(0)).current;

  const startSpin = () => {
    spinAnim.setValue(0);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: Platform.OS !== 'web',
      })
    ).start();
  };

  const stopSpin = () => {
    spinAnim.stopAnimation();
    spinAnim.setValue(0);
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Função para buscar jogos em direto da API oficial
  const fetchLiveSchedule = useCallback(async (isManual = false) => {
    if (isLoading) return;
    setIsLoading(true);
    if (isManual) startSpin();

    try {
      const [fixturesRes, resultsRes] = await Promise.all([
        fetch(FIXTURES_API, { headers: { Accept: 'application/json' } }),
        fetch(RESULTS_API, { headers: { Accept: 'application/json' } }),
      ]);

      if (fixturesRes.ok) {
        const fixturesData = await fixturesRes.json();
        const rawEvents = fixturesData.events || [];

        if (rawEvents.length > 0) {
          const parsedFixtures = rawEvents.map((e, index) => {
            const comp = e.competitions?.[0];
            const home = comp?.competitors?.find((c) => c.homeAway === 'home');
            const away = comp?.competitors?.find((c) => c.homeAway === 'away');
            const homeName = home?.team?.displayName || home?.team?.name || 'Clube';
            const awayName = away?.team?.displayName || away?.team?.name || 'Clube';
            const isHome = homeName.toLowerCase().includes('rio ave');

            return {
              id: e.id || `fix-${index}`,
              date: e.date,
              competition: e.league?.name || 'Liga Portugal Betclic',
              round: `Jornada ${index + 6}`,
              homeTeam: homeName,
              homeLogo: home?.team?.logos?.[0]?.href || null,
              awayTeam: awayName,
              awayLogo: away?.team?.logos?.[0]?.href || null,
              isHome,
              venue: comp?.venue?.fullName || (isHome ? 'Estádio do Rio Ave FC (Arcos)' : 'Estádio Fora'),
              city: comp?.venue?.address?.city || (isHome ? 'Vila do Conde' : 'Portugal'),
              ticketPrice: isHome ? '8,00 €' : null,
              busAvailable: !isHome,
            };
          });

          setUpcomingMatches(parsedFixtures);
        }
      }

      if (resultsRes.ok) {
        const resultsData = await resultsRes.json();
        const rawResults = resultsData.events || [];

        if (rawResults.length > 0) {
          const parsedResults = rawResults.map((e, index) => {
            const comp = e.competitions?.[0];
            const home = comp?.competitors?.find((c) => c.homeAway === 'home');
            const away = comp?.competitors?.find((c) => c.homeAway === 'away');
            const homeName = home?.team?.displayName || home?.team?.name || 'Clube';
            const awayName = away?.team?.displayName || away?.team?.name || 'Clube';
            const homeScore = parseInt(home?.score?.displayValue ?? '0', 10);
            const awayScore = parseInt(away?.score?.displayValue ?? '0', 10);
            const isHome = homeName.toLowerCase().includes('rio ave');

            let outcome = 'draw';
            if (isHome) {
              if (homeScore > awayScore) outcome = 'win';
              else if (homeScore < awayScore) outcome = 'loss';
            } else {
              if (awayScore > homeScore) outcome = 'win';
              else if (awayScore < homeScore) outcome = 'loss';
            }

            return {
              id: e.id || `res-${index}`,
              date: e.date,
              competition: e.league?.name || 'Liga Portugal Betclic',
              round: `Jornada ${5 - index}`,
              homeTeam: homeName,
              homeScore,
              homeLogo: home?.team?.logos?.[0]?.href || null,
              awayTeam: awayName,
              awayScore,
              awayLogo: away?.team?.logos?.[0]?.href || null,
              outcome,
              venue: comp?.venue?.fullName || (isHome ? 'Estádio do Rio Ave FC (Arcos)' : 'Estádio Fora'),
            };
          });

          setPastResults(parsedResults);
        }
      }

      setFetchError(false);
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setLastUpdated(`Atualizado às ${hours}:${minutes}`);
    } catch (err) {
      console.warn('Erro ao atualizar jogos em direto:', err);
      setFetchError(true);
    } finally {
      setIsLoading(false);
      stopSpin();
    }
  }, [isLoading]);

  useEffect(() => {
    if (visible) {
      fetchLiveSchedule(false);

      const intervalId = setInterval(() => {
        fetchLiveSchedule(false);
      }, 60000);

      return () => clearInterval(intervalId);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, !isDark && styles.containerLight]}>
          {/* Header Superior */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                <CalendarIcon size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
              </View>
              <View>
                <View style={styles.titleRow}>
                  <Text style={[styles.headerTitle, !isDark && styles.textDark]}>
                    Jogos do Rio Ave FC
                  </Text>
                  <View style={[styles.liveBadge, !isDark && styles.liveBadgeLight]}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveBadgeText}>EM DIRETO</Text>
                  </View>
                </View>

                <View style={styles.subTitleRow}>
                  <Text style={[styles.headerSubtitle, !isDark && styles.headerSubtitleLight]}>
                    Liga Portugal Betclic · 2026/2027
                  </Text>
                  <Text style={[styles.dotSeparator, !isDark && styles.textMutedDark]}>•</Text>
                  <Text style={[styles.lastUpdatedText, !isDark && styles.textMutedDark]}>
                    {lastUpdated}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.headerRightActions}>
              <TouchableOpacity
                onPress={() => fetchLiveSchedule(true)}
                style={[styles.refreshBtn, !isDark && styles.refreshBtnLight]}
                activeOpacity={0.7}
                disabled={isLoading}
                accessibilityLabel="Atualizar calendário oficial"
              >
                <Animated.View style={styles.spinIconWrap}>
                  <RefreshCw size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
                activeOpacity={0.7}
              >
                <X size={14} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Aviso Offline se houver erro de rede */}
          {fetchError && (
            <View style={styles.offlineNotice}>
              <WifiOff size={13} color="#FFB74D" />
              <Text style={styles.offlineNoticeText}>
                A exibir calendário guardado em cache.
              </Text>
              <TouchableOpacity onPress={() => fetchLiveSchedule(true)} activeOpacity={0.7}>
                <Text style={styles.offlineRetryText}>Tentar de novo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Tabs de Selecção: Próximos Jogos vs Resultados */}
          <View style={[styles.tabBar, !isDark && styles.tabBarLight]}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                !isDark && styles.tabBtnLight,
                activeTab === 'upcoming' && styles.tabBtnActive,
                !isDark && activeTab === 'upcoming' && styles.tabBtnActiveLight,
              ]}
              onPress={() => setActiveTab('upcoming')}
              activeOpacity={0.8}
            >
              <CalendarIcon
                size={15}
                color={
                  activeTab === 'upcoming'
                    ? isDark
                      ? COLORS.primaryLight
                      : '#00874E'
                    : isDark
                    ? COLORS.textSecondary
                    : '#5A6E63'
                }
              />
              <Text
                style={[
                  styles.tabText,
                  !isDark && styles.tabTextLight,
                  activeTab === 'upcoming' && styles.tabTextActive,
                  !isDark && activeTab === 'upcoming' && styles.tabTextActiveLight,
                ]}
              >
                Próximos Jogos ({upcomingMatches.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                !isDark && styles.tabBtnLight,
                activeTab === 'results' && styles.tabBtnActive,
                !isDark && activeTab === 'results' && styles.tabBtnActiveLight,
              ]}
              onPress={() => setActiveTab('results')}
              activeOpacity={0.8}
            >
              <Trophy
                size={15}
                color={
                  activeTab === 'results'
                    ? isDark
                      ? COLORS.primaryLight
                      : '#00874E'
                    : isDark
                    ? COLORS.textSecondary
                    : '#5A6E63'
                }
              />
              <Text
                style={[
                  styles.tabText,
                  !isDark && styles.tabTextLight,
                  activeTab === 'results' && styles.tabTextActive,
                  !isDark && activeTab === 'results' && styles.tabTextActiveLight,
                ]}
              >
                Resultados ({pastResults.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conteúdo Principal com Scroll */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollBodyContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {activeTab === 'upcoming' ? (
              // LISTA DE PRÓXIMOS JOGOS
              <View>
                {upcomingMatches.map((m) => {
                  const dateInfo = formatDatePt(m.date);

                  return (
                    <View
                      key={m.id}
                      style={[
                        styles.matchCard,
                        !isDark && styles.matchCardLight,
                        m.isHome && styles.matchCardHome,
                        !isDark && m.isHome && styles.matchCardHomeLight,
                      ]}
                    >
                      {/* Topo do Card */}
                      <View style={styles.cardHeaderRow}>
                        <Text style={[styles.cardCompTitle, !isDark && styles.textMutedDark]}>
                          {m.competition} · {m.round}
                        </Text>
                        <View
                          style={[
                            styles.homeAwayBadge,
                            m.isHome ? styles.homeBadge : styles.awayBadge,
                          ]}
                        >
                          <Text
                            style={[
                              styles.homeAwayBadgeText,
                              m.isHome ? styles.homeBadgeText : styles.awayBadgeText,
                            ]}
                          >
                            {m.isHome ? 'CASA (ARCOS)' : 'DESLOCAÇÃO (FORA)'}
                          </Text>
                        </View>
                      </View>

                      {/* Confronto Central */}
                      <View style={styles.matchTeamsRow}>
                        {/* Equipa Casa */}
                        <View style={styles.teamColumn}>
                          <TeamLogo
                            logoUrl={m.homeLogo}
                            teamName={m.homeTeam}
                            isRioAve={m.isHome}
                          />
                          <Text
                            style={[
                              styles.teamNameLabel,
                              !isDark && styles.textDark,
                              m.isHome && styles.teamNameRioAve,
                            ]}
                            numberOfLines={1}
                          >
                            {m.homeTeam}
                          </Text>
                        </View>

                        {/* Indicador VS */}
                        <View style={styles.vsContainer}>
                          <View style={[styles.vsBadge, !isDark && styles.vsBadgeLight]}>
                            <Text style={styles.vsBadgeText}>VS</Text>
                          </View>
                          {dateInfo.time ? (
                            <Text style={[styles.vsTimeText, !isDark && styles.textMutedDark]}>
                              {dateInfo.time}
                            </Text>
                          ) : null}
                        </View>

                        {/* Equipa Fora */}
                        <View style={styles.teamColumn}>
                          <TeamLogo
                            logoUrl={m.awayLogo}
                            teamName={m.awayTeam}
                            isRioAve={!m.isHome}
                          />
                          <Text
                            style={[
                              styles.teamNameLabel,
                              !isDark && styles.textDark,
                              !m.isHome && styles.teamNameRioAve,
                            ]}
                            numberOfLines={1}
                          >
                            {m.awayTeam}
                          </Text>
                        </View>
                      </View>

                      {/* Informações de Local e Data */}
                      <View style={[styles.matchMetaRow, !isDark && styles.matchMetaRowLight]}>
                        <View style={styles.metaItem}>
                          <CalendarIcon size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                          <Text style={[styles.metaText, !isDark && styles.textDark]}>
                            {dateInfo.full}
                          </Text>
                        </View>

                        <View style={styles.metaItem}>
                          <MapPin size={13} color={isDark ? COLORS.textMuted : '#7A8E83'} />
                          <Text
                            style={[styles.metaText, !isDark && styles.textMutedDark]}
                            numberOfLines={1}
                          >
                            {m.venue}
                          </Text>
                        </View>
                      </View>

                      {/* Botão de Ação / Bilhete / Deslocação */}
                      {m.isHome ? (
                        <TouchableOpacity
                          style={styles.cardActionBtn}
                          onPress={() => {
                            onClose();
                            if (onBuyTicket) {
                              onBuyTicket({
                                title: `Bilhete ${m.homeTeam} vs ${m.awayTeam}`,
                                category: 'Bilheteira Oficial · Bancada Poente',
                                amount: 8.0,
                                type: 'ticket',
                              });
                            }
                          }}
                          activeOpacity={0.85}
                        >
                          <Ticket size={15} color="#FFF" />
                          <Text style={styles.cardActionBtnText}>
                            Comprar Bilhete · Bancada Poente
                          </Text>
                          <ChevronRight size={15} color="#FFF" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.cardActionBtn, styles.cardActionBtnAway]}
                          onPress={() => {
                            onClose();
                            if (onOpenDeslocacao) {
                              onOpenDeslocacao();
                            } else if (onBuyTicket) {
                              onBuyTicket({
                                title: `Caravana Grupo 39 · ${m.awayTeam} vs ${m.homeTeam}`,
                                category: 'Deslocação Oficial G39',
                                amount: 15.0,
                                type: 'caravan',
                              });
                            }
                          }}
                          activeOpacity={0.85}
                        >
                          <Bus size={15} color="#FFF" />
                          <Text style={styles.cardActionBtnText}>
                            Caravana Grupo 39 (Autocarro + Bilhete)
                          </Text>
                          <ChevronRight size={15} color="#FFF" />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            ) : (
              // LISTA DE RESULTADOS PASSADOS
              <View>
                {pastResults.map((r) => {
                  const dateInfo = formatDatePt(r.date);
                  const isWin = r.outcome === 'win';
                  const isLoss = r.outcome === 'loss';
                  const isDraw = r.outcome === 'draw';

                  return (
                    <View
                      key={r.id}
                      style={[
                        styles.matchCard,
                        !isDark && styles.matchCardLight,
                        isWin && styles.matchCardWin,
                        !isDark && isWin && styles.matchCardWinLight,
                      ]}
                    >
                      <View style={styles.cardHeaderRow}>
                        <Text style={[styles.cardCompTitle, !isDark && styles.textMutedDark]}>
                          {r.competition} · {r.round}
                        </Text>
                        <View
                          style={[
                            styles.outcomeBadge,
                            isWin && styles.outcomeWin,
                            isLoss && styles.outcomeLoss,
                            isDraw && styles.outcomeDraw,
                          ]}
                        >
                          {isWin && <CheckCircle2 size={12} color="#FFF" />}
                          {isLoss && <XCircle size={12} color="#FFF" />}
                          {isDraw && <MinusCircle size={12} color="#FFF" />}
                          <Text style={styles.outcomeText}>
                            {isWin ? 'VITÓRIA' : isLoss ? 'DERROTA' : 'EMPATE'}
                          </Text>
                        </View>
                      </View>

                      {/* Placar Oficial */}
                      <View style={styles.matchTeamsRow}>
                        <View style={styles.teamColumn}>
                          <TeamLogo
                            logoUrl={r.homeLogo}
                            teamName={r.homeTeam}
                            isRioAve={r.homeTeam.includes('Rio Ave')}
                          />
                          <Text
                            style={[
                              styles.teamNameLabel,
                              !isDark && styles.textDark,
                              r.homeTeam.includes('Rio Ave') && styles.teamNameRioAve,
                            ]}
                            numberOfLines={1}
                          >
                            {r.homeTeam}
                          </Text>
                        </View>

                        <View style={styles.scoreContainer}>
                          <View style={styles.scorePill}>
                            <Text style={styles.scoreText}>{r.homeScore}</Text>
                            <Text style={styles.scoreDivider}>-</Text>
                            <Text style={styles.scoreText}>{r.awayScore}</Text>
                          </View>
                          <Text style={[styles.ftLabel, !isDark && styles.textMutedDark]}>
                            FINAL
                          </Text>
                        </View>

                        <View style={styles.teamColumn}>
                          <TeamLogo
                            logoUrl={r.awayLogo}
                            teamName={r.awayTeam}
                            isRioAve={r.awayTeam.includes('Rio Ave')}
                          />
                          <Text
                            style={[
                              styles.teamNameLabel,
                              !isDark && styles.textDark,
                              r.awayTeam.includes('Rio Ave') && styles.teamNameRioAve,
                            ]}
                            numberOfLines={1}
                          >
                            {r.awayTeam}
                          </Text>
                        </View>
                      </View>

                      {/* Informações de Local e Data */}
                      <View style={[styles.matchMetaRow, !isDark && styles.matchMetaRowLight]}>
                        <View style={styles.metaItem}>
                          <CalendarIcon size={13} color={isDark ? COLORS.textMuted : '#7A8E83'} />
                          <Text style={[styles.metaText, !isDark && styles.textMutedDark]}>
                            {dateInfo.full}
                          </Text>
                        </View>

                        <View style={styles.metaItem}>
                          <MapPin size={13} color={isDark ? COLORS.textMuted : '#7A8E83'} />
                          <Text
                            style={[styles.metaText, !isDark && styles.textMutedDark]}
                            numberOfLines={1}
                          >
                            {r.venue}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            <View style={{ height: 28 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'flex-end',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  container: {
    backgroundColor: '#0D1410',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    overflow: 'hidden',
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBoxLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 15.5,
    fontWeight: '800',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.3)',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primaryLight,
  },
  liveBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  subTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  headerSubtitle: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  headerSubtitleLight: {
    color: '#00874E',
  },
  dotSeparator: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  lastUpdatedText: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    fontWeight: '500',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  spinIconWrap: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshBtnLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.22)',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLight: {
    backgroundColor: '#F0F4F2',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 183, 77, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 183, 77, 0.25)',
  },
  offlineNoticeText: {
    color: '#FFB74D',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  offlineRetryText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: '#111A14',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabBarLight: {
    backgroundColor: '#F4F7F5',
    borderBottomColor: 'rgba(0, 135, 78, 0.1)',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabBtnLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(0, 179, 104, 0.2)',
    borderColor: 'rgba(0, 179, 104, 0.45)',
  },
  tabBtnActiveLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.35)',
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    fontWeight: '700',
  },
  tabTextLight: {
    color: '#556A5E',
  },
  tabTextActive: {
    color: COLORS.primaryLight,
    fontWeight: '800',
  },
  tabTextActiveLight: {
    color: '#00874E',
    fontWeight: '800',
  },
  scrollBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  scrollBodyContent: {
    paddingBottom: 16,
  },
  matchCard: {
    backgroundColor: '#14201A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    marginBottom: 12,
  },
  matchCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.15)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  matchCardHome: {
    borderColor: 'rgba(0, 179, 104, 0.35)',
  },
  matchCardHomeLight: {
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  matchCardWin: {
    borderColor: 'rgba(0, 200, 83, 0.35)',
  },
  matchCardWinLight: {
    borderColor: 'rgba(0, 200, 83, 0.25)',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardCompTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  homeAwayBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  homeBadge: {
    backgroundColor: 'rgba(0, 179, 104, 0.2)',
  },
  homeBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  awayBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  awayBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  matchTeamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  teamLogoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#101713',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  teamLogoBoxRioAve: {
    backgroundColor: 'rgba(0, 179, 104, 0.2)',
    borderColor: '#00B368',
  },
  teamLogoImg: {
    width: 34,
    height: 34,
  },
  badgeMargin: {
    marginBottom: 2,
  },
  teamNameLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: 100,
  },
  teamNameRioAve: {
    color: COLORS.primaryLight,
    fontWeight: '900',
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  vsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  vsBadgeLight: {
    backgroundColor: '#EDF5F0',
  },
  vsBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '900',
  },
  vsTimeText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0A100C',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  scoreText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  scoreDivider: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  ftLabel: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 4,
  },
  matchMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#0F1712',
    borderRadius: 10,
    marginBottom: 10,
  },
  matchMetaRowLight: {
    backgroundColor: '#F7FAF8',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    fontWeight: '600',
  },
  cardActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00874E',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00B368',
  },
  cardActionBtnAway: {
    backgroundColor: '#0E3A27',
    borderColor: '#00874E',
  },
  cardActionBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  outcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  outcomeWin: {
    backgroundColor: '#00874E',
  },
  outcomeLoss: {
    backgroundColor: '#C62828',
  },
  outcomeDraw: {
    backgroundColor: '#E65100',
  },
  outcomeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});

export default memo(JogosModal);
