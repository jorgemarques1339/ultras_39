import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ClubBadge from './ClubBadge';
import { COLORS } from '../theme/colors';

const RIO_AVE_GREEN = COLORS.primary;
const AUTO_SLIDE_INTERVAL_MS = 5000;

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

const MatchSlide = memo(function MatchSlide({
  item,
  cardWidth,
  isDark,
  onPressTickets,
}) {
  const isPast = item.type === 'past';
  const isNext = item.type === 'next';

  const handleActionPress = useCallback(() => {
    onPressTickets && onPressTickets(item);
  }, [item, onPressTickets]);

  return (
    <View style={[styles.slideWrapper, { width: cardWidth }]}>
      {/* Topo (Centro): Etiqueta Próximo Jogo + Competição + Data Abreviada */}
      <View style={styles.topCenter}>
        {isNext && (
          <View style={[styles.nextMatchPill, !isDark && styles.nextMatchPillLight]}>
            <View style={[styles.nextMatchDot, !isDark && styles.nextMatchDotLight]} />
            <Text style={[styles.nextMatchPillText, !isDark && styles.nextMatchPillTextLight]}>
              PRÓXIMO JOGO
            </Text>
          </View>
        )}
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
          <View
            style={[
              styles.badgeHalo,
              !isDark && styles.badgeHaloLight,
              isNext && styles.badgeHaloNext,
              isNext && !isDark && styles.badgeHaloNextLight,
            ]}
          >
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

        {/* Centro: Hora (futuro/próximo) ou Resultado (passado) + Botão Bilhetes apenas no Próximo Jogo */}
        <View style={styles.centerCol}>
          <Text
            style={[
              styles.mainHighlightText,
              !isDark && styles.textDark,
              isNext && (isDark ? styles.mainHighlightNextDark : styles.mainHighlightNextLight),
            ]}
            numberOfLines={1}
          >
            {isPast ? item.score || '0 - 0' : item.time || '20:30'}
          </Text>

          {isNext ? (
            <TouchableOpacity
              activeOpacity={0.84}
              onPress={handleActionPress}
              style={[styles.actionBtn, styles.actionBtnPrimary, styles.actionBtnNext]}
              accessibilityRole="button"
              accessibilityLabel="Comprar bilhetes para o próximo jogo"
            >
              <Text style={styles.actionBtnText}>BILHETES</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionBtnPlaceholder} />
          )}
        </View>

        {/* Direita: Equipa Visitante */}
        <View style={styles.teamCol}>
          <View
            style={[
              styles.badgeHalo,
              !isDark && styles.badgeHaloLight,
              isNext && styles.badgeHaloNext,
              isNext && !isDark && styles.badgeHaloNextLight,
            ]}
          >
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
});

