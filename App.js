import React, { useState } from 'react';
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
import HomeScreen from './src/screens/HomeScreen';
import ForumScreen from './src/screens/ForumScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import {
  INITIAL_USER,
  INITIAL_TRANSACTIONS,
  NEXT_MATCH,
} from './src/data/mockData';
import { COLORS } from './src/theme/colors';

export default function App() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;
  const containerMaxWidth = isTablet ? (width >= 1024 ? 760 : 660) : '100%';

  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(INITIAL_USER);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Modais
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  // Iniciar fluxo de compra de bilhete
  const handleBuyTicket = (itemData) => {
    setCheckoutData({
      ...itemData,
      phone: user.phone,
    });
    setCheckoutModalVisible(true);
  };

  // Iniciar fluxo de regularização de quota
  const handlePayQuota = (itemData) => {
    setCheckoutData({
      ...itemData,
      phone: user.phone,
    });
    setCheckoutModalVisible(true);
  };

  // Callback de sucesso no pagamento MB WAY
  const handlePaymentSuccess = (newTx) => {
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
  };

  // Abrir comprovativo oficial
  const handleViewReceipt = (tx) => {
    setSelectedReceipt(tx);
    setReceiptModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1310" />

      <View style={[styles.appContainer, { maxWidth: containerMaxWidth }]}>
        {/* Cabeçalho Superior Fixo */}
        <Header onOpenNotifications={() => setNotificationsVisible(true)} />

        {/* Ecrãs Conforme a Aba Ativa */}
        <View style={styles.screenArea}>
          {activeTab === 'home' && (
            <HomeScreen
              user={user}
              onBuyTicket={handleBuyTicket}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'forum' && (
            <ForumScreen user={user} onBuyTicket={handleBuyTicket} />
          )}

          {activeTab === 'calendar' && (
            <CalendarScreen onBuyTicket={handleBuyTicket} />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              user={user}
              transactions={transactions}
              onPayQuota={handlePayQuota}
              onViewReceipt={handleViewReceipt}
            />
          )}
        </View>

        {/* Barra de Navegação Flutuante Liquid Glass UI */}
        <LiquidGlassNavBar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
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
  screenArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
});
