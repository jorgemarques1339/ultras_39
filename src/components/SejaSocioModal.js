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
  X,
  IdCard,
  CheckCircle2,
  Ticket,
  Bus,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const BENEFITS = [
  {
    icon: Ticket,
    title: 'Bilhética a Preço Reduzido',
    desc: 'Descontos de mais de 50% em todos os jogos nos Arcos e acesso prioritário na Bancada Poente.',
  },
  {
    icon: Bus,
    title: 'Prioridade em Deslocações',
    desc: 'Lugar garantido e valor subvencionado nos autocarros oficiais do Grupo 39 fora de casa.',
  },
  {
    icon: ShoppingBag,
    title: 'Merchandising Oficial Exclusivo',
    desc: 'Acesso antecipado a t-shirts, hoodies, cachecóis e material de edição limitada da claque.',
  },
  {
    icon: IdCard,
    title: 'Cartão Digital de Associado',
    desc: 'Cartão holográfico interativo com suporte para Apple Wallet e Google Wallet.',
  },
];

function SejaSocioModal({
  visible,
  onClose,
  onJoinMember,
  onNavigateTab,
  isDark = true,
}) {
  const handleJoin = () => {
    onClose();
    if (onJoinMember) {
      onJoinMember({
        title: 'Quota Anual Grupo 39 · Época 2026/2027',
        category: 'Quota de Sócio Efetivo',
        amount: 12.50,
        type: 'quota',
      });
    } else if (onNavigateTab) {
      onNavigateTab('profile');
    }
  };

  const handleGoProfile = () => {
    onClose();
    if (onNavigateTab) {
      onNavigateTab('profile');
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
          {/* Header */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                <IdCard size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
              </View>
              <View>
                <Text style={[styles.headerTitle, !isDark && styles.textDark]}>
                  Seja Sócio do Grupo 39
                </Text>
                <Text style={[styles.headerSubtitle, !isDark && styles.headerSubtitleLight]}>
                  Junta-te à Maior Força Vilacondense
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              activeOpacity={0.7}
            >
              <X size={20} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {/* Banner Destaque */}
            <View style={[styles.heroCard, !isDark && styles.heroCardLight]}>
              <View style={styles.badgeRow}>
                <View style={styles.badgeGreen}>
                  <Sparkles size={11} color="#FFF" />
                  <Text style={styles.badgeGreenText}>CAMPANHA 2026/2027</Text>
                </View>
                <Text style={[styles.heroPriceText, !isDark && styles.heroPriceTextLight]}>
                  12,50 € / Época
                </Text>
              </View>

              <Text style={[styles.heroTitle, !isDark && styles.textDark]}>
                A Força do Rio Ave FC na Bancada Poente
              </Text>
              <Text style={[styles.heroDesc, !isDark && styles.heroDescLight]}>
                Garante o teu estatuto de associado oficial do Grupo 39, apoia o Rio Ave em qualquer estádio e desfruta de regalias exclusivas ao longo de toda a época desportiva.
              </Text>
            </View>

            {/* Vantagens */}
            <Text style={[styles.sectionLabel, !isDark && styles.textMutedDark]}>
              VANTAGENS EXCLUSIVAS DE SÓCIO
            </Text>
            <View style={styles.benefitsList}>
              {BENEFITS.map((item, index) => {
                const IconComp = item.icon;
                return (
                  <View
                    key={index}
                    style={[styles.benefitCard, !isDark && styles.benefitCardLight]}
                  >
                    <View style={[styles.benefitIconBox, !isDark && styles.benefitIconBoxLight]}>
                      <IconComp size={16} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    </View>
                    <View style={styles.benefitContent}>
                      <Text style={[styles.benefitTitle, !isDark && styles.textDark]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.benefitDesc, !isDark && styles.benefitDescLight]}>
                        {item.desc}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Ações */}
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={handleJoin}
              activeOpacity={0.85}
            >
              <View style={styles.joinBtnRow}>
                <ShieldCheck size={18} color="#FFF" />
                <Text style={styles.joinBtnText}>Aderir / Regularizar Quota (12,50 €)</Text>
              </View>
              <ChevronRight size={16} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.profileBtn, !isDark && styles.profileBtnLight]}
              onPress={handleGoProfile}
              activeOpacity={0.8}
            >
              <Text style={[styles.profileBtnText, !isDark && styles.textDark]}>
                Já és Sócio? Ver Cartão Digital
              </Text>
              <ChevronRight size={14} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
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
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.12)',
      },
    }),
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
  headerIconBoxLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.25)',
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
    backgroundColor: '#F0F4F2',
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  heroCard: {
    backgroundColor: '#132219',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    marginBottom: 16,
  },
  heroCardLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.16)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#00874E',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  badgeGreenText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  heroPriceText: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '900',
  },
  heroPriceTextLight: {
    color: '#00874E',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroDesc: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    lineHeight: 16,
  },
  heroDescLight: {
    color: '#475C50',
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  benefitsList: {
    gap: 8,
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101A14',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 10,
  },
  benefitCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.15)',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 6px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
  benefitIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitIconBoxLight: {
    backgroundColor: '#EDF5F0',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  benefitDesc: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    marginTop: 2,
    lineHeight: 14,
  },
  benefitDescLight: {
    color: '#556A5E',
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00874E',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#00B368',
    marginBottom: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 135, 78, 0.35)',
      },
    }),
  },
  joinBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  joinBtnText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121A15',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  profileBtnLight: {
    backgroundColor: '#F2F6F4',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  profileBtnText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    fontWeight: '600',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});

export default memo(SejaSocioModal);
