import React, { useState, useEffect, memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  useWindowDimensions,
} from 'react-native';
import {
  X,
  Smartphone,
  Download,
  Share,
  SquarePlus,
  Sparkles,
  CircleCheckBig,
  ArrowUpRight,
  ShieldCheck,
  Layers,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

function PwaInstallPromptModal({ visible, onClose, isDark = true }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;

  const [platformType, setPlatformType] = useState('android'); // 'ios' | 'android' | 'desktop'
  const [canInstallDirectly, setCanInstallDirectly] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Detetar se já está a correr como PWA Standalone
    const isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(isInstalled);

    // Detetar Sistema Operativo do Smartphone
    const userAgent = window.navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(userAgent);

    if (isIOS) {
      setPlatformType('ios');
    } else if (isAndroid) {
      setPlatformType('android');
    } else {
      setPlatformType('desktop');
    }

    // Verificar se o evento de instalação direta do Chrome/Edge está disponível
    if (window.deferredPrompt) {
      setCanInstallDirectly(true);
    }

    const handlePromptReady = () => {
      setCanInstallDirectly(true);
    };

    window.addEventListener('pwa-installable', handlePromptReady);
    return () => {
      window.removeEventListener('pwa-installable', handlePromptReady);
    };
  }, []);

  const handleInstallClick = async () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.deferredPrompt) {
      const promptEvent = window.deferredPrompt;
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] Utilizador aceitou instalar');
        setCanInstallDirectly(false);
        onClose();
      }
      window.deferredPrompt = null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            !isDark && styles.modalContainerLight,
            isTablet && styles.modalContainerTablet,
          ]}
        >
          {/* Header */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerTitleRow}>
              <View style={styles.appIconBadge}>
                <Image
                  source={require('../../assets/icon.png')}
                  style={styles.appIconImg}
                  resizeMode="contain"
                />
              </View>
              <View>
                <View style={styles.titleWithBadge}>
                  <Text style={[styles.title, !isDark && styles.textDark]}>
                    Instalar Grupo 39
                  </Text>
                  <View style={styles.pwaBadge}>
                    <Text style={styles.pwaBadgeText}>PWA APP</Text>
                  </View>
                </View>
                <Text style={[styles.subtitle, !isDark && styles.textMutedDark]}>
                  Rio Ave FC · Claque Oficial
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              activeOpacity={0.7}
              accessibilityLabel="Fechar"
            >
              <X size={18} color={isDark ? '#FFF' : '#14201A'} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Se já estiver instalada */}
            {isStandalone && (
              <View style={styles.alreadyInstalledBox}>
                <CircleCheckBig size={18} color="#00B368" />
                <Text style={styles.alreadyInstalledText}>
                  A aplicação já está instalada no teu ecrã inicial!
                </Text>
              </View>
            )}

            {/* Vantagens */}
            <View style={[styles.benefitsGrid, !isDark && styles.benefitsGridLight]}>
              <View style={styles.benefitItem}>
                <CircleCheckBig size={14} color="#00B368" />
                <Text style={[styles.benefitText, !isDark && styles.textDark]}>
                  Ecrã inteiro sem barras de URL
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <CircleCheckBig size={14} color="#00B368" />
                <Text style={[styles.benefitText, !isDark && styles.textDark]}>
                  Acesso ultra-rápido com 1 toque
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <CircleCheckBig size={14} color="#00B368" />
                <Text style={[styles.benefitText, !isDark && styles.textDark]}>
                  Não ocupa armazenamento das lojas
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <CircleCheckBig size={14} color="#00B368" />
                <Text style={[styles.benefitText, !isDark && styles.textDark]}>
                  Atualizações automáticas em tempo real
                </Text>
              </View>
            </View>

            {/* Seletor de Instruções (iOS Safari vs Android Chrome) */}
            <View style={[styles.platformTabs, !isDark && styles.platformTabsLight]}>
              <TouchableOpacity
                style={[
                  styles.platformTab,
                  platformType === 'ios' && styles.platformTabActive,
                  !isDark && platformType === 'ios' && styles.platformTabActiveLight,
                ]}
                onPress={() => setPlatformType('ios')}
                activeOpacity={0.7}
              >
                <Smartphone size={14} color={platformType === 'ios' ? '#00B368' : (isDark ? '#7E9187' : '#5A6E63')} />
                <Text
                  style={[
                    styles.platformTabText,
                    platformType === 'ios' && styles.platformTabTextActive,
                    !isDark && styles.textDark,
                  ]}
                >
                  iPhone (Safari)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.platformTab,
                  platformType === 'android' && styles.platformTabActive,
                  !isDark && platformType === 'android' && styles.platformTabActiveLight,
                ]}
                onPress={() => setPlatformType('android')}
                activeOpacity={0.7}
              >
                <Download size={14} color={platformType === 'android' ? '#00B368' : (isDark ? '#7E9187' : '#5A6E63')} />
                <Text
                  style={[
                    styles.platformTabText,
                    platformType === 'android' && styles.platformTabTextActive,
                    !isDark && styles.textDark,
                  ]}
                >
                  Android (Chrome)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Instruções para iPhone / Safari */}
            {platformType === 'ios' && (
              <View style={styles.instructionsWrapper}>
                <Text style={[styles.instructionsTitle, !isDark && styles.textDark]}>
                  Como instalar no Safari do iPhone:
                </Text>

                <View style={[styles.stepCard, !isDark && styles.stepCardLight]}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={[styles.stepTitle, !isDark && styles.textDark]}>
                      Toca no botão de Partilhar
                    </Text>
                    <Text style={[styles.stepDescription, !isDark && styles.textMutedDark]}>
                      Na barra inferior do Safari, toca no ícone de partilha:
                    </Text>
                    <View style={styles.inlineIconBox}>
                      <Share size={16} color="#00874E" />
                      <Text style={styles.inlineIconText}>Ícone de Partilha [↑]</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.stepCard, !isDark && styles.stepCardLight]}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={[styles.stepTitle, !isDark && styles.textDark]}>
                      Adicionar ao Ecrã Principal
                    </Text>
                    <Text style={[styles.stepDescription, !isDark && styles.textMutedDark]}>
                      Desliza a lista para baixo e seleciona:
                    </Text>
                    <View style={styles.inlineIconBox}>
                      <SquarePlus size={16} color="#00874E" />
                      <Text style={styles.inlineIconText}>"Adicionar ao Ecrã Principal"</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.stepCard, !isDark && styles.stepCardLight]}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={[styles.stepTitle, !isDark && styles.textDark]}>
                      Confirmar Adicionar
                    </Text>
                    <Text style={[styles.stepDescription, !isDark && styles.textMutedDark]}>
                      No canto superior direito, toca em <Text style={{ fontWeight: '800' }}>Adicionar</Text>. O ícone do Grupo 39 fica pronto no teu ecrã!
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Instruções para Android / Chrome */}
            {platformType === 'android' && (
              <View style={styles.instructionsWrapper}>
                {canInstallDirectly ? (
                  <View style={styles.directInstallBox}>
                    <Text style={styles.directInstallTitle}>
                      Instalação direta disponível!
                    </Text>
                    <Text style={styles.directInstallDesc}>
                      Podes instalar a aplicação agora com um único toque.
                    </Text>
                    <TouchableOpacity
                      style={styles.directInstallBtn}
                      onPress={handleInstallClick}
                      activeOpacity={0.85}
                    >
                      <Download size={18} color="#FFF" />
                      <Text style={styles.directInstallBtnText}>
                        Instalar Aplicação Agora
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Text style={[styles.instructionsTitle, !isDark && styles.textDark]}>
                      Como instalar no Google Chrome:
                    </Text>

                    <View style={[styles.stepCard, !isDark && styles.stepCardLight]}>
                      <View style={styles.stepNumberBadge}>
                        <Text style={styles.stepNumberText}>1</Text>
                      </View>
                      <View style={styles.stepInfo}>
                        <Text style={[styles.stepTitle, !isDark && styles.textDark]}>
                          Abre o menu do Chrome
                        </Text>
                        <Text style={[styles.stepDescription, !isDark && styles.textMutedDark]}>
                          Toca nos <Text style={{ fontWeight: '800' }}>três pontos (⋮)</Text> no canto superior direito do teu navegador.
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.stepCard, !isDark && styles.stepCardLight]}>
                      <View style={styles.stepNumberBadge}>
                        <Text style={styles.stepNumberText}>2</Text>
                      </View>
                      <View style={styles.stepInfo}>
                        <Text style={[styles.stepTitle, !isDark && styles.textDark]}>
                          Instalar aplicação
                        </Text>
                        <Text style={[styles.stepDescription, !isDark && styles.textMutedDark]}>
                          Toca em <Text style={{ fontWeight: '800' }}>"Instalar aplicação"</Text> ou <Text style={{ fontWeight: '800' }}>"Adicionar ao ecrã inicial"</Text>.
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.stepCard, !isDark && styles.stepCardLight]}>
                      <View style={styles.stepNumberBadge}>
                        <Text style={styles.stepNumberText}>3</Text>
                      </View>
                      <View style={styles.stepInfo}>
                        <Text style={[styles.stepTitle, !isDark && styles.textDark]}>
                          Tudo pronto!
                        </Text>
                        <Text style={[styles.stepDescription, !isDark && styles.textMutedDark]}>
                          A aplicação do Grupo 39 abre como app independente sem o navegador.
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            )}

            {/* Instruções para Computador / Desktop */}
            {platformType === 'desktop' && (
              <View style={styles.instructionsWrapper}>
                <Text style={[styles.instructionsTitle, !isDark && styles.textDark]}>
                  No teu computador (Chrome / Edge / Safari):
                </Text>
                <View style={[styles.stepCard, !isDark && styles.stepCardLight]}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={[styles.stepTitle, !isDark && styles.textDark]}>
                      Ícone na Barra de Endereço
                    </Text>
                    <Text style={[styles.stepDescription, !isDark && styles.textMutedDark]}>
                      Clica no ícone de computador com seta ou no símbolo de <Text style={{ fontWeight: '800' }}>[+]</Text> no canto direito da barra de endereço e escolhe "Instalar".
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Botão de Fechar no Rodapé */}
          <View style={[styles.footer, !isDark && styles.footerLight]}>
            <TouchableOpacity
              style={styles.understandBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.understandBtnText}>Entendido</Text>
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
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '88%',
    backgroundColor: '#121A15',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 179, 104, 0.2)',
      },
    }),
  },
  modalContainerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.25)',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  modalContainerTablet: {
    maxWidth: 520,
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
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00B368',
  },
  appIconImg: {
    width: 44,
    height: 44,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  pwaBadge: {
    backgroundColor: 'rgba(0, 179, 104, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00B368',
  },
  pwaBadgeText: {
    color: '#00B368',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
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
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 14,
  },
  alreadyInstalledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    borderWidth: 1,
    borderColor: '#00B368',
    borderRadius: 10,
    padding: 10,
  },
  alreadyInstalledText: {
    color: '#00B368',
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
  },
  benefitsGrid: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 12,
    gap: 8,
  },
  benefitsGridLight: {
    backgroundColor: '#F5FBF7',
    borderColor: 'rgba(0, 135, 78, 0.12)',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
  platformTabs: {
    flexDirection: 'row',
    backgroundColor: '#0D1410',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 4,
  },
  platformTabsLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  platformTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
    gap: 6,
  },
  platformTabActive: {
    backgroundColor: 'rgba(0, 179, 104, 0.22)',
    borderWidth: 1,
    borderColor: '#00B368',
  },
  platformTabActiveLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00874E',
  },
  platformTabText: {
    color: '#7E9187',
    fontSize: 12,
    fontWeight: '700',
  },
  platformTabTextActive: {
    color: '#00B368',
    fontWeight: '900',
  },
  instructionsWrapper: {
    gap: 10,
  },
  instructionsTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#16221B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 12,
  },
  stepCardLight: {
    backgroundColor: '#F9FDFB',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
  stepInfo: {
    flex: 1,
    gap: 3,
  },
  stepTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stepDescription: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  inlineIconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  inlineIconText: {
    color: '#00874E',
    fontSize: 11,
    fontWeight: '800',
  },
  directInstallBox: {
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    borderWidth: 1,
    borderColor: '#00B368',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  directInstallTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
  },
  directInstallDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  directInstallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00874E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 135, 78, 0.4)',
      },
    }),
  },
  directInstallBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  footer: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerLight: {
    borderTopColor: 'rgba(0, 135, 78, 0.12)',
  },
  understandBtn: {
    backgroundColor: '#00874E',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  understandBtnText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  textDark: {
    color: '#14201A',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});

export default memo(PwaInstallPromptModal);
