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
  MapPin,
  RefreshCw,
  WifiOff,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import ClubBadge from './ClubBadge';
import { fetchLiveSchedule as fetchLiveUpcomingFromService } from '../services/matchesService';

// Fallback inicial com jogos reais da época 2026/2027
const FALLBACK_UPCOMING = [
  {
    id: 'fix-2',
    date: '2026-09-19T17:00:00Z',
    competition: 'Liga Portugal Betclic',
    round: '7.ª Jornada',
    homeTeam: 'FC Alverca',
    homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/21613.png',
    awayTeam: 'Rio Ave FC',
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    isHome: false,
    venue: 'Complexo Desportivo FC Alverca',
    city: 'Alverca',
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
  },
];

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
  isDark = true,
}) {
  const [upcomingMatches, setUpcomingMatches] = useState(FALLBACK_UPCOMING);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const isFetchingRef = useRef(false);

  // Rotação do ícone de atualização
  const spinAnim = useRef(new Animated.Value(0)).current;

  const startSpin = useCallback(() => {
    spinAnim.setValue(0);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: Platform.OS !== 'web',
      })
    ).start();
  }, [spinAnim]);

  const stopSpin = useCallback(() => {
    spinAnim.stopAnimation();
    spinAnim.setValue(0);
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Função para buscar próximos jogos usando o serviço partilhado (com cache de 60s)
  const fetchLiveSchedule = useCallback(async (isManual = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    if (isManual) startSpin();

    try {
      const matches = await fetchLiveUpcomingFromService(isManual);
      if (Array.isArray(matches) && matches.length > 0) {
        setUpcomingMatches(
          matches.map((m) => ({
            id: m.id,
            date: m.rawDate || m.date,
            competition: m.competition || 'Liga Portugal Betclic',
            round: m.round,
            homeTeam: m.homeTeam?.name || 'Rio Ave FC',
            homeLogo: m.homeTeam?.logo || null,
            awayTeam: m.awayTeam?.name || 'Adversário',
            awayLogo: m.awayTeam?.logo || null,
            isHome: m.isHome,
            venue: m.venue,
            city: m.city,
          }))
        );
      }
      setFetchError(false);
    } catch (err) {
      console.warn('Erro ao atualizar jogos em direto:', err);
      setFetchError(true);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      stopSpin();
    }
  }, [startSpin, stopSpin]);

  useEffect(() => {
    if (visible) {
      fetchLiveSchedule(false);
      const intervalId = setInterval(() => {
        fetchLiveSchedule(false);
      }, 60000);

      return () => clearInterval(intervalId);
    }
  }, [visible, fetchLiveSchedule]);

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
                </View>

                <View style={styles.subTitleRow}>
                  <Text style={[styles.headerSubtitle, !isDark && styles.headerSubtitleLight]}>
                    Liga Portugal Betclic · 2026/2027
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
                <Animated.View style={[styles.spinIconWrap, { transform: [{ rotate: spin }] }]}>
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

          {/* Cabeçalho de Secção: Próximos Jogos */}
          <View style={[styles.tabBar, !isDark && styles.tabBarLight]}>
            <View
              style={[
                styles.tabBtn,
                !isDark && styles.tabBtnLight,
                styles.tabBtnActive,
                !isDark && styles.tabBtnActiveLight,
              ]}
            >
              <CalendarIcon
                size={15}
                color={isDark ? COLORS.primaryLight : '#00874E'}
              />
              <Text
                style={[
                  styles.tabText,
                  !isDark && styles.tabTextLight,
                  styles.tabTextActive,
                  !isDark && styles.tabTextActiveLight,
                ]}
              >
                Próximos Jogos ({upcomingMatches.length})
              </Text>
            </View>
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
                    </View>
                  );
                })}
              </View>

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
