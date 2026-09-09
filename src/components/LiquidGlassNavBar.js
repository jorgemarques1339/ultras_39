import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Home, MessageSquare, Calendar, User } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const NAV_ITEMS = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'forum', label: 'Fórum', icon: MessageSquare, badge: '2' },
  { id: 'calendar', label: 'Calendário', icon: Calendar },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function LiquidGlassNavBar({ activeTab, onSelectTab }) {
  return (
    <View style={[styles.outerContainer, { pointerEvents: 'box-none' }]}>
      <View style={styles.glassBar}>
        {/* Subtle Top Gradient Line */}
        <View style={styles.glowLine} />

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
                  size={22}
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
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
    paddingHorizontal: 16,
  },
  glassBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 520,
    height: 68,
    borderRadius: 36,
    backgroundColor: 'rgba(13, 20, 16, 0.84)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        pointerEvents: 'auto',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(0, 135, 78, 0.15)',
      },
      default: {
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
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
    backgroundColor: COLORS.gold,
    marginTop: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '800',
  },
});
