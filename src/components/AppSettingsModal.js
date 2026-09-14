import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  X,
  Settings,
  Bell,
  BellOff,
  Nfc,
  Volume2,
  VolumeX,
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const APP_SETTINGS_STORAGE_KEY = '@grupo39_app_settings';

export const DEFAULT_APP_SETTINGS = {
  notifications: true,
  nfc: true,
  sound: true,
};

export default function AppSettingsModal({ visible, onClose, isDark = true }) {
  const [settings, setSettings] = useState(DEFAULT_APP_SETTINGS);
  const [hasSavedFeedback, setHasSavedFeedback] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(APP_SETTINGS_STORAGE_KEY);
        if (stored && isMounted) {
          setSettings({ ...DEFAULT_APP_SETTINGS, ...JSON.parse(stored) });
        }
      } catch (err) {
        console.warn('Erro ao carregar definições da app:', err);
      }
    };

    if (visible) {
      loadSettings();
      setHasSavedFeedback(false);
    }

    return () => {
      isMounted = false;
    };
  }, [visible]);

  const updateSetting = async (key, value) => {
    const nextSettings = { ...settings, [key]: value };
    setSettings(nextSettings);
    setHasSavedFeedback(true);
    try {
      await AsyncStorage.setItem(
        APP_SETTINGS_STORAGE_KEY,
        JSON.stringify(nextSettings)
      );
    } catch (err) {
      console.warn('Erro ao guardar definições:', err);
    }
    setTimeout(() => {
      setHasSavedFeedback(false);
    }, 2000);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.modalCard, !isDark && styles.modalCardLight]}>
          {/* Cabeçalho */}
          <View style={[styles.modalHeader, !isDark && styles.modalHeaderLight]}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <SlidersHorizontal size={18} color="#00E676" />
              </View>
              <View>
                <Text style={[styles.modalTitle, !isDark && styles.textDark]}>
                  Definições da App
                </Text>
                <Text style={[styles.modalSubtitle, !isDark && styles.textMutedDark]}>
                  Preferências de sistema do Grupo 39
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={isDark ? COLORS.textMuted : '#7A9184'} />
            </TouchableOpacity>
          </View>

          {/* Conteúdo das opções */}
          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Opção 1: Notificações da App */}
            <View
              style={[
                styles.settingCard,
                !isDark && styles.settingCardLight,
                settings.notifications && styles.settingCardActive,
              ]}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIconBox,
                    settings.notifications
                      ? styles.settingIconBoxActive
                      : styles.settingIconBoxInactive,
                  ]}
                >
                  {settings.notifications ? (
                    <Bell size={18} color="#00E676" />
                  ) : (
                    <BellOff size={18} color={isDark ? '#7E9187' : '#94A3B8'} />
                  )}
                </View>
                <View style={styles.settingTextCol}>
                  <View style={styles.settingTitleRow}>
                    <Text style={[styles.settingTitle, !isDark && styles.textDark]}>
                      1. Notificações da App
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        settings.notifications
                          ? styles.statusPillActive
                          : styles.statusPillInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          settings.notifications
                            ? styles.statusPillTextActive
                            : styles.statusPillTextInactive,
                        ]}
                      >
                        {settings.notifications ? 'Ativadas' : 'Desativadas'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.settingDesc, !isDark && styles.textMutedDark]}>
                    Alertas em tempo real de golos, convocatórias de bancada, bilhetes e avisos da claque.
                  </Text>
                </View>
              </View>

              <Switch
                value={settings.notifications}
                onValueChange={(val) => updateSetting('notifications', val)}
                trackColor={{
                  false: isDark ? '#22332A' : '#E2E8F0',
                  true: '#00874E',
                }}
                thumbColor={settings.notifications ? '#00E676' : '#94A3B8'}
                ios_backgroundColor={isDark ? '#22332A' : '#E2E8F0'}
              />
            </View>

            {/* Opção 2: NFC do Dispositivo */}
            <View
              style={[
                styles.settingCard,
                !isDark && styles.settingCardLight,
                settings.nfc && styles.settingCardActive,
              ]}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIconBox,
                    settings.nfc
                      ? styles.settingIconBoxActive
                      : styles.settingIconBoxInactive,
                  ]}
                >
                  <Nfc
                    size={18}
                    color={settings.nfc ? '#00E676' : isDark ? '#7E9187' : '#94A3B8'}
                  />
                </View>
                <View style={styles.settingTextCol}>
                  <View style={styles.settingTitleRow}>
                    <Text style={[styles.settingTitle, !isDark && styles.textDark]}>
                      2. NFC do Dispositivo
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        settings.nfc
                          ? styles.statusPillActive
                          : styles.statusPillInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          settings.nfc
                            ? styles.statusPillTextActive
                            : styles.statusPillTextInactive,
                        ]}
                      >
                        {settings.nfc ? 'Ativo' : 'Desativado'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.settingDesc, !isDark && styles.textMutedDark]}>
                    Leitura por aproximação nos torniquetes dos Arcos e validação de presença no estádio.
                  </Text>
                </View>
              </View>

              <Switch
                value={settings.nfc}
                onValueChange={(val) => updateSetting('nfc', val)}
                trackColor={{
                  false: isDark ? '#22332A' : '#E2E8F0',
                  true: '#00874E',
                }}
                thumbColor={settings.nfc ? '#00E676' : '#94A3B8'}
                ios_backgroundColor={isDark ? '#22332A' : '#E2E8F0'}
              />
            </View>

            {/* Opção 3: Acesso ao Som */}
            <View
              style={[
                styles.settingCard,
                !isDark && styles.settingCardLight,
                settings.sound && styles.settingCardActive,
              ]}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIconBox,
                    settings.sound
                      ? styles.settingIconBoxActive
                      : styles.settingIconBoxInactive,
                  ]}
                >
                  {settings.sound ? (
                    <Volume2 size={18} color="#00E676" />
                  ) : (
                    <VolumeX size={18} color={isDark ? '#7E9187' : '#94A3B8'} />
                  )}
                </View>
                <View style={styles.settingTextCol}>
                  <View style={styles.settingTitleRow}>
                    <Text style={[styles.settingTitle, !isDark && styles.textDark]}>
                      3. Acesso ao Som
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        settings.sound
                          ? styles.statusPillActive
                          : styles.statusPillInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          settings.sound
                            ? styles.statusPillTextActive
                            : styles.statusPillTextInactive,
                        ]}
                      >
                        {settings.sound ? 'Ligado' : 'Mudo'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.settingDesc, !isDark && styles.textMutedDark]}>
                    Efeitos sonoros da aplicação, hino oficial e reprodução interativa de cânticos da bancada.
                  </Text>
                </View>
              </View>

              <Switch
                value={settings.sound}
                onValueChange={(val) => updateSetting('sound', val)}
                trackColor={{
                  false: isDark ? '#22332A' : '#E2E8F0',
                  true: '#00874E',
                }}
                thumbColor={settings.sound ? '#00E676' : '#94A3B8'}
                ios_backgroundColor={isDark ? '#22332A' : '#E2E8F0'}
              />
            </View>

            {/* Banner de feedback salvo */}
            <View style={styles.feedbackContainer}>
              {hasSavedFeedback ? (
                <View style={styles.savedToast}>
                  <CheckCircle2 size={13} color="#00E676" />
                  <Text style={styles.savedToastText}>Preferência gravada com sucesso!</Text>
                </View>
              ) : (
                <View style={styles.persistenceInfoRow}>
                  <ShieldCheck size={13} color="#8FA89B" />
                  <Text style={styles.persistenceInfoText}>
                    Definições guardadas automaticamente no teu dispositivo.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Rodapé */}
          <View style={[styles.modalFooter, !isDark && styles.modalFooterLight]}>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>Concluir</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#0D1612',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.25)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 230, 118, 0.15)',
      },
    }),
  },
  modalCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalHeaderLight: {
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: '#8FA89B',
    fontSize: 12,
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalBody: {
    flexGrow: 0,
  },
  modalBodyContent: {
    padding: 20,
    gap: 14,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#121F19',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
  },
  settingCardLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  settingCardActive: {
    borderColor: 'rgba(0, 230, 118, 0.25)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  settingIconBoxActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
  },
  settingIconBoxInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingTextCol: {
    flex: 1,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  settingTitle: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  statusPillInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  statusPillTextActive: {
    color: '#00E676',
  },
  statusPillTextInactive: {
    color: '#8FA89B',
  },
  settingDesc: {
    color: '#8FA89B',
    fontSize: 11,
    lineHeight: 15,
  },
  feedbackContainer: {
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  savedToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  savedToastText: {
    color: '#00E676',
    fontSize: 11,
    fontWeight: '700',
  },
  persistenceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  persistenceInfoText: {
    color: '#6B8577',
    fontSize: 11,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'flex-end',
  },
  modalFooterLight: {
    borderTopColor: 'rgba(0, 135, 78, 0.12)',
  },
  doneBtn: {
    backgroundColor: '#00874E',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00E676',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 135, 78, 0.35)',
      },
    }),
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});
