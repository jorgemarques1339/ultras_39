import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  Users,
  Bus,
  Flame,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export default function HomeSlidingBanner({
  onOpenSocio,
  onOpenDeslocacao,
  onOpenAlertas,
  isDark = true,
  style,
}) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const touchStartX = useRef(0);
  const autoPlayTimer = useRef(null);
  const isAnimating = useRef(false);

  const SLIDES = [
    {
      id: 'socios',
      badge: 'NOVOS SÓCIOS',
      title: 'Boas-vindas aos novos Sócios!',
      subtitle: 'Faz parte da família Grupo 39 · Inscreve-te',
      icon: Users,
      iconColor: '#00E676',
      badgeBg: 'rgba(0, 230, 118, 0.16)',
      badgeBorder: 'rgba(0, 230, 118, 0.4)',
      badgeText: '#00E676',
      onPress: onOpenSocio,
    },
    {
      id: 'deslocacao',
      badge: 'DESLOCAÇÃO',
      title: 'Próxima Deslocação a Alverca',
      subtitle: '19 Set · Autocarro desde 7,50 € · Reserva já',
      icon: Bus,
      iconColor: '#FFD700',
      badgeBg: 'rgba(255, 215, 0, 0.18)',
      badgeBorder: 'rgba(255, 215, 0, 0.45)',
      badgeText: '#FFD700',
      onPress: onOpenDeslocacao,
    },
    {
      id: 'alertas',
      badge: 'ALERTAS',
      title: 'Alertas Importantes do Grupo 39',
      subtitle: 'Quotas 2026/27, Apoio na Bancada e Avisos',
      icon: Flame,
      iconColor: '#FF5252',
      badgeBg: 'rgba(255, 82, 82, 0.18)',
      badgeBorder: 'rgba(255, 82, 82, 0.45)',
      badgeText: '#FF7070',
      onPress: onOpenAlertas,
    },
  ];

  const animateToSlide = useCallback(
    (nextIdx, direction = 'left') => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const outX = direction === 'left' ? -28 : 28;
      const inX = direction === 'left' ? 28 : -28;

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: outX,
          duration: 140,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 140,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(() => {
        setCurrentIndex(nextIdx);
        slideAnim.setValue(inX);

        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 180,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 180,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]).start(() => {
          isAnimating.current = false;
        });
      });
    },
    [slideAnim, opacityAnim]
  );

  const nextSlide = useCallback(() => {
    const nextIdx = (currentIndex + 1) % SLIDES.length;
    animateToSlide(nextIdx, 'left');
  }, [currentIndex, animateToSlide, SLIDES.length]);

  const prevSlide = useCallback(() => {
    const prevIdx = (currentIndex - 1 + SLIDES.length) % SLIDES.length;
    animateToSlide(prevIdx, 'right');
  }, [currentIndex, animateToSlide, SLIDES.length]);

  // Rotação automática suave a cada 4.2 segundos
  const resetTimer = useCallback(() => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
    autoPlayTimer.current = setInterval(() => {
      nextSlide();
    }, 4200);
  }, [nextSlide]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [resetTimer]);

  const handlePress = () => {
    const current = SLIDES[currentIndex];
    if (current && current.onPress) {
      current.onPress();
    }
  };

  const handleDotPress = (index) => {
    if (index === currentIndex || isAnimating.current) return;
    const dir = index > currentIndex ? 'left' : 'right';
    animateToSlide(index, dir);
    resetTimer();
  };

  const currentItem = SLIDES[currentIndex] || SLIDES[0];
  const IconComponent = currentItem.icon;

  return (
    <View style={[styles.outerWrapper, style]}>
      <TouchableOpacity
        style={[
          styles.container,
          !isDark && styles.containerLight,
          { borderColor: isDark ? currentItem.badgeBorder : 'rgba(0, 135, 78, 0.25)' },
        ]}
        activeOpacity={0.88}
        onPress={handlePress}
        onTouchStart={(e) => {
          touchStartX.current = e.nativeEvent.pageX;
        }}
        onTouchEnd={(e) => {
          const diff = touchStartX.current - e.nativeEvent.pageX;
          if (diff > 35) {
            nextSlide();
            resetTimer();
          } else if (diff < -35) {
            prevSlide();
            resetTimer();
          }
        }}
        accessibilityRole="button"
        accessibilityLabel={`${currentItem.title} - ${currentItem.subtitle}`}
      >
        {/* Ícone no lado esquerdo */}
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: currentItem.badgeBg },
          ]}
        >
          <IconComponent size={17} color={currentItem.iconColor} />
        </View>

        {/* Informação deslizante animada */}
        <Animated.View
          style={[
            styles.contentCol,
            {
              transform: [{ translateX: slideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.topRow}>
            <View
              style={[
                styles.badgePill,
                {
                  backgroundColor: currentItem.badgeBg,
                  borderColor: currentItem.badgeBorder,
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: currentItem.badgeText }]}>
                {currentItem.badge}
              </Text>
            </View>
            <Text
              style={[styles.itemTitle, !isDark && styles.textDark]}
              numberOfLines={1}
            >
              {currentItem.title}
            </Text>
          </View>

          <Text
            style={[styles.itemSubtitle, !isDark && styles.textMutedDark]}
            numberOfLines={1}
          >
            {currentItem.subtitle}
          </Text>
        </Animated.View>

        {/* Lado direito: Indicadores de slide e seta */}
        <View style={styles.rightActionBox}>
          {/* Indicadores de paginação */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <TouchableOpacity
                  key={`dot-${idx}`}
                  onPress={(e) => {
                    e.stopPropagation && e.stopPropagation();
                    handleDotPress(idx);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  style={[
                    styles.dot,
                    isActive ? [styles.dotActive, { backgroundColor: currentItem.iconColor }] : styles.dotInactive,
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.chevronBox}>
            <ChevronRight size={14} color={isDark ? '#FFF' : '#2D4036'} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    width: '100%',
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 31, 23, 0.85)',
    borderRadius: 15,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    height: 58,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
        cursor: 'pointer',
      },
    }),
  },
  containerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderColor: 'rgba(0, 135, 78, 0.22)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
    flexShrink: 0,
  },
  contentCol: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  badgePill: {
    paddingHorizontal: 6.5,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 0.8,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  itemTitle: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
    flexShrink: 1,
  },
  itemSubtitle: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    fontWeight: '500',
    marginTop: 2,
  },
  rightActionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
    flexShrink: 0,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    height: 4.5,
    borderRadius: 2.25,
  },
  dotActive: {
    width: 14,
    backgroundColor: COLORS.primaryLight,
  },
  dotInactive: {
    width: 4.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  chevronBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDark: {
    color: '#0E2319',
  },
  textMutedDark: {
    color: '#556E61',
  },
});
