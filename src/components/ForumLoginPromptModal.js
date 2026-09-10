import React, { memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
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
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

function ForumLoginPromptModal({
  visible,
  onClose,
  onOpenLogin,
  onOpenRegister,
  isDark = true,
  type = 'forum', // 'forum' | 'profile'
}) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;

  if (!visible) return null;

  const isProfile = type === 'profile';
  const IconComponent = isProfile ? User : MessageSquare;
  const tagLabel = isProfile ? 'CARTÃO DE SÓCIO DIGITAL' : 'COMUNIDADE GRUPO 39';
  const title = isProfile ? 'Perfil do Sócio & Adepto' : 'Fórum da Claque';
  const description = isProfile
    ? 'Para acederes ao teu Perfil, Cartão Digital de Sócio, histórico de quotas e bilhetes, precisas de iniciar sessão.'
    : 'Para que possas participar no Fórum da Claque, precisas de iniciar sessão na tua conta de adepto ou sócio.';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            isTablet && styles.containerTablet,
            !isDark && styles.containerLight,
          ]}
        >
          {/* Reflexo Superior Efeito Vidro */}
          <View style={[styles.specularHighlight, !isDark && styles.specularHighlightLight]} />

          {/* Botão Fechar */}
          <TouchableOpacity
            style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityLabel="Fechar aviso de autenticação"
          >
            <X size={18} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
          </TouchableOpacity>

          {/* Cabeçalho com Ícone e Cadeado */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconHalo, !isDark && styles.iconHaloLight]}>
              <IconComponent size={34} color={isDark ? COLORS.primaryLight : '#00874E'} />
              <View style={[styles.lockBadge, !isDark && styles.lockBadgeLight]}>
                <Lock size={12} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </View>
          </View>

          {/* Etiqueta / Tag */}
          <View style={[styles.tagPill, !isDark && styles.tagPillLight]}>
            <ShieldCheck size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
            <Text style={[styles.tagText, !isDark && styles.tagTextLight]}>
              {tagLabel}
            </Text>
          </View>

          {/* Título e Descrição Principal */}
          <Text style={[styles.title, !isDark && styles.titleLight]}>
            {title}
          </Text>

          <Text style={[styles.description, !isDark && styles.descriptionLight]}>
            {description}
          </Text>

          {/* Caixa de Benefícios / Destaques */}
          <View style={[styles.benefitsCard, !isDark && styles.benefitsCardLight]}>
            {isProfile ? (
              <>
                <View style={styles.benefitRow}>
                  <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                    <CreditCard size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  </View>
                  <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                    Cartão Digital oficial com QR Code SIBS
                  </Text>
                </View>

                <View style={styles.benefitRow}>
                  <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                    <ShieldCheck size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  </View>
                  <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                    Regularização de quotas de época via MB WAY
                  </Text>
                </View>

                <View style={styles.benefitRow}>
                  <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                    <Ticket size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
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
                    <Flame size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  </View>
                  <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                    Publica e responde a tópicos de bancada
                  </Text>
                </View>

                <View style={styles.benefitRow}>
                  <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                    <Bus size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  </View>
                  <Text style={[styles.benefitText, !isDark && styles.benefitTextLight]}>
                    Organiza e participa em viagens e deslocações
                  </Text>
                </View>

                <View style={styles.benefitRow}>
                  <View style={[styles.benefitBullet, !isDark && styles.benefitBulletLight]}>
                    <ShieldCheck size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
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
              <LogIn size={18} color="#0D1310" strokeWidth={2.4} />
              <Text style={styles.primaryBtnText}>Fazer Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryBtn, !isDark && styles.secondaryBtnLight]}
              onPress={onOpenRegister}
              activeOpacity={0.8}
            >
              <UserPlus size={17} color={isDark ? COLORS.textPrimary : '#18241D'} />
              <Text style={[styles.secondaryBtnText, !isDark && styles.secondaryBtnTextLight]}>
                Criar Conta de Sócio / Adepto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelBtnText, !isDark && styles.cancelBtnTextLight]}>
                Mais Tarde
              </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      },
    }),
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#0F1A14',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 179, 104, 0.12)',
      },
      default: {
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
      },
    }),
  },
  containerTablet: {
    maxWidth: 460,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 28,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.18)',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15), 0 0 25px rgba(0, 135, 78, 0.1)',
      },
    }),
  },
  specularHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  specularHighlightLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.2)',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconHalo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(0, 179, 104, 0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 0 24px rgba(0, 179, 104, 0.25)',
      },
    }),
  },
  iconHaloLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: '#0F1A14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadgeLight: {
    backgroundColor: '#4B5563',
    borderColor: '#FFFFFF',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.28)',
    marginBottom: 10,
  },
  tagPillLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.08)',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  tagText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  tagTextLight: {
    color: '#00874E',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  titleLight: {
    color: '#121F17',
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  descriptionLight: {
    color: '#4A5B51',
  },
  benefitsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  benefitsCardLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitBullet: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitBulletLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
  },
  benefitText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  benefitTextLight: {
    color: '#24332A',
  },
  actionsCol: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 14,
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 179, 104, 0.4)',
      },
    }),
  },
  primaryBtnText: {
    color: '#08120C',
    fontSize: 15,
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
    paddingVertical: 12,
    borderRadius: 16,
  },
  secondaryBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  secondaryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtnTextLight: {
    color: '#1F2E25',
  },
  cancelBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  cancelBtnTextLight: {
    color: '#65786C',
  },
});

export default memo(ForumLoginPromptModal);
