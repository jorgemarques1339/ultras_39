import React, { useState, useEffect, useRef, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  Image,
} from 'react-native';
import {
  Bell,
  BellOff,
  Nfc,
  Volume2,
  VolumeX,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Settings,
  Sun,
  Moon,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { useAppTheme } from '../context/ThemeContext';
import { useAppSettings } from '../context/AppSettingsContext';

function SettingsScreen({
  isDark: isDarkProp,
  onOpenNotifications,
  unreadCount = 0,
}) {
  const { isDark: contextIsDark, toggleTheme } = useAppTheme();
  const isDark = isDarkProp !== undefined ? isDarkProp : contextIsDark;
  const { appSettings: settings, updateAppSetting } = useAppSettings();

  const [hasSavedFeedback, setHasSavedFeedback] = useState(false);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showSavedToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setHasSavedFeedback(true);
    toastTimerRef.current = setTimeout(() => {
      setHasSavedFeedback(false);
    }, 2000);
  };

  const updateSetting = (key, value) => {
    updateAppSetting(key, value);
    showSavedToast();
  };

  const handleSelectTheme = (targetDark) => {
    if (isDark !== targetDark) {
      toggleTheme();
      showSavedToast();
    }
  };

  return (
    <View style={[styles.container, !isDark && styles.containerLight]}>
      {/* Logótipo de fundo subtil */}
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
      >
        {/* Cabeçalho da Secção */}
        <View style={styles.headerBlock}>
          <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
            <Settings size={20} color={isDark ? '#00E676' : '#00874E'} />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={[styles.pageTitle, !isDark && styles.textDark]}>
              Definições
            </Text>
            <Text style={[styles.pageSubtitle, !isDark && styles.textMutedDark]}>
              Alertas, tema da aplicação e preferências
            </Text>
          </View>
        </View>

        {/* ALERTAS & COMUNICADOS */}
        {onOpenNotifications && (
          <View style={styles.settingsSection}>
            <TouchableOpacity
              style={[styles.settingsBtn, !isDark && styles.settingsBtnLight]}
              onPress={onOpenNotifications}
              activeOpacity={0.85}
            >
              <View style={styles.settingsBtnLeft}>
                <View
                  style={[
                    styles.settingsIconBox,
                    !isDark && styles.settingsIconBoxLight,
                  ]}
                >
                  <Bell size={17} color={isDark ? '#00E676' : '#00874E'} />
                </View>
                <View style={styles.settingsTextWrap}>
                  <View style={styles.settingsTitleRow}>
                    <Text style={[styles.settingsBtnTitle, !isDark && styles.textDark]}>
                      Alertas & Comunicados
                    </Text>
                    {unreadCount > 0 && (
                      <View style={styles.alertsUnreadBadge}>
                        <Text style={styles.alertsUnreadBadgeText}>
                          {unreadCount > 9 ? '9+' : unreadCount}{' '}
                          {unreadCount === 1 ? 'novo' : 'novos'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.settingsBtnSubtitle,
                      !isDark && styles.textMutedDark,
                    ]}
                  >
                    Avisos da claque, convocatórias e notificações
                  </Text>
                </View>
              </View>
              <ChevronRight
                size={16}
                color={isDark ? COLORS.textMuted : '#7E9187'}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* PREFERÊNCIAS DA APP (INLINE) */}
        <View style={styles.preferencesList}>
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
                  Alertas em tempo real de golos, convocatórias de bancada e avisos da claque.
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

          {/* Opção 4: Tema da Aplicação (Branco / Preto) */}
          <View
            style={[
              styles.settingCard,
              styles.themeSettingCard,
              !isDark && styles.settingCardLight,
              styles.settingCardActive,
            ]}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, styles.settingIconBoxActive]}>
                {isDark ? (
                  <Moon size={18} color="#00E676" />
                ) : (
                  <Sun size={18} color="#00874E" />
                )}
              </View>
              <View style={styles.settingTextCol}>
                <View style={styles.settingTitleRow}>
                  <Text style={[styles.settingTitle, !isDark && styles.textDark]}>
                    4. Tema da Aplicação
                  </Text>
                  <View style={[styles.statusPill, styles.statusPillActive]}>
                    <Text style={[styles.statusPillText, styles.statusPillTextActive]}>
                      {isDark ? 'Preto' : 'Branco'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.settingDesc, !isDark && styles.textMutedDark]}>
                  Escolhe entre o tema escuro (Preto) e o tema claro (Branco).
                </Text>
              </View>
            </View>

            <View style={styles.themeOptionsRow}>
              <TouchableOpacity
                style={[
                  styles.themeOptionBtn,
                  !isDark && styles.themeOptionBtnLightBase,
                  !isDark && styles.themeOptionBtnSelected,
                ]}
                onPress={() => handleSelectTheme(false)}
                activeOpacity={0.8}
              >
                <Sun size={14} color={!isDark ? '#FFF' : '#8FA89B'} />
                <Text
                  style={[
                    styles.themeOptionText,
                    !isDark && styles.themeOptionTextSelected,
                  ]}
                >
                  Branco
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOptionBtn,
                  !isDark && styles.themeOptionBtnLightBase,
                  isDark && styles.themeOptionBtnSelected,
                ]}
                onPress={() => handleSelectTheme(true)}
                activeOpacity={0.8}
              >
                <Moon size={14} color={isDark ? '#FFF' : '#556A5E'} />
                <Text
                  style={[
                    styles.themeOptionText,
                    !isDark && styles.themeOptionTextLightBase,
                    isDark && styles.themeOptionTextSelected,
                  ]}
                >
                  Preto
                </Text>
              </TouchableOpacity>
            </View>
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
        </View>
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
    backgroundColor: '#FFFFFF',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  backgroundImage: {
    width: 240,
    height: 240,
    opacity: 0.06,
  },
  backgroundImageLight: {
    opacity: 0.05,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 19, 16, 0.25)',
  },
  backgroundOverlayLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 120,
  },
  headerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBoxLight: {
    backgroundColor: '#E9F6EF',
    borderColor: 'rgba(0, 135, 78, 0.28)',
  },
  headerTextCol: {
    flex: 1,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  pageSubtitle: {
    color: '#8FA89B',
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 2,
  },
  settingsSection: {
    marginBottom: 14,
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121C16',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.28)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
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
    width: 38,
    height: 38,
    borderRadius: 11,
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
  settingsTextWrap: {
    flex: 1,
  },
  settingsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexWrap: 'wrap',
  },
  settingsBtnTitle: {
    color: '#FFF',
    fontSize: 14,
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
    fontSize: 11.5,
    marginTop: 2,
  },
  preferencesList: {
    gap: 12,
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
  themeSettingCard: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
  },
  themeOptionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themeOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
  },
  themeOptionBtnLightBase: {
    backgroundColor: '#EDF3EF',
    borderColor: 'rgba(0, 135, 78, 0.16)',
  },
  themeOptionBtnSelected: {
    backgroundColor: '#00874E',
    borderColor: '#00E676',
  },
  themeOptionText: {
    color: '#8FA89B',
    fontSize: 12,
    fontWeight: '800',
  },
  themeOptionTextLightBase: {
    color: '#556A5E',
  },
  themeOptionTextSelected: {
    color: '#FFFFFF',
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
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});

export default memo(SettingsScreen);
