import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Award,
  Check,
  Nfc,
  LogOut,
  LogIn,
  Edit3,
  CreditCard,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { FAN_ACHIEVEMENTS } from '../data/mockData';
import NfcCheckInModal from '../components/NfcCheckInModal';
import EditProfileModal from '../components/EditProfileModal';
import FidelidadeModal from '../components/FidelidadeModal';
import PagamentosModal from '../components/PagamentosModal';
import { useAuth } from '../context/AuthContext';
import { useAppSettings } from '../context/AppSettingsContext';

// Componente isolado para o Cartão Holográfico Compacto de Sócio
const HolographicMemberCard = memo(function HolographicMemberCard({
  user,
  isQuotaPending,
  isQuotaAwaitingValidation,
  onPayQuota,
  onEditProfile,
  onOpenWalletPass,
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
          <Text style={styles.memberName}>
            {user?.name || 'Sócio Grupo 39'}
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
          !isQuotaPending && !isQuotaAwaitingValidation && styles.cardFooterDataPaid,
        ]}
      >
        <View style={styles.cardQuotaSimpleRow}>
          <View style={styles.cardQuotaLabelContainer}>
            <View
              style={[
                styles.cardQuotaDot,
                !isQuotaPending && !isQuotaAwaitingValidation && styles.cardQuotaDotPaid,
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
          ) : isQuotaAwaitingValidation ? (
            <View style={styles.cardAwaitingBtn}>
              <Text style={styles.cardAwaitingText}>AGUARDA VALIDAÇÃO</Text>
            </View>
          ) : (
            <View style={styles.cardPaidSuccessBtn}>
              <Check size={10} color="#00E676" strokeWidth={3} />
              <Text style={styles.cardPaidSuccessText}>EM DIA</Text>
            </View>
          )}
        </View>
      </View>

      {/* Botões Compactos: Guardar na Carteira Digital (Apple Wallet & Google Wallet) */}
      {onOpenWalletPass && (
        <View style={styles.cardWalletRow}>
          <TouchableOpacity
            style={[
              styles.cardWalletBtn,
              styles.cardWalletBtnHalf,
              !isDark && styles.cardWalletBtnLight,
            ]}
            onPress={() => onOpenWalletPass('apple')}
            activeOpacity={0.82}
          >
            <View style={styles.cardWalletLeft}>
              <View style={styles.cardWalletIconBlack}>
                <Text style={styles.cardAppleGlyph}></Text>
              </View>
              <Text
                style={[styles.cardWalletText, !isDark && styles.cardWalletTextLight]}
                numberOfLines={1}
              >
                Apple Wallet
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cardWalletBtn,
              styles.cardWalletBtnHalf,
              !isDark && styles.cardWalletBtnLight,
            ]}
            onPress={() => onOpenWalletPass('google')}
            activeOpacity={0.82}
          >
            <View style={styles.cardWalletLeft}>
              <View style={styles.cardWalletIconGoogle}>
                <Text style={styles.cardGoogleGlyph}>G</Text>
              </View>
              <Text
                style={[styles.cardWalletText, !isDark && styles.cardWalletTextLight]}
                numberOfLines={1}
              >
                Google Wallet
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
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
  const { appSettings } = useAppSettings();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [achievements, setAchievements] = useState(FAN_ACHIEVEMENTS);
  const [fidelidadeModalVisible, setFidelidadeModalVisible] = useState(false);
  const [nfcModalVisible, setNfcModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [pagamentosModalVisible, setPagamentosModalVisible] = useState(false);

  // Filtrar apenas transações relativas a pagamento de quotas
  const quotaTransactions = useMemo(() => {
    return (transactions || []).filter(
      (tx) =>
        tx.type === 'quota' ||
        tx.category?.toLowerCase().includes('quota') ||
        tx.title?.toLowerCase().includes('quota')
    );
  }, [transactions]);

  const handleOpenNfcCheckIn = useCallback(() => {
    if (!appSettings.nfc) {
      const msg = 'O leitor NFC está desativado. Ativa-o em Definições > NFC do Dispositivo para validar a tua presença.';
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
        window.alert(msg);
      } else {
        Alert.alert('NFC Desativado', msg);
      }
      return;
    }
    setNfcModalVisible(true);
  }, [appSettings.nfc]);

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

  const isQuotaAwaitingValidation = user?.quotaStatus === 'aguarda_validacao';
  const isQuotaPending = !isQuotaAwaitingValidation && user?.quotaStatus !== 'em_dia';

  return (
    <View style={[styles.container, !isDark && styles.containerLight]}>
      {/* LOGÓTIPO DE FUNDO DA CLAQUE (GRUPO 39) */}
      <View style={styles.backgroundContainer} pointerEvents="none">
        <Image
          source={require('../../assets/logo_39.png')}
          style={[styles.backgroundImage, !isDark && styles.backgroundImageLight]}
          resizeMode="contain"
        />
        <View style={[styles.backgroundOverlay, !isDark && styles.backgroundOverlayLight]} />
      </View>

      <ScrollView
        style={styles.scrollView}
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
            bancada, crachás de presença nos Arcos e vantagens exclusivas de sócio.
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
          {/* 1. CARTÃO DIGITAL DO SÓCIO DA CLAQUE G39 */}
          <View style={styles.cardSection}>
            <View style={styles.sectionTitleHeaderRow}>
              <Text style={[styles.sectionHeaderTitle, !isDark && styles.textDark]}>
                Cartão Sócio G39
              </Text>
            </View>

            <HolographicMemberCard
              user={user}
              isQuotaPending={isQuotaPending}
              isQuotaAwaitingValidation={isQuotaAwaitingValidation}
              onPayQuota={onPayQuota}
              onEditProfile={() => setEditProfileModalVisible(true)}
              onOpenWalletPass={onOpenWalletPass}
              isDark={isDark}
            />
          </View>

          {/* 3. PAGAMENTO DE QUOTAS */}
          <View style={styles.quotasSection}>
            <TouchableOpacity
              style={[styles.settingsBtn, !isDark && styles.settingsBtnLight]}
              onPress={() => setPagamentosModalVisible(true)}
              activeOpacity={0.85}
            >
              <View style={styles.settingsBtnLeft}>
                <View
                  style={[
                    styles.settingsIconBox,
                    !isDark && styles.settingsIconBoxLight,
                  ]}
                >
                  <CreditCard
                    size={17}
                    color={isDark ? '#00E676' : '#00874E'}
                  />
                </View>
                <View>
                  <View style={styles.settingsTitleRow}>
                    <Text
                      style={[styles.settingsBtnTitle, !isDark && styles.textDark]}
                    >
                      Pagamento de Quotas
                    </Text>
                    <View style={styles.settingsConfigBadge}>
                      <Text style={styles.settingsConfigBadgeText}>
                        {quotaTransactions.length} {quotaTransactions.length === 1 ? 'quota' : 'quotas'}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.settingsBtnSubtitle,
                      !isDark && styles.textMutedDark,
                    ]}
                  >
                    Histórico de quotas anuais e recibos SIBS
                  </Text>
                </View>
              </View>
              <ChevronRight
                size={16}
                color={isDark ? COLORS.textMuted : '#7E9187'}
              />
            </TouchableOpacity>
          </View>

          {/* PEQUENA DIVISÃO */}
          <View
            style={[
              styles.profileSectionDivider,
              !isDark && styles.profileSectionDividerLight,
            ]}
          />

          {/* 4. ATIVIDADE DE BANCADA */}
          <View style={styles.loyaltySection}>
            <View style={styles.loyaltyHeaderRow}>
              <View style={styles.loyaltyTitleGroup}>
                <Award size={16} color={isDark ? COLORS.gold : '#00874E'} />
                <Text style={[styles.sectionHeaderTitle, !isDark && styles.textDark]}>
                  Atividade de Bancada
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.loyaltyHeaderBtn,
                  !isDark && styles.loyaltyHeaderBtnLight,
                ]}
                onPress={() => setFidelidadeModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.loyaltyHeaderBtnText,
                    !isDark && styles.loyaltyHeaderBtnTextLight,
                  ]}
                >
                  Ver Mais
                </Text>
                <ChevronRight size={13} color={isDark ? '#00E676' : '#00874E'} />
              </TouchableOpacity>
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
          </View>

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

      {/* Modal de Fidelidade de Bancada Descriminada */}
      <FidelidadeModal
        visible={fidelidadeModalVisible}
        onClose={() => setFidelidadeModalVisible(false)}
        hasCheckedIn={hasCheckedIn}
        achievements={achievements}
        isDark={isDark}
        onOpenNfcCheckIn={handleOpenNfcCheckIn}
      />

      {/* Modal de Pagamentos de Quotas */}
      <PagamentosModal
        visible={pagamentosModalVisible}
        onClose={() => setPagamentosModalVisible(false)}
        transactions={quotaTransactions}
        onViewReceipt={onViewReceipt}
        user={user}
        isDark={isDark}
      />

      <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1310',
    position: 'relative',
    overflow: 'hidden',
  },
  containerLight: {
    backgroundColor: '#F5F8F6',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 64,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 0,
  },
  backgroundImage: {
    width: '88%',
    maxWidth: 380,
    aspectRatio: 1,
    opacity: 0.28,
  },
  backgroundImageLight: {
    opacity: 0.22,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  backgroundOverlayLight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    zIndex: 1,
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

  // 1. Cartão Holográfico Expandido
  cardSection: {
    marginBottom: 20,
  },
  holographicCard: {
    backgroundColor: '#14201A',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(242, 182, 0, 0.45)',
    padding: 16,
    opacity: 0.93,
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
    gap: 12,
    marginBottom: 13,
  },
  memberPhotoWrapper: {
    position: 'relative',
  },
  memberPhoto: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00B368',
  },
  memberPhotoImg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#00B368',
  },
  memberPhotoInitial: {
    color: '#FFF',
    fontSize: 21,
    fontWeight: '900',
  },
  memberPhotoRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.5)',
  },
  memberInfoCol: {
    flex: 1,
  },
  memberName: {
    color: COLORS.white,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
  },
  cardEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  cardEditBtnText: {
    color: '#00E676',
    fontSize: 11.5,
    fontWeight: '800',
  },

  // Grelha de Dados Oficiais
  cardDataContainer: {
    backgroundColor: 'rgba(10, 18, 14, 0.75)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 10,
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
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  dataLabel: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  dataVal: {
    color: COLORS.white,
    fontSize: 12.5,
    fontWeight: '800',
  },

  // Rodapé Quota Anual
  cardFooterData: {
    backgroundColor: 'rgba(5, 14, 9, 0.92)',
    borderRadius: 9,
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    gap: 6,
  },
  cardQuotaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFB74D',
  },
  cardQuotaDotPaid: {
    backgroundColor: '#00E676',
  },
  cardQuotaSimpleLabel: {
    color: '#F4E8C1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardPayBtn: {
    backgroundColor: '#00874E',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.6)',
  },
  cardPayBtnText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cardPaidSuccessBtn: {
    backgroundColor: 'rgba(0, 200, 83, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.5)',
  },
  cardPaidSuccessText: {
    color: '#00E676',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardAwaitingBtn: {
    backgroundColor: 'rgba(255, 183, 77, 0.18)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 77, 0.5)',
  },
  cardAwaitingText: {
    color: '#FFB74D',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  // Botões Carteira Digital Integrados no Cartão
  cardWalletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  cardWalletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardWalletBtnHalf: {
    flex: 1,
    justifyContent: 'center',
  },
  cardWalletIconGoogle: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(66, 133, 244, 0.4)',
  },
  cardGoogleGlyph: {
    color: '#4285F4',
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 13,
  },
  cardWalletBtnLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(0, 135, 78, 0.22)',
  },
  cardWalletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  cardWalletIconBlack: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  cardAppleGlyph: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 12,
  },
  cardWalletText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardWalletTextLight: {
    color: '#0E1712',
  },
  cardWalletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  cardWalletBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  cardWalletBadgeText: {
    color: '#00E676',
    fontSize: 8.5,
    fontWeight: '800',
  },
  cardWalletBadgeTextLight: {
    color: '#00874E',
  },

  // 2. Fidelidade de Bancada & Gamificação
  loyaltySection: {
    marginBottom: 22,
  },
  loyaltyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loyaltyTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loyaltyHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  loyaltyHeaderBtnLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  loyaltyHeaderBtnText: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '800',
  },
  loyaltyHeaderBtnTextLight: {
    color: '#00874E',
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: '#00874E',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#00B368',
    opacity: 0.93,
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
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // 1. Definições da App (Topo)
  settingsTopSection: {
    marginBottom: 16,
  },
  // 3. Quotas
  quotasSection: {
    marginBottom: 18,
  },
  // Divisão Visual
  profileSectionDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 4,
    marginBottom: 20,
    borderRadius: 1,
  },
  profileSectionDividerLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  settingsSection: {
    marginBottom: 16,
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#14201A',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.28)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 15,
    opacity: 0.9,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  settingsBtnLight: {
    backgroundColor: 'rgba(238, 244, 240, 0.85)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
    opacity: 0.9,
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
  alertsUnreadBadge: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  alertsUnreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
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

  // 5. Logout
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
