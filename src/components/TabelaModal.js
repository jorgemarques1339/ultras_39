import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  Table as TableIcon,
  Trophy,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import ClubBadge from './ClubBadge';

const LIGA_STANDINGS = [
  { pos: 1, team: 'Sporting CP', p: 5, w: 5, d: 0, l: 0, gd: '+17', pts: 15 },
  { pos: 2, team: 'FC Porto', p: 5, w: 4, d: 0, l: 1, gd: '+8', pts: 12 },
  { pos: 3, team: 'SL Benfica', p: 5, w: 3, d: 1, l: 1, gd: '+5', pts: 10 },
  { pos: 4, team: 'Santa Clara', p: 5, w: 3, d: 0, l: 2, gd: '+3', pts: 9 },
  { pos: 5, team: 'SC Braga', p: 5, w: 2, d: 2, l: 1, gd: '+2', pts: 8 },
  { pos: 6, team: 'Vitória SC', p: 5, w: 2, d: 2, l: 1, gd: '+1', pts: 8 },
  { pos: 7, team: 'FC Famalicão', p: 5, w: 2, d: 1, l: 2, gd: '0', pts: 7 },
  { pos: 8, team: 'Moreirense', p: 5, w: 2, d: 1, l: 2, gd: '-1', pts: 7 },
  { pos: 9, team: 'Rio Ave FC', p: 5, w: 2, d: 0, l: 3, gd: '-4', pts: 6, isRioAve: true },
  { pos: 10, team: 'Gil Vicente', p: 5, w: 1, d: 3, l: 1, gd: '0', pts: 6 },
  { pos: 11, team: 'AVS FS', p: 5, w: 1, d: 1, l: 3, gd: '-3', pts: 4 },
  { pos: 12, team: 'Estoril Praia', p: 5, w: 1, d: 1, l: 3, gd: '-4', pts: 4 },
  { pos: 13, team: 'Estrela da Amadora', p: 5, w: 0, d: 2, l: 3, gd: '-5', pts: 2 },
  { pos: 14, team: 'Boavista FC', p: 5, w: 0, d: 2, l: 3, gd: '-5', pts: 2 },
  { pos: 15, team: 'CD Nacional', p: 5, w: 0, d: 1, l: 4, gd: '-7', pts: 1 },
  { pos: 16, team: 'FC Alverca', p: 5, w: 0, d: 1, l: 4, gd: '-9', pts: 1 },
];

export default function TabelaModal({ visible, onClose, onNavigateTab }) {
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
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBox}>
                <TableIcon size={18} color={COLORS.primaryLight} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Tabela Classificativa</Text>
                <Text style={styles.headerSubtitle}>Liga Portugal Betclic · 2026/2027</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Cabeçalho da Tabela */}
          <View style={styles.tableHeadRow}>
            <Text style={[styles.colHead, styles.colPos]}>#</Text>
            <Text style={[styles.colHead, styles.colClub]}>CLUBE</Text>
            <Text style={[styles.colHead, styles.colStat]}>J</Text>
            <Text style={[styles.colHead, styles.colStat]}>V</Text>
            <Text style={[styles.colHead, styles.colStat]}>E</Text>
            <Text style={[styles.colHead, styles.colStat]}>D</Text>
            <Text style={[styles.colHead, styles.colStat]}>DG</Text>
            <Text style={[styles.colHead, styles.colPts]}>PTS</Text>
          </View>

          {/* Lista de Classificação */}
          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {LIGA_STANDINGS.map((row) => (
              <View
                key={row.pos}
                style={[
                  styles.tableRow,
                  row.isRioAve && styles.tableRowRioAve,
                ]}
              >
                <View style={styles.colPos}>
                  <Text
                    style={[
                      styles.posText,
                      row.isRioAve && styles.textRioAveGlow,
                      row.pos <= 3 && styles.posTop,
                    ]}
                  >
                    {row.pos}
                  </Text>
                </View>

                <View style={[styles.clubInfo, styles.colClub]}>
                  <ClubBadge name={row.team} size="xs" style={{ marginRight: 6 }} />
                  <Text
                    style={[
                      styles.teamName,
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

                <Text style={[styles.statText, styles.colStat]}>{row.p}</Text>
                <Text style={[styles.statText, styles.colStat]}>{row.w}</Text>
                <Text style={[styles.statText, styles.colStat]}>{row.d}</Text>
                <Text style={[styles.statText, styles.colStat]}>{row.l}</Text>
                <Text style={[styles.statText, styles.colStat]}>{row.gd}</Text>
                <Text style={[styles.ptsText, styles.colPts, row.isRioAve && styles.ptsRioAve]}>
                  {row.pts}
                </Text>
              </View>
            ))}

            {/* Acesso aos Jogos */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleGoToMatches}
              activeOpacity={0.85}
            >
              <Text style={styles.actionBtnText}>Ver Calendário de Jogos</Text>
              <ChevronRight size={16} color="#FFF" />
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
      },
    }),
  },
  container: {
    backgroundColor: '#0D1410',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    overflow: 'hidden',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121C16',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  colHead: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  colPos: {
    width: 26,
    textAlign: 'center',
  },
  colClub: {
    flex: 1,
    textAlign: 'left',
  },
  colStat: {
    width: 24,
    textAlign: 'center',
  },
  colPts: {
    width: 32,
    textAlign: 'center',
    fontWeight: '900',
  },
  scrollBody: {
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  tableRowRioAve: {
    backgroundColor: 'rgba(0, 179, 104, 0.16)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.45)',
    marginVertical: 2,
    paddingVertical: 10,
  },
  posText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  posTop: {
    color: COLORS.gold,
  },
  textRioAveGlow: {
    color: COLORS.primaryLight,
    fontWeight: '900',
  },
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  teamNameRioAve: {
    color: '#FFF',
    fontWeight: '900',
  },
  rioAveTag: {
    backgroundColor: '#00874E',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginLeft: 6,
  },
  rioAveTagText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  ptsText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  ptsRioAve: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '900',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00874E',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
    gap: 8,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
