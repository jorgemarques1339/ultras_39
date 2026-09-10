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
  Smartphone,
  MapPin,
  Flame,
  Bus,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { FAN_ACHIEVEMENTS } from '../data/mockData';

export default function ProfileScreen({
  user,
  transactions,
  onPayQuota,
  onViewReceipt,
  onScroll,
  onOpenWalletPass,
  isDark = true,
}) {
  const [tiltAngle, setTiltAngle] = useState({ x: 0, y: 0 });
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [achievements, setAchievements] = useState(FAN_ACHIEVEMENTS);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const handleCheckIn = () => {
    if (hasCheckedIn) return;
    setHasCheckedIn(true);
    setAchievements((prev) =>
      prev.map((ach) =>
        ach.id === 'ach-1' ? { ...ach, unlocked: true, progress: '4/4 Jogos' } : ach
      )
    );
    alert('📍 Check-in de Bancada confirmado no Estádio dos Arcos! A tua presença no apoio ao Rio Ave FC foi registada com sucesso.');
  };

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
      style={[styles.container, !isDark && styles.containerLight]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {/* 1. CARTÃO DIGITAL HOLOGRÁFICO DE SÓCIO (SOMENTE DADOS) */}
      <View style={styles.cardSection}>
        <Text style={[styles.sectionHeaderTitle, !isDark && styles.textDark]}>Cartão Digital</Text>

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
              <Text style={styles.memberRole}>Membro Oficial G39</Text>
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
                <Text style={styles.dataLabel}>FILIAÇÃO</Text>
                <Text style={styles.dataVal}>Desde {user.memberSince}</Text>
              </View>

              <View style={styles.cardDataDivider} />

              <View style={styles.cardDataCol}>
                <Text style={styles.dataLabel}>VALIDADE</Text>
                <Text style={styles.dataVal}>30/06/2027</Text>
              </View>
            </View>
          </View>

          {/* Rodapé Oficial do Cartão: Pagamento / Estado de Quotas */}
          <View style={[styles.cardFooterData, !isQuotaPending && styles.cardFooterDataPaid]}>
            {isQuotaPending ? (
              <View style={styles.cardQuotaRow}>
                <View style={styles.cardQuotaInfo}>
                  <AlertTriangle size={15} color="#FF9800" />
                  <View>
                    <Text style={styles.cardQuotaTitle}>Quota Anual em Atraso</Text>
                    <Text style={styles.cardQuotaSub}>Época 2026/2027 · 12,50 €</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.cardPayBtn}
                  onPress={() =>
                    onPayQuota({
                      title: 'Quota Anual Grupo 39 · Época 2026/2027',
                      category: 'Quota Anual de Sócio',
                      amount: 12.50,
                      type: 'quota',
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.cardPayBtnText}>Pagar Quota Anual</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.cardQuotaPaidRow}>
                <View style={styles.cardQuotaPaidInfo}>
                  <CheckCircle2 size={16} color="#00C853" />
                  <View>
                    <Text style={styles.cardQuotaPaidTitle}>Quotas em Ordem ✓</Text>
                    <Text style={styles.cardQuotaPaidSub}>Época 2026/2027 Regularizada</Text>
                  </View>
                </View>
                <View style={styles.cardPillPaid}>
                  <Text style={styles.cardPillTextPaid}>EM ORDEM</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* NOVO: BOTÕES OFICIAIS APPLE WALLET & GOOGLE WALLET */}
        <View style={styles.walletBtnContainer}>
          <TouchableOpacity
            style={[styles.walletActionBtn, !isDark && styles.walletActionBtnLight]}
            onPress={onOpenWalletPass}
            activeOpacity={0.85}
          >
            <View style={styles.walletBtnLeft}>
              <View style={styles.walletIconBlack}>
                <Text style={styles.appleLogoGlyph}></Text>
              </View>
              <View>
                <Text style={[styles.walletBtnMain, !isDark && styles.textDark]}>Guardar na Carteira Digital</Text>
                <Text style={[styles.walletBtnSub, !isDark && styles.textMutedDark]}>Apple Wallet & Google Wallet (Torniquetes Offline)</Text>
              </View>
            </View>
            <Download size={16} color={isDark ? COLORS.gold : '#00874E'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* NOVO: FIDELIDADE DE BANCADA & GAMIFICAÇÃO */}
      <View style={styles.loyaltySection}>
        <View style={styles.loyaltyHeaderRow}>
          <View style={styles.loyaltyTitleGroup}>
            <Award size={16} color={isDark ? COLORS.gold : '#00874E'} />
            <Text style={[styles.sectionHeaderTitle, !isDark && styles.textDark]}>Fidelidade de Bancada</Text>
          </View>
          <View style={[styles.loyaltyPointsBadge, !isDark && styles.loyaltyPointsBadgeLight]}>
            <Text style={[styles.loyaltyPointsText, !isDark && styles.loyaltyPointsTextLight]}>{hasCheckedIn ? '15 Presenças' : '14 Presenças'}</Text>
          </View>
        </View>

        {/* Botão de Check-in no Estádio */}
        <TouchableOpacity
          style={[styles.checkInBtn, hasCheckedIn && styles.checkInBtnActive]}
          onPress={handleCheckIn}
          activeOpacity={0.85}
        >
          {hasCheckedIn ? (
            <>
              <CheckCircle2 size={16} color="#FFF" />
              <Text style={styles.checkInBtnText}>Presença Confirmada nos Arcos Hoje!</Text>
            </>
          ) : (
            <>
              <MapPin size={16} color="#FFF" />
              <Text style={styles.checkInBtnText}>Fazer Check-In</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Vitrine de Crachás de Sócio */}
        <View style={styles.achievementsGrid}>
          {achievements.slice(0, showAllAchievements ? 4 : 1).map((ach) => (
            <View
              key={ach.id}
              style={[
                styles.achievementCard,
                !isDark && styles.achievementCardLight,
                ach.unlocked && styles.achievementCardUnlocked,
                !isDark && ach.unlocked && styles.achievementCardUnlockedLight,
              ]}
            >
              <View style={styles.achievementTop}>
                <View style={[
                  styles.achievementIconBox,
                  !isDark && styles.achievementIconBoxLight,
                  ach.unlocked && styles.achievementIconBoxUnlocked,
                  !isDark && ach.unlocked && styles.achievementIconBoxUnlockedLight,
                ]}>
                  {ach.unlocked ? (
                    <Award size={16} color={isDark ? COLORS.gold : '#00874E'} />
                  ) : (
                    <ShieldCheck size={16} color={isDark ? COLORS.textMuted : '#8FA89B'} />
                  )}
                </View>
                <View style={[styles.achBadgePill, ach.unlocked ? (isDark ? styles.achBadgePillUnlocked : styles.achBadgePillUnlockedLight) : (isDark ? styles.achBadgePillLocked : styles.achBadgePillLockedLight)]}>
                  <Text style={[styles.achBadgeText, ach.unlocked ? (isDark ? styles.achBadgeTextUnlocked : styles.achBadgeTextUnlockedLight) : (isDark ? styles.achBadgeTextLocked : styles.achBadgeTextLockedLight)]}>
                    {ach.unlocked ? 'DESBLOQUEADO' : 'EM CURSO'}
                  </Text>
                </View>
              </View>

              <Text style={[styles.achTitle, !isDark && styles.textDark]}>{ach.title}</Text>
              <Text style={[styles.achDesc, !isDark && styles.textMutedDark]}>{ach.description}</Text>

              <View style={styles.achFooter}>
                <Text style={[styles.achProgress, !isDark && styles.achProgressLight]}>{ach.progress}</Text>
                <Text style={styles.achReward}>🎁 {ach.reward}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Botão Ver Mais / Ver Menos para Fidelidade */}
        {achievements.length > 1 && (
          <TouchableOpacity
            style={[styles.viewMoreBtn, !isDark && styles.viewMoreBtnLight]}
            onPress={() => setShowAllAchievements((prev) => !prev)}
            activeOpacity={0.8}
          >
            <Text style={[styles.viewMoreBtnText, !isDark && styles.viewMoreBtnTextLight]}>
              {showAllAchievements ? 'Ver Menos' : 'Ver Mais (Últimos 4 Check-ins)'}
            </Text>
            {showAllAchievements ? (
              <ChevronUp size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
            ) : (
              <ChevronDown size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
            )}
          </TouchableOpacity>
        )}
      </View>


      {/* 3. HISTÓRICO DE TRANSAÇÕES MB WAY */}
      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.iconHeadingRow}>
            <History size={16} color={isDark ? COLORS.gold : '#00874E'} />
            <Text style={[styles.sectionHeaderTitle, !isDark && styles.textDark]} numberOfLines={1}>
              Histórico MB WAY
            </Text>
          </View>
          <Text style={[styles.txCountBadge, !isDark && styles.textMutedDark]}>{transactions.length} mov.</Text>
        </View>

        {transactions.length === 0 ? (
          <View style={[styles.emptyTxBox, !isDark && styles.emptyTxBoxLight]}>
            <Text style={[styles.emptyTxText, !isDark && styles.textMutedDark]}>Nenhum pagamento efetuado ainda.</Text>
          </View>
        ) : (
          <>
            {transactions.slice(0, showAllTransactions ? 4 : 1).map((tx) => (
              <TouchableOpacity
                key={tx.id}
                style={[styles.txCard, !isDark && styles.txCardLight]}
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
                  <Text style={[styles.txTitle, !isDark && styles.textDark]}>{tx.title}</Text>
                  <Text style={[styles.txMeta, !isDark && styles.textMutedDark]}>
                    {tx.date} · Ref: {tx.sibsRef}
                  </Text>
                  <View style={[styles.txReceiptPill, !isDark && styles.txReceiptPillLight]}>
                    <Receipt size={11} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    <Text style={[styles.txReceiptText, !isDark && styles.txReceiptTextLight]}>Ver Comprovativo</Text>
                  </View>
                </View>

                <View style={styles.txRight}>
                  <Text style={[styles.txAmount, !isDark && styles.txAmountLight]}>{tx.amount.toFixed(2)} €</Text>
                  <View style={styles.txStatusPill}>
                    <Text style={styles.txStatusText}>{tx.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Botão Ver Mais / Ver Menos para Histórico */}
            {transactions.length > 1 && (
              <TouchableOpacity
                style={[styles.viewMoreBtn, !isDark && styles.viewMoreBtnLight]}
                onPress={() => setShowAllTransactions((prev) => !prev)}
                activeOpacity={0.8}
              >
                <Text style={[styles.viewMoreBtnText, !isDark && styles.viewMoreBtnTextLight]}>
                  {showAllTransactions ? 'Ver Menos' : 'Ver Mais (Últimas 4 Transações)'}
                </Text>
                {showAllTransactions ? (
                  <ChevronUp size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
                ) : (
                  <ChevronDown size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* 4. DADOS DO PERFIL & APOIO AO SÓCIO */}
      <View style={styles.supportSection}>
        <Text style={[styles.sectionHeaderTitle, !isDark && styles.textDark]}>Apoio ao Sócio do Grupo 39</Text>
        <View style={[styles.supportCard, !isDark && styles.supportCardLight]}>
          <View style={styles.supportRow}>
            <Phone size={16} color={isDark ? COLORS.gold : '#00874E'} />
            <Text style={[styles.supportLabel, !isDark && styles.textMutedDark]}>Linha Direta WhatsApp Claque:</Text>
            <Text style={[styles.supportVal, !isDark && styles.textDark]}>+351 912 345 678</Text>
          </View>
          <View style={styles.supportRow}>
            <Calendar size={16} color={isDark ? COLORS.primaryLight : '#00874E'} />
            <Text style={[styles.supportLabel, !isDark && styles.textMutedDark]}>Horário da Sede nos Arcos:</Text>
            <Text style={[styles.supportVal, !isDark && styles.textDark]}>Ter a Sex: 17h - 20h</Text>
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
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
  },
  cardCategoryText: {
    color: '#00B368',
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
    borderColor: '#00B368',
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

  // Rodapé Oficial do Cartão: Pagamento / Estado de Quotas
  cardFooterData: {
    backgroundColor: '#0A120E',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardFooterDataPaid: {
    backgroundColor: 'rgba(0, 135, 78, 0.15)',
    borderColor: 'rgba(0, 200, 83, 0.35)',
  },
  cardQuotaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardQuotaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardQuotaTitle: {
    color: '#FFB74D',
    fontSize: 11,
    fontWeight: '800',
  },
  cardQuotaSub: {
    color: COLORS.textMuted,
    fontSize: 9.5,
  },
  cardPayBtn: {
    backgroundColor: '#00874E',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00B368',
  },
  cardPayBtnText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  cardQuotaPaidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardQuotaPaidInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardQuotaPaidTitle: {
    color: '#00C853',
    fontSize: 12,
    fontWeight: '800',
  },
  cardQuotaPaidSub: {
    color: COLORS.textSecondary,
    fontSize: 9.5,
  },
  cardPillPaid: {
    backgroundColor: 'rgba(0, 200, 83, 0.2)',
    borderColor: 'rgba(0, 200, 83, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  cardPillTextPaid: {
    color: '#00C853',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
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

  // Carteira Digital (Apple & Google Wallet)
  walletBtnContainer: {
    marginTop: 10,
  },
  walletActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#070D09',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
      },
    }),
  },
  walletBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletIconBlack: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleLogoGlyph: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  walletBtnMain: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  walletBtnSub: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    marginTop: 1,
  },

  // Fidelidade de Bancada & Gamificação
  loyaltySection: {
    marginBottom: 20,
  },
  loyaltyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  loyaltyTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loyaltyPointsBadge: {
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  loyaltyPointsText: {
    color: COLORS.gold,
    fontSize: 10.5,
    fontWeight: '800',
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00874E',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#00B368',
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 135, 78, 0.3)',
      },
    }),
  },
  checkInBtnActive: {
    backgroundColor: '#12241A',
    borderColor: COLORS.primaryLight,
  },
  checkInBtnText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  achievementsGrid: {
    gap: 10,
  },
  achievementCard: {
    backgroundColor: '#111A15',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  achievementCardUnlocked: {
    borderColor: 'rgba(242, 182, 0, 0.25)',
    backgroundColor: '#131E18',
  },
  achievementTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  achievementIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementIconBoxUnlocked: {
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
  },
  achBadgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  achBadgePillUnlocked: {
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
  },
  achBadgePillLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  achBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
  },
  achBadgeTextUnlocked: {
    color: COLORS.primaryLight,
  },
  achBadgeTextLocked: {
    color: COLORS.textMuted,
  },
  achTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  achDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },
  achFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  achProgress: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '700',
  },
  achReward: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
  walletActionBtnLight: {
    backgroundColor: '#F2F6F4',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  loyaltyPointsBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  loyaltyPointsTextLight: {
    color: '#00874E',
  },
  achievementCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.12)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  achievementCardUnlockedLight: {
    borderColor: 'rgba(0, 135, 78, 0.3)',
    backgroundColor: '#F8FAF9',
  },
  achievementIconBoxLight: {
    backgroundColor: '#F0F4F2',
  },
  achievementIconBoxUnlockedLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  achBadgePillUnlockedLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  achBadgePillLockedLight: {
    backgroundColor: '#EAEFEA',
  },
  achBadgeTextUnlockedLight: {
    color: '#00874E',
  },
  achBadgeTextLockedLight: {
    color: '#7A9184',
  },
  achProgressLight: {
    color: '#00874E',
  },
  quotaCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.14)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  statusPendingBadgeLight: {
    backgroundColor: 'rgba(255, 152, 0, 0.12)',
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  statusPendingTextLight: {
    color: '#D97706',
  },
  statusPaidBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.3)',
  },
  statusPaidTextLight: {
    color: '#00874E',
  },
  quotaAlertTitleLight: {
    color: '#D97706',
  },
  quotaAlertDescLight: {
    color: '#4B5563',
  },
  quotaPriceBreakdownLight: {
    borderTopColor: 'rgba(0, 135, 78, 0.12)',
  },
  advanceQuotaBtnLight: {
    backgroundColor: '#F2F6F4',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  advanceQuotaBtnTextLight: {
    color: '#00874E',
  },
  emptyTxBoxLight: {
    backgroundColor: '#F4F7F5',
  },
  txCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.14)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  txReceiptPillLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.08)',
  },
  txReceiptTextLight: {
    color: '#00874E',
  },
  txAmountLight: {
    color: '#00874E',
  },
  supportCardLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
  },
  viewMoreBtnLight: {
    backgroundColor: '#F2F6F4',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  viewMoreBtnText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  viewMoreBtnTextLight: {
    color: '#00874E',
  },
});
