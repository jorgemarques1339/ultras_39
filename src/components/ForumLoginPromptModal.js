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
  MessageSquare,
  Lock,
  LogIn,
  UserPlus,
  X,
  ShieldCheck,
  Flame,
  Bus,
  User,
  CreditCard,
  Ticket,
  Sparkles,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

function ForumLoginPromptModal({
  visible,
  onClose,
  onOpenLogin,
  onOpenRegister,
  onSimulateUnlock,
  isDark = true,
  type = 'forum', // 'forum' | 'profile' | 'deslocacao'
}) {
  if (!visible) return null;

  const isProfile = type === 'profile';
  const isDeslocacao = type === 'deslocacao';
  const IconComponent = isDeslocacao ? Bus : (isProfile ? User : MessageSquare);
  const tagLabel = isDeslocacao
    ? 'DESLOCAÇÃO OFICIAL · ALVERCA'
    : (isProfile ? 'CARTÃO DE SÓCIO DIGITAL' : 'COMUNIDADE GRUPO 39');
  const title = isDeslocacao
    ? 'Deslocação a Alverca'
    : (isProfile ? 'Perfil do Sócio & Adepto' : 'Fórum da Claque');
  const subtitle = isDeslocacao
    ? 'Acesso Antecipado & Sócios'
    : (isProfile ? 'Cartão Digital & Quotas' : 'Voz da Bancada Poente');
  const description = isDeslocacao
    ? 'As inscrições antecipadas em autocarro são exclusivas para Sócios do Grupo 39 por apenas 7,50 €. Para quem não tem login, as vagas abrem a 16 de Setembro (10,00 €).'
    : (isProfile
      ? 'Para acederes ao teu Perfil, Cartão Digital de Sócio, histórico de quotas e bilhetes, precisas de iniciar sessão.'
      : 'Para que possas participar no Fórum da Claque, precisas de iniciar sessão na tua conta de adepto ou sócio.');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, !isDark && styles.overlayLight]}>
        <View style={[styles.container, !isDark && styles.containerLight]}>
          {/* Barra Indicadora de Arraste (Sheet Handle) */}
          <View style={[styles.sheetHandle, !isDark && styles.sheetHandleLight]} />

          {/* Header Padronizado com Ícone, Títulos e Botão Fechar */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                <IconComponent size={20} color={isDark ? COLORS.primaryLight : '#00874E'} />
              </View>
              <View style={styles.headerTitleCol}>
                <Text style={[styles.headerTitle, !isDark && styles.headerTitleLight]} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={[styles.headerSubtitle, !isDark && styles.headerSubtitleLight]} numberOfLines={1}>
                  {subtitle}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel="Fechar aviso"
            >
              <X size={18} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          {/* Corpo Scrollável Perfeitamente Enquadrado no Ecrã */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {/* Card de Destaque com Asas Arredondadas */}
            <View style={[styles.heroCard, !isDark && styles.heroCardLight]}>
              <View style={styles.heroBadgeRow}>
                <View style={[styles.tagPill, !isDark && styles.tagPillLight]}>
                  <ShieldCheck size={12} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  <Text style={[styles.tagText, !isDark && styles.tagTextLight]}>
                    {tagLabel}
                  </Text>
                </View>
                <View style={[styles.statusBadge, !isDark && styles.statusBadgeLight]}>
                  <Lock size={10} color={isDark ? '#F2B600' : '#8A6D00'} />
                  <Text style={[styles.statusBadgeText, !isDark && styles.statusBadgeTextLight]}>
                    {isDeslocacao ? 'EXCLUSIVO SÓCIOS' : 'REQUER LOGIN'}
                  </Text>
                </View>
              </View>

              <Text style={[styles.heroDescription, !isDark && styles.heroDescriptionLight]}>
                {description}
              </Text>
            </View>

            {/* Comparativo de Preços Exclusivo para Deslocação */}
            {isDeslocacao && (
              <View style={[styles.priceCompareBox, !isDark && styles.priceCompareBoxLight]}>
                <View style={styles.priceCol}>
                  <Text style={[styles.priceColLabel, !isDark && styles.textMutedDark]}>
                    SÓCIOS G39
                  </Text>
                  <View style={styles.priceValueRow}>
                    <Text style={styles.priceValueHighlight}>7,50 €</Text>
                  </View>
                  <Text style={styles.priceAvailableNow}>✓ Disponível com login</Text>
                </View>

                <View style={[styles.priceDivider, !isDark && styles.priceDividerLight]} />

                <View style={styles.priceCol}>
                  <Text style={[styles.priceColLabel, !isDark && styles.textMutedDark]}>
                    NÃO SÓCIOS
                  </Text>
                  <View style={styles.priceValueRow}>
                    <Text style={[styles.priceValueStandard, !isDark && styles.textDark]}>10,00 €</Text>
                  </View>
                  <Text style={[styles.priceUnlockDate, !isDark && styles.priceUnlockDateLight]}>
                    Abre 16 Set · 3 dias antes
                  </Text>
                </View>
              </View>
            )}

            {/* Caixa de Benefícios / Destaques com Cantos Arredondados */}
            <View style={[styles.benefitsCard, !isDark && styles.benefitsCardLight]}>
              {isDeslocacao ? (
                <>
                  <View style={styles.benefitRow}>
                    <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                      <Bus size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    </View>
                    <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                      Pack autocarro ida/volta + bilhete setor visitante incluído
                    </Text>
                  </View>

                  <View style={styles.benefitRow}>
                    <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                      <ShieldCheck size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    </View>
                    <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                      Preço exclusivo de 7,50 € reservado a Sócios do Grupo 39
                    </Text>
                  </View>

                  <View style={styles.benefitRow}>
                    <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                      <Ticket size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    </View>
                    <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                      Vagas para público geral abrem a 16 de Setembro (10,00 €)
                    </Text>
                  </View>
                </>
              ) : isProfile ? (
                <>
                  <View style={styles.benefitRow}>
                    <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                      <CreditCard size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    </View>
                    <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                      Cartão Digital oficial com QR Code SIBS
                    </Text>
                  </View>

                  <View style={styles.benefitRow}>
                    <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                      <ShieldCheck size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    </View>
                    <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                      Regularização de quotas de época via MB WAY
                    </Text>
                  </View>

                  <View style={styles.benefitRow}>
                    <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                      <Ticket size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    </View>
                    <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                      Histórico de compras, bilhetes e comprovativos
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.benefitRow}>
                    <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                      <Flame size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    </View>
                    <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                      Publica e responde a tópópicos de bancada
                    </Text>
                  </View>

                  <View style={styles.benefitRow}>
                    <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                      <Bus size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    </View>
                    <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                      Organiza e participa em viagens e deslocações
                    </Text>
                  </View>

                  <View style={styles.benefitRow}>
                    <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                      <ShieldCheck size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    </View>
                    <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                      Espaço oficial e moderado reservado a membros
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Botões de Ação */}
            <View style={styles.actionsCol}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={onOpenLogin}
                activeOpacity={0.85}
              >
                <LogIn size={17} color="#0D1310" strokeWidth={2.4} />
                <Text style={styles.primaryBtnText}>
                  {isDeslocacao ? 'Iniciar Sessão como Sócio (7,50 €)' : 'Fazer Login'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryBtn, !isDark && styles.secondaryBtnLight]}
                onPress={onOpenRegister}
                activeOpacity={0.8}
              >
                <UserPlus size={16} color={isDark ? COLORS.textPrimary : '#18241D'} />
                <Text style={[styles.secondaryBtnText, !isDark && styles.secondaryBtnTextLight]}>
                  Criar Conta de Sócio / Adepto
                </Text>
              </TouchableOpacity>

              {isDeslocacao && onSimulateUnlock && (
                <TouchableOpacity
                  style={[styles.simulateBtn, !isDark && styles.simulateBtnLight]}
                  onPress={onSimulateUnlock}
                  activeOpacity={0.75}
                >
                  <Sparkles size={14} color="#F2B600" />
                  <Text style={styles.simulateBtnText}>
                    Simular Data a partir de 16 Setembro (10,00 €)
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelBtnText, !isDark && styles.cancelBtnTextLight]}>
                  {isDeslocacao ? 'Fechar' : 'Mais Tarde'}
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  heroCard: {
    backgroundColor: '#142219',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
    marginBottom: 12,
  },
  heroCardLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.16)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
  },
  tagPillLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.08)',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  tagText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagTextLight: {
    color: '#00874E',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.3)',
  },
  statusBadgeLight: {
    backgroundColor: 'rgba(242, 182, 0, 0.1)',
    borderColor: 'rgba(242, 182, 0, 0.25)',
  },
  statusBadgeText: {
    color: '#F2B600',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  statusBadgeTextLight: {
    color: '#8A6D00',
  },
  heroDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  heroDescriptionLight: {
    color: '#3F5246',
  },
  priceCompareBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1510',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 12,
  },
  priceCompareBoxLight: {
    backgroundColor: '#F5F9F6',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  priceCol: {
    flex: 1,
    alignItems: 'center',
  },
  priceDivider: {
    width: 1,
    height: 46,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  priceDividerLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  priceColLabel: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  textMutedDark: {
    color: '#607368',
  },
  textDark: {
    color: '#121F17',
  },
  priceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  priceValueHighlight: {
    color: COLORS.primaryLight,
    fontSize: 20,
    fontWeight: '900',
  },
  priceValueStandard: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
  },
  priceAvailableNow: {
    color: '#00B368',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  priceUnlockDate: {
    color: '#F2B600',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  priceUnlockDateLight: {
    color: '#8A6D00',
  },
  benefitsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  benefitsCardLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitBulletLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
  },
  benefitText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  benefitTextLight: {
    color: '#24332A',
  },
  actionsCol: {
    width: '100%',
    gap: 9,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 13,
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 179, 104, 0.35)',
      },
    }),
  },
  primaryBtnText: {
    color: '#08120C',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    paddingVertical: 11,
    borderRadius: 16,
  },
  secondaryBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  secondaryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '700',
  },
  secondaryBtnTextLight: {
    color: '#1F2E25',
  },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(242, 182, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.3)',
    paddingVertical: 10,
    borderRadius: 16,
  },
  simulateBtnLight: {
    backgroundColor: '#FFFDF0',
    borderColor: 'rgba(242, 182, 0, 0.35)',
  },
  simulateBtnText: {
    color: '#F2B600',
    fontSize: 12,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  cancelBtnTextLight: {
    color: '#65786C',
  },
});

export default memo(ForumLoginPromptModal);
