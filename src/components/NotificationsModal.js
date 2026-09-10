import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { X, Bell, Ticket, CreditCard, Bus, Sparkles, Check } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export default function NotificationsModal({ visible, onClose, onSelectAction }) {
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
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Bell size={18} color={COLORS.gold} />
              <Text style={styles.headerTitle}>Avisos da Claque</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {NOTIFICATIONS.map((item) => {
              const IconComp = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemCard, item.unread && styles.itemCardUnread]}
                  onPress={() => {
                    onClose();
                    if (onSelectAction) onSelectAction(item.action);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemIconBox}>
                    <IconComp size={16} color={COLORS.primaryLight} />
                  </View>
                  <View style={styles.itemContent}>
                    <View style={styles.itemTop}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      {item.unread && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.itemDesc}>{item.desc}</Text>
                    <Text style={styles.itemTime}>{item.time}</Text>
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
    maxHeight: '80%',
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
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#14201A',
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  itemCardUnread: {
    borderColor: 'rgba(0, 179, 104, 0.3)',
    backgroundColor: '#16241D',
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 135, 78, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
  },
  itemDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 6,
  },
  itemTime: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
});
