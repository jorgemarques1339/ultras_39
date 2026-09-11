import React, { memo } from 'react';
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
  CreditCard,
  X,
  ShieldCheck,
  Receipt,
  ChevronRight,
  ArrowUpRight,
  History,
  CheckCircle2,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

function PagamentosModal({
  visible,
  onClose,
  transactions = [],
  onViewReceipt,
  user,
  isDark = true,
}) {
  if (!visible) return null;

  const totalSpent = transactions.reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, !isDark && styles.overlayLight]}>
        <View style={[styles.container, !isDark && styles.containerLight]}>
          {/* Barra Indicadora Superior (Sheet Handle) */}
          <View style={[styles.sheetHandle, !isDark && styles.sheetHandleLight]} />

          {/* Header Padronizado */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                <Receipt size={20} color={isDark ? COLORS.primaryLight : '#00874E'} />
              </View>
              <View style={styles.headerTitleCol}>
                <Text style={[styles.headerTitle, !isDark && styles.headerTitleLight]} numberOfLines={1}>
                  Os Meus Pagamentos
                </Text>
                <Text style={[styles.headerSubtitle, !isDark && styles.headerSubtitleLight]} numberOfLines={1}>
                  Todas as Transações & Comprovativos SIBS
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel="Fechar pagamentos"
            >
              <X size={18} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          {/* Conteúdo Scrollável com Todas as Transações */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {/* Resumo Financeiro do Utilizador */}
            <View style={[styles.summaryCard, !isDark && styles.summaryCardLight]}>
              <View style={styles.summaryTopRow}>
                <View style={styles.summaryBadge}>
                  <History size={12} color={COLORS.primaryLight} />
                  <Text style={styles.summaryBadgeText}>HISTÓRICO EXECUTADO</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <CheckCircle2 size={12} color="#00C853" />
                  <Text style={styles.verifiedText}>SIBS Autenticado</Text>
                </View>
              </View>

              <View style={styles.summaryMainRow}>
                <View>
                  <Text style={[styles.summaryLabel, !isDark && styles.textMutedDark]}>
                    Total Liquidado
                  </Text>
                  <Text style={[styles.summaryTotalAmount, !isDark && styles.textDark]}>
                    {totalSpent.toFixed(2)} €
                  </Text>
                </View>
                <View style={styles.summaryRightCol}>
                  <Text style={[styles.summaryCountLabel, !isDark && styles.textMutedDark]}>
                    Movimentos
                  </Text>
                  <Text style={styles.summaryCountValue}>
                    {transactions.length} transações
                  </Text>
                </View>
              </View>

              {user?.name && (
                <View style={[styles.userRow, !isDark && styles.userRowLight]}>
                  <Text style={[styles.userNameText, !isDark && styles.textDark]}>
                    Sócio / Adepto: <Text style={styles.boldWhite}>{user.name}</Text>
                  </Text>
                  <Text style={styles.userPhoneText}>
                    {user.phone || '912 345 678'}
                  </Text>
                </View>
              )}
            </View>

            {/* Título da Lista de Transações */}
            <View style={styles.listHeaderRow}>
              <Text style={[styles.listSectionTitle, !isDark && styles.textDark]}>
                Transações Executadas ({transactions.length})
              </Text>
              <Text style={[styles.listSubText, !isDark && styles.textMutedDark]}>
                Toca para ver o recibo oficial
              </Text>
            </View>

            {/* Lista de Transações */}
            {transactions.length === 0 ? (
              <View style={[styles.emptyBox, !isDark && styles.emptyBoxLight]}>
                <CreditCard size={32} color={isDark ? '#4A6154' : '#8A9E93'} />
                <Text style={[styles.emptyTitle, !isDark && styles.textDark]}>
                  Nenhum pagamento efetuado ainda
                </Text>
                <Text style={[styles.emptyDesc, !isDark && styles.textMutedDark]}>
                  As quotas, bilhetes de jogo e deslocações que pagares via MB WAY aparecerão detalhadas aqui.
                </Text>
              </View>
            ) : (
              transactions.map((tx, index) => (
                <TouchableOpacity
                  key={tx.id || `tx-${index}`}
                  style={[styles.txCard, !isDark && styles.txCardLight]}
                  onPress={() => {
                    if (onViewReceipt) onViewReceipt(tx);
                  }}
                  activeOpacity={0.75}
                >
                  <View style={styles.txTopRow}>
                    {/* Badge do Método de Pagamento MB WAY */}
                    <View style={styles.mbwayBadge}>
                      <Text style={styles.mbwayText}>MB</Text>
                      <View style={styles.mbwayDot} />
                      <Text style={styles.mbwaySub}>WAY</Text>
                    </View>

                    <Text style={[styles.txDate, !isDark && styles.textMutedDark]}>
                      {tx.date}
                    </Text>

                    <View style={styles.txStatusBadge}>
                      <Text style={styles.txStatusText}>
                        {tx.status || 'Concluído'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.txBodyRow}>
                    <View style={styles.txInfoCol}>
                      <Text style={[styles.txTitle, !isDark && styles.textDark]} numberOfLines={2}>
                        {tx.title}
                      </Text>
                      <Text style={[styles.txCategory, !isDark && styles.textMutedDark]}>
                        {tx.category}
                      </Text>
                      <Text style={styles.txRefText}>
                        Ref SIBS: {tx.sibsRef || `MBW-${tx.id}`}
                      </Text>
                    </View>

                    <View style={styles.txAmountCol}>
                      <Text style={[styles.txAmountText, !isDark && styles.textDark]}>
                        {Number(tx.amount || 0).toFixed(2)} €
                      </Text>
                    </View>
                  </View>

                  {/* Botão Ver Comprovativo */}
                  <View style={[styles.receiptBtnRow, !isDark && styles.receiptBtnRowLight]}>
                    <View style={styles.receiptLeftCol}>
                      <Receipt size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                      <Text style={[styles.receiptBtnLabel, !isDark && styles.receiptBtnLabelLight]}>
                        Comprovativo Oficial SIBS
                      </Text>
                    </View>
                    <ArrowUpRight size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  </View>
                </TouchableOpacity>
              ))
            )}

            {/* Aviso de Segurança SIBS */}
            <View style={[styles.footerSecurity, !isDark && styles.footerSecurityLight]}>
              <ShieldCheck size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
              <Text style={[styles.footerSecurityText, !isDark && styles.textMutedDark]}>
                Transações processadas pela Rede SIBS com encriptação bancária 256-bit SSL.
              </Text>
            </View>

            {/* Botão Fechar */}
            <TouchableOpacity
              style={styles.closeActionBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[styles.closeActionText, !isDark && styles.closeActionTextLight]}>
                Fechar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      },
    }),
  },
  overlayLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  container: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#0F1A14',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    maxHeight: '90%',
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    ...Platform.select({
      web: {
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 179, 104, 0.1)',
      },
      default: {
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
    }),
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  sheetHandleLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLight: {
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBoxLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerTitleLight: {
    color: '#121F17',
  },
  headerSubtitle: {
    color: COLORS.primaryLight,
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 1,
  },
  headerSubtitleLight: {
    color: '#00874E',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  scrollBody: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#142219',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
  },
  summaryCardLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.16)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
  },
  summaryBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    color: '#00C853',
    fontSize: 10,
    fontWeight: '700',
  },
  summaryMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  summaryTotalAmount: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  summaryRightCol: {
    alignItems: 'flex-end',
  },
  summaryCountLabel: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  summaryCountValue: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '800',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
    marginTop: 2,
  },
  userRowLight: {
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
  },
  userNameText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  boldWhite: {
    color: '#FFF',
    fontWeight: '700',
  },
  userPhoneText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 4,
    marginBottom: 2,
  },
  listSectionTitle: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  listSubText: {
    color: COLORS.textMuted,
    fontSize: 10.5,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#111A14',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 8,
  },
  emptyBoxLight: {
    backgroundColor: '#F5F9F6',
    borderColor: 'rgba(0, 135, 78, 0.12)',
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  emptyDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  txCard: {
    backgroundColor: '#142219',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
  },
  txCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.14)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  txTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  mbwayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#1E3224',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
  },
  mbwayText: {
    color: '#00C853',
    fontSize: 9.5,
    fontWeight: '900',
  },
  mbwayDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#00C853',
  },
  mbwaySub: {
    color: '#FFF',
    fontSize: 9.5,
    fontWeight: '900',
  },
  txDate: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: 10.5,
    marginLeft: 4,
  },
  txStatusBadge: {
    backgroundColor: 'rgba(0, 200, 83, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  txStatusText: {
    color: '#00C853',
    fontSize: 9.5,
    fontWeight: '800',
  },
  txBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  txInfoCol: {
    flex: 1,
  },
  txTitle: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
    lineHeight: 18,
    marginBottom: 2,
  },
  txCategory: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 3,
  },
  txRefText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txAmountText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  receiptBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 179, 104, 0.1)',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.22)',
  },
  receiptBtnRowLight: {
    backgroundColor: '#EDF9F2',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  receiptLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  receiptBtnLabel: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  receiptBtnLabelLight: {
    color: '#00874E',
  },
  footerSecurity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
  },
  footerSecurityLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  footerSecurityText: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: 10.5,
    lineHeight: 15,
  },
  closeActionBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeActionText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  closeActionTextLight: {
    color: '#65786C',
  },
  textDark: {
    color: '#121F17',
  },
  textMutedDark: {
    color: '#556960',
  },
});

export default memo(PagamentosModal);
