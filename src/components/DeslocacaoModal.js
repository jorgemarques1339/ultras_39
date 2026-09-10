import React, { memo } from 'react';
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

function DeslocacaoModal({ visible, onClose, onBuyTicket, isDark = true, isLoggedIn = false, onOpenAuth }) {
  const ticketAmount = isLoggedIn ? 7.50 : 10.00;
  const originalPrice = 15.00;
  const discount = originalPrice - ticketAmount;

  const handleReserve = () => {
    onClose();
    if (onBuyTicket) {
      onBuyTicket({
        title: 'Pack Deslocação Alverca (Autocarro + Bilhete Visitante)',
        category: 'Deslocação Grupo 39',
        amount: ticketAmount,
        originalPrice: originalPrice,
        discount: discount,
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
        <View style={[styles.container, !isDark && styles.containerLight]}>
          {/* Header do Modal */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                <Bus size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
              </View>
              <View>
                <Text style={[styles.headerTitle, !isDark && styles.textDark]}>
                  Deslocação Oficial G39
                </Text>
                <Text style={[styles.headerSubtitle, !isDark && styles.headerSubtitleLight]}>
                  Caravana do Rio Ave FC
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              activeOpacity={0.7}
            >
              <X size={20} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {/* Card Principal da Viagem */}
            <View style={[styles.mainCard, !isDark && styles.mainCardLight]}>
              <View style={styles.badgeRow}>
                <View style={styles.badgeGold}>
                  <Sparkles size={11} color="#FFF" />
                  <Text style={styles.badgeGoldText}>CARAVANA G39</Text>
                </View>
                <Text style={[styles.roundText, !isDark && styles.textMutedDark]}>
                  19 de Setembro · 7.ª Jornada
                </Text>
              </View>

              <Text style={[styles.matchTitle, !isDark && styles.textDark]}>
                Autocarros para Alverca (FC Alverca vs Rio Ave FC)
              </Text>

              <Text style={[styles.matchDesc, !isDark && styles.matchDescLight]}>
                Inscrições abertas na sede e pela app! Saída do Estádio dos Arcos às
                11h30. O pack inclui viagem ida/volta em autocarro de turismo + bilhete no
                setor visitante por apenas {isLoggedIn ? '7,50 € (preço exclusivo para Sócios)' : '10,00 € (preço público geral)'}.
              </Text>

              {/* Banner Exclusivo de Sócio se não estiver logado */}
              {!isLoggedIn && onOpenAuth && (
                <TouchableOpacity
                  style={[styles.memberPromoBanner, !isDark && styles.memberPromoBannerLight]}
                  onPress={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  activeOpacity={0.85}
                >
                  <Sparkles size={14} color="#00B368" />
                  <View style={styles.memberPromoCol}>
                    <Text style={[styles.memberPromoTitle, !isDark && styles.textDark]}>
                      És sócio do Grupo 39?
                    </Text>
                    <Text style={[styles.memberPromoDesc, !isDark && styles.textMutedDark]}>
                      Inicia sessão e reserva por apenas <Text style={styles.memberPromoHighlight}>7,50 €</Text>!
                    </Text>
                  </View>
                  <ChevronRight size={14} color="#00B368" />
                </TouchableOpacity>
              )}

              {/* Itinerário & Detalhes da Viagem */}
              <View style={[styles.itineraryBox, !isDark && styles.itineraryBoxLight]}>
                <View style={styles.itineraryItem}>
                  <MapPin size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  <View style={styles.itineraryCol}>
                    <Text style={[styles.itineraryLabel, !isDark && styles.textMutedDark]}>
                      Ponto de Partida
                    </Text>
                    <Text style={[styles.itineraryValue, !isDark && styles.textDark]}>
                      Estádio dos Arcos
                    </Text>
                  </View>
                </View>

                <View style={styles.itineraryItem}>
                  <Clock size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  <View style={styles.itineraryCol}>
                    <Text style={[styles.itineraryLabel, !isDark && styles.textMutedDark]}>
                      Horário de Saída
                    </Text>
                    <Text style={[styles.itineraryValue, !isDark && styles.textDark]}>
                      11h30 (Concentração às 11h00)
                    </Text>
                  </View>
                </View>

                <View style={styles.itineraryItem}>
                  <Ticket size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  <View style={styles.itineraryCol}>
                    <Text style={[styles.itineraryLabel, !isDark && styles.textMutedDark]}>
                      Bilhete de Jogo
                    </Text>
                    <Text style={[styles.itineraryValue, !isDark && styles.textDark]}>
                      Setor Visitante Incluído no Pack
                    </Text>
                  </View>
                </View>

                <View style={styles.itineraryItem}>
                  <ShieldCheck size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  <View style={styles.itineraryCol}>
                    <Text style={[styles.itineraryLabel, !isDark && styles.textMutedDark]}>
                      Garantia
                    </Text>
                    <Text style={[styles.itineraryValue, !isDark && styles.textDark]}>
                      Ambiente 100% Família Grupo 39
                    </Text>
                  </View>
                </View>
              </View>

              {/* Bloco de Reserva & MB WAY */}
              <View style={styles.priceContainer}>
                <View>
                  <Text style={[styles.priceLabel, !isDark && styles.textMutedDark]}>
                    Valor do Pack Completo
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.priceHighlight, !isDark && styles.priceHighlightLight]}>
                      {ticketAmount.toFixed(2).replace('.', ',')} €
                    </Text>
                    <Text style={[styles.pricePublic, !isDark && styles.textMutedDark]}>
                      {originalPrice.toFixed(2).replace('.', ',')} €
                    </Text>
                    <View style={[styles.memberTag, !isLoggedIn && styles.publicTag]}>
                      <Text style={[styles.memberTagText, !isLoggedIn && styles.publicTagText]}>
                        {isLoggedIn ? 'SÓCIO G39' : 'PÚBLICO GERAL'}
                      </Text>
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
                <Text style={styles.bookButtonText}>
                  Reservar Lugar via MB WAY ({ticketAmount.toFixed(2).replace('.', ',')} €)
                </Text>
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
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
      },
    }),
  },
  container: {
    backgroundColor: '#0F1A13',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    maxHeight: '85%',
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    ...Platform.select({
      web: {
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8)',
      },
    }),
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLight: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
  },
  headerIconBoxLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.25)',
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
  headerSubtitleLight: {
    color: '#00874E',
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
    backgroundColor: '#F0F4F2',
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
  mainCardLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.16)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
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
  matchDescLight: {
    color: '#475C50',
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
  itineraryBoxLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.15)',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 6px rgba(0, 0, 0, 0.03)',
      },
    }),
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
  priceHighlightLight: {
    color: '#00874E',
  },
  pricePublic: {
    color: COLORS.textMuted,
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  memberTag: {
    backgroundColor: 'rgba(0, 179, 104, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.45)',
  },
  memberTagText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  publicTag: {
    backgroundColor: 'rgba(242, 182, 0, 0.2)',
    borderColor: 'rgba(242, 182, 0, 0.45)',
  },
  publicTagText: {
    color: '#F2B600',
  },
  memberPromoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  memberPromoBannerLight: {
    backgroundColor: '#EDF8F2',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  memberPromoCol: {
    flex: 1,
  },
  memberPromoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  memberPromoDesc: {
    fontSize: 11,
    color: '#A0B8AA',
    marginTop: 1,
  },
  memberPromoHighlight: {
    color: '#00E676',
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
    borderWidth: 1,
    borderColor: '#00B368',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 20px rgba(0, 135, 78, 0.35)',
      },
    }),
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});

export default memo(DeslocacaoModal);
