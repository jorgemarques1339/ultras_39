import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Phone,
  Award,
  Calendar,
  Smartphone,
  Download,
  ChevronDown,
  ChevronUp,
  Check,
  Nfc,
  LogOut,
  LogIn,
  SlidersHorizontal,
  Edit3,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { FAN_ACHIEVEMENTS } from '../data/mockData';
import NfcCheckInModal from '../components/NfcCheckInModal';
import EditProfileModal from '../components/EditProfileModal';
import AppSettingsModal from '../components/AppSettingsModal';
import { useAuth } from '../context/AuthContext';

// Componente isolado para o Cartão Holográfico Compacto de Sócio
const HolographicMemberCard = memo(function HolographicMemberCard({
  user,
  isQuotaPending,
  onPayQuota,
  onEditProfile,
  isDark = true,
}) {
  const [tiltAngle, setTiltAngle] = useState({ x: 0, y: 0 });
  const [avatarError, setAvatarError] = useState(false);

  const handleCardTouch = useCallback((e) => {
    if (Platform.OS === 'web') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTiltAngle({ x: x * 15, y: -y * 15 });
    }
  }, []);

  const handleCardLeave = useCallback(() => {
    setTiltAngle({ x: 0, y: 0 });
  }, []);

  return (
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

      {/* Miolo do Cartão: Foto, Identificação & Ação de Editar */}
      <View style={styles.cardBody}>
        <View style={styles.memberPhotoWrapper}>
          {user?.avatar && !avatarError ? (
            <Image
              source={{ uri: user.avatar }}
              style={styles.memberPhotoImg}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <View style={styles.memberPhoto}>
              <Text style={styles.memberPhotoInitial}>
                {user?.name?.charAt(0) || 'S'}
              </Text>
            </View>
          )}
          <View style={styles.memberPhotoRing} />
        </View>

        <View style={styles.memberInfoCol}>
          <Text style={styles.memberName} numberOfLines={1}>
            {user?.name || 'Sócio Grupo 39'}
          </Text>
          <Text style={styles.memberRole} numberOfLines={1}>
            {user?.memberCategory || 'Membro Oficial G39'}
          </Text>
        </View>

        {/* Botão Compacto Editar Perfil (Nome e Avatar) */}
        {onEditProfile && (
          <TouchableOpacity
            style={styles.cardEditBtn}
            onPress={onEditProfile}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Edit3 size={11} color="#00E676" />
            <Text style={styles.cardEditBtnText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dados Oficiais do Sócio (Formato Ultracompacto em Grelha Limpa) */}
      <View style={styles.cardDataContainer}>
        <View style={styles.cardDataRow}>
          <View style={styles.cardDataCol}>
            <Text style={styles.dataLabel}>N.º SÓCIO</Text>
            <Text style={styles.dataVal}>#{user?.memberNumber || '039'}</Text>
          </View>

          <View style={styles.cardDataDivider} />

          <View style={styles.cardDataCol}>
            <Text style={styles.dataLabel}>ÉPOCA</Text>
            <Text style={styles.dataVal}>2026 / 2027</Text>
          </View>

          <View style={styles.cardDataDivider} />

          <View style={styles.cardDataCol}>
            <Text style={styles.dataLabel}>VALIDADE</Text>
            <Text style={styles.dataVal}>30/06/2027</Text>
          </View>
        </View>
      </View>

      {/* Rodapé do Cartão: Quota Anual Compacta */}
      <View
        style={[
          styles.cardFooterData,
          !isQuotaPending && styles.cardFooterDataPaid,
        ]}
      >
        <View style={styles.cardQuotaSimpleRow}>
          <View style={styles.cardQuotaLabelContainer}>
            <View
              style={[
                styles.cardQuotaDot,
                !isQuotaPending && styles.cardQuotaDotPaid,
              ]}
            />
            <Text style={styles.cardQuotaSimpleLabel}>QUOTA ANUAL</Text>
          </View>

          {isQuotaPending ? (
            <TouchableOpacity
              style={styles.cardPayBtn}
              onPress={() =>
                onPayQuota({
                  title: 'Quota Anual Grupo 39 · Época 2026/2027',
                  category: 'Quota Anual de Sócio',
                  amount: 12.0,
                  type: 'quota',
                })
              }
              activeOpacity={0.85}
            >
              <Text style={styles.cardPayBtnText}>Pagar Quota</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.cardPaidSuccessBtn}>
              <Check size={10} color="#00E676" strokeWidth={3} />
              <Text style={styles.cardPaidSuccessText}>EM DIA</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

function ProfileScreen({
  user,
  transactions = [],
  onPayQuota,
  onViewReceipt,
  onScroll,
  onOpenWalletPass,
  isDark = true,
  onOpenPwaInstall,
  isLoggedIn = true,
  onOpenAuth,
  onLogout,
  onUpdateUser,
}) {
  const { updateUser: authUpdateUser } = useAuth();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [achievements, setAchievements] = useState(FAN_ACHIEVEMENTS);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [nfcModalVisible, setNfcModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const handleOpenNfcCheckIn = useCallback(() => {
    setNfcModalVisible(true);
  }, []);

  const handleNfcSuccess = useCallback(() => {
    setHasCheckedIn(true);
    setAchievements((prev) =>
      prev.map((ach) =>
        ach.id === 'ach-1' ? { ...ach, unlocked: true, progress: '4/4 Jogos' } : ach
      )
    );
  }, []);

  const handleSaveUser = useCallback(
    (updatedFields) => {
      if (onUpdateUser) {
        onUpdateUser(updatedFields);
      } else if (authUpdateUser) {
        authUpdateUser(updatedFields);
      }
    },
    [onUpdateUser, authUpdateUser]
  );

  const isQuotaPending = user?.quotaStatus === 'pendente';

  return (
    <ScrollView
      style={[styles.container, !isDark && styles.containerLight]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews={Platform.OS !== 'web'}
      overScrollMode="never"
    >
      {!isLoggedIn ? (
        <View style={[styles.guestCard, !isDark && styles.guestCardLight]}>
          <View style={styles.guestIconBox}>
            <ShieldCheck size={32} color="#00B368" />
          </View>
          <Text style={[styles.guestTitle, !isDark && styles.textDark]}>
            Área de Sócio & Perfil do Adepto
          </Text>
          <Text style={[styles.guestDesc, !isDark && styles.textMutedDark]}>
            Inicia sessão com a tua conta para acederes ao cartão digital de
            bancada, crachás de presença nos Arcos e prioridade em deslocações.
          </Text>
          <TouchableOpacity
            style={styles.guestLoginBtn}
            onPress={onOpenAuth}
            activeOpacity={0.85}
          >
            <LogIn size={16} color="#FFF" />
            <Text style={styles.guestLoginBtnText}>
              Iniciar Sessão / Criar Conta
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* 1. DEFINIÇÕES DA APP (NA PARTE SUPERIOR) */}
          <View style={styles.settingsSection}>
            <TouchableOpacity
              style={[styles.settingsBtn, !isDark && styles.settingsBtnLight]}
              onPress={() => setSettingsModalVisible(true)}
              activeOpacity={0.85}
            >
              <View style={styles.settingsBtnLeft}>
                <View
                  style={[
                    styles.settingsIconBox,
                    !isDark && styles.settingsIconBoxLight,
                  ]}
                >
                  <SlidersHorizontal
                    size={17}
                    color={isDark ? '#00E676' : '#00874E'}
                  />
                </View>
                <View>
                  <View style={styles.settingsTitleRow}>
                    <Text
                      style={[styles.settingsBtnTitle, !isDark && styles.textDark]}
                    >
                      Definições da App
                    </Text>
                    <View style={styles.settingsConfigBadge}>
                      <Text style={styles.settingsConfigBadgeText}>Preferências</Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.settingsBtnSubtitle,
                      !isDark && styles.textMutedDark,
                    ]}
                  >
                    Notificações, leitor NFC e som da bancada
                  </Text>
                </View>
              </View>
              <ChevronRight
                size={16}
                color={isDark ? COLORS.textMuted : '#7E9187'}
              />
            </TouchableOpacity>
          </View>

          {/* 2. CARTÃO DIGITAL HOLOGRÁFICO DE SÓCIO (COMPACTO COM EDIÇÃO DE NOME & AVATAR) */}
          <View style={styles.cardSection}>
            <View style={styles.sectionTitleHeaderRow}>
              <Text style={[styles.sectionHeaderTitle, !isDark && styles.textDark]}>
                Cartão Digital
              </Text>
              <TouchableOpacity
                style={styles.headerEditBtn}
                onPress={() => setEditProfileModalVisible(true)}
                activeOpacity={0.7}
              >
                <Edit3 size={12} color={isDark ? '#00E676' : '#00874E'} />
                <Text
                  style={[
                    styles.headerEditBtnText,
                    !isDark && styles.headerEditBtnTextLight,
                  ]}
                >
                  Editar Perfil
                </Text>
              </TouchableOpacity>
            </View>

            <HolographicMemberCard
              user={user}
              isQuotaPending={isQuotaPending}
              onPayQuota={onPayQuota}
              onEditProfile={() => setEditProfileModalVisible(true)}
              isDark={isDark}
            />

            {/* BOTÃO COMPACTO GUARDAR NA CARTEIRA DIGITAL */}
            <View style={styles.walletBtnContainer}>
              <TouchableOpacity
                style={[
                  styles.walletCompactBtn,
                  !isDark && styles.walletCompactBtnLight,
                ]}
                onPress={onOpenWalletPass}
                activeOpacity={0.85}
              >
                <View style={styles.walletCompactLeft}>
                  <View style={styles.walletIconBlack}>
                    <Text style={styles.appleLogoGlyph}></Text>
                  </View>
                  <View>
                    <Text
                      style={[styles.walletCompactTitle, !isDark && styles.textDark]}
                    >
                      Guardar na Carteira Digital
                    </Text>
                    <Text
                      style={[
                        styles.walletCompactSub,
                        !isDark && styles.textMutedDark,
                      ]}
                    >
                      Apple & Google Wallet (Offline)
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.walletDownloadBadge,
                    !isDark && styles.walletDownloadBadgeLight,
                  ]}
                >
                  <Download size={13} color={isDark ? '#00E676' : '#00874E'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. FIDELIDADE DE BANCADA & GAMIFICAÇÃO (MANTIDA SEM ALTERAÇÕES) */}
          <View style={styles.loyaltySection}>
            <View style={styles.loyaltyHeaderRow}>
              <View style={styles.loyaltyTitleGroup}>
                <Award size={16} color={isDark ? COLORS.gold : '#00874E'} />
                <Text style={[styles.sectionHeaderTitle, !isDark && styles.textDark]}>
                  Fidelidade de Bancada
                </Text>
              </View>
              <View
                style={[
                  styles.loyaltyPointsBadge,
                  !isDark && styles.loyaltyPointsBadgeLight,
                ]}
              >
                <Text
                  style={[
                    styles.loyaltyPointsText,
                    !isDark && styles.loyaltyPointsTextLight,
                  ]}
                >
                  {hasCheckedIn ? '15 Presenças' : '14 Presenças'}
                </Text>
              </View>
            </View>

            {/* Botão de Check-in NFC no Estádio */}
            <TouchableOpacity
              style={[styles.checkInBtn, hasCheckedIn && styles.checkInBtnActive]}
              onPress={handleOpenNfcCheckIn}
              activeOpacity={0.85}
            >
              {hasCheckedIn ? (
                <>
                  <CheckCircle2 size={16} color="#FFF" />
                  <Text style={styles.checkInBtnText}>
                    Presença Validada via NFC nos Arcos!
                  </Text>
                </>
              ) : (
                <>
                  <Nfc size={16} color="#FFF" />
                  <Text style={styles.checkInBtnText}>Faça Check-In via NFC</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Vitrine de Crachás de Sócio (Oculta por defeito para manter o perfil limpo) */}
            {showAllAchievements && (
              <View style={styles.achievementsGrid}>
                {achievements.slice(0, 4).map((ach) => (
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
                      <View
                        style={[
                          styles.achievementIconBox,
                          !isDark && styles.achievementIconBoxLight,
                          ach.unlocked && styles.achievementIconBoxUnlocked,
                          !isDark &&
                            ach.unlocked &&
                            styles.achievementIconBoxUnlockedLight,
                        ]}
                      >
                        {ach.unlocked ? (
                          <Award size={16} color={isDark ? COLORS.gold : '#00874E'} />
                        ) : (
                          <ShieldCheck
                            size={16}
                            color={isDark ? COLORS.textMuted : '#8FA89B'}
                          />
                        )}
                      </View>
                      <View
                        style={[
                          styles.achBadgePill,
                          ach.unlocked
                            ? isDark
                              ? styles.achBadgePillUnlocked
                              : styles.achBadgePillUnlockedLight
                            : isDark
                            ? styles.achBadgePillLocked
                            : styles.achBadgePillLockedLight,
                        ]}
                      >
                        <Text
                          style={[
                            styles.achBadgeText,
                            ach.unlocked
                              ? isDark
                                ? styles.achBadgeTextUnlocked
                                : styles.achBadgeTextUnlockedLight
                              : isDark
                              ? styles.achBadgeTextLocked
                              : styles.achBadgeTextLockedLight,
                        ]}
                      >
                        {ach.unlocked ? 'DESBLOQUEADO' : 'EM CURSO'}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.achTitle, !isDark && styles.textDark]}>
                    {ach.title}
                  </Text>
                  <Text style={[styles.achDesc, !isDark && styles.textMutedDark]}>
                    {ach.description}
                  </Text>

                  <View style={styles.achFooter}>
                    <Text
                      style={[
                        styles.achProgress,
                        !isDark && styles.achProgressLight,
                      ]}
                    >
                      {ach.progress}
                    </Text>
                    <Text style={styles.achReward}>🎁 {ach.reward}</Text>
                  </View>
                </View>
              ))}
            </View>
            )}

            {/* Botão Ver Mais / Ver Menos para Fidelidade */}
            <TouchableOpacity
              style={[styles.viewMoreBtn, !isDark && styles.viewMoreBtnLight]}
              onPress={() => setShowAllAchievements((prev) => !prev)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.viewMoreBtnText,
                  !isDark && styles.viewMoreBtnTextLight,
                ]}
              >
                {showAllAchievements ? 'Ver Menos' : 'Ver Mais'}
              </Text>
              {showAllAchievements ? (
                <ChevronUp
                  size={15}
                  color={isDark ? COLORS.primaryLight : '#00874E'}
                />
              ) : (
                <ChevronDown
                  size={15}
                  color={isDark ? COLORS.primaryLight : '#00874E'}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* 3. DADOS DO PERFIL & APOIO AO SÓCIO */}
          <View style={styles.supportSection}>
            <Text style={[styles.sectionHeaderTitle, !isDark && styles.textDark]}>
              Apoio ao Sócio do Grupo 39
            </Text>
            <View style={[styles.supportCard, !isDark && styles.supportCardLight]}>
              <View style={styles.supportRow}>
                <Phone size={15} color={isDark ? COLORS.gold : '#00874E'} />
                <Text style={[styles.supportLabel, !isDark && styles.textMutedDark]}>
                  Linha Direta WhatsApp Claque:
                </Text>
                <Text style={[styles.supportVal, !isDark && styles.textDark]}>
                  +351 912 345 678
                </Text>
              </View>
              <View style={styles.supportRow}>
                <Calendar
                  size={15}
                  color={isDark ? COLORS.primaryLight : '#00874E'}
                />
                <Text style={[styles.supportLabel, !isDark && styles.textMutedDark]}>
                  Horário da Sede nos Arcos:
                </Text>
                <Text style={[styles.supportVal, !isDark && styles.textDark]}>
                  Ter a Sex: 17h - 20h
                </Text>
              </View>
            </View>
          </View>

          {/* 5. INSTALAR APP NO SMARTPHONE (PWA) */}
          {onOpenPwaInstall && (
            <TouchableOpacity
              style={[styles.pwaProfileBtn, !isDark && styles.pwaProfileBtnLight]}
              onPress={onOpenPwaInstall}
              activeOpacity={0.8}
            >
              <View style={styles.pwaProfileLeft}>
                <View
                  style={[
                    styles.pwaProfileIconBox,
                    !isDark && styles.pwaProfileIconBoxLight,
                  ]}
                >
                  <Smartphone size={16} color={isDark ? '#00B368' : '#00874E'} />
                </View>
                <View>
                  <Text
                    style={[styles.pwaProfileTitle, !isDark && styles.textDark]}
                  >
                    Instalar Aplicação no Ecrã Principal
                  </Text>
                  <Text
                    style={[
                      styles.pwaProfileSubtitle,
                      !isDark && styles.textMutedDark,
                    ]}
                  >
                    PWA para iPhone (Safari) e Android (Chrome)
                  </Text>
                </View>
              </View>
              <ChevronRight
                size={16}
                color={isDark ? COLORS.textMuted : '#7E9187'}
              />
            </TouchableOpacity>
          )}

          {/* Botão de Terminar Sessão (Logout) */}
          {onLogout && (
            <TouchableOpacity
              style={[styles.logoutBtn, !isDark && styles.logoutBtnLight]}
              onPress={onLogout}
              activeOpacity={0.8}
            >
              <LogOut size={16} color="#FF5252" />
              <Text style={styles.logoutBtnText}>Terminar Sessão</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Modal de Check-In NFC */}
      <NfcCheckInModal
        visible={nfcModalVisible}
        onClose={() => setNfcModalVisible(false)}
        onCheckInSuccess={handleNfcSuccess}
        user={user}
        isDark={isDark}
      />

      {/* Modal de Edição de Perfil (Nome e Avatar) */}
      <EditProfileModal
        visible={editProfileModalVisible}
        onClose={() => setEditProfileModalVisible(false)}
        user={user}
        onSaveUser={handleSaveUser}
        isDark={isDark}
      />

      {/* Modal de Definições da App (Notificações, NFC e Som) */}
      <AppSettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        isDark={isDark}
      />

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
  sectionTitleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  headerEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.25)',
  },
  headerEditBtnText: {
    color: '#00E676',
    fontSize: 11,
    fontWeight: '700',
  },
  headerEditBtnTextLight: {
    color: '#00874E',
  },

  // 1. Cartão Holográfico Compacto
  cardSection: {
    marginBottom: 16,
  },
  holographicCard: {
    backgroundColor: '#111D16',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(242, 182, 0, 0.45)',
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        contain: 'paint',
        boxShadow:
          '0 12px 28px rgba(0, 0, 0, 0.55), 0 0 18px rgba(242, 182, 0, 0.18), inset 0 0 24px rgba(0, 135, 78, 0.2)',
      },
    }),
  },
  holoSheenOverlay: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(242, 182, 0, 0.08)',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  memberPhotoWrapper: {
    position: 'relative',
  },
  memberPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00B368',
  },
  memberPhotoImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#00B368',
  },
  memberPhotoInitial: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  memberPhotoRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.5)',
  },
  memberInfoCol: {
    flex: 1,
  },
  memberName: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 1,
  },
  memberRole: {
    color: '#00E676',
    fontSize: 10.5,
    fontWeight: '700',
  },
  cardEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  cardEditBtnText: {
    color: '#00E676',
    fontSize: 10.5,
    fontWeight: '800',
  },

  // Grelha Compacta de Dados Oficiais
  cardDataContainer: {
    backgroundColor: 'rgba(10, 18, 14, 0.75)',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 8,
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
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  dataLabel: {
    color: COLORS.textMuted,
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dataVal: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },

  // Rodapé Compacto Quota Anual
  cardFooterData: {
    backgroundColor: 'rgba(5, 14, 9, 0.92)',
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.35)',
  },
  cardFooterDataPaid: {
    backgroundColor: 'rgba(0, 40, 22, 0.85)',
    borderColor: 'rgba(0, 230, 118, 0.35)',
  },
  cardQuotaSimpleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardQuotaLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardQuotaDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFB74D',
  },
  cardQuotaDotPaid: {
    backgroundColor: '#00E676',
  },
  cardQuotaSimpleLabel: {
    color: '#F4E8C1',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardPayBtn: {
    backgroundColor: '#00874E',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.6)',
  },
  cardPayBtnText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cardPaidSuccessBtn: {
    backgroundColor: 'rgba(0, 200, 83, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.5)',
  },
  cardPaidSuccessText: {
    color: '#00E676',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // Botão Compacto Carteira Digital
  walletBtnContainer: {
    marginTop: 8,
  },
  walletCompactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#070D09',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  walletCompactBtnLight: {
    backgroundColor: '#F2F6F4',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  walletCompactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  walletIconBlack: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleLogoGlyph: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  walletCompactTitle: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  walletCompactSub: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 0.5,
  },
  walletDownloadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletDownloadBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },

  // 2. Fidelidade de Bancada & Gamificação (Intacta)
  loyaltySection: {
    marginBottom: 16,
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
  loyaltyPointsBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  loyaltyPointsText: {
    color: COLORS.gold,
    fontSize: 10.5,
    fontWeight: '800',
  },
  loyaltyPointsTextLight: {
    color: '#00874E',
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
  achievementCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.12)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  achievementCardUnlocked: {
    borderColor: 'rgba(242, 182, 0, 0.25)',
    backgroundColor: '#131E18',
  },
  achievementCardUnlockedLight: {
    borderColor: 'rgba(0, 135, 78, 0.3)',
    backgroundColor: '#F8FAF9',
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
  achievementIconBoxLight: {
    backgroundColor: '#F0F4F2',
  },
  achievementIconBoxUnlocked: {
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
  },
  achievementIconBoxUnlockedLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  achBadgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  achBadgePillUnlocked: {
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
  },
  achBadgePillUnlockedLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  achBadgePillLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  achBadgePillLockedLight: {
    backgroundColor: '#EAEFEA',
  },
  achBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
  },
  achBadgeTextUnlocked: {
    color: COLORS.primaryLight,
  },
  achBadgeTextUnlockedLight: {
    color: '#00874E',
  },
  achBadgeTextLocked: {
    color: COLORS.textMuted,
  },
  achBadgeTextLockedLight: {
    color: '#7A9184',
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
  achProgressLight: {
    color: '#00874E',
  },
  achReward: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
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

  // 3. NOVO: Definições da App
  settingsSection: {
    marginBottom: 16,
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121C16',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.28)',
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 13,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  settingsBtnLight: {
    backgroundColor: '#F4FAF6',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  settingsBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingsIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIconBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  settingsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  settingsBtnTitle: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  settingsConfigBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  settingsConfigBadgeText: {
    color: '#00E676',
    fontSize: 9,
    fontWeight: '800',
  },
  settingsBtnSubtitle: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    marginTop: 1,
  },

  // 4. Apoio
  supportSection: {
    marginBottom: 16,
  },
  supportCard: {
    backgroundColor: '#14201A',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 8,
  },
  supportCardLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.15)',
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
    fontSize: 10.5,
    flexShrink: 1,
  },
  supportVal: {
    color: COLORS.white,
    fontSize: 10.5,
    fontWeight: '700',
  },

  // 5. PWA & Logout
  pwaProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121C16',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 13,
    marginBottom: 12,
  },
  pwaProfileBtnLight: {
    backgroundColor: '#F3F9F5',
    borderColor: 'rgba(0, 135, 78, 0.22)',
  },
  pwaProfileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  pwaProfileIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pwaProfileIconBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  pwaProfileTitle: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  pwaProfileSubtitle: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 82, 82, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
    borderRadius: 14,
    paddingVertical: 11,
  },
  logoutBtnLight: {
    backgroundColor: '#FFF2F2',
    borderColor: 'rgba(255, 82, 82, 0.35)',
  },
  logoutBtnText: {
    color: '#FF5252',
    fontSize: 12.5,
    fontWeight: '700',
  },

  // Utilizador não autenticado
  guestCard: {
    backgroundColor: '#111D16',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    padding: 24,
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  guestCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.22)',
  },
  guestIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
  },
  guestDesc: {
    fontSize: 13,
    color: '#9CAFA4',
    textAlign: 'center',
    lineHeight: 19,
  },
  guestLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00B368',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
    width: '100%',
  },
  guestLoginBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
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
});

export default memo(ProfileScreen);
