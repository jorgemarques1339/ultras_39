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
  Award,
  ShieldCheck,
  CheckCircle2,
  Nfc,
  Bus,
  Flame,
  ChevronRight,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export default function FidelidadeModal({
  visible,
  onClose,
  hasCheckedIn = false,
  achievements = [],
  isDark = true,
  onOpenNfcCheckIn,
}) {
  const totalPresencas = hasCheckedIn ? 15 : 14;
  const presencasCasa = hasCheckedIn ? 13 : 12;
  const presencasFora = 2;
  const nextMilestone = 16;
  const progressPct = Math.min(100, Math.round((totalPresencas / nextMilestone) * 100));

  const renderIcon = (iconName, isUnlocked) => {
    const iconColor = isUnlocked ? (isDark ? COLORS.gold : '#00874E') : (isDark ? COLORS.textMuted : '#8FA89B');
    switch (iconName) {
      case 'Bus':
        return <Bus size={18} color={iconColor} />;
      case 'Award':
        return <Award size={18} color={iconColor} />;
      case 'Flame':
        return <Flame size={18} color={iconColor} />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck size={18} color={iconColor} />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, !isDark && styles.modalCardLight]}>
          {/* Header */}
          <View style={[styles.headerRow, !isDark && styles.headerRowLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                <Award size={20} color={isDark ? COLORS.gold : '#00874E'} />
              </View>
              <View>
                <Text style={[styles.modalTitle, !isDark && styles.textDark]}>
                  Fidelidade de Bancada
                </Text>
                <Text style={[styles.modalSubtitle, !isDark && styles.textMutedDark]}>
                  Registo oficial de presenças e crachás
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <X size={18} color={isDark ? '#FFF' : '#333'} />
            </TouchableOpacity>
          </View>

          {/* Conteúdo com Scroll */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Cartão de Destaque com Número Total de Presenças */}
            <View style={[styles.heroPresencasCard, !isDark && styles.heroPresencasCardLight]}>
              <View style={styles.heroTopLine}>
                <View>
                  <Text style={[styles.heroPresencasLabel, !isDark && styles.heroPresencasLabelLight]}>
                    TOTAL DE PRESENÇAS NA ÉPOCA
                  </Text>
                  <View style={styles.heroNumberRow}>
                    <Text style={[styles.heroBigNumber, !isDark && styles.heroBigNumberLight]}>
                      {totalPresencas}
                    </Text>
                    <Text style={styles.heroNumberUnit}>Jogos Oficiais</Text>
                  </View>
                </View>
                <View style={styles.heroBadgeTier}>
                  <Sparkles size={13} color="#FFD700" />
                  <Text style={styles.heroBadgeTierText}>Grau Ouro</Text>
                </View>
              </View>

              {/* Estatísticas Detalhadas */}
              <View style={[styles.statsGrid, !isDark && styles.statsGridLight]}>
                <View style={styles.statCol}>
                  <View style={styles.statIconRow}>
                    <MapPin size={11} color={isDark ? '#00E676' : '#00874E'} />
                    <Text style={styles.statLabel}>Estádio dos Arcos</Text>
                  </View>
                  <Text style={[styles.statValue, !isDark && styles.textDark]}>
                    {presencasCasa} Jogos
                  </Text>
                  <Text style={styles.statSub}>100% em Casa</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statCol}>
                  <View style={styles.statIconRow}>
                    <Bus size={11} color={isDark ? '#00E676' : '#00874E'} />
                    <Text style={styles.statLabel}>Deslocações</Text>
                  </View>
                  <Text style={[styles.statValue, !isDark && styles.textDark]}>
                    {presencasFora} Viagens
                  </Text>
                  <Text style={styles.statSub}>Estoril & Açores</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statCol}>
                  <View style={styles.statIconRow}>
                    <Calendar size={11} color={isDark ? '#FFD700' : '#8A6D00'} />
                    <Text style={styles.statLabel}>Assiduidade</Text>
                  </View>
                  <Text style={[styles.statValue, !isDark && styles.textDark]}>
                    100%
                  </Text>
                  <Text style={styles.statSub}>Sem Faltas</Text>
                </View>
              </View>

              {/* Barra de Progresso para a Próxima Recompensa */}
              <View style={styles.progressBox}>
                <View style={styles.progressHeaderRow}>
                  <Text style={[styles.progressTitle, !isDark && styles.textDark]}>
                    Próxima Recompensa: Cachecol Oficial G39
                  </Text>
                  <Text style={styles.progressFraction}>
                    {totalPresencas}/{nextMilestone} Presenças
                  </Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
                </View>
                <Text style={styles.progressHint}>
                  Falta apenas {nextMilestone - totalPresencas} jogo com validação NFC para desbloquear o cachecol grátis!
                </Text>
              </View>
            </View>

            {/* Estado do Check-In */}
            {hasCheckedIn ? (
              <View style={[styles.checkInStatusBox, styles.checkInStatusSuccess]}>
                <CheckCircle2 size={16} color="#00E676" />
                <View style={styles.checkInStatusTextCol}>
                  <Text style={styles.checkInStatusSuccessTitle}>
                    Presença Validada via NFC nos Arcos!
                  </Text>
                  <Text style={styles.checkInStatusSuccessDesc}>
                    O teu registo foi averbado na Bancada Poente com sucesso.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[styles.checkInStatusBox, !isDark && styles.checkInStatusBoxLight]}>
                <Nfc size={16} color={isDark ? '#FFD700' : '#00874E'} />
                <View style={styles.checkInStatusTextCol}>
                  <Text style={[styles.checkInStatusPendingTitle, !isDark && styles.textDark]}>
                    Validação no Estádio
                  </Text>
                  <Text style={[styles.checkInStatusPendingDesc, !isDark && styles.textMutedDark]}>
                    Aproxime o telemóvel do sensor NFC na sede ou na Bancada Poente.
                  </Text>
                </View>
                {onOpenNfcCheckIn && (
                  <TouchableOpacity
                    style={styles.nfcActionBtn}
                    onPress={() => {
                      onClose();
                      onOpenNfcCheckIn();
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.nfcActionBtnText}>Validar</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Secção de Crachás & Conquistas Descriminada */}
            <View style={styles.achievementsSection}>
              <View style={styles.sectionHeadingRow}>
                <Text style={[styles.sectionHeading, !isDark && styles.textDark]}>
                  Crachás de Bancada
                </Text>
                <Text style={styles.sectionHeadingBadge}>
                  {achievements.filter((a) => a.unlocked).length}/{achievements.length} Desbloqueados
                </Text>
              </View>

              <View style={styles.achievementsList}>
                {achievements.map((ach) => (
                  <View
                    key={ach.id}
                    style={[
                      styles.achievementItem,
                      !isDark && styles.achievementItemLight,
                      ach.unlocked && styles.achievementItemUnlocked,
                      !isDark && ach.unlocked && styles.achievementItemUnlockedLight,
                    ]}
                  >
                    <View style={styles.achItemLeft}>
                      <View
                        style={[
                          styles.achIconContainer,
                          !isDark && styles.achIconContainerLight,
                          ach.unlocked && styles.achIconContainerUnlocked,
                          !isDark && ach.unlocked && styles.achIconContainerUnlockedLight,
                        ]}
                      >
                        {renderIcon(ach.icon, ach.unlocked)}
                      </View>
                      <View style={styles.achInfoCol}>
                        <View style={styles.achTitleRow}>
                          <Text style={[styles.achItemTitle, !isDark && styles.textDark]}>
                            {ach.title}
                          </Text>
                          <View
                            style={[
                              styles.achStatusBadge,
                              ach.unlocked
                                ? isDark
                                  ? styles.achStatusUnlocked
                                  : styles.achStatusUnlockedLight
                                : isDark
                                ? styles.achStatusLocked
                                : styles.achStatusLockedLight,
                            ]}
                          >
                            <Text
                              style={[
                                styles.achStatusText,
                                ach.unlocked
                                  ? isDark
                                    ? styles.achStatusTextUnlocked
                                    : styles.achStatusTextUnlockedLight
                                  : isDark
                                  ? styles.achStatusTextLocked
                                  : styles.achStatusTextLockedLight,
                              ]}
                            >
                              {ach.unlocked ? 'DESBLOQUEADO' : 'EM CURSO'}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.achItemDesc, !isDark && styles.textMutedDark]}>
                          {ach.description}
                        </Text>
                        <View style={styles.achMetaRow}>
                          <Text style={[styles.achProgressText, !isDark && styles.achProgressTextLight]}>
                            {ach.progress}
                          </Text>
                          <Text style={styles.achRewardText}>🎁 {ach.reward}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Como Funciona a Assiduidade */}
            <View style={[styles.rulesCard, !isDark && styles.rulesCardLight]}>
              <Text style={[styles.rulesTitle, !isDark && styles.textDark]}>
                Como funciona o sistema de Fidelidade:
              </Text>
              <View style={styles.rulesList}>
                <Text style={[styles.ruleItem, !isDark && styles.textMutedDark]}>
                  • <Text style={styles.ruleBold}>Jogos em Casa:</Text> +1 presença validada por NFC na Bancada Poente.
                </Text>
                <Text style={[styles.ruleItem, !isDark && styles.textMutedDark]}>
                  • <Text style={styles.ruleBold}>Deslocações Oficiais:</Text> +2 presenças em viagens com a Caravana G39.
                </Text>
                <Text style={[styles.ruleItem, !isDark && styles.textMutedDark]}>
                  • <Text style={styles.ruleBold}>Vantagens Exclusivas:</Text> Prioridade máxima em bilhetes para clássicos e finais de taça.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Botão de Fechar no Rodapé */}
          <View style={[styles.modalFooter, !isDark && styles.modalFooterLight]}>
            <TouchableOpacity
              style={styles.closeMainBtn}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={styles.closeMainBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '88%',
    backgroundColor: '#0F1A14',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 135, 78, 0.25)',
      },
    }),
  },
  modalCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerRowLight: {
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
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
  closeBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  scrollBody: {
    flexGrow: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // Hero Card de Presenças
  heroPresencasCard: {
    backgroundColor: '#14221A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(242, 182, 0, 0.35)',
  },
  heroPresencasCardLight: {
    backgroundColor: '#F4F9F6',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  heroTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  heroPresencasLabel: {
    color: '#F4E8C1',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  heroPresencasLabelLight: {
    color: '#00874E',
  },
  heroNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  heroBigNumber: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 38,
  },
  heroBigNumberLight: {
    color: '#0E1712',
  },
  heroNumberUnit: {
    color: '#00E676',
    fontSize: 13,
    fontWeight: '800',
  },
  heroBadgeTier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.4)',
  },
  heroBadgeTierText: {
    color: '#FFD700',
    fontSize: 10.5,
    fontWeight: '800',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(7, 14, 10, 0.7)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  statsGridLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 8.5,
    fontWeight: '700',
  },
  statValue: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  statSub: {
    color: '#00E676',
    fontSize: 8.5,
    fontWeight: '700',
    marginTop: 1,
  },

  // Barra de Progresso
  progressBox: {
    gap: 5,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  progressFraction: {
    color: '#FFD700',
    fontSize: 10.5,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00E676',
    borderRadius: 3,
  },
  progressHint: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontStyle: 'italic',
  },

  // Status Box
  checkInStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121E17',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 9,
  },
  checkInStatusBoxLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  checkInStatusSuccess: {
    backgroundColor: 'rgba(0, 200, 83, 0.12)',
    borderColor: 'rgba(0, 230, 118, 0.4)',
  },
  checkInStatusTextCol: {
    flex: 1,
  },
  checkInStatusSuccessTitle: {
    color: '#00E676',
    fontSize: 11.5,
    fontWeight: '800',
  },
  checkInStatusSuccessDesc: {
    color: '#A7F3D0',
    fontSize: 9.5,
    marginTop: 1,
  },
  checkInStatusPendingTitle: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  checkInStatusPendingDesc: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    marginTop: 1,
  },
  nfcActionBtn: {
    backgroundColor: '#00874E',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.4)',
  },
  nfcActionBtnText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '800',
  },

  // Achievements
  achievementsSection: {
    gap: 10,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeading: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  sectionHeadingBadge: {
    color: '#00E676',
    fontSize: 11,
    fontWeight: '700',
  },
  achievementsList: {
    gap: 8,
  },
  achievementItem: {
    backgroundColor: '#121D17',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  achievementItemLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.12)',
  },
  achievementItemUnlocked: {
    borderColor: 'rgba(242, 182, 0, 0.35)',
    backgroundColor: 'rgba(20, 35, 26, 0.9)',
  },
  achievementItemUnlockedLight: {
    borderColor: 'rgba(0, 135, 78, 0.3)',
    backgroundColor: '#EDF5F0',
  },
  achItemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  achIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achIconContainerLight: {
    backgroundColor: '#E8EFEA',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  achIconContainerUnlocked: {
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    borderColor: 'rgba(242, 182, 0, 0.45)',
  },
  achIconContainerUnlockedLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.15)',
    borderColor: 'rgba(0, 135, 78, 0.35)',
  },
  achInfoCol: {
    flex: 1,
  },
  achTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  achItemTitle: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  achStatusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  achStatusUnlocked: {
    backgroundColor: 'rgba(242, 182, 0, 0.18)',
  },
  achStatusUnlockedLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.15)',
  },
  achStatusLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  achStatusLockedLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  achStatusText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  achStatusTextUnlocked: {
    color: '#FFD700',
  },
  achStatusTextUnlockedLight: {
    color: '#00874E',
  },
  achStatusTextLocked: {
    color: COLORS.textMuted,
  },
  achStatusTextLockedLight: {
    color: '#7A8E83',
  },
  achItemDesc: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginBottom: 5,
  },
  achMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achProgressText: {
    color: '#00E676',
    fontSize: 9.5,
    fontWeight: '700',
  },
  achProgressTextLight: {
    color: '#00874E',
  },
  achRewardText: {
    color: '#F4E8C1',
    fontSize: 9.5,
    fontWeight: '700',
  },

  // Rules
  rulesCard: {
    backgroundColor: '#0B140F',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 6,
  },
  rulesCardLight: {
    backgroundColor: '#F5F8F6',
    borderColor: 'rgba(0, 135, 78, 0.12)',
  },
  rulesTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  rulesList: {
    gap: 4,
  },
  ruleItem: {
    color: COLORS.textMuted,
    fontSize: 10,
    lineHeight: 14,
  },
  ruleBold: {
    fontWeight: '800',
    color: '#00E676',
  },

  // Footer
  modalFooter: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalFooterLight: {
    borderTopColor: 'rgba(0, 135, 78, 0.12)',
  },
  closeMainBtn: {
    backgroundColor: '#00874E',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeMainBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#5A6E63',
  },
});
