import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ClubBadge from './ClubBadge';

const RIO_AVE_GREEN = '#008751';

/**
 * Array de exemplo (3 jogos passados, 1 próximo jogo ativo no centro, 3 jogos futuros)
 */
export const SAMPLE_MATCH_CENTER_DATA = [
  {
    id: 'mc-past-1',
    type: 'past',
    competition: 'LIGA PORTUGAL BETCLIC',
    dateShort: 'SÁB, 08/11',
    time: '18:00',
    score: '0 - 2',
    homeTeam: { name: 'ESTORIL PRAIA', logo: null },
    awayTeam: { name: 'RIO AVE FC', logo: null },
    isHome: false,
  },
  {
    id: 'mc-past-2',
    type: 'past',
    competition: 'LIGA PORTUGAL BETCLIC',
    dateShort: 'SEX, 15/11',
    time: '20:30',
    score: '1 - 4',
    homeTeam: { name: 'SANTA CLARA', logo: null },
    awayTeam: { name: 'RIO AVE FC', logo: null },
    isHome: false,
  },
  {
    id: 'mc-past-3',
    type: 'past',
    competition: 'LIGA PORTUGAL BETCLIC',
    dateShort: 'DOM, 22/11',
    time: '15:30',
    score: '3 - 3',
    homeTeam: { name: 'RIO AVE FC', logo: null },
    awayTeam: { name: 'ESTRELA AMADORA', logo: null },
    isHome: true,
  },
  {
    id: 'mc-next-active',
    type: 'next',
    competition: 'LIGA PORTUGAL BETCLIC',
    dateShort: 'DOM, 29/11',
    time: '20:30',
    score: null,
    homeTeam: { name: 'RIO AVE FC', logo: null },
    awayTeam: { name: 'CD NACIONAL', logo: null },
    isHome: true,
  },
  {
    id: 'mc-future-1',
    type: 'future',
    competition: 'LIGA PORTUGAL BETCLIC',
    dateShort: 'SÁB, 06/12',
    time: '18:00',
    score: null,
    homeTeam: { name: 'FC ALVERCA', logo: null },
    awayTeam: { name: 'RIO AVE FC', logo: null },
    isHome: false,
  },
  {
    id: 'mc-future-2',
    type: 'future',
    competition: 'TAÇA DE PORTUGAL',
    dateShort: 'QUA, 17/12',
    time: '20:15',
    score: null,
    homeTeam: { name: 'RIO AVE FC', logo: null },
    awayTeam: { name: 'FC FAMALICÃO', logo: null },
    isHome: true,
  },
  {
    id: 'mc-future-3',
    type: 'future',
    competition: 'LIGA PORTUGAL BETCLIC',
    dateShort: 'DOM, 21/12',
    time: '15:30',
    score: null,
    homeTeam: { name: 'SC BRAGA', logo: null },
    awayTeam: { name: 'RIO AVE FC', logo: null },
    isHome: false,
  },
];

