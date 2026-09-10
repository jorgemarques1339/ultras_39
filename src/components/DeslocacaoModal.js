import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  Bus,
  MapPin,
  Clock,
  Ticket,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export default function DeslocacaoModal({ visible, onClose, onBuyTicket }) {
  const handleReserve = () => {
    onClose();
    if (onBuyTicket) {
      onBuyTicket({
        title: 'Pack Deslocação Alverca (Autocarro + Bilhete Visitante)',
        category: 'Deslocação Grupo 39',
        amount: 15.0,
        originalPrice: 20.0,
        discount: 5.0,
        type: 'bus',
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header do Modal */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBox}>
                <Bus size={18} color={COLORS.gold} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Deslocação Oficial G39</Text>
                <Text style={styles.headerSubtitle}>Caravana do Rio Ave FC</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Card Principal da Viagem */}
            <View style={styles.mainCard}>
              <View style={styles.badgeRow}>
                <View style={styles.badgeGold}>
                  <Sparkles size={11} color="#000" />
                  <Text style={styles.badgeGoldText}>CARAVANA G39</Text>
                </View>
                <Text style={styles.roundText}>19 de Setembro · 7.ª Jornada</Text>
              </View>

              <Text style={styles.matchTitle}>
                Autocarros para Alverca (FC Alverca vs Rio Ave FC)
              </Text>

              <Text style={styles.matchDesc}>
                Inscrições abertas na sede e pela app! Saída do Estadio dos Arcos às
                11h30. O pack inclui viagem ida/volta em autocarro de turismo + bilhete no
                setor visitante por apenas 15,00 €.
              </Text>

              {/* Itinerário & Detalhes da Viagem */}
              <View style={styles.itineraryBox}>
                <View style={styles.itineraryItem}>
                  <MapPin size={15} color={COLORS.primaryLight} />
                  <View style={styles.itineraryCol}>
                    <Text style={styles.itineraryLabel}>Ponto de Partida</Text>
                    <Text style={styles.itineraryValue}>Estádio dos Arcos</Text>
                  </View>
                </View>

                <View style={styles.itineraryItem}>
                  <Clock size={15} color={COLORS.gold} />
                  <View style={styles.itineraryCol}>
                    <Text style={styles.itineraryLabel}>Horário de Saída</Text>
                    <Text style={styles.itineraryValue}>11h30 (Concentração às 11h00)</Text>
                  </View>
                </View>

                <View style={styles.itineraryItem}>
                  <Ticket size={15} color={COLORS.primaryLight} />
                  <View style={styles.itineraryCol}>
                    <Text style={styles.itineraryLabel}>Bilhete de Jogo</Text>
                    <Text style={styles.itineraryValue}>Setor Visitante Incluído no Pack</Text>
                  </View>
                </View>

                <View style={styles.itineraryItem}>
                  <ShieldCheck size={15} color={COLORS.gold} />
                  <View style={styles.itineraryCol}>
                    <Text style={styles.itineraryLabel}>Garantia</Text>
                    <Text style={styles.itineraryValue}>Ambiente 100% Família Grupo 39</Text>
                  </View>
                </View>
              </View>

              {/* Bloco de Reserva & MB WAY */}
              <View style={styles.priceContainer}>
                <View>
                  <Text style={styles.priceLabel}>Valor do Pack Completo</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceHighlight}>15,00 €</Text>
                    <Text style={styles.pricePublic}>20,00 €</Text>
                    <View style={styles.memberTag}>
                      <Text style={styles.memberTagText}>SÓCIO G39</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Botão de Ação Direta */}
              <TouchableOpacity
                style={styles.bookButton}
                onPress={handleReserve}
                activeOpacity={0.85}
              >
                <Text style={styles.bookButtonText}>Reservar Lugar via MB WAY (15,00 €)</Text>
                <ChevronRight size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0F1A13',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    ...Platform.select({
      web: {
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scrollBody: {
    padding: 16,
  },
  mainCard: {
    backgroundColor: '#142219',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeGold: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeGoldText: {
    color: '#FFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  roundText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  matchTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 8,
  },
  matchDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  itineraryBox: {
    backgroundColor: '#0D1510',
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 16,
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  itineraryCol: {
    flex: 1,
  },
  itineraryLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  itineraryValue: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  priceContainer: {
    marginBottom: 14,
  },
  priceLabel: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 2,
  },
  priceHighlight: {
    color: COLORS.primaryLight,
    fontSize: 22,
    fontWeight: '900',
  },
  pricePublic: {
    color: COLORS.textMuted,
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  memberTag: {
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.3)',
  },
  memberTagText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '800',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 6px 20px rgba(0, 135, 78, 0.45)',
      },
    }),
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
