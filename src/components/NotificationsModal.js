import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  Bell,
  Ticket,
  CreditCard,
  Bus,
  Sparkles,
  Check,
  BellRing,
  Smartphone,
  CircleCheckBig,
  Send,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendSmartphoneNotification,
} from '../services/notificationService';

export default function NotificationsModal({ visible, onClose, onSelectAction, isDark = true }) {
  const [permStatus, setPermStatus] = useState('default'); // 'default' | 'granted' | 'denied' | 'unsupported'

  useEffect(() => {
    if (visible) {
      setPermStatus(getNotificationPermission());
    }
  }, [visible]);

  const handleActivatePush = async () => {
    const res = await requestNotificationPermission();
    setPermStatus(res);
    if (res === 'granted') {
      sendSmartphoneNotification('🟢⚪️ Notificações Ativas!', {
        body: 'Receberás avisos de golos, autocarros e bilhetes no teu smartphone.',
      });
    }
  };

  const handleTestNotification = async () => {
    await sendSmartphoneNotification('⚽️ GOLO DO RIO AVE FC!', {
      body: 'Golaço nos Arcos! A Bancada Poente do Grupo 39 em festa!',
      tag: 'test-goal',
    });
  };

  const NOTIFICATIONS = [
    {
      id: 'notif-1',
      type: 'payment',
      icon: CreditCard,
      title: 'Quota Anual 2026/2027 a Pagamento',
      desc: 'Evita filas na sede. Regulariza a quota anual (12,50 €) via MB WAY em segundos.',
      time: 'Há 1 hora',
      unread: true,
      action: 'pay_quota',
    },
    {
      id: 'notif-2',
      type: 'ticket',
      icon: Ticket,
      title: 'Bancada Poente: vs Estrela da Amadora',
      desc: 'Segunda-feira nos Arcos às 20h15. 120 bilhetes restantes para sócios G39.',
      time: 'Há 3 horas',
      unread: true,
      action: 'buy_ticket',
    },
    {
      id: 'notif-3',
      type: 'bus',
      icon: Bus,
      title: 'Caravana a Alverca Confirmada',
      desc: 'Autocarro para a 7.ª Jornada a 19 de Setembro com 60% dos lugares reservados.',
      time: 'Ontem',
      unread: false,
      action: 'bus_trip',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, !isDark && styles.containerLight]}>
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerTitleRow}>
              <Bell size={18} color={isDark ? COLORS.gold : '#00874E'} />
              <Text style={[styles.headerTitle, !isDark && styles.textDark]}>
                Avisos da Claque
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={isDark ? COLORS.textSecondary : '#556A5E'} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {/* CARD DE GESTÃO DE NOTIFICAÇÕES NATIVAS DO SMARTPHONE */}
            <View style={[styles.pushCard, !isDark && styles.pushCardLight]}>
              <View style={styles.pushCardHeader}>
                <View style={styles.pushIconBox}>
                  <BellRing size={16} color="#00B368" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.pushCardTitle, !isDark && styles.textDark]}>
                      Notificações no Smartphone
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        permStatus === 'granted'
                          ? styles.statusPillActive
                          : permStatus === 'denied'
                          ? styles.statusPillDenied
                          : styles.statusPillPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          permStatus === 'granted'
                            ? styles.statusTextActive
                            : permStatus === 'denied'
                            ? styles.statusTextDenied
                            : styles.statusTextPending,
                        ]}
                      >
                        {permStatus === 'granted'
                          ? 'ATIVAS'
                          : permStatus === 'denied'
                          ? 'BLOQUEADAS'
                          : 'DISPONÍVEL'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.pushCardDesc, !isDark && styles.textMutedDark]}>
                    Alertas instantâneos de golos, autocarros e bilhetes no ecrã de bloqueio.
                  </Text>
                </View>
              </View>

              {permStatus !== 'granted' ? (
                <TouchableOpacity
                  style={styles.activatePushBtn}
                  onPress={handleActivatePush}
                  activeOpacity={0.85}
                >
                  <Smartphone size={14} color="#FFF" />
                  <Text style={styles.activatePushBtnText}>
                    Ativar Notificações no Dispositivo
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.activePushRow}>
                  <View style={styles.activeCheckRow}>
                    <CircleCheckBig size={14} color="#00B368" />
                    <Text style={styles.activePushText}>
                      Ligação direta ao telemóvel ativa
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.testPushBtn, !isDark && styles.testPushBtnLight]}
                    onPress={handleTestNotification}
                    activeOpacity={0.75}
                  >
                    <Send size={11} color={isDark ? '#00B368' : '#00874E'} />
                    <Text style={[styles.testPushBtnText, !isDark && styles.testPushBtnTextLight]}>
                      Testar
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text style={[styles.sectionSubtitle, !isDark && styles.textMutedDark]}>
              ÚLTIMAS COMUNICAÇÕES
            </Text>

            {NOTIFICATIONS.map((item) => {
              const IconComp = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemCard,
                    !isDark && styles.itemCardLight,
                    item.unread && styles.itemCardUnread,
                    !isDark && item.unread && styles.itemCardUnreadLight,
                  ]}
                  onPress={() => {
                    onClose();
                    if (onSelectAction) onSelectAction(item.action);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.itemIconBox, !isDark && styles.itemIconBoxLight]}>
                    <IconComp size={16} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  </View>
                  <View style={styles.itemContent}>
                    <View style={styles.itemTop}>
                      <Text style={[styles.itemTitle, !isDark && styles.textDark]}>
                        {item.title}
                      </Text>
                      {item.unread && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={[styles.itemDesc, !isDark && styles.textMutedDark]}>
                      {item.desc}
                    </Text>
                    <Text style={[styles.itemTime, !isDark && styles.textMutedDark]}>
                      {item.time}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 8, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#111A15',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    maxHeight: '84%',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
      },
    }),
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
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
    gap: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  pushCard: {
    backgroundColor: '#16231B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    gap: 10,
  },
  pushCardLight: {
    backgroundColor: '#F3F9F5',
    borderColor: 'rgba(0, 135, 78, 0.22)',
  },
  pushCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pushIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pushCardTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  pushCardDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  statusPillActive: {
    backgroundColor: 'rgba(0, 179, 104, 0.2)',
  },
  statusPillPending: {
    backgroundColor: 'rgba(242, 182, 0, 0.2)',
  },
  statusPillDenied: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusPillText: {
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  statusTextActive: {
    color: '#00B368',
  },
  statusTextPending: {
    color: '#F2B600',
  },
  statusTextDenied: {
    color: '#EF4444',
  },
  activatePushBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00874E',
    paddingVertical: 9,
    borderRadius: 10,
  },
  activatePushBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  activePushRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  activeCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activePushText: {
    color: '#00B368',
    fontSize: 11.5,
    fontWeight: '700',
  },
  testPushBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  testPushBtnLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  testPushBtnText: {
    color: '#00B368',
    fontSize: 11,
    fontWeight: '800',
  },
  testPushBtnTextLight: {
    color: '#00874E',
  },
  sectionSubtitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 4,
    marginLeft: 2,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
  },
  itemCardLight: {
    backgroundColor: '#FAFAFA',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  itemCardUnread: {
    backgroundColor: 'rgba(0, 179, 104, 0.06)',
    borderColor: 'rgba(0, 179, 104, 0.25)',
  },
  itemCardUnreadLight: {
    backgroundColor: '#F3F9F5',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  itemIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIconBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
  },
  itemContent: {
    flex: 1,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  itemDesc: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 6,
  },
  itemTime: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryLight,
    marginLeft: 6,
  },
  textDark: {
    color: '#14201A',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});
