import React, { useState, memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  X,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  Sparkles,
  Flame,
  HeartHandshake,
  PartyPopper,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const EVENTS_DATA = [
  {
    id: 'evt-cortejo',
    category: 'cortejo',
    categoryLabel: 'CORTEJO',
    tagColor: '#00E676',
    title: 'Cortejo Oficial ao Estádio dos Arcos',
    date: '14 Setembro 2026 · 17h00',
    time: 'Concentração 16h30',
    location: 'Sede Grupo 39 ➔ Estádio dos Arcos',
    description: 'Grande caminhada de apoio com bandeirões, faixas, fumígenos verdes e tambores até à Bancada Poente. Entrada conjunta no estádio!',
    attendees: 184,
    status: 'Confirmado',
    icon: Flame,
  },
  {
    id: 'evt-magusto',
    category: 'convivio',
    categoryLabel: 'CONVÍVIO',
    tagColor: '#FFB300',
    title: 'Grande Magusto & Convívio da Família Grupo 39',
    date: '01 Novembro 2026 · 13h00',
    time: 'Das 13h00 às 19h00',
    location: 'Parque da Cidade · Vila do Conde',
    description: 'Almoço convívio para todos os sócios e simpatizantes com castanhas, bifanas, sardinhas e ensaio geral dos novos cânticos da época.',
    attendees: 96,
    status: 'Inscrições Abertas',
    icon: PartyPopper,
  },
  {
    id: 'evt-aniversario',
    category: 'gala',
    categoryLabel: '42.º ANIVERSÁRIO',
    tagColor: '#E040FB',
    title: 'Gala do 42.º Aniversário (Fundação 1984)',
    date: '15 Dezembro 2026 · 20h00',
    time: '20h00 às 00h30',
    location: 'Salão Nobre / Sede Oficial G39',
    description: 'Mais de quatro décadas de amor incondicional ao Rio Ave FC. Homenagem aos fundadores de 1984 e entrega de crachás de prata aos sócios com 20 anos de bancada.',
    attendees: 140,
    status: 'Lotação Limitada',
    icon: Sparkles,
  },
  {
    id: 'evt-solidario',
    category: 'solidario',
    categoryLabel: 'SOLIDARIEDADE',
    tagColor: '#29B6F6',
    title: 'Campanha "Ultras Solidários" · Natal 2026',
    date: '18 a 23 Dezembro 2026',
    time: 'Recolha Diária 17h - 21h',
    location: 'Sede G39 & Porta 2 dos Arcos',
    description: 'Recolha anual de bens alimentares não perecíveis e brinquedos para doação a famílias carenciadas e instituições de caridade de Vila do Conde.',
    attendees: 65,
    status: 'Recolha Ativa',
    icon: HeartHandshake,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'cortejo', label: 'Cortejos' },
  { id: 'convivio', label: 'Convívios' },
  { id: 'gala', label: 'Aniversário' },
  { id: 'solidario', label: 'Solidariedade' },
];

function EventosModal({ visible, onClose, isDark = true }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [attendedEvents, setAttendedEvents] = useState({ 'evt-cortejo': true });

  const toggleAttend = (id) => {
    setAttendedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredEvents =
    selectedFilter === 'all'
      ? EVENTS_DATA
      : EVENTS_DATA.filter((e) => e.category === selectedFilter);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            isTablet && styles.containerTablet,
            !isDark && styles.containerLight,
          ]}
        >
          {/* Header */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                <CalendarIcon size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
              </View>
              <View>
                <Text style={[styles.headerTitle, !isDark && styles.textDark]}>
                  Eventos Grupo 39
                </Text>
                <Text style={[styles.headerSubtitle, !isDark && styles.headerSubtitleLight]}>
                  Iniciativas, Cortejos & Convívios
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              activeOpacity={0.7}
              accessibilityLabel="Fechar Eventos"
            >
              <X size={18} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          {/* Filtros por Categoria */}
          <View style={[styles.filtersContainer, !isDark && styles.filtersContainerLight]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedFilter === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedFilter(cat.id)}
                    style={[
                      styles.filterChip,
                      !isDark && styles.filterChipLight,
                      isActive && styles.filterChipActive,
                      !isDark && isActive && styles.filterChipActiveLight,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        !isDark && styles.filterChipTextLight,
                        isActive && styles.filterChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Lista de Eventos */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollBodyContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {filteredEvents.map((evt) => {
              const isAttending = !!attendedEvents[evt.id];
              const IconComp = evt.icon;

              return (
                <View
                  key={evt.id}
                  style={[styles.eventCard, !isDark && styles.eventCardLight]}
                >
                  {/* Top Bar do Card */}
                  <View style={styles.cardTopRow}>
                    <View
                      style={[
                        styles.categoryTag,
                        { borderColor: evt.tagColor, backgroundColor: `${evt.tagColor}1A` },
                      ]}
                    >
                      <IconComp size={11} color={evt.tagColor} />
                      <Text style={[styles.categoryTagText, { color: evt.tagColor }]}>
                        {evt.categoryLabel}
                      </Text>
                    </View>

                    <View style={styles.statusBadge}>
                      <View style={[styles.statusDot, { backgroundColor: evt.tagColor }]} />
                      <Text style={[styles.statusText, !isDark && styles.textMutedDark]}>
                        {evt.status}
                      </Text>
                    </View>
                  </View>

                  {/* Título */}
                  <Text style={[styles.eventTitle, !isDark && styles.textDark]}>
                    {evt.title}
                  </Text>

                  {/* Descrição */}
                  <Text style={[styles.eventDesc, !isDark && styles.eventDescLight]}>
                    {evt.description}
                  </Text>

                  {/* Detalhes de Data & Localização */}
                  <View style={[styles.metaBox, !isDark && styles.metaBoxLight]}>
                    <View style={styles.metaRow}>
                      <CalendarIcon size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                      <Text style={[styles.metaText, !isDark && styles.textDark]}>
                        {evt.date}
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Clock size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                      <Text style={[styles.metaText, !isDark && styles.textMutedDark]}>
                        {evt.time}
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      <MapPin size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                      <Text style={[styles.metaText, !isDark && styles.textDark]}>
                        {evt.location}
                      </Text>
                    </View>
                  </View>

                  {/* Rodapé do Card com Participação */}
                  <View style={styles.cardFooter}>
                    <View style={styles.attendeesRow}>
                      <Users size={14} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
                      <Text style={[styles.attendeesText, !isDark && styles.textMutedDark]}>
                        {evt.attendees + (isAttending ? 1 : 0)} adeptos confirmados
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.attendBtn,
                        isAttending && styles.attendBtnActive,
                        !isDark && !isAttending && styles.attendBtnLight,
                      ]}
                      onPress={() => toggleAttend(evt.id)}
                      activeOpacity={0.8}
                    >
                      {isAttending ? (
                        <>
                          <CheckCircle2 size={14} color="#FFF" />
                          <Text style={styles.attendBtnActiveText}>Vou Estar Presente</Text>
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                          <Text style={[styles.attendBtnText, !isDark && styles.attendBtnTextLight]}>
                            Marcar Presença
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'flex-end',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  container: {
    backgroundColor: '#0A120D',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    maxHeight: '90%',
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    ...Platform.select({
      web: {
        boxShadow: '0 -10px 45px rgba(0, 0, 0, 0.85)',
      },
    }),
  },
  containerTablet: {
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    marginBottom: 20,
  },
  containerLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.22)',
    ...Platform.select({
      web: {
        boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.14)',
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
    backgroundColor: '#0F1A13',
  },
  headerLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
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
  headerIconBoxLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#8A9E93',
    fontWeight: '500',
  },
  headerSubtitleLight: {
    color: '#5A6E63',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  filtersContainer: {
    backgroundColor: '#0D1610',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 10,
  },
  filtersContainerLight: {
    backgroundColor: '#F0F5F2',
    borderBottomColor: 'rgba(0, 135, 78, 0.08)',
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  filterChipActive: {
    backgroundColor: '#00B368',
    borderColor: '#00B368',
  },
  filterChipActiveLight: {
    backgroundColor: '#00874E',
    borderColor: '#00874E',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9EAEAA',
  },
  filterChipTextLight: {
    color: '#4B5E54',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollBody: {
    flex: 1,
  },
  scrollBodyContent: {
    padding: 16,
    gap: 14,
  },
  eventCard: {
    backgroundColor: '#111D15',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  eventCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.12)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    color: '#7F9188',
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
    lineHeight: 20,
  },
  eventDesc: {
    fontSize: 12,
    color: '#9CAEA4',
    lineHeight: 18,
    marginBottom: 12,
  },
  eventDescLight: {
    color: '#55695E',
  },
  metaBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 10,
    gap: 7,
    marginBottom: 14,
  },
  metaBoxLight: {
    backgroundColor: '#F3F8F5',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E0E8E3',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attendeesText: {
    fontSize: 11,
    color: '#7A8C82',
    fontWeight: '500',
  },
  attendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  attendBtnLight: {
    backgroundColor: '#EDF6F1',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  attendBtnActive: {
    backgroundColor: '#00B368',
    borderColor: '#00B368',
  },
  attendBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  attendBtnTextLight: {
    color: '#00874E',
  },
  attendBtnActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#5A6E63',
  },
});

export default memo(EventosModal);
