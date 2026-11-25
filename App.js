import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Linking,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './src/components/Header';
import LiquidGlassNavBar from './src/components/LiquidGlassNavBar';
import MbWayCheckoutModal from './src/components/MbWayCheckoutModal';
import ReceiptModal from './src/components/ReceiptModal';
import AlertasModal from './src/components/AlertasModal';
import WalletPassModal from './src/components/WalletPassModal';
import ChantsModal from './src/components/ChantsModal';
import PwaInstallPromptModal from './src/components/PwaInstallPromptModal';
import AuthModal from './src/components/AuthModal';
import ForumLoginPromptModal from './src/components/ForumLoginPromptModal';
import AnimatedSplashScreen from './src/components/AnimatedSplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import ApoioScreen from './src/screens/ApoioScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StoreScreen from './src/screens/StoreScreen';
import {
  INITIAL_TRANSACTIONS,
} from './src/data/mockData';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AlertsProvider, useAlerts } from './src/context/AlertsContext';

function MainApp() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;
  const containerMaxWidth = isTablet ? (width >= 1024 ? 760 : 660) : '100%';

  const { theme, isDark, toggleTheme } = useAppTheme();
  const {
    user,
    isLoggedIn,
    authModalVisible,
    authModalOptions,
    openAuthModal,
    closeAuthModal,
    logout,
    updateUser,
  } = useAuth();
  const {
    unreadCount,
    alertsModalVisible,
    openAlertsModal,
    closeAlertsModal,
  } = useAlerts();

  const [activeTab, setActiveTab] = useState('home');
  const [visitedTabs, setVisitedTabs] = useState({ home: true });
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Carregar apenas transações de quotas persistidas da sessão
  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem('@grupo39_transactions')
      .then((stored) => {
        if (stored && isMounted) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const onlyQuotas = parsed.filter(
                (t) =>
                  t.type === 'quota' ||
                  t.category?.toLowerCase().includes('quota') ||
                  t.title?.toLowerCase().includes('quota')
              );
              if (onlyQuotas.length > 0) {
                setTransactions(onlyQuotas);
              }
            }
          } catch (e) {}
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const [accessPromptVisible, setAccessPromptVisible] = useState(false);
  const [accessPromptType, setAccessPromptType] = useState('apoio');
  const [pendingTabAfterLogin, setPendingTabAfterLogin] = useState(null);
  const [isSplashDone, setIsSplashDone] = useState(false);
  const handleSplashFinish = useCallback(() => setIsSplashDone(true), []);

  const handleSelectTab = useCallback((tab) => {
    // Páginas de livre acesso sem login: Início e Loja.
    // Apoio e Perfil requerem autenticação do adepto/sócio.
    if (!isLoggedIn && (tab === 'apoio' || tab === 'profile')) {
      setAccessPromptType(tab);
      setAccessPromptVisible(true);
      return;
    }
    setVisitedTabs((prev) => (prev[tab] ? prev : { ...prev, [tab]: true }));
    setActiveTab(tab);
  }, [isLoggedIn]);

  // Modais
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [walletPassModalVisible, setWalletPassModalVisible] = useState(false);
  const [walletPassType, setWalletPassType] = useState(Platform.OS === 'android' ? 'google' : 'apple');
  const [chantsModalVisible, setChantsModalVisible] = useState(false);
  const [pwaModalVisible, setPwaModalVisible] = useState(false);

  const handleOpenNotifications = useCallback(() => openAlertsModal('all'), [openAlertsModal]);
  const handleNavigateProfile = useCallback(() => handleSelectTab('profile'), [handleSelectTab]);
  const handleOpenChants = useCallback(() => setChantsModalVisible(true), []);
  const handleOpenPwaInstall = useCallback(() => setPwaModalVisible(true), []);
  const handleOpenWalletPass = useCallback((type) => {
    if (typeof type === 'string') {
      setWalletPassType(type);
    }
    setWalletPassModalVisible(true);
  }, []);

  // Iniciar fluxo de checkout MB WAY (Loja Oficial e Quotas)
  const handleCheckout = useCallback((itemData) => {
    setCheckoutData({
      ...itemData,
      phone: user?.phone || '912 345 678',
    });
    setCheckoutModalVisible(true);
  }, [user?.phone]);

  const handleAuthSuccess = useCallback(() => {
    if (authModalOptions?.pendingAction === 'pay_quota') {
      setTimeout(() => {
        handleCheckout({
          title: 'Inscrição de Sócio · Quota Anual 2026/2027',
          category: 'Quota Oficial Grupo 39',
          amount: 12.00,
          originalPrice: 12.00,
          type: 'quota',
          isNewMemberWelcome: true,
          phone: user?.phone || '912 345 678',
        });
      }, 350);
      return;
    }
    if (pendingTabAfterLogin) {
      setActiveTab(pendingTabAfterLogin);
      setPendingTabAfterLogin(null);
    }
  }, [authModalOptions, handleCheckout, pendingTabAfterLogin, user?.phone]);

  const handleLogout = useCallback(async () => {
    await logout();
    setActiveTab('home');
  }, [logout]);

  // Iniciar fluxo de regularização de quota
  const handlePayQuota = useCallback((itemData) => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    setCheckoutData({
      ...itemData,
      phone: user?.phone || '912 345 678',
    });
    setCheckoutModalVisible(true);
  }, [isLoggedIn, openAuthModal, user?.phone]);

  // Callback de sucesso no pagamento MB WAY
  const handlePaymentSuccess = useCallback((newTx) => {
    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      AsyncStorage.setItem('@grupo39_transactions', JSON.stringify(updated)).catch(() => {});
      return updated;
    });

    // Se o pagamento for de quota, atualizar estado do cartão digital do sócio
    if (newTx.type === 'quota') {
      updateUser({
        quotaStatus: 'em_dia',
        quotaPendingPeriod: 'Época 2026/2027 Regularizada',
        quotaPendingMonth: 'Época 2026/2027 Regularizada',
        memberCategory: 'Sócio Efetivo (Bancada Poente)',
      });
    }
  }, [updateUser]);

  // Ver recibo/comprovativo oficial
  const handleViewReceipt = useCallback((tx) => {
    setSelectedReceipt(tx);
    setReceiptModalVisible(true);
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgDark }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bgDark}
      />

      <View
        style={[
          styles.appContainer,
          { maxWidth: containerMaxWidth, backgroundColor: theme.bgDark },
          !isTablet && styles.appContainerMobile,
          !isDark && styles.appContainerLight,
          !isDark && !isTablet && styles.appContainerMobileLight,
        ]}
      >
        {/* Cabeçalho Superior: visível apenas na aba Principal (Início) */}
        <Header
          onOpenNotifications={handleOpenNotifications}
          unreadCount={unreadCount}
          visible={activeTab === 'home'}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          isLoggedIn={isLoggedIn}
          onOpenAuth={openAuthModal}
          onNavigateProfile={handleNavigateProfile}
        />

        {/* Ecrãs Conforme a Aba Ativa com Lazy-Mount & Keep-Alive para Arranque Rápido */}
        <View style={[styles.screenArea, !isDark && styles.screenAreaLight]}>
          <View style={[styles.tabContentPane, activeTab !== 'home' && styles.hiddenPane]}>
            <HomeScreen
              user={user}
              onOpenChants={handleOpenChants}
              isDark={isDark}
              isActive={activeTab === 'home'}
              isLoggedIn={isLoggedIn}
            />
          </View>

          {visitedTabs.apoio && (
            <View style={[styles.tabContentPane, activeTab !== 'apoio' && styles.hiddenPane]}>
              <ApoioScreen
                user={user}
                isDark={isDark}
                isActive={activeTab === 'apoio'}
              />
            </View>
          )}

          {visitedTabs.store && (
            <View style={[styles.tabContentPane, activeTab !== 'store' && styles.hiddenPane]}>
              <StoreScreen
                isDark={isDark}
                isActive={activeTab === 'store'}
              />
            </View>
          )}

          {visitedTabs.profile && (
            <View style={[styles.tabContentPane, activeTab !== 'profile' && styles.hiddenPane]}>
              <ProfileScreen
                user={user}
                transactions={transactions}
                onPayQuota={handlePayQuota}
                onViewReceipt={handleViewReceipt}
                onOpenWalletPass={handleOpenWalletPass}
                isDark={isDark}
                onOpenPwaInstall={handleOpenPwaInstall}
                isLoggedIn={isLoggedIn}
                onOpenAuth={openAuthModal}
                onLogout={handleLogout}
                onUpdateUser={updateUser}
              />
            </View>
          )}
        </View>

        {/* Barra de Navegação Flutuante Liquid Glass UI */}
        <LiquidGlassNavBar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isDark={isDark}
          isLoggedIn={isLoggedIn}
        />

        {/* Modais montados sob demanda para melhor desempenho em smartphones */}
        {checkoutModalVisible && (
          <MbWayCheckoutModal
            visible={checkoutModalVisible}
            onClose={() => setCheckoutModalVisible(false)}
            checkoutData={checkoutData}
            onPaymentSuccess={handlePaymentSuccess}
            onViewReceipt={handleViewReceipt}
            onGoProfile={() => {
              setCheckoutModalVisible(false);
              handleSelectTab('profile');
            }}
            user={user}
            isDark={isDark}
          />
        )}

        {receiptModalVisible && (
          <ReceiptModal
            visible={receiptModalVisible}
            onClose={() => setReceiptModalVisible(false)}
            transaction={selectedReceipt}
            isDark={isDark}
          />
        )}

        {authModalVisible && (
          <AuthModal
            visible={authModalVisible}
            onClose={() => {
              closeAuthModal();
              setPendingTabAfterLogin(null);
            }}
            isDark={isDark}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {accessPromptVisible && (
          <ForumLoginPromptModal
            visible={accessPromptVisible}
            type={accessPromptType}
            onClose={() => setAccessPromptVisible(false)}
            onOpenLogin={() => {
              setAccessPromptVisible(false);
              setPendingTabAfterLogin(accessPromptType);
              openAuthModal({
                initialTab: 'login',
                message:
                  accessPromptType === 'profile'
                    ? 'Inicia sessão para acederes ao teu Cartão Digital de Sócio e Perfil.'
                    : 'Inicia sessão para acederes ao Assistente de Apoio do Grupo 39.',
              });
            }}
            onOpenRegister={() => {
              setAccessPromptVisible(false);
              setPendingTabAfterLogin(accessPromptType);
              openAuthModal({
                initialTab: 'register',
                message:
                  accessPromptType === 'profile'
                    ? 'Cria a tua conta para teres acesso ao teu Cartão Digital de Sócio e Perfil.'
                    : 'Cria a tua conta para acederes ao Assistente de Apoio do Grupo 39.',
              });
            }}
            isDark={isDark}
          />
        )}

        {walletPassModalVisible && (
          <WalletPassModal
            visible={walletPassModalVisible}
            onClose={() => setWalletPassModalVisible(false)}
            user={user}
            isDark={isDark}
            initialWalletType={walletPassType}
          />
        )}

        {chantsModalVisible && (
          <ChantsModal
            visible={chantsModalVisible}
            onClose={() => setChantsModalVisible(false)}
            isDark={isDark}
          />
        )}

        {pwaModalVisible && (
          <PwaInstallPromptModal
            visible={pwaModalVisible}
            onClose={() => setPwaModalVisible(false)}
            isDark={isDark}
          />
        )}

        {alertsModalVisible && (
          <AlertasModal
            visible={alertsModalVisible}
            onClose={closeAlertsModal}
            isDark={isDark}
            onSelectAction={(action) => {
              if (action === 'pay_quota') {
                handlePayQuota({
                  title: `Quota Anual Grupo 39 · ${user?.quotaPendingPeriod || user?.quotaPendingMonth || 'Época 2026/2027'}`,
                  category: 'Quota Anual de Sócio',
                  amount: user?.quotaAmount || 12.00,
                  type: 'quota',
                });
              } else if (action === 'open_store') {
                handleSelectTab('store');
              } else if (action === 'open_chants') {
                setChantsModalVisible(true);
              } else if (action === 'open_map') {
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Estádio do Rio Ave FC, Vila do Conde')}`;
                if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  window.open(mapUrl, '_blank', 'noopener,noreferrer');
                } else {
                  Linking.openURL(mapUrl).catch(() => {});
                }
              }
            }}
          />
        )}
      </View>

      {/* Animação Inicial de Abertura com o Logótipo Oficial da Claque */}
      {!isSplashDone && (
        <AnimatedSplashScreen onFinish={handleSplashFinish} />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AlertsProvider>
          <MainApp />
        </AlertsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D1310',
    overflow: 'hidden',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#0D1310',
    position: 'relative',
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        height: '100dvh',
        maxHeight: '100dvh',
        boxShadow: '0 0 50px rgba(0, 0, 0, 0.8)',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        overflowX: 'hidden',
      },
    }),
  },
  safeAreaLight: {
    backgroundColor: '#FFFFFF',
  },
  appContainerLight: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.08)',
        borderColor: 'rgba(0, 135, 78, 0.15)',
      },
    }),
  },
  appContainerMobile: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    boxShadow: 'none',
  },
  appContainerMobileLight: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    boxShadow: 'none',
  },
  screenArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  screenAreaLight: {
    backgroundColor: '#FFFFFF',
  },
  tabContentPane: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  hiddenPane: {
    display: 'none',
  },
});