function MatchCenterCarousel({
  matches = SAMPLE_MATCH_CENTER_DATA,
  onPressTickets,
  onPressSummary,
  isDark = true,
  isActive = true,
  containerWidth,
}) {
  const { width: windowWidth } = useWindowDimensions();
  const isTablet = windowWidth >= 650;
  const maxAppWidth = isTablet ? (windowWidth >= 1024 ? 760 : 660) : windowWidth;
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const cardWidth = containerWidth || measuredWidth || maxAppWidth;

  const listData = useMemo(
    () => (matches && matches.length > 0 ? matches : SAMPLE_MATCH_CENTER_DATA),
    [matches]
  );

  const defaultIndex = useMemo(() => {
    const nextIdx = listData.findIndex((m) => m.type === 'next');
    if (nextIdx !== -1) return nextIdx;
    return Math.max(0, Math.floor(listData.length / 2));
  }, [listData]);

  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [isPaused, setIsPaused] = useState(false);

  const flatListRef = useRef(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const hasScrolledInitialRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticTimerRef = useRef(null);

  const scrollToSlide = useCallback(
    (index, animated = true) => {
      if (!flatListRef.current || cardWidth <= 0) return;
      const clamped = Math.max(0, Math.min(index, listData.length - 1));
      if (programmaticTimerRef.current) {
        clearTimeout(programmaticTimerRef.current);
      }
      isProgrammaticScrollRef.current = animated;
      setActiveIndex(clamped);
      try {
        flatListRef.current.scrollToOffset({
          offset: clamped * cardWidth,
          animated,
        });
      } catch (_) {
        isProgrammaticScrollRef.current = false;
      }
      if (animated) {
        programmaticTimerRef.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 480);
      }
    },
    [cardWidth, listData.length]
  );

  useEffect(() => {
    return () => {
      if (programmaticTimerRef.current) {
        clearTimeout(programmaticTimerRef.current);
      }
    };
  }, []);

  const handleContainerLayout = useCallback(
    (e) => {
      const w = Math.round(e.nativeEvent.layout.width);
      if (w > 0 && w !== measuredWidth) {
        setMeasuredWidth(w);
        if (flatListRef.current) {
          const targetIdx = hasScrolledInitialRef.current
            ? activeIndexRef.current
            : defaultIndex;
          requestAnimationFrame(() => {
            try {
              flatListRef.current?.scrollToOffset({
                offset: targetIdx * w,
                animated: false,
              });
              hasScrolledInitialRef.current = true;
            } catch (_) {}
          });
        }
      }
    },
    [defaultIndex, measuredWidth]
  );

  // Garantir foco inicial no Próximo Jogo sem reiniciar quando a lista atualiza em segundo plano
  useEffect(() => {
    if (!hasScrolledInitialRef.current && cardWidth > 0 && listData.length > 0) {
      const timer = setTimeout(() => {
        scrollToSlide(defaultIndex, false);
        hasScrolledInitialRef.current = true;
      }, 30);
      return () => clearTimeout(timer);
    }
    if (activeIndexRef.current >= listData.length) {
      scrollToSlide(defaultIndex, false);
    }
  }, [cardWidth, defaultIndex, listData.length, scrollToSlide]);

  // Deslize automático de 5 em 5 segundos: do próximo jogo até ao último, voltando ao próximo jogo
  useEffect(() => {
    if (!isActive || isPaused || listData.length <= 1) return;

    const timer = setTimeout(() => {
      const current = activeIndexRef.current;
      const nextIndex = current + 1 >= listData.length ? defaultIndex : current + 1;
      scrollToSlide(nextIndex, true);
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [activeIndex, isActive, isPaused, listData.length, defaultIndex, scrollToSlide]);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: cardWidth,
      offset: cardWidth * index,
      index,
    }),
    [cardWidth]
  );

  const handleScroll = useCallback(
    (event) => {
      if (isProgrammaticScrollRef.current || cardWidth <= 0) return;
      const offsetX = event.nativeEvent.contentOffset.x;
      const idx = Math.round(offsetX / cardWidth);
      if (idx >= 0 && idx < listData.length && idx !== activeIndexRef.current) {
        setActiveIndex(idx);
      }
    },
    [cardWidth, listData.length]
  );

  const handleMomentumScrollEnd = useCallback(
    (event) => {
      isProgrammaticScrollRef.current = false;
      setIsPaused(false);
      if (cardWidth <= 0) return;
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
      scrollToSlide(index, true);
    },
    [scrollToSlide]
  );

  const renderSlide = useCallback(
    ({ item }) => (
      <MatchSlide
        item={item}
        cardWidth={cardWidth}
        isDark={isDark}
        onPressTickets={onPressTickets}
      />
    ),
    [cardWidth, isDark, onPressTickets]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const handleScrollToIndexFailed = useCallback(
    (info) => {
      setTimeout(() => {
        scrollToSlide(info.index, false);
      }, 50);
    },
    [scrollToSlide]
  );

  const activeItem = listData[activeIndex] || listData[defaultIndex];
  const isActiveNext = activeItem?.type === 'next';
  const isActivePast = activeItem?.type === 'past';

  const carouselColors = isActiveNext
    ? isDark
      ? ['rgba(10, 46, 30, 0.90)', 'rgba(0, 90, 54, 0.88)', 'rgba(9, 30, 21, 0.92)']
      : ['rgba(217, 244, 229, 0.88)', 'rgba(236, 249, 242, 0.86)', 'rgba(203, 238, 219, 0.88)']
    : isActivePast
      ? isDark
        ? ['rgba(13, 17, 20, 0.90)', 'rgba(20, 27, 30, 0.88)', 'rgba(9, 12, 14, 0.92)']
        : ['rgba(245, 247, 246, 0.88)', 'rgba(236, 239, 237, 0.86)', 'rgba(228, 233, 230, 0.88)']
      : isDark
        ? ['rgba(13, 19, 16, 0.90)', 'rgba(11, 36, 25, 0.88)', 'rgba(8, 18, 22, 0.92)']
        : ['rgba(255, 255, 255, 0.88)', 'rgba(241, 248, 244, 0.86)', 'rgba(230, 244, 236, 0.88)'];

  return (
    <LinearGradient
      colors={carouselColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      onLayout={handleContainerLayout}
      onMouseEnter={Platform.OS === 'web' ? () => setIsPaused(true) : undefined}
      onMouseLeave={Platform.OS === 'web' ? () => setIsPaused(false) : undefined}
      style={[styles.carouselContainer, !isDark && styles.carouselContainerLight]}
    >
      <FlatList
        ref={flatListRef}
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        disableIntervalMomentum
        snapToInterval={cardWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={defaultIndex}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        onScrollBeginDrag={() => setIsPaused(true)}
        onScrollEndDrag={() => setIsPaused(false)}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        bounces={false}
        overScrollMode="never"
        removeClippedSubviews={false}
        initialNumToRender={listData.length}
        maxToRenderPerBatch={listData.length}
        windowSize={7}
      />

      {/* Base do Componente: Indicadores de Paginação (Dots) */}
      <View style={styles.dotsContainer}>
        {listData.map((m, idx) => {
          const isActiveDot = idx === activeIndex;
          const isNextAnchor = m.type === 'next';
          return (
            <TouchableOpacity
              key={`dot-${m.id}`}
              onPress={() => handleDotPress(idx)}
              hitSlop={{ top: 8, bottom: 8, left: 5, right: 5 }}
              style={[
                styles.dot,
                !isDark && styles.dotLight,
                isNextAnchor && !isActiveDot && styles.dotNextHint,
                isActiveDot && styles.dotActive,
                isActiveDot && !isDark && styles.dotActiveLight,
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
    borderColor: 'rgba(0, 135, 78, 0.35)',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? Math.max(14, (StatusBar.currentHeight || 0) + 8) : 14,
    paddingBottom: 16,
    ...Platform.select({
      web: {
        paddingTop: 'max(14px, env(safe-area-inset-top))',
        boxShadow: '0 10px 26px rgba(0, 0, 0, 0.45), 0 0 18px rgba(0, 135, 78, 0.16)',
      },
      default: {
        shadowColor: COLORS.primary,
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
    height: 172,
    justifyContent: 'space-between',
  },
  topCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    marginBottom: 4,
  },
  nextMatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.42)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 6,
  },
  nextMatchPillLight: {
    backgroundColor: 'rgba(0, 135, 81, 0.1)',
    borderColor: 'rgba(0, 135, 81, 0.35)',
  },
  nextMatchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
  },
  nextMatchDotLight: {
    backgroundColor: RIO_AVE_GREEN,
  },
  nextMatchPillText: {
    color: '#00E676',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  nextMatchPillTextLight: {
    color: RIO_AVE_GREEN,
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
    height: 112,
    gap: 8,
  },
  teamCol: {
    flex: 1,
    height: 108,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
    gap: 8,
  },
  badgeHalo: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  badgeHaloNext: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.48)',
  },
  badgeHaloNextLight: {
    backgroundColor: 'rgba(0, 135, 81, 0.1)',
    borderColor: 'rgba(0, 135, 81, 0.4)',
  },
  teamNameText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 15,
    minHeight: 30,
  },
  centerCol: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 114,
    height: 108,
    gap: 10,
  },
  mainHighlightText: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  actionBtnPlaceholder: {
    height: 33,
  },
  mainHighlightNextDark: {
    color: '#00E676',
  },
  mainHighlightNextLight: {
    color: RIO_AVE_GREEN,
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
  actionBtnNext: {
    borderColor: '#00E676',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 230, 118, 0.35)',
      },
      default: {
        shadowColor: '#00E676',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
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
