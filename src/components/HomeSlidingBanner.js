import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Flame,
  MapPin,
  IdCard,
  ShoppingBag,
  Bell,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { useAlerts } from '../context/AlertsContext';

function getSlideTheme(alert) {
  switch (alert.category) {
    case 'jogo':
      return {
        icon: MapPin,
        iconColor: '#FF6B6B',
        badgeBg: 'rgba(255, 82, 82, 0.24)',
        badgeBorder: 'rgba(255, 118, 118, 0.55)',
        badgeText: '#FF9A9A',
        borderColor: 'rgba(255, 107, 107, 0.4)',
      };
    case 'bancada':
      return {
        icon: Flame,
        iconColor: '#00E676',
        badgeBg: 'rgba(0, 230, 118, 0.18)',
        badgeBorder: 'rgba(0, 230, 118, 0.45)',
        badgeText: '#00E676',
        borderColor: 'rgba(0, 179, 104, 0.4)',
      };
    case 'quota':
      return {
        icon: IdCard,
        iconColor: '#00E676',
        badgeBg: 'rgba(0, 230, 118, 0.18)',
        badgeBorder: 'rgba(0, 230, 118, 0.45)',
        badgeText: '#00E676',
        borderColor: 'rgba(0, 179, 104, 0.4)',
      };
    case 'loja':
      return {
        icon: ShoppingBag,
        iconColor: '#38BDF8',
        badgeBg: 'rgba(56, 189, 248, 0.2)',
        badgeBorder: 'rgba(56, 189, 248, 0.48)',
        badgeText: '#7DD3FC',
        borderColor: 'rgba(56, 189, 248, 0.38)',
      };
    default:
      return {
        icon: Bell,
        iconColor: COLORS.primaryLight,
        badgeBg: 'rgba(0, 179, 104, 0.2)',
        badgeBorder: 'rgba(0, 179, 104, 0.45)',
        badgeText: '#00E676',
        borderColor: 'rgba(0, 179, 104, 0.35)',
      };
  }
}

export default function HomeSlidingBanner({
  onOpenSocio,
  isDark = true,
  isLoggedIn = false,
  style,
}) {
  const { width } = useWindowDimensions();
  const isCompactPhone = width < 385;
  const { activeBannerAlerts, openAlertsModal } = useAlerts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const touchStartX = useRef(0);
  const autoPlayTimer = useRef(null);
  const isAnimating = useRef(false);

  const SLIDES = useMemo(() => {
    const list = activeBannerAlerts.map((alert) => {
      const visuals = getSlideTheme(alert);
      return {
        id: alert.id,
        badge: alert.badge,
        title: alert.bannerTitle || alert.title,
        subtitle: alert.bannerSubtitle || alert.summary || alert.description,
        isUnread: !alert.isRead,
        ...visuals,
        onPress: () => openAlertsModal(alert.category),
      };
    });

    if (!isLoggedIn) {
      list.push({
        id: 'socios-cta',
        badge: 'SÓCIO',
        title: 'Faz-te Sócio G39!',
        subtitle: 'Junta-te à família verde e branca',
        isUnread: false,
        icon: Users,
        iconColor: '#00E676',
        badgeBg: 'rgba(0, 230, 118, 0.18)',
        badgeBorder: 'rgba(0, 230, 118, 0.45)',
        badgeText: '#00E676',
        borderColor: 'rgba(0, 179, 104, 0.38)',
        onPress: onOpenSocio,
      });
    }

    return list;
  }, [activeBannerAlerts, isLoggedIn, onOpenSocio, openAlertsModal]);

  useEffect(() => {
    if (currentIndex >= SLIDES.length) {
      setCurrentIndex(0);
    }
  }, [SLIDES.length, currentIndex]);

  const animateToSlide = useCallback(
    (nextIdx, direction = 'left') => {
      if (isAnimating.current || SLIDES.length <= 1) return;
      isAnimating.current = true;

      const outX = direction === 'left' ? -24 : 24;
      const inX = direction === 'left' ? 24 : -24;

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
    [slideAnim, opacityAnim, SLIDES.length]
  );

  const nextSlide = useCallback(() => {
    if (SLIDES.length <= 1) return;
    const next = (currentIndex + 1) % SLIDES.length;
    animateToSlide(next, 'left');
  }, [currentIndex, SLIDES.length, animateToSlide]);

  const prevSlide = useCallback(() => {
    if (SLIDES.length <= 1) return;
    const prev = (currentIndex - 1 + SLIDES.length) % SLIDES.length;
    animateToSlide(prev, 'right');
  }, [currentIndex, SLIDES.length, animateToSlide]);

  // Rotação automática entre todos os comunicados ativos a cada 5 segundos
  useEffect(() => {
    if (SLIDES.length <= 1) return;
    autoPlayTimer.current = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [nextSlide, SLIDES.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.nativeEvent.pageX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.nativeEvent.pageX - touchStartX.current;
    if (Math.abs(diff) > 35) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const handleDotPress = (idx) => {
    if (idx === currentIndex) return;
    if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    animateToSlide(idx, idx > currentIndex ? 'left' : 'right');
  };

  if (SLIDES.length === 0) return null;

  const currentItem = SLIDES[currentIndex] || SLIDES[0];
  const IconComp = currentItem.icon;

  return (
    <View style={[styles.outerWrapper, style]}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => {
          if (currentItem.onPress) currentItem.onPress();
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={[
          styles.container,
          isDark && { borderColor: currentItem.borderColor },
          !isDark && styles.containerLight,
        ]}
      >
        {/* Ícone com ponto de não lido */}
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: currentItem.badgeBg, borderColor: currentItem.badgeBorder },
          ]}
        >
          <IconComp size={16} color={currentItem.iconColor} />
          {currentItem.isUnread && <View style={styles.unreadPulseDot} />}
        </View>

        {/* Conteúdo animado */}
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

        {/* Indicadores de slide e seta */}
        <View style={styles.rightActionBox}>
          {SLIDES.length > 1 && !isCompactPhone && (
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
                      isActive
                        ? [styles.dotActive, { backgroundColor: currentItem.iconColor }]
                        : [styles.dotInactive, !isDark && styles.dotInactiveLight],
                    ]}
                  />
                );
              })}
            </View>
          )}
          <View style={[styles.chevronBox, !isDark && styles.chevronBoxLight]}>
            <ChevronRight size={14} color={isDark ? '#FFFFFF' : '#1C3527'} />
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
    backgroundColor: 'rgba(18, 31, 23, 0.88)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    minHeight: 56,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.28)',
        cursor: 'pointer',
      },
    }),
  },
  containerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderColor: 'rgba(0, 135, 78, 0.24)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0,
    position: 'relative',
  },
  unreadPulseDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    borderWidth: 1.5,
    borderColor: '#121F17',
  },
  contentCol: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
    borderWidth: 0.8,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  unreadCountChip: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF5252',
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    flexShrink: 1,
    letterSpacing: 0.1,
  },
  itemSubtitle: {
    color: '#D5E4DC',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  rightActionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginLeft: 7,
    flexShrink: 0,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 12,
    backgroundColor: COLORS.primaryLight,
  },
  dotInactive: {
    width: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  dotInactiveLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.22)',
  },
  chevronBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
  },
  textDark: {
    color: '#0E2319',
  },
  textMutedDark: {
    color: '#4A6256',
  },
});
