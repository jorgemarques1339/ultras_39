import React, { useState, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Header from './src/components/Header';
import LiquidGlassNavBar from './src/components/LiquidGlassNavBar';
import MbWayCheckoutModal from './src/components/MbWayCheckoutModal';
import ReceiptModal from './src/components/ReceiptModal';
import NotificationsModal from './src/components/NotificationsModal';
import WalletPassModal from './src/components/WalletPassModal';
import ChantsModal from './src/components/ChantsModal';
import StoreModal from './src/components/StoreModal';
import HomeScreen from './src/screens/HomeScreen';
import ForumScreen from './src/screens/ForumScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StoreScreen from './src/screens/StoreScreen';
import {
  INITIAL_USER,
  INITIAL_TRANSACTIONS,
  NEXT_MATCH,
} from './src/data/mockData';
import { COLORS } from './src/theme/colors';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';

function MainApp() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;
  const containerMaxWidth = isTablet ? (width >= 1024 ? 760 : 660) : '100%';

  const { theme, isDark, toggleTheme } = useAppTheme();

  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(INITIAL_USER);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Visibilidade do Header ao fazer Scroll com Throttling Otimizado
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback((event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (Math.abs(diff) > 12) {
      if (diff > 0 && currentY > 36) {
        setIsHeaderVisible((prev) => (prev ? false : prev));
      } else if (diff < 0) {
        setIsHeaderVisible((prev) => (!prev ? true : prev));
      }
      lastScrollY.current = currentY;
    }
  }, []);

  const handleSelectTab = useCallback((tab) => {
    setIsHeaderVisible(true);
    lastScrollY.current = 0;
    setActiveTab(tab);
  }, []);

  // Modais
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [walletPassModalVisible, setWalletPassModalVisible] = useState(false);
  const [chantsModalVisible, setChantsModalVisible] = useState(false);
  const [storeModalVisible, setStoreModalVisible] = useState(false);

  // Iniciar fluxo de compra de bilhete
  const handleBuyTicket = useCallback((itemData) => {
    setCheckoutData({
      ...itemData,
      phone: user.phone,
    });
    setCheckoutModalVisible(true);
  }, [user.phone]);

  // Iniciar fluxo de regularização de quota
  const handlePayQuota = useCallback((itemData) => {
    setCheckoutData({
      ...itemData,
      phone: user.phone,
    });
    setCheckoutModalVisible(true);
  }, [user.phone]);

  // Callback de sucesso no pagamento MB WAY
  const handlePaymentSuccess = useCallback((newTx) => {
    setTransactions((prev) => [newTx, ...prev]);

    // Se o pagamento for de quota, atualizar estado do cartão digital do sócio
    if (newTx.type === 'quota') {
      setUser((prev) => ({
        ...prev,
        quotaStatus: 'em_dia',
        quotaPendingPeriod: 'Época 2026/2027 Regularizada',
        quotaPendingMonth: 'Época 2026/2027 Regularizada',
      }));
    }
  }, []);

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
          !isDark && styles.appContainerLight,
        ]}
      >
        {/* Cabeçalho Superior Retrátil com Animação Fluida & Alternador de Tema */}
        <Header
          onOpenNotifications={() => setNotificationsVisible(true)}
          visible={isHeaderVisible}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        {/* Ecrãs Conforme a Aba Ativa com Gestão de Scroll e Keep-Alive de Performance */}
        <View style={[styles.screenArea, !isDark && styles.screenAreaLight]}>
          <View style={[styles.tabContentPane, activeTab !== 'home' && styles.hiddenPane]}>
            <HomeScreen
              user={user}
              onBuyTicket={handleBuyTicket}
              onNavigateTab={handleSelectTab}
              onScroll={handleScroll}
              onOpenChants={() => setChantsModalVisible(true)}
              onOpenStore={() => handleSelectTab('store')}
              isDark={isDark}
            />
          </View>

          <View style={[styles.tabContentPane, activeTab !== 'forum' && styles.hiddenPane]}>
            <ForumScreen
              user={user}
              onBuyTicket={handleBuyTicket}
              onScroll={handleScroll}
              isDark={isDark}
            />
          </View>

          <View style={[styles.tabContentPane, activeTab !== 'store' && styles.hiddenPane]}>
            <StoreScreen
              user={user}
              onCheckoutItem={handleBuyTicket}
              onScroll={handleScroll}
              isDark={isDark}
            />
          </View>

          <View style={[styles.tabContentPane, activeTab !== 'calendar' && styles.hiddenPane]}>
            <CalendarScreen
              onBuyTicket={handleBuyTicket}
              onScroll={handleScroll}
              onBack={() => handleSelectTab('home')}
              isDark={isDark}
            />
          </View>

          <View style={[styles.tabContentPane, activeTab !== 'profile' && styles.hiddenPane]}>
            <ProfileScreen
              user={user}
              transactions={transactions}
              onPayQuota={handlePayQuota}
              onViewReceipt={handleViewReceipt}
              onScroll={handleScroll}
              onOpenWalletPass={() => setWalletPassModalVisible(true)}
              isDark={isDark}
            />
          </View>
        </View>

        {/* Barra de Navegação Flutuante Liquid Glass UI */}
        <LiquidGlassNavBar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isDark={isDark}
        />

        {/* Módulo Especial: Modal de Checkout MB WAY */}
        <MbWayCheckoutModal
          visible={checkoutModalVisible}
          onClose={() => setCheckoutModalVisible(false)}
          checkoutData={checkoutData}
          onPaymentSuccess={handlePaymentSuccess}
          onViewReceipt={handleViewReceipt}
        />

        {/* Modal de Comprovativo Oficial SIBS */}
        <ReceiptModal
          visible={receiptModalVisible}
          onClose={() => setReceiptModalVisible(false)}
          transaction={selectedReceipt}
        />

        {/* Modal de Carteira Digital (Apple & Google Wallet) */}
        <WalletPassModal
          visible={walletPassModalVisible}
          onClose={() => setWalletPassModalVisible(false)}
          user={user}
          isDark={isDark}
        />

        {/* Modal do Cancioneiro Grupo 39 */}
        <ChantsModal
          visible={chantsModalVisible}
          onClose={() => setChantsModalVisible(false)}
          isDark={isDark}
        />

        {/* Modal da Loja Oficial G39 */}
        <StoreModal
          visible={storeModalVisible}
          onClose={() => setStoreModalVisible(false)}
          onCheckoutItem={handleBuyTicket}
        />

        {/* Modal de Notificações / Avisos */}
        <NotificationsModal
          visible={notificationsVisible}
          onClose={() => setNotificationsVisible(false)}
          onSelectAction={(action) => {
            if (action === 'pay_quota') {
              handlePayQuota({
                title: `Quota Anual Grupo 39 · ${user.quotaPendingPeriod || user.quotaPendingMonth || 'Época 2026/2027'}`,
                category: 'Quota Anual de Sócio',
                amount: user.quotaAmount || 12.50,
                type: 'quota',
              });
            } else if (action === 'buy_ticket') {
              handleBuyTicket({
                title: `Bilhete Bancada Grupo 39 · Rio Ave FC vs ${NEXT_MATCH.awayTeam.name}`,
                category: 'Bilhética Oficial RAFC',
                amount: NEXT_MATCH.ticketPriceMember,
                originalPrice: NEXT_MATCH.ticketPricePublic,
                discount: NEXT_MATCH.ticketPricePublic - NEXT_MATCH.ticketPriceMember,
                type: 'ticket',
              });
            } else if (action === 'bus_trip') {
              setActiveTab('home');
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
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
