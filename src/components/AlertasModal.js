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
import {
  X,
  Bell,
  Bus,
  IdCard,
  Flame,
  Ticket,
  ChevronRight,
  ShieldAlert,
  Info,
  Sparkles,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export default function AlertasModal({
  visible,
  onClose,
  onOpenSocio,
  onOpenDeslocacao,
  onOpenJogos,
  isDark = true,
}) {
  const ALERTS = [
    {
      id: 'alert-1',
      type: 'warning',
      badge: 'URGENTE · DESLOCAÇÃO',
      title: 'Autocarro para Alverca (19 Setembro)',
      description:
        'As inscrições para a caravana a Alverca estão a decorrer a ritmo elevado. Os lugares no autocarro oficial são limitados à lotação disponível. Garante o teu bilhete + transporte o quanto antes.',
      actionText: 'Ver Detalhes da Deslocação',
      onPress: () => {
        onClose();
        if (onOpenDeslocacao) onOpenDeslocacao();
      },
      icon: Bus,
      iconColor: '#F2B600',
      badgeBg: 'rgba(242, 182, 0, 0.18)',
      badgeText: '#FFD700',
    },
    {
      id: 'alert-2',
      type: 'socio',
      badge: 'QUOTAS 2026/2027',
      title: 'Regularização de Quotas Obrigatória',
      description:
        'A quota anual de 12,00 € é essencial para garantir o apoio às bancadas e dá direito a descontos exclusivos em bilhetes, autocarros e na Loja Oficial do Grupo 39.',
      actionText: 'Inscrever ou Regularizar Quota',
      onPress: () => {
        onClose();
        if (onOpenSocio) onOpenSocio();
      },
      icon: IdCard,
      iconColor: COLORS.primaryLight,
      badgeBg: 'rgba(0, 179, 104, 0.18)',
      badgeText: COLORS.primaryLight,
    },
    {
      id: 'alert-3',
      type: 'info',
      badge: 'BANCADA POENTE',
      title: 'Regras de Apoio nos Jogos em Casa',
      description:
        'No Estádio dos Arcos, a concentração faz-se na Porta 4. Todos os elementos devem apresentar-se com adereços verdes e brancos, cachecol bem visível e apoiar ativamente os 90 minutos ao ritmo da bateria.',
      actionText: 'Consultar Calendário de Jogos',
      onPress: () => {
        onClose();
        if (onOpenJogos) onOpenJogos();
      },
      icon: Flame,
      iconColor: '#FF5252',
      badgeBg: 'rgba(255, 82, 82, 0.18)',
      badgeText: '#FF7676',
    },
    {
      id: 'alert-4',
      type: 'tech',
      badge: 'PAGAMENTOS',
      title: 'Pagamento Seguro com MB WAY',
      description:
        'Podes adquirir bilhetes e pagar deslocações de forma 100% segura e instantânea na aplicação. Todos os recibos ficam arquivados na tua área pessoal.',
      actionText: null,
      icon: Ticket,
      iconColor: '#00A3E0',
      badgeBg: 'rgba(0, 163, 224, 0.18)',
      badgeText: '#38BDF8',
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, !isDark && styles.modalContentLight]}>
          {/* Header */}
          <View style={[styles.modalHeader, !isDark && styles.modalHeaderLight]}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconWrapper}>
                <Bell size={18} color={COLORS.primaryLight} />
              </View>
              <View>
                <Text style={[styles.headerTitle, !isDark && styles.textDark]}>
                  Alertas & Avisos
                </Text>
                <Text style={[styles.headerSubtitle, !isDark && styles.textMutedDark]}>
                  Comunicados Oficiais do Grupo 39
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.closeButton, !isDark && styles.closeButtonLight]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={18} color={isDark ? '#FFF' : '#333'} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {ALERTS.map((item) => {
              const IconComp = item.icon;
              return (
                <View
                  key={item.id}
                  style={[styles.alertCard, !isDark && styles.alertCardLight]}
                >
                  <View style={styles.cardTopRow}>
                    <View
                      style={[
                        styles.cardBadge,
                        { backgroundColor: item.badgeBg },
                      ]}
                    >
                      <Text style={[styles.cardBadgeText, { color: item.badgeText }]}>
                        {item.badge}
                      </Text>
                    </View>
                    <IconComp size={16} color={item.iconColor} />
                  </View>

                  <Text style={[styles.cardTitle, !isDark && styles.textDark]}>
                    {item.title}
                  </Text>

                  <Text style={[styles.cardDesc, !isDark && styles.cardDescLight]}>
                    {item.description}
                  </Text>

                  {item.actionText && (
                    <TouchableOpacity
                      style={[styles.cardActionBtn, !isDark && styles.cardActionBtnLight]}
                      onPress={item.onPress}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cardActionText}>{item.actionText}</Text>
                      <ChevronRight size={14} color={COLORS.primaryLight} />
                    </TouchableOpacity>
                  )}
                </View>
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
              <Text style={styles.closeFooterBtnText}>Compreendi</Text>
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
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '85%',
    backgroundColor: '#121A15',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
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
    paddingHorizontal: 18,
    paddingVertical: 14,
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
  },
  headerIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
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
    backgroundColor: '#EDF2EE',
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  alertCard: {
    backgroundColor: '#17241D',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  alertCardLight: {
    backgroundColor: '#F5F9F6',
    borderColor: '#DEE8E2',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  cardDescLight: {
    color: '#496053',
  },
  cardActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
  },
  cardActionBtnLight: {
    backgroundColor: '#EAF5EE',
    borderColor: '#BFE3CE',
  },
  cardActionText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  modalFooter: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalFooterLight: {
    borderTopColor: '#E6ECE8',
  },
  closeFooterBtn: {
    backgroundColor: '#00874E',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeFooterBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  textDark: {
    color: '#0E2319',
  },
  textMutedDark: {
    color: '#577263',
  },
});
