import React, { useState, useEffect, useMemo } from 'react';
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
  BellRing,
  IdCard,
  Flame,
  ShoppingBag,
  MapPin,
  ChevronRight,
  CheckCheck,
  CircleCheckBig,
  Send,
  Clock,
  Pin,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { useAlerts } from '../context/AlertsContext';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendSmartphoneNotification,
} from '../services/notificationService';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'jogo', label: 'Dia de Jogo' },
  { id: 'bancada', label: 'Bancada' },
  { id: 'quota', label: 'Quotas' },
  { id: 'loja', label: 'Loja' },
];

function getAlertVisuals(alert, isDark) {
  switch (alert.category) {
    case 'jogo':
      return {
        Icon: MapPin,
        accent: '#FF6B6B',
        badgeBg: isDark ? 'rgba(255, 82, 82, 0.2)' : 'rgba(220, 38, 38, 0.1)',
        badgeText: isDark ? '#FF9A9A' : '#C62828',
      };
    case 'bancada':
      return {
        Icon: Flame,
        accent: '#00E676',
        badgeBg: isDark ? 'rgba(0, 179, 104, 0.2)' : 'rgba(0, 135, 78, 0.1)',
        badgeText: isDark ? '#00E676' : '#00874E',
      };
    case 'quota':
      return {
        Icon: IdCard,
        accent: '#00B368',
        badgeBg: isDark ? 'rgba(0, 179, 104, 0.18)' : 'rgba(0, 135, 78, 0.1)',
        badgeText: isDark ? '#00E676' : '#00874E',
      };
    case 'loja':
      return {
        Icon: ShoppingBag,
        accent: '#38BDF8',
        badgeBg: isDark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(2, 132, 199, 0.1)',
        badgeText: isDark ? '#7DD3FC' : '#0369A1',
      };
    default:
      return {
        Icon: Bell,
        accent: COLORS.primaryLight,
        badgeBg: isDark ? 'rgba(0, 179, 104, 0.18)' : 'rgba(0, 135, 78, 0.1)',
        badgeText: isDark ? COLORS.primaryLight : '#00874E',
      };
  }
}

