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
  ActivityIndicator,
  Animated,
} from 'react-native';
import {
  X,
  Table as TableIcon,
  ChevronRight,
  RefreshCw,
  Sparkles,
  WifiOff,
  Radio,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import ClubBadge from './ClubBadge';

// Dados base de segurança (para renderização instantânea caso a rede demore ou falhe)
const FALLBACK_STANDINGS = [
  { pos: 1, team: 'FC Porto', shortName: 'FC Porto', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/437.png', p: 5, w: 5, d: 0, l: 0, gd: '+10', pts: 15, isRioAve: false },
  { pos: 2, team: 'Benfica', shortName: 'Benfica', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/1929.png', p: 5, w: 4, d: 1, l: 0, gd: '+15', pts: 13, isRioAve: false },
  { pos: 3, team: 'Sporting CP', shortName: 'Sporting', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/2250.png', p: 5, w: 4, d: 1, l: 0, gd: '+9', pts: 13, isRioAve: false },
  { pos: 4, team: 'Santa Clara', shortName: 'Santa Clara', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/4260.png', p: 5, w: 3, d: 2, l: 0, gd: '+6', pts: 11, isRioAve: false },
  { pos: 5, team: 'Arouca', shortName: 'Arouca', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/11833.png', p: 5, w: 3, d: 1, l: 1, gd: '+4', pts: 10, isRioAve: false },
  { pos: 6, team: 'SC Braga', shortName: 'Braga', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/3823.png', p: 3, w: 2, d: 1, l: 0, gd: '+2', pts: 7, isRioAve: false },
  { pos: 7, team: 'Gil Vicente', shortName: 'Gil Vicente', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/3826.png', p: 4, w: 2, d: 1, l: 1, gd: '+2', pts: 7, isRioAve: false },
  { pos: 8, team: 'Marítimo', shortName: 'Marítimo', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/3825.png', p: 5, w: 2, d: 1, l: 2, gd: '-2', pts: 7, isRioAve: false },
  { pos: 9, team: 'Estrela da Amadora', shortName: 'Estrela', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/3824.png', p: 4, w: 1, d: 3, l: 0, gd: '+1', pts: 6, isRioAve: false },
  { pos: 10, team: 'Académico de Viseu', shortName: 'Ac. Viseu', logoUrl: null, p: 5, w: 1, d: 2, l: 2, gd: '-3', pts: 5, isRioAve: false },
  { pos: 11, team: 'Vitória SC', shortName: 'Vitória SC', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/3827.png', p: 5, w: 1, d: 1, l: 3, gd: '-2', pts: 4, isRioAve: false },
  { pos: 12, team: 'CD Nacional', shortName: 'Nacional', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/3828.png', p: 5, w: 1, d: 1, l: 3, gd: '-2', pts: 4, isRioAve: false },
  { pos: 13, team: 'Moreirense', shortName: 'Moreirense', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/4262.png', p: 5, w: 1, d: 1, l: 3, gd: '-8', pts: 4, isRioAve: false },
  { pos: 14, team: 'FC Famalicão', shortName: 'Famalicão', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/18816.png', p: 5, w: 0, d: 3, l: 2, gd: '-2', pts: 3, isRioAve: false },
  { pos: 15, team: 'Rio Ave FC', shortName: 'Rio Ave', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png', p: 5, w: 1, d: 0, l: 4, gd: '-9', pts: 3, isRioAve: true },
  { pos: 16, team: 'FC Alverca', shortName: 'Alverca', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/3829.png', p: 5, w: 0, d: 2, l: 3, gd: '-5', pts: 2, isRioAve: false },
  { pos: 17, team: 'Estoril Praia', shortName: 'Estoril', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/4261.png', p: 5, w: 0, d: 2, l: 3, gd: '-5', pts: 2, isRioAve: false },
  { pos: 18, team: 'Casa Pia AC', shortName: 'Casa Pia', logoUrl: 'https://a.espncdn.com/i/teamlogos/soccer/500/21535.png', p: 5, w: 0, d: 1, l: 4, gd: '-11', pts: 1, isRioAve: false },
];

const LIGA_PORTUGAL_API = 'https://site.api.espn.com/apis/v2/sports/soccer/por.1/standings';

function TeamLogo({ logoUrl, teamName, isRioAve }) {
  const [hasError, setHasError] = useState(false);

  if (!logoUrl || hasError) {
    return <ClubBadge name={teamName} size="xs" style={styles.badgeSpacing} />;
  }

  return (
    <View style={[styles.logoContainer, isRioAve && styles.logoContainerRioAve]}>
      <Image
        source={{ uri: logoUrl }}
        style={styles.logoImg}
        resizeMode="contain"
        onError={() => setHasError(true)}
      />
    </View>
  );
}

function TabelaModal({ visible, onClose, onNavigateTab, isDark = true }) {
  const [standings, setStandings] = useState(FALLBACK_STANDINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(true);
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

  // Função para buscar dados em direto da Liga Portugal
  const fetchLiveStandings = useCallback(async (isManual = false) => {
    if (isLoading) return;
    setIsLoading(true);
    if (isManual) startSpin();

    try {
      const response = await fetch(LIGA_PORTUGAL_API, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const entries = data.children ? data.children[0]?.standings?.entries : data.standings?.entries;

      if (entries && Array.isArray(entries) && entries.length > 0) {
        const parsed = entries.map((entry, index) => {
          const statsMap = {};
          (entry.stats || []).forEach((stat) => {
            statsMap[stat.name] = stat.displayValue !== undefined ? stat.displayValue : stat.value;
          });

          const rawTeamName = entry.team?.displayName || entry.team?.name || 'Clube';
          const isRioAve = rawTeamName.toLowerCase().includes('rio ave');

          // Formatar nome amigável para a tabela
          let displayTeam = rawTeamName;
          if (rawTeamName.toLowerCase() === 'rio ave') displayTeam = 'Rio Ave FC';
          if (rawTeamName.toLowerCase() === 'sporting cp' || rawTeamName.toLowerCase() === 'sporting') displayTeam = 'Sporting CP';
          if (rawTeamName.toLowerCase() === 'benfica') displayTeam = 'SL Benfica';
          if (rawTeamName.toLowerCase() === 'braga') displayTeam = 'SC Braga';
          if (rawTeamName.toLowerCase() === 'vitoria de guimaraes') displayTeam = 'Vitória SC';

          return {
            pos: parseInt(statsMap.rank, 10) || index + 1,
            team: displayTeam,
            shortName: entry.team?.shortDisplayName || displayTeam,
            logoUrl: entry.team?.logos?.[0]?.href || null,
            p: parseInt(statsMap.gamesPlayed, 10) || 0,
            w: parseInt(statsMap.wins, 10) || 0,
            d: parseInt(statsMap.ties, 10) || 0,
            l: parseInt(statsMap.losses, 10) || 0,
            gd: statsMap.pointDifferential !== undefined ? String(statsMap.pointDifferential) : '0',
            pts: parseInt(statsMap.points, 10) || 0,
            isRioAve,
          };
        });

        // Ordenar por posição oficial
        parsed.sort((a, b) => a.pos - b.pos);
        setStandings(parsed);
        setIsLive(true);
        setFetchError(false);

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setLastUpdated(`Atualizado às ${hours}:${minutes}`);
      }
    } catch (err) {
      console.warn('Erro ao carregar classificação em direto:', err);
      setFetchError(true);
    } finally {
      setIsLoading(false);
      stopSpin();
    }
  }, [isLoading]);

  // Carregar dados sempre que o modal for aberto e a cada 60s
  useEffect(() => {
    if (visible) {
      fetchLiveStandings(false);

      const intervalId = setInterval(() => {
        fetchLiveStandings(false);
      }, 60000);

      return () => clearInterval(intervalId);
    }
  }, [visible]);

  const handleGoToMatches = () => {
    onClose();
    if (onNavigateTab) {
      onNavigateTab('calendar');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, !isDark && styles.containerLight]}>
          {/* Barra Superior / Header */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                <TableIcon size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
              </View>
              <View>
                <View style={styles.titleRow}>
                  <Text style={[styles.headerTitle, !isDark && styles.textDark]}>
                    Tabela Classificativa
                  </Text>
                  {/* Badge de Transmissão Oficial em Direto */}
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
              {/* Botão de Atualização Manual */}
              <TouchableOpacity
                onPress={() => fetchLiveStandings(true)}
                style={[styles.refreshBtn, !isDark && styles.refreshBtnLight]}
                activeOpacity={0.7}
                disabled={isLoading}
                accessibilityLabel="Atualizar tabela classificativa"
              >
                <Animated.View style={styles.spinIconWrap}>
                  <RefreshCw size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                </Animated.View>
              </TouchableOpacity>

              {/* Fechar */}
              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
                activeOpacity={0.7}
              >
                <X size={14} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Aviso se estiver a carregar ou erro */}
          {fetchError && (
            <View style={styles.offlineNotice}>
              <WifiOff size={13} color="#FFB74D" />
              <Text style={styles.offlineNoticeText}>
                A exibir última versão guardada da Liga Portugal.
              </Text>
              <TouchableOpacity onPress={() => fetchLiveStandings(true)} activeOpacity={0.7}>
                <Text style={styles.offlineRetryText}>Tentar de novo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Cabeçalho da Tabela */}
          <View style={[styles.tableHeadRow, !isDark && styles.tableHeadRowLight]}>
            <Text style={[styles.colHead, styles.colPos, !isDark && styles.textMutedDark]}>#</Text>
            <Text style={[styles.colHead, styles.colClub, !isDark && styles.textMutedDark]}>CLUBE</Text>
            <Text style={[styles.colHead, styles.colStat, !isDark && styles.textMutedDark]}>J</Text>
            <Text style={[styles.colHead, styles.colStat, !isDark && styles.textMutedDark]}>V</Text>
            <Text style={[styles.colHead, styles.colStat, !isDark && styles.textMutedDark]}>E</Text>
            <Text style={[styles.colHead, styles.colStat, !isDark && styles.textMutedDark]}>D</Text>
            <Text style={[styles.colHead, styles.colStat, !isDark && styles.textMutedDark]}>DG</Text>
            <Text style={[styles.colHead, styles.colPts, !isDark && styles.textMutedDark]}>PTS</Text>
          </View>

          {/* Lista de Classificação Oficial */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollBodyContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {standings.map((row) => {
              const isTopChampions = row.pos <= 2;
              const isEurope = row.pos === 3 || row.pos === 4;
              const isRelegation = row.pos >= 17;
              const isPlayoff = row.pos === 16;

              return (
                <View
                  key={row.pos + '-' + row.team}
                  style={[
                    styles.tableRow,
                    !isDark && styles.tableRowLight,
                    row.isRioAve && styles.tableRowRioAve,
                    !isDark && row.isRioAve && styles.tableRowRioAveLight,
                  ]}
                >
                  {/* Posição com Indicador de Zona */}
                  <View style={styles.colPos}>
                    <View style={styles.posWrapper}>
                      <Text
                        style={[
                          styles.posText,
                          !isDark && styles.posTextLight,
                          row.isRioAve && styles.textRioAveGlow,
                          !isDark && row.isRioAve && styles.textRioAveGlowLight,
                          isTopChampions && styles.posTop,
                        ]}
                      >
                        {row.pos}
                      </Text>
                      {/* Barrinha lateral de qualificação/despromoção */}
                      {isTopChampions && <View style={[styles.zoneIndicator, styles.zoneChampions]} />}
                      {isEurope && <View style={[styles.zoneIndicator, styles.zoneEurope]} />}
                      {isPlayoff && <View style={[styles.zoneIndicator, styles.zonePlayoff]} />}
                      {isRelegation && <View style={[styles.zoneIndicator, styles.zoneRelegation]} />}
                    </View>
                  </View>

                  {/* Nome do Clube e Emblema Oficial */}
                  <View style={[styles.clubInfo, styles.colClub]}>
                    <TeamLogo
                      logoUrl={row.logoUrl}
                      teamName={row.team}
                      isRioAve={row.isRioAve}
                    />

                    <Text
                      style={[
                        styles.teamName,
                        !isDark && styles.teamNameLight,
                        row.isRioAve && styles.teamNameRioAve,
                      ]}
                      numberOfLines={1}
                    >
                      {row.team}
                    </Text>

                    {row.isRioAve && (
                      <View style={styles.rioAveTag}>
                        <Text style={styles.rioAveTagText}>G39</Text>
                      </View>
                    )}
                  </View>

                  {/* Estatísticas */}
                  <Text style={[styles.statText, styles.colStat, !isDark && styles.statTextLight]}>{row.p}</Text>
                  <Text style={[styles.statText, styles.colStat, !isDark && styles.statTextLight]}>{row.w}</Text>
                  <Text style={[styles.statText, styles.colStat, !isDark && styles.statTextLight]}>{row.d}</Text>
                  <Text style={[styles.statText, styles.colStat, !isDark && styles.statTextLight]}>{row.l}</Text>
                  <Text style={[styles.statText, styles.colStat, !isDark && styles.statTextLight]}>{row.gd}</Text>

                  {/* Pontos */}
                  <Text
                    style={[
                      styles.ptsText,
                      styles.colPts,
                      !isDark && styles.ptsTextLight,
                      row.isRioAve && styles.ptsRioAve,
                    ]}
                  >
                    {row.pts}
                  </Text>
                </View>
              );
            })}

            {/* Legenda de Zonas */}
            <View style={[styles.legendBox, !isDark && styles.legendBoxLight]}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.zoneChampions]} />
                <Text style={[styles.legendText, !isDark && styles.legendTextLight]}>
                  1º-2º Liga dos Campeões
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.zoneEurope]} />
                <Text style={[styles.legendText, !isDark && styles.legendTextLight]}>
                  3º-4º Competições Europeias
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.zonePlayoff]} />
                <Text style={[styles.legendText, !isDark && styles.legendTextLight]}>
                  16º Playoff
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.zoneRelegation]} />
                <Text style={[styles.legendText, !isDark && styles.legendTextLight]}>
                  17º-18º Despromoção
                </Text>
              </View>
            </View>

            {/* Acesso ao Calendário de Jogos */}
            <TouchableOpacity
              style={[styles.actionBtn, !isDark && styles.actionBtnLight]}
              onPress={handleGoToMatches}
              activeOpacity={0.85}
            >
              <Text style={styles.actionBtnText}>Ver Calendário Oficial de Jogos</Text>
              <ChevronRight size={16} color="#FFF" />
            </TouchableOpacity>

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
    maxHeight: '88%',
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
  tableHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111A14',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  tableHeadRowLight: {
    backgroundColor: '#F4F7F5',
    borderBottomColor: 'rgba(0, 135, 78, 0.1)',
  },
  colHead: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  colPos: {
    width: 24,
    textAlign: 'center',
  },
  posWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  zoneIndicator: {
    position: 'absolute',
    left: -2,
    width: 2.5,
    height: 14,
    borderRadius: 1,
  },
  zoneChampions: {
    backgroundColor: '#00B368',
  },
  zoneEurope: {
    backgroundColor: '#FF9800',
  },
  zonePlayoff: {
    backgroundColor: '#FFB300',
  },
  zoneRelegation: {
    backgroundColor: '#E53935',
  },
  colClub: {
    flex: 1,
    textAlign: 'left',
  },
  colStat: {
    width: 22,
    textAlign: 'center',
  },
  colPts: {
    width: 28,
    textAlign: 'center',
    fontWeight: '900',
  },
  scrollBody: {
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  scrollBodyContent: {
    paddingBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8.5,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  tableRowLight: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  tableRowRioAve: {
    backgroundColor: 'rgba(0, 179, 104, 0.16)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.45)',
    marginVertical: 2,
    paddingVertical: 9.5,
  },
  tableRowRioAveLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.35)',
  },
  posText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  posTextLight: {
    color: '#556A5E',
  },
  posTop: {
    color: COLORS.primaryLight,
    fontWeight: '800',
  },
  textRioAveGlow: {
    color: COLORS.primaryLight,
    fontWeight: '900',
  },
  textRioAveGlowLight: {
    color: '#00874E',
    fontWeight: '900',
  },
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  badgeSpacing: {
    marginRight: 6,
  },
  logoContainer: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#15221B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    overflow: 'hidden',
  },
  logoContainerRioAve: {
    backgroundColor: 'rgba(0, 135, 78, 0.25)',
    borderWidth: 1,
    borderColor: '#00B368',
  },
  logoImg: {
    width: 18,
    height: 18,
  },
  teamName: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '600',
    flexShrink: 1,
  },
  teamNameLight: {
    color: '#121F17',
  },
  teamNameRioAve: {
    color: '#FFF',
    fontWeight: '900',
  },
  rioAveTag: {
    backgroundColor: '#00874E',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 5,
  },
  rioAveTagText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    textAlign: 'center',
  },
  statTextLight: {
    color: '#556A5E',
  },
  ptsText: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  ptsTextLight: {
    color: '#0D1510',
  },
  ptsRioAve: {
    color: COLORS.primaryLight,
    fontSize: 12.5,
    fontWeight: '900',
  },
  legendBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: '#101913',
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  legendBoxLight: {
    backgroundColor: '#F5F8F6',
    borderColor: 'rgba(0, 135, 78, 0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '600',
  },
  legendTextLight: {
    color: '#556A5E',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00874E',
    borderRadius: 12,
    paddingVertical: 11,
    marginTop: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#00B368',
  },
  actionBtnLight: {
    backgroundColor: '#00874E',
    borderColor: '#00A15D',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});

export default memo(TabelaModal);
