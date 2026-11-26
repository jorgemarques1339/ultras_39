import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { X, Trophy, RefreshCw, WifiOff } from 'lucide-react-native';
import ClubBadge from './ClubBadge';
import { COLORS } from '../theme/colors';
import { fetchLigaStandings } from '../services/matchesService';

const FALLBACK_STANDINGS = [
  { pos: 1, team: 'FC Porto', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/437.png', j: 11, v: 11, e: 0, d: 0, dg: '+22', pts: 33, zone: 'cl' },
  { pos: 2, team: 'SL Benfica', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/1929.png', j: 11, v: 9, e: 1, d: 1, dg: '+20', pts: 28, zone: 'cl' },
  { pos: 3, team: 'Sporting CP', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/2250.png', j: 11, v: 7, e: 3, d: 1, dg: '+13', pts: 24, zone: 'el' },
  { pos: 4, team: 'Santa Clara', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/12215.png', j: 11, v: 6, e: 3, d: 2, dg: '+8', pts: 21, zone: 'conf' },
  { pos: 5, team: 'FC Arouca', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/15784.png', j: 11, v: 6, e: 2, d: 3, dg: '+5', pts: 20 },
  { pos: 6, team: 'Académico de Viseu', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/21607.png', j: 11, v: 6, e: 2, d: 3, dg: '+2', pts: 20 },
  { pos: 7, team: 'Gil Vicente', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3699.png', j: 11, v: 5, e: 3, d: 3, dg: '+2', pts: 18 },
  { pos: 8, team: 'SC Braga', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/2994.png', j: 11, v: 5, e: 2, d: 4, dg: '+2', pts: 17 },
  { pos: 9, team: 'Moreirense FC', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3696.png', j: 11, v: 4, e: 2, d: 5, dg: '-5', pts: 14 },
  { pos: 10, team: 'FC Famalicão', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/12698.png', j: 11, v: 3, e: 4, d: 4, dg: '+1', pts: 13 },
  { pos: 11, team: 'FC Alverca', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/21613.png', j: 11, v: 3, e: 3, d: 5, dg: '-1', pts: 12 },
  { pos: 12, team: 'Estrela da Amadora', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/21610.png', j: 11, v: 2, e: 4, d: 5, dg: '-5', pts: 10 },
  { pos: 13, team: 'CD Nacional', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3472.png', j: 11, v: 3, e: 1, d: 7, dg: '-8', pts: 10 },
  { pos: 14, team: 'Vitória de Guimarães', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/5309.png', j: 11, v: 2, e: 3, d: 6, dg: '-1', pts: 9 },
  { pos: 15, team: 'Marítimo', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/552.png', j: 10, v: 2, e: 2, d: 6, dg: '-12', pts: 8 },
  { pos: 16, team: 'Casa Pia AC', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/21581.png', j: 11, v: 2, e: 2, d: 7, dg: '-14', pts: 8, zone: 'playoff' },
  { pos: 17, team: 'Rio Ave FC', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png', j: 11, v: 2, e: 1, d: 8, dg: '-15', pts: 7, zone: 'rel', isRioAve: true },
  { pos: 18, team: 'Estoril Praia', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/12216.png', j: 10, v: 0, e: 2, d: 8, dg: '-14', pts: 2, zone: 'rel' },
];

function TabelaModal({ visible, onClose, isDark = true }) {
  const [standings, setStandings] = useState(FALLBACK_STANDINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadStandings = useCallback(async (force = false) => {
    setIsLoading(true);
    setFetchError(false);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      })
    ).start();

    try {
      const data = await fetchLigaStandings(force);
      if (Array.isArray(data) && data.length > 0) {
        setStandings(data);
      }
    } catch (_) {
      setFetchError(true);
    } finally {
      setIsLoading(false);
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [spinAnim]);

  useEffect(() => {
    if (visible) {
      loadStandings(false);
    }
  }, [visible, loadStandings]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.card, !isDark && styles.cardLight]}>
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                <Trophy size={19} color={isDark ? '#00E676' : '#008751'} />
              </View>
              <View>
                <Text style={[styles.title, !isDark && styles.textDark]}>
                  Tabela Classificativa
                </Text>
                <Text style={[styles.subtitle, !isDark && styles.textMutedDark]}>
                  Liga Portugal Betclic · 2026/2027
                </Text>
              </View>
            </View>
            <View style={styles.headerRightActions}>
              <TouchableOpacity
                onPress={() => loadStandings(true)}
                style={[styles.refreshBtn, !isDark && styles.refreshBtnLight]}
                activeOpacity={0.7}
                disabled={isLoading}
                accessibilityLabel="Atualizar classificação"
              >
                <Animated.View style={[styles.spinIconWrap, { transform: [{ rotate: spin }] }]}>
                  <RefreshCw size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={18} color={isDark ? COLORS.textMuted : '#5A6E63'} />
              </TouchableOpacity>
            </View>
          </View>

          {fetchError && (
            <View style={styles.offlineNotice}>
              <WifiOff size={13} color="#FFB74D" />
              <Text style={styles.offlineNoticeText}>
                A exibir classificação guardada em cache.
              </Text>
              <TouchableOpacity onPress={() => loadStandings(true)} activeOpacity={0.7}>
                <Text style={styles.offlineRetryText}>Tentar de novo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Cabeçalho da Tabela */}
          <View style={[styles.tableHeaderRow, !isDark && styles.tableHeaderRowLight]}>
            <Text style={[styles.colPos, styles.thText, !isDark && styles.textMutedDark]}>#</Text>
            <Text style={[styles.colTeam, styles.thText, !isDark && styles.textMutedDark]}>CLUBE</Text>
            <Text style={[styles.colStat, styles.thText, !isDark && styles.textMutedDark]}>J</Text>
            <Text style={[styles.colStat, styles.thText, !isDark && styles.textMutedDark]}>V</Text>
            <Text style={[styles.colStat, styles.thText, !isDark && styles.textMutedDark]}>DG</Text>
            <Text style={[styles.colPts, styles.thText, !isDark && styles.textMutedDark]}>PTS</Text>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {standings.map((row) => {
              const zoneColor =
                row.zone === 'cl'
                  ? '#00E676'
                  : row.zone === 'el'
                    ? '#38BDF8'
                    : row.zone === 'conf'
                      ? '#F59E0B'
                      : row.zone === 'playoff'
                        ? '#FB923C'
                        : row.zone === 'rel'
                          ? '#EF4444'
                          : 'transparent';

              return (
                <View
                  key={row.team}
                  style={[
                    styles.tableRow,
                    !isDark && styles.tableRowLight,
                    row.isRioAve && (isDark ? styles.rioAveRowDark : styles.rioAveRowLight),
                  ]}
                >
                  <View style={[styles.zoneBar, { backgroundColor: zoneColor }]} />
                  <Text
                    style={[
                      styles.colPos,
                      styles.posCellText,
                      !isDark && styles.textDark,
                      row.isRioAve && (isDark ? styles.rioAveHighlightText : styles.rioAveNameLight),
                    ]}
                  >
                    {row.pos}
                  </Text>
                  <View style={styles.colTeamCell}>
                    <ClubBadge name={row.team} logo={row.logo} size="xs" isDark={isDark} />
                    <Text
                      style={[
                        styles.teamNameText,
                        !isDark && styles.textDark,
                        row.isRioAve && (isDark ? styles.rioAveNameDark : styles.rioAveNameLight),
                      ]}
                      numberOfLines={1}
                    >
                      {row.team}
                    </Text>
                  </View>
                  <Text style={[styles.colStat, styles.statCellText, !isDark && styles.textMutedDark]}>
                    {row.j}
                  </Text>
                  <Text style={[styles.colStat, styles.statCellText, !isDark && styles.textMutedDark]}>
                    {row.v}
                  </Text>
                  <Text style={[styles.colStat, styles.statCellText, !isDark && styles.textMutedDark]}>
                    {row.dg}
                  </Text>
                  <Text
                    style={[
                      styles.colPts,
                      styles.ptsCellText,
                      !isDark && styles.textDark,
                      row.isRioAve && (isDark ? styles.rioAveNameDark : styles.rioAveNameLight),
                    ]}
                  >
                    {row.pts}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          <View style={[styles.footer, !isDark && styles.footerLight]}>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#00E676' }]} />
                <Text style={[styles.legendText, !isDark && styles.textMutedDark]}>UCL</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#38BDF8' }]} />
                <Text style={[styles.legendText, !isDark && styles.textMutedDark]}>UEL</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text style={[styles.legendText, !isDark && styles.textMutedDark]}>Descida</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.doneBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#0D1410',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    overflow: 'hidden',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLight: {
    borderBottomColor: 'rgba(0, 135, 81, 0.12)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBoxLight: {
    backgroundColor: '#EBF7F0',
    borderColor: 'rgba(0, 135, 81, 0.25)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    color: '#8FA89B',
    fontSize: 11.5,
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spinIconWrap: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: 'rgba(255, 183, 77, 0.1)',
  },
  offlineNoticeText: {
    flex: 1,
    color: '#FFB74D',
    fontSize: 11,
    fontWeight: '600',
  },
  offlineRetryText: {
    color: '#00E676',
    fontSize: 11,
    fontWeight: '800',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#111D17',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  tableHeaderRowLight: {
    backgroundColor: '#F3F8F5',
    borderBottomColor: 'rgba(0, 135, 81, 0.12)',
  },
  thText: {
    color: '#8FA89B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  body: {
    flexGrow: 1,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    paddingLeft: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    position: 'relative',
  },
  tableRowLight: {
    borderBottomColor: 'rgba(0, 135, 81, 0.08)',
  },
  rioAveRowDark: {
    backgroundColor: 'rgba(0, 135, 81, 0.22)',
  },
  rioAveRowLight: {
    backgroundColor: 'rgba(0, 135, 81, 0.12)',
  },
  zoneBar: {
    width: 3,
    height: 18,
    borderRadius: 2,
    marginRight: 5,
  },
  colPos: {
    width: 24,
    textAlign: 'center',
  },
  colTeam: {
    flex: 1,
    paddingLeft: 6,
  },
  colTeamCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 6,
    paddingRight: 4,
  },
  colStat: {
    width: 28,
    textAlign: 'center',
  },
  colPts: {
    width: 34,
    textAlign: 'right',
  },
  posCellText: {
    color: '#C7D8CE',
    fontSize: 12,
    fontWeight: '700',
  },
  teamNameText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
  },
  statCellText: {
    color: '#8FA89B',
    fontSize: 11.5,
    fontWeight: '600',
  },
  ptsCellText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '900',
  },
  rioAveHighlightText: {
    color: '#00E676',
    fontWeight: '900',
  },
  rioAveNameDark: {
    color: '#00E676',
    fontWeight: '800',
  },
  rioAveNameLight: {
    color: '#008751',
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerLight: {
    borderTopColor: 'rgba(0, 135, 81, 0.12)',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    color: '#8FA89B',
    fontSize: 10.5,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: '#008751',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00E676',
  },
  doneBtnText: {
    color: '#FFFFFF',
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