export default function AlertasModal({
  visible,
  onClose,
  onSelectAction,
  isDark = true,
}) {
  const {
    alerts,
    unreadCount,
    selectedCategoryFilter,
    markAsRead,
    markAllAsRead,
  } = useAlerts();

  const [activeFilter, setActiveFilter] = useState('all');
  const [permStatus, setPermStatus] = useState('default');

  useEffect(() => {
    if (visible) {
      setActiveFilter(selectedCategoryFilter || 'all');
      setPermStatus(getNotificationPermission());
    }
  }, [visible, selectedCategoryFilter]);

  const filteredAlerts = useMemo(() => {
    const base =
      activeFilter === 'all'
        ? alerts
        : alerts.filter((a) => a.category === activeFilter);
    return [...base].sort((a, b) => {
      if (Boolean(b.pinned) !== Boolean(a.pinned)) {
        return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
      }
      if (a.isRead !== b.isRead) {
        return Number(a.isRead) - Number(b.isRead);
      }
      return 0;
    });
  }, [alerts, activeFilter]);

  const handleActivatePush = async () => {
    const res = await requestNotificationPermission();
    setPermStatus(res);
    if (res === 'granted') {
      sendSmartphoneNotification('🟢⚪️ Alertas Grupo 39 Ativos!', {
        body: 'Receberás comunicados da claque, avisos de dia de jogo e golos no teu smartphone.',
      });
    }
  };

  const handleTestNotification = async () => {
    await sendSmartphoneNotification('⚽️ GOLO DO RIO AVE FC!', {
      body: 'Golaço nos Arcos! A Bancada Poente do Grupo 39 em festa!',
      tag: 'test-goal',
    });
  };

  const handleCardPress = (item) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
  };

  const handleActionPress = (item) => {
    markAsRead(item.id);
    onClose();
    if (onSelectAction && item.actionType) {
      onSelectAction(item.actionType, item);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, !isDark && styles.modalContentLight]}>
          {/* Header Unificado */}
          <View style={[styles.modalHeader, !isDark && styles.modalHeaderLight]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.headerIconWrapper, !isDark && styles.headerIconWrapperLight]}>
                <Bell size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
              </View>
              <View style={styles.headerTextCol}>
                <View style={styles.headerTitleLine}>
                  <Text style={[styles.headerTitle, !isDark && styles.textDark]} numberOfLines={1}>
                    Alertas & Comunicados
                  </Text>
                  {unreadCount > 0 && (
                    <View style={styles.headerUnreadPill}>
                      <Text style={styles.headerUnreadText}>{unreadCount} novos</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.headerSubtitle, !isDark && styles.textMutedDark]} numberOfLines={1}>
                  Central Oficial do Grupo 39
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.closeButton, !isDark && styles.closeButtonLight]}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel="Fechar alertas"
            >
              <X size={18} color={isDark ? '#FFF' : '#333'} />
            </TouchableOpacity>
          </View>

          {/* Barra de Filtros + Marcar Todos como Lidos */}
          <View style={[styles.filtersBar, !isDark && styles.filtersBarLight]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScrollContent}
            >
              {CATEGORY_FILTERS.map((cat) => {
                const isSelected = activeFilter === cat.id;
                const count =
                  cat.id === 'all'
                    ? alerts.length
                    : alerts.filter((a) => a.category === cat.id).length;
                if (cat.id !== 'all' && count === 0) return null;

                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.filterChip,
                      !isDark && styles.filterChipLight,
                      isSelected && styles.filterChipActive,
                    ]}
                    onPress={() => setActiveFilter(cat.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        !isDark && styles.filterChipTextLight,
                        isSelected && styles.filterChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {unreadCount > 0 && (
              <TouchableOpacity
                style={[styles.markAllBtn, !isDark && styles.markAllBtnLight]}
                onPress={markAllAsRead}
                activeOpacity={0.75}
              >
                <CheckCheck size={13} color={isDark ? '#00E676' : '#00874E'} />
                <Text style={[styles.markAllText, !isDark && { color: '#00874E' }]}>
                  Ler todos
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Corpo Scrollável */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Card Compacto de Notificações Push no Smartphone */}
            {isNotificationSupported() && (
              <View style={[styles.pushCompactCard, !isDark && styles.pushCompactCardLight]}>
                <View style={styles.pushLeft}>
                  <View style={[styles.pushIconCircle, !isDark && styles.pushIconCircleLight]}>
                    {permStatus === 'granted' ? (
                      <CircleCheckBig size={15} color="#00E676" />
                    ) : (
                      <BellRing size={15} color={isDark ? '#00E676' : '#00874E'} />
                    )}
                  </View>
                  <View style={styles.pushTextCol}>
                    <Text style={[styles.pushTitle, !isDark && styles.textDark]} numberOfLines={1}>
                      {permStatus === 'granted'
                        ? 'Alertas no Smartphone Ativos'
                        : 'Ativar Alertas no Smartphone'}
                    </Text>
                    <Text style={[styles.pushSub, !isDark && styles.textMutedDark]} numberOfLines={1}>
                      {permStatus === 'denied'
                        ? 'Permissão bloqueada nas definições do browser'
                        : permStatus === 'granted'
                        ? 'Recebes avisos de golos e comunicados'
                        : 'Recebe avisos urgentes da claque em tempo real'}
                    </Text>
                  </View>
                </View>

                {permStatus === 'granted' ? (
                  <TouchableOpacity
                    style={[styles.pushTestBtn, !isDark && styles.pushTestBtnLight]}
                    onPress={handleTestNotification}
                    activeOpacity={0.8}
                  >
                    <Send size={11} color={isDark ? '#00E676' : '#00874E'} />
                    <Text style={[styles.pushTestText, !isDark && { color: '#00874E' }]}>
                      Testar
                    </Text>
                  </TouchableOpacity>
                ) : permStatus !== 'denied' ? (
                  <TouchableOpacity
                    style={styles.pushEnableBtn}
                    onPress={handleActivatePush}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.pushEnableText}>Ativar</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            {/* Lista de Comunicados */}
            {filteredAlerts.map((item) => {
              const { Icon, accent, badgeBg, badgeText } = getAlertVisuals(item, isDark);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.alertCard,
                    !isDark && styles.alertCardLight,
                    !item.isRead && styles.alertCardUnread,
                    !item.isRead && !isDark && styles.alertCardUnreadLight,
                    { borderLeftColor: accent },
                  ]}
                  onPress={() => handleCardPress(item)}
                  activeOpacity={0.88}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardBadgesGroup}>
                      <View style={[styles.cardBadge, { backgroundColor: badgeBg }]}>
                        <Text style={[styles.cardBadgeText, { color: badgeText }]}>
                          {item.badge}
                        </Text>
                      </View>
                      {item.pinned && (
                        <View style={[styles.pinnedChip, !isDark && styles.pinnedChipLight]}>
                          <Pin size={9} color={isDark ? '#D5E4DC' : '#4A5D53'} />
                          <Text style={[styles.pinnedChipText, !isDark && styles.textMutedDark]}>
                            Fixado
                          </Text>
                        </View>
                      )}
                      {!item.isRead && (
                        <View style={styles.unreadDotPill}>
                          <View style={[styles.unreadDot, { backgroundColor: accent }]} />
                          <Text style={[styles.unreadLabel, { color: badgeText }]}>Novo</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.cardTimeRow}>
                      <Clock size={10} color={isDark ? '#7E9187' : '#6A7E74'} />
                      <Text style={[styles.cardTimeText, !isDark && styles.textMutedDark]}>
                        {item.timeLabel}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardTitleRow}>
                    <Icon size={15} color={accent} style={{ marginTop: 2 }} />
                    <Text style={[styles.cardTitle, !isDark && styles.textDark]}>
                      {item.title}
                    </Text>
                  </View>

                  <Text style={[styles.cardDesc, !isDark && styles.cardDescLight]}>
                    {item.description}
                  </Text>

                  {item.actionLabel && (
                    <TouchableOpacity
                      style={[styles.cardActionBtn, !isDark && styles.cardActionBtnLight]}
                      onPress={() => handleActionPress(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.cardActionText, !isDark && { color: '#00874E' }]}>
                        {item.actionLabel}
                      </Text>
                      <ChevronRight size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.modalFooter, !isDark && styles.modalFooterLight]}>
            <TouchableOpacity
              style={styles.closeFooterBtn}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={styles.closeFooterBtnText}>Fechar</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  modalContent: {
    width: '100%',
    maxWidth: 450,
    maxHeight: '88%',
    backgroundColor: '#121A15',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 14px 40px rgba(0,0,0,0.65)',
      },
    }),
  },
  modalContentLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D4E6DC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalHeaderLight: {
    borderBottomColor: '#E6ECE8',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  headerIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 179, 104, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconWrapperLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
  },
  headerUnreadPill: {
    backgroundColor: 'rgba(255, 82, 82, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 118, 118, 0.5)',
    paddingHorizontal: 6.5,
    paddingVertical: 1.5,
    borderRadius: 999,
  },
  headerUnreadText: {
    color: '#FF9A9A',
    fontSize: 9.5,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#9BB0A5',
    fontSize: 11,
    marginTop: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonLight: {
    backgroundColor: '#F0F4F1',
  },
  filtersBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    gap: 8,
  },
  filtersBarLight: {
    backgroundColor: '#F8FAF9',
    borderBottomColor: '#E6ECE8',
  },
  filtersScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D6E3DC',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: '#00C86F',
  },
  filterChipText: {
    color: '#B8C9C0',
    fontSize: 11,
    fontWeight: '700',
  },
  filterChipTextLight: {
    color: '#4A5D53',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 179, 104, 0.14)',
    flexShrink: 0,
  },
  markAllBtnLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
  },
  markAllText: {
    color: '#00E676',
    fontSize: 10.5,
    fontWeight: '800',
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    padding: 14,
    gap: 11,
  },
  pushCompactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: 'rgba(0, 179, 104, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.28)',
    borderRadius: 13,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  pushCompactCardLight: {
    backgroundColor: '#EEF8F2',
    borderColor: 'rgba(0, 135, 78, 0.22)',
  },
  pushLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  pushIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pushIconCircleLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  pushTextCol: {
    flex: 1,
  },
  pushTitle: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  pushSub: {
    color: '#B5C8BE',
    fontSize: 10,
    marginTop: 1,
  },
  pushEnableBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 9,
  },
  pushEnableText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  pushTestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pushTestBtnLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.3)',
  },
  pushTestText: {
    color: '#00E676',
    fontSize: 10.5,
    fontWeight: '800',
  },
  alertCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftWidth: 3.5,
  },
  alertCardLight: {
    backgroundColor: '#F9FBFA',
    borderColor: '#E1EBE5',
  },
  alertCardUnread: {
    backgroundColor: 'rgba(0, 179, 104, 0.08)',
    borderColor: 'rgba(0, 230, 118, 0.24)',
  },
  alertCardUnreadLight: {
    backgroundColor: '#F3FAF6',
    borderColor: '#C5E3D2',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  cardBadgesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  cardBadge: {
    paddingHorizontal: 7.5,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  pinnedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pinnedChipLight: {
    backgroundColor: '#E9F0EC',
  },
  pinnedChipText: {
    color: '#D5E4DC',
    fontSize: 9,
    fontWeight: '700',
  },
  unreadDotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  unreadLabel: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  cardTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cardTimeText: {
    color: '#8EA398',
    fontSize: 10,
    fontWeight: '600',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginBottom: 5,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    lineHeight: 19,
  },
  cardDesc: {
    color: '#C5D5CC',
    fontSize: 12,
    lineHeight: 17.5,
  },
  cardDescLight: {
    color: '#495E52',
  },
  cardActionBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 179, 104, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 8.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
  },
  cardActionBtnLight: {
    backgroundColor: '#EAF5EE',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  cardActionText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  modalFooter: {
    padding: 13,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalFooterLight: {
    borderTopColor: '#E6ECE8',
  },
  closeFooterBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeFooterBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  textDark: {
    color: '#112219',
  },
  textMutedDark: {
    color: '#5E7266',
  },
});