function MatchCenterCarousel({
  matches = SAMPLE_MATCH_CENTER_DATA,
  onPressTickets,
  onPressSummary,
  isDark = true,
  containerWidth,
}) {
  const { width: windowWidth } = useWindowDimensions();
  const isTablet = windowWidth >= 650;
  const maxAppWidth = isTablet ? (windowWidth >= 1024 ? 760 : 660) : windowWidth;
  const cardWidth = containerWidth || maxAppWidth;

  const listData = matches && matches.length > 0 ? matches : SAMPLE_MATCH_CENTER_DATA;

  const defaultIndex = Math.max(
    0,
    listData.findIndex((m) => m.type === 'next') !== -1
      ? listData.findIndex((m) => m.type === 'next')
      : Math.floor(listData.length / 2)
  );

  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const flatListRef = useRef(null);
  const hasScrolledInitial = useRef(false);

  // Garantir foco inicial no Próximo Jogo mesmo em Web / Android
  useEffect(() => {
    setActiveIndex(defaultIndex);
    if (flatListRef.current && listData.length > 0) {
      const timer = setTimeout(() => {
        try {
          flatListRef.current?.scrollToIndex({
            index: defaultIndex,
            animated: false,
          });
          hasScrolledInitial.current = true;
        } catch (_) {}
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [defaultIndex, listData.length]);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: cardWidth,
      offset: cardWidth * index,
      index,
    }),
    [cardWidth]
  );

  const handleMomentumScrollEnd = useCallback(
    (event) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const idx = Math.round(offsetX / cardWidth);
      if (idx >= 0 && idx < listData.length) {
        setActiveIndex(idx);
      }
    },
    [cardWidth, listData.length]
  );

  const handleDotPress = useCallback(
    (index) => {
      setActiveIndex(index);
      try {
        flatListRef.current?.scrollToIndex({ index, animated: true });
      } catch (_) {}
    },
    []
  );

  const renderSlide = useCallback(
    ({ item }) => {
      const isPast = item.type === 'past';

      return (
        <View style={[styles.slideWrapper, { width: cardWidth }]}>
          {/* Topo (Centro): Competição + Data Abreviada */}
          <View style={styles.topCenter}>
            <Text style={[styles.competitionText, !isDark && styles.competitionTextLight]} numberOfLines={1}>
              {item.competition}
            </Text>
            <Text style={[styles.dateText, !isDark && styles.textDark]} numberOfLines={1}>
              {item.dateShort}
            </Text>
          </View>

          {/* Centro + Laterais: Casa | Hora ou Resultado | Fora */}
          <View style={styles.matchRow}>
            {/* Esquerda: Equipa da Casa */}
            <View style={styles.teamCol}>
              <View style={[styles.badgeHalo, !isDark && styles.badgeHaloLight]}>
                <ClubBadge
                  name={item.homeTeam?.name}
                  logo={item.homeTeam?.logo}
                  size="lg"
                  isDark={isDark}
                />
              </View>
              <Text style={[styles.teamNameText, !isDark && styles.textDark]} numberOfLines={2}>
                {(item.homeTeam?.name || 'CASA').toUpperCase()}
              </Text>
            </View>

            {/* Centro: Hora (futuro/próximo) ou Resultado (passado) + Botão Ação */}
            <View style={styles.centerCol}>
              <Text style={[styles.mainHighlightText, !isDark && styles.textDark]} numberOfLines={1}>
                {isPast ? item.score || '0 - 0' : item.time || '20:30'}
              </Text>

              <TouchableOpacity
                activeOpacity={0.84}
                onPress={() =>
                  isPast
                    ? onPressSummary && onPressSummary(item)
                    : onPressTickets && onPressTickets(item)
                }
                style={[
                  styles.actionBtn,
                  isPast
                    ? [styles.actionBtnSecondary, !isDark && styles.actionBtnSecondaryLight]
                    : styles.actionBtnPrimary,
                ]}
                accessibilityRole="button"
                accessibilityLabel={
                  isPast
                    ? 'Ver resumo do jogo'
                    : item.isHome
                      ? 'Ver detalhes do jogo'
                      : 'Comprar bilhetes'
                }
              >
                <Text
                  style={[
                    styles.actionBtnText,
                    isPast && styles.actionBtnTextSecondary,
                    isPast && !isDark && styles.actionBtnTextSecondaryLight,
                  ]}
                >
                  {isPast ? 'RESUMO' : item.isHome ? 'DETALHES' : 'BILHETES'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Direita: Equipa Visitante */}
            <View style={styles.teamCol}>
              <View style={[styles.badgeHalo, !isDark && styles.badgeHaloLight]}>
                <ClubBadge
                  name={item.awayTeam?.name}
                  logo={item.awayTeam?.logo}
                  size="lg"
                  isDark={isDark}
                />
              </View>
              <Text style={[styles.teamNameText, !isDark && styles.textDark]} numberOfLines={2}>
                {(item.awayTeam?.name || 'FORA').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    [cardWidth, isDark, onPressSummary, onPressTickets]
  );

  return (
    <LinearGradient
      colors={
        isDark
          ? ['#0D1310', '#0B2419', '#081216']
          : ['#FFFFFF', '#F1F8F4', '#E6F4EC']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.carouselContainer, !isDark && styles.carouselContainerLight]}
    >
      <FlatList
        ref={flatListRef}
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        snapToInterval={cardWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={defaultIndex}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        bounces={false}
        overScrollMode="never"
        removeClippedSubviews={Platform.OS !== 'web'}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
      />

      {/* Base do Componente: Indicadores de Paginação (Dots) */}
      <View style={styles.dotsContainer}>
        {listData.map((m, idx) => {
          const isActive = idx === activeIndex;
          const isNextAnchor = m.type === 'next';
          return (
            <TouchableOpacity
              key={`dot-${m.id}`}
              onPress={() => handleDotPress(idx)}
              hitSlop={{ top: 8, bottom: 8, left: 5, right: 5 }}
              style={[
                styles.dot,
                !isDark && styles.dotLight,
                isNextAnchor && !isActive && styles.dotNextHint,
                isActive && styles.dotActive,
                isActive && !isDark && styles.dotActiveLight,
              ]}
              accessibilityLabel={`Ir para jogo ${idx + 1}`}
            />
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    width: '100%',
    borderRadius: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 135, 81, 0.35)',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: 14,
    paddingBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 26px rgba(0, 0, 0, 0.45), 0 0 18px rgba(0, 135, 81, 0.16)',
      },
      default: {
        shadowColor: '#008751',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
  carouselContainerLight: {
    borderColor: 'rgba(0, 135, 81, 0.28)',
  },
  slideWrapper: {
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  topCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  competitionText: {
    color: '#B8C7BF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 3,
    textAlign: 'center',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  teamCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  badgeHalo: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  teamNameText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 15,
  },
  centerCol: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 114,
    gap: 12,
  },
  mainHighlightText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  actionBtn: {
    paddingHorizontal: 22,
    paddingVertical: 8.5,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPrimary: {
    backgroundColor: RIO_AVE_GREEN,
    borderWidth: 1,
    borderColor: '#00B368',
  },
  actionBtnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.24)',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 1,
  },
  actionBtnTextSecondary: {
    color: '#E6EFEA',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
  },
  dotLight: {
    backgroundColor: 'rgba(0, 135, 81, 0.2)',
  },
  dotNextHint: {
    backgroundColor: 'rgba(0, 230, 118, 0.45)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#00E676',
  },
  dotActiveLight: {
    backgroundColor: RIO_AVE_GREEN,
  },
  textDark: {
    color: '#0E1712',
  },
  competitionTextLight: {
    color: '#4F665B',
  },
  badgeHaloLight: {
    backgroundColor: 'rgba(0, 135, 81, 0.06)',
    borderColor: 'rgba(0, 135, 81, 0.14)',
  },
  actionBtnSecondaryLight: {
    backgroundColor: 'rgba(0, 135, 81, 0.1)',
    borderColor: 'rgba(0, 135, 81, 0.25)',
  },
  actionBtnTextSecondaryLight: {
    color: RIO_AVE_GREEN,
  },
});

export default memo(MatchCenterCarousel);
