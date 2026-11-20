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
  Trophy,
  RefreshCw,
  WifiOff,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import ClubBadge from './ClubBadge';
import { fetchLiveResults as fetchLiveResultsFromService } from '../services/matchesService';

const FALLBACK_RESULTS = [
  {
    id: 'res-0',
    date: '2026-09-14T17:45:00Z',
    competition: 'Liga Portugal Betclic',
    round: '6.ª Jornada',
    homeTeam: 'Rio Ave FC',
    homeScore: 3,
    homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
    awayTeam: 'Estrela da Amadora',
    awayScore: 3,
    awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3824.png',
    outcome: 'draw',
    venue: 'Estádio do Rio Ave FC (Arcos)',
  },
  {
    id: 'res-1',
    date: '2026-09-06T14:30:00Z',
    competition: 'Liga Portugal Betclic',
    round: '5.ª Jornada',
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
  if (!dateString) return { full: 'A definir', time: '', short: '' };
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

function ResultadoModal({
  visible,
  onClose,
  isDark = true,
}) {
  const [pastResults, setPastResults] = useState(FALLBACK_RESULTS);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const isFetchingRef = useRef(false);

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

  const fetchLiveResultsList = useCallback(async (isManual = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    if (isManual) startSpin();

    try {
      const results = await fetchLiveResultsFromService(isManual);
      if (Array.isArray(results) && results.length > 0) {
        const mapped = results.map((r, index) => ({
          id: r.id || `res-${index}`,
          date: r.rawDate || r.date,
          competition: r.competition?.split('·')[0]?.trim() || 'Liga Portugal Betclic',
          round: r.competition?.split('·')[1]?.trim() || `${results.length - index}.ª Jornada`,
          homeTeam: r.home,
          homeScore: r.scoreHome,
          homeLogo: r.homeLogo || null,
          awayTeam: r.away,
          awayScore: r.scoreAway,
          awayLogo: r.awayLogo || null,
          outcome: r.outcome === 'V' ? 'win' : r.outcome === 'D' ? 'loss' : 'draw',
          venue: r.stadium || 'Estádio',
        }));
        setPastResults(mapped);
      }
      setFetchError(false);
    } catch (err) {
      console.warn('Erro ao atualizar resultados:', err);
      setFetchError(true);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      stopSpin();
    }
  }, [startSpin, stopSpin]);

  useEffect(() => {
    if (visible) {
      fetchLiveResultsList(false);
      const intervalId = setInterval(() => {
        fetchLiveResultsList(false);
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [visible, fetchLiveResultsList]);

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
                <Trophy size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
              </View>
              <View>
                <View style={styles.titleRow}>
                  <Text style={[styles.headerTitle, !isDark && styles.textDark]}>
                    Últimos Resultados
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
                onPress={() => fetchLiveResultsList(true)}
                style={[styles.refreshBtn, !isDark && styles.refreshBtnLight]}
                activeOpacity={0.7}
                disabled={isLoading}
                accessibilityLabel="Atualizar resultados oficiais"
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
                A exibir resultados guardados em cache.
              </Text>
              <TouchableOpacity onPress={() => fetchLiveResultsList(true)} activeOpacity={0.7}>
                <Text style={styles.offlineRetryText}>Tentar de novo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Cabeçalho de Secção: Resultados */}
          <View style={[styles.tabBar, !isDark && styles.tabBarLight]}>
            <View
              style={[
                styles.tabBtn,
                !isDark && styles.tabBtnLight,
                styles.tabBtnActive,
                !isDark && styles.tabBtnActiveLight,
              ]}
            >
              <Trophy size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
              <Text
                style={[
                  styles.tabText,
                  !isDark && styles.tabTextLight,
                  styles.tabTextActive,
                  !isDark && styles.tabTextActiveLight,
                ]}
              >
                Resultados ({pastResults.length})
              </Text>
            </View>
          </View>

          {/* Lista de Resultados Passados */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollBodyContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
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

export default memo(ResultadoModal);
