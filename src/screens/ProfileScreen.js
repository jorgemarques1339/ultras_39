import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  ShieldCheck,
  History,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Receipt,
  Phone,
  Award,
  Calendar,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export default function ProfileScreen({
  user,
  transactions,
  onPayQuota,
  onViewReceipt,
}) {
  const [tiltAngle, setTiltAngle] = useState({ x: 0, y: 0 });

  // Efeito holográfico interativo com toque ou movimento
  const handleCardTouch = (e) => {
    if (Platform.OS === 'web') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTiltAngle({ x: x * 15, y: -y * 15 });
    }
  };

  const handleCardLeave = () => {
    setTiltAngle({ x: 0, y: 0 });
  };

  const isQuotaPending = user.quotaStatus === 'pendente';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. CARTÃO DIGITAL HOLOGRÁFICO DE SÓCIO (SOMENTE DADOS) */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionHeaderTitle}>Cartão Digital de Sócio</Text>

        <View
          style={[
            styles.holographicCard,
            Platform.OS === 'web' && {
              transform: `perspective(1000px) rotateX(${tiltAngle.y}deg) rotateY(${tiltAngle.x}deg)`,
              transition: 'transform 0.15s ease-out',
            },
          ]}
          onMouseMove={handleCardTouch}
          onMouseLeave={handleCardLeave}
        >
          {/* Brilho metálico holográfico */}
          <View style={styles.holoSheenOverlay} />

          {/* Topo do Cartão */}
          <View style={styles.cardHeader}>
            <View style={styles.cardBrandRow}>
              <View style={styles.cardLogoBox}>
                <Text style={styles.cardLogoText}>G39</Text>
              </View>
              <View>
                <Text style={styles.cardClubTitle}>RIO AVE FUTEBOL CLUBE</Text>
                <Text style={styles.cardClaqueSubtitle}>CLAQUE OFICIAL GRUPO 39</Text>
              </View>
            </View>

            <View style={styles.cardCategoryBadge}>
              <Award size={12} color={COLORS.gold} />
              <Text style={styles.cardCategoryText}>Sócio Efetivo</Text>
            </View>
          </View>

          {/* Miolo do Cartão: Foto & Identificação */}
          <View style={styles.cardBody}>
            <View style={styles.memberPhotoWrapper}>
              <View style={styles.memberPhoto}>
                <Text style={styles.memberPhotoInitial}>
                  {user.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.memberPhotoRing} />
            </View>

            <View style={styles.memberInfoCol}>
              <Text style={styles.memberName}>{user.name}</Text>
              <Text style={styles.memberRole}>{user.memberCategory || 'Sócio Efetivo · Bancada Poente'}</Text>
              <View style={styles.memberStatusInline}>
                <View style={[styles.statusDot, { backgroundColor: isQuotaPending ? '#FFB74D' : COLORS.primaryLight }]} />
                <Text style={[styles.statusInlineText, { color: isQuotaPending ? '#FFB74D' : COLORS.primaryLight }]}>
                  {isQuotaPending ? 'Quota Anual Pendente' : 'Quota Regularizada'}
                </Text>
              </View>
            </View>
          </View>

          {/* Dados Oficiais do Sócio (Grelha Sem QR Code, 100% Responsiva) */}
          <View style={styles.cardDataContainer}>
            <View style={styles.cardDataRow}>
              <View style={styles.cardDataCol}>
                <Text style={styles.dataLabel}>N.º SÓCIO G39</Text>
                <Text style={styles.dataVal}>#{user.memberNumber}</Text>
              </View>

              <View style={styles.cardDataDivider} />

              <View style={styles.cardDataCol}>
                <Text style={styles.dataLabel}>ÉPOCA ATIVA</Text>
                <Text style={styles.dataVal}>2026 / 2027</Text>
              </View>
            </View>

            <View style={styles.cardHorizontalDivider} />

            <View style={styles.cardDataRow}>
              <View style={styles.cardDataCol}>
                <Text style={styles.dataLabel}>SETOR NO ESTÁDIO</Text>
                <Text style={styles.dataVal}>Bancada Poente</Text>
              </View>

              <View style={styles.cardDataDivider} />

              <View style={styles.cardDataCol}>
                <Text style={styles.dataLabel}>FILIAÇÃO</Text>
                <Text style={styles.dataVal}>Desde {user.memberSince}</Text>
              </View>
            </View>

            <View style={styles.cardHorizontalDivider} />

            <View style={styles.cardDataRow}>
              <View style={styles.cardDataCol}>
                <Text style={styles.dataLabel}>CONTACTO MB WAY</Text>
                <Text style={styles.dataVal}>{user.phone}</Text>
              </View>

              <View style={styles.cardDataDivider} />

              <View style={styles.cardDataCol}>
                <Text style={styles.dataLabel}>VALIDADE</Text>
                <Text style={styles.dataVal}>30/06/2027</Text>
              </View>
            </View>
          </View>

          {/* Rodapé Oficial do Cartão Digital (Certificação Oficial Sem QR Code) */}
          <View style={styles.cardFooterData}>
            <View style={styles.cardFooterLeft}>
              <ShieldCheck size={16} color={COLORS.primaryLight} />
              <View>
                <Text style={styles.cardFooterTitle}>Cartão Oficial Grupo 39</Text>
                <Text style={styles.cardFooterSub}>Identificação oficial do associado Rio Ave FC</Text>
              </View>
            </View>
            <View style={[styles.cardPillBadge, isQuotaPending ? styles.cardPillPending : styles.cardPillPaid]}>
              <Text style={[styles.cardPillText, isQuotaPending ? styles.cardPillTextPending : styles.cardPillTextPaid]}>
                {isQuotaPending ? 'PENDENTE' : 'EM DIA'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. GESTÃO DE QUOTAS (PAGAMENTO ANUAL 12,50 €) */}
      <View style={styles.quotaSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Gestão de Quota Anual de Sócio</Text>
          <View
            style={[
              styles.quotaStatusBadge,
              isQuotaPending ? styles.statusPendingBadge : styles.statusPaidBadge,
            ]}
          >
            {isQuotaPending ? (
              <AlertTriangle size={13} color="#FF9800" />
            ) : (
              <CheckCircle2 size={13} color={COLORS.primaryLight} />
            )}
            <Text
              style={[
                styles.quotaStatusText,
                isQuotaPending ? styles.statusPendingText : styles.statusPaidText,
              ]}
            >
              {isQuotaPending ? 'Quota Anual Pendente' : 'Quota Anual em Dia'}
            </Text>
          </View>
        </View>

        <View style={styles.quotaCard}>
          {isQuotaPending ? (
            <View>
              <View style={styles.quotaAlertRow}>
                <View style={styles.quotaAlertIcon}>
                  <AlertTriangle size={24} color="#FF9800" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.quotaAlertTitle}>
                    Regularização de Quota Anual
                  </Text>
                  <Text style={styles.quotaAlertDesc}>
                    A quota anual da <Text style={{ color: COLORS.white, fontWeight: '700' }}>{user.quotaPendingPeriod || user.quotaPendingMonth || 'Época 2026/2027'}</Text> está por liquidar. Mantém os teus direitos de voto e desconto nos bilhetes.
                  </Text>
                </View>
              </View>

              <View style={styles.quotaPriceBreakdown}>
                <Text style={styles.quotaPriceLabel}>Valor Anual da Quota:</Text>
                <Text style={styles.quotaPriceValue}>12,50 €</Text>
              </View>

              {/* Botão de Pagamento MB WAY */}
              <TouchableOpacity
                style={styles.payQuotaBtn}
                onPress={() =>
                  onPayQuota({
                    title: `Quota Anual Grupo 39 · ${user.quotaPendingPeriod || user.quotaPendingMonth || 'Época 2026/2027'}`,
                    category: 'Quota Anual de Sócio',
                    amount: 12.50,
                    type: 'quota',
                  })
                }
                activeOpacity={0.85}
              >
                <View style={styles.miniMbwayBadge}>
                  <Text style={styles.miniMbwayText}>MB</Text>
                  <View style={styles.miniDot} />
                  <Text style={styles.miniMbwaySub}>WAY</Text>
                </View>
                <Text style={styles.payQuotaBtnText}>
                  Liquidar Quota Anual via MB WAY (12,50 €)
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.quotaSuccessRow}>
                <CheckCircle2 size={24} color={COLORS.primaryLight} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.quotaSuccessTitle}>
                    Parabéns! Época 2026/2027 Regularizada
                  </Text>
                  <Text style={styles.quotaSuccessDesc}>
                    A tua quota anual está regularizada. O teu cartão digital de sócio está ativo para acesso livre ao Estádio dos Arcos e descontos na loja da claque.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.advanceQuotaBtn}
                onPress={() =>
                  onPayQuota({
                    title: 'Antecipação Quota Anual · Época 2027/2028',
                    category: 'Quota Anual de Sócio',
                    amount: 12.50,
                    type: 'quota',
                  })
                }
                activeOpacity={0.8}
              >
                <Text style={styles.advanceQuotaBtnText}>
                  Adiantar Próxima Época via MB WAY (12,50 €)
                </Text>
                <ChevronRight size={14} color={COLORS.gold} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* 3. HISTÓRICO DE TRANSAÇÕES MB WAY */}
      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.iconHeadingRow}>
            <History size={16} color={COLORS.gold} />
            <Text style={styles.sectionHeaderTitle} numberOfLines={1}>
              Histórico MB WAY
            </Text>
          </View>
          <Text style={styles.txCountBadge}>{transactions.length} mov.</Text>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyTxBox}>
            <Text style={styles.emptyTxText}>Nenhum pagamento efetuado ainda.</Text>
          </View>
        ) : (
          transactions.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={styles.txCard}
              onPress={() => onViewReceipt(tx)}
              activeOpacity={0.7}
            >
              <View style={styles.txLeftIcon}>
                <View style={styles.txMbwayIcon}>
                  <Text style={styles.txMbwayText}>MB</Text>
                  <View style={styles.txMbwayDot} />
                  <Text style={styles.txMbwaySub}>WAY</Text>
                </View>
              </View>

              <View style={styles.txDetails}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txMeta}>
                  {tx.date} · Ref: {tx.sibsRef}
                </Text>
                <View style={styles.txReceiptPill}>
                  <Receipt size={11} color={COLORS.primaryLight} />
                  <Text style={styles.txReceiptText}>Ver Comprovativo</Text>
                </View>
              </View>

              <View style={styles.txRight}>
                <Text style={styles.txAmount}>{tx.amount.toFixed(2)} €</Text>
                <View style={styles.txStatusPill}>
                  <Text style={styles.txStatusText}>{tx.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* 4. DADOS DO PERFIL & APOIO AO SÓCIO */}
      <View style={styles.supportSection}>
        <Text style={styles.sectionHeaderTitle}>Apoio ao Sócio do Grupo 39</Text>
        <View style={styles.supportCard}>
          <View style={styles.supportRow}>
            <Phone size={16} color={COLORS.gold} />
            <Text style={styles.supportLabel}>Linha Direta WhatsApp Claque:</Text>
            <Text style={styles.supportVal}>+351 912 345 678</Text>
          </View>
          <View style={styles.supportRow}>
            <Calendar size={16} color={COLORS.primaryLight} />
            <Text style={styles.supportLabel}>Horário da Sede nos Arcos:</Text>
            <Text style={styles.supportVal}>Ter a Sex: 17h - 20h</Text>
          </View>
        </View>
      </View>

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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeaderTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 0,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  txCountBadge: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 0,
  },

  // 1. Cartão Holográfico
  cardSection: {
    marginBottom: 20,
  },
  holographicCard: {
    backgroundColor: '#111D16',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(242, 182, 0, 0.45)',
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        contain: 'paint',
        boxShadow:
          '0 16px 36px rgba(0, 0, 0, 0.6), 0 0 24px rgba(242, 182, 0, 0.2), inset 0 0 30px rgba(0, 135, 78, 0.25)',
      },
    }),
  },
  holoSheenOverlay: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(242, 182, 0, 0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 6,
  },
  cardBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#00874E',
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLogoText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  cardClubTitle: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardClaqueSubtitle: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  cardCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.3)',
  },
  cardCategoryText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  memberPhotoWrapper: {
    position: 'relative',
  },
  memberPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  memberPhotoInitial: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
  },
  memberPhotoRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.5)',
  },
  memberInfoCol: {
    flex: 1,
  },
  memberName: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
  },
  memberRole: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 8,
  },
  memberStatusInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusInlineText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Grelha de Dados Oficiais
  cardDataContainer: {
    backgroundColor: 'rgba(10, 18, 14, 0.75)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  cardDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDataCol: {
    flex: 1,
    alignItems: 'center',
  },
  cardDataDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHorizontalDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 10,
  },
  dataLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  dataVal: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },

  // Rodapé Oficial do Cartão (Sem QR Code)
  cardFooterData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A120E',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  cardFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardFooterTitle: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  cardFooterSub: {
    color: COLORS.textMuted,
    fontSize: 9,
  },
  cardPillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  cardPillPending: {
    backgroundColor: 'rgba(255, 183, 77, 0.15)',
    borderColor: 'rgba(255, 183, 77, 0.35)',
  },
  cardPillPaid: {
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    borderColor: 'rgba(0, 179, 104, 0.35)',
  },
  cardPillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardPillTextPending: {
    color: '#FFB74D',
  },
  cardPillTextPaid: {
    color: COLORS.primaryLight,
  },

  // 2. Quotas
  quotaSection: {
    marginBottom: 20,
  },
  quotaStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPendingBadge: {
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.4)',
  },
  statusPaidBadge: {
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.4)',
  },
  quotaStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusPendingText: {
    color: '#FFB74D',
  },
  statusPaidText: {
    color: COLORS.primaryLight,
  },
  quotaCard: {
    backgroundColor: '#14201A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
  },
  quotaAlertRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  quotaAlertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quotaAlertTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  quotaAlertDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  quotaPriceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0D1410',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  quotaPriceLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  quotaPriceValue: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  payQuotaBtn: {
    backgroundColor: '#00874E',
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#00B368',
  },
  miniMbwayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004B87',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  miniMbwayText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  miniDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E31B23',
    marginHorizontal: 1,
    marginBottom: 2,
  },
  miniMbwaySub: {
    color: '#00A3E0',
    fontSize: 10,
    fontWeight: '900',
  },
  payQuotaBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  quotaSuccessRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  quotaSuccessTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  quotaSuccessDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  advanceQuotaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#192821',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.25)',
  },
  advanceQuotaBtnText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
  },

  // 3. Transações
  transactionsSection: {
    marginBottom: 20,
  },
  emptyTxBox: {
    padding: 20,
    alignItems: 'center',
  },
  emptyTxText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14201A',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  txLeftIcon: {
    marginRight: 12,
  },
  txMbwayIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004B87',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  txMbwayText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  txMbwayDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#E31B23',
    marginHorizontal: 1,
    marginBottom: 2,
  },
  txMbwaySub: {
    color: '#00A3E0',
    fontSize: 10,
    fontWeight: '900',
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },
  txMeta: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginBottom: 4,
  },
  txReceiptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  txReceiptText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '700',
  },
  txRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  txAmount: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  txStatusPill: {
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  txStatusText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '700',
  },

  // 4. Apoio
  supportSection: {
    marginBottom: 20,
  },
  supportCard: {
    backgroundColor: '#14201A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 10,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  supportLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    flexShrink: 1,
  },
  supportVal: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
