import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Home, MessageSquare, ShoppingBag, User } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const NAV_ITEMS = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'forum', label: 'Fórum', icon: MessageSquare, badge: '2' },
  { id: 'store', label: 'Loja', icon: ShoppingBag },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function LiquidGlassNavBar({ activeTab, onSelectTab, isDark = true }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;

  return (
    <View
      style={[
        styles.outerContainer,
        isTablet ? styles.outerContainerTablet : styles.outerContainerPhone,
        { pointerEvents: 'box-none' },
      ]}
    >
      <View
        style={[
          styles.glassBar,
          isTablet ? styles.glassBarTablet : styles.glassBarPhone,
          !isDark && styles.glassBarLight,
        ]}
      >
        {/* Subtle Top Gradient Line */}
        <View style={[styles.glowLine, !isDark && styles.glowLineLight]} />

        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => onSelectTab(item.id)}
              style={[styles.navItem, isActive && styles.navItemActive]}
            >
              {/* Active Glow Pill Background */}
              {isActive && <View style={styles.activePillGlow} />}

              <View style={styles.iconWrapper}>
                <IconComponent
                  size={20}
                  color={isActive ? COLORS.primaryLight : COLORS.textSecondary}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {item.badge && !isActive && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.navLabel,
                  isActive ? styles.navLabelActive : styles.navLabelInactive,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>

              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  outerContainerPhone: {
    bottom: 0,
    paddingHorizontal: 0,
  },
  outerContainerTablet: {
    bottom: 20,
    paddingHorizontal: 16,
  },
  glassBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(11, 18, 14, 0.94)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        pointerEvents: 'auto',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      },
      default: {
        elevation: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
    }),
  },
  glassBarPhone: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopWidth: 1.5,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'web' ? 14 : 18,
    paddingHorizontal: 6,
    ...Platform.select({
      web: {
        boxShadow: '0 -8px 28px rgba(0, 0, 0, 0.75), 0 -1px 12px rgba(0, 135, 78, 0.2)',
      },
    }),
  },
  glassBarTablet: {
    maxWidth: 520,
    height: 68,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(0, 135, 78, 0.15)',
      },
    }),
  },
  glassBarLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
    ...Platform.select({
      web: {
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08), 0 0 14px rgba(0, 135, 78, 0.1)',
      },
    }),
  },
  glowLine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(0, 179, 104, 0.35)',
  },
  glowLineLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.25)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 24,
    position: 'relative',
  },
  navItemActive: {
    // subtle elevate
  },
  activePillGlow: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 6,
    right: 6,
    backgroundColor: 'rgba(0, 135, 78, 0.18)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.28)',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  navLabelActive: {
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  navLabelInactive: {
    color: COLORS.textSecondary,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00B368',
    marginTop: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#00B368',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
