import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Home, MessageSquare, ShoppingBag, User, Lock } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Início' },
  { id: 'store', icon: ShoppingBag, label: 'Loja' },
  { id: 'forum', icon: MessageSquare, label: 'Fórum', badge: '2' },
  { id: 'profile', icon: User, label: 'Perfil' },
];

function LiquidGlassNavBar({ activeTab, onSelectTab, isDark = true, isLoggedIn = false }) {
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
        {/* Apple Specular Highlight Line (Reflexo de Vidro Líquido Superior) */}
        <View style={[styles.specularHighlight, !isDark && styles.specularHighlightLight]} />

        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          const isItemLocked = (item.id === 'forum' || item.id === 'profile') && !isLoggedIn;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => onSelectTab(item.id)}
              style={styles.navItem}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={isItemLocked ? `${item.label} (Requer início de sessão)` : item.label}
            >
              <View
                style={[
                  styles.iconCapsule,
                  isActive && (isDark ? styles.iconCapsuleActiveDark : styles.iconCapsuleActiveLight),
                  isItemLocked && (isDark ? styles.iconCapsuleLockedDark : styles.iconCapsuleLockedLight),
                ]}
              >
                <IconComponent
                  size={22}
                  color={
                    isItemLocked
                      ? isDark
                        ? '#6B7280' // Cor cinzenta evidente no modo escuro
                        : '#9CA3AF' // Cor cinzenta evidente no modo claro
                      : isActive
                      ? COLORS.primaryLight
                      : isDark
                      ? 'rgba(255, 255, 255, 0.58)'
                      : '#5A6E63'
                  }
                  strokeWidth={isActive ? 2.4 : 1.9}
                />

                {(item.badge || isItemLocked) && (
                  <View
                    style={[
                      styles.badgeContainer,
                      !isDark && styles.badgeContainerLight,
                      isItemLocked && (isDark ? styles.badgeContainerLockedDark : styles.badgeContainerLockedLight),
                    ]}
                  >
                    {isItemLocked ? (
                      <Lock size={8} color="#FFFFFF" strokeWidth={2.5} />
                    ) : (
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    )}
                  </View>
                )}

                {/* Apple Micro-indicador Luminoso Ativo */}
                {isActive && (
                  <View style={styles.activeDot} />
                )}
              </View>
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
    bottom: Platform.OS === 'ios' ? 22 : 16,
    paddingHorizontal: 18,
  },
  outerContainerTablet: {
    bottom: 22,
    paddingHorizontal: 20,
  },
  glassBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 36,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    backgroundColor: 'rgba(12, 20, 16, 0.72)',
    height: 62,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        pointerEvents: 'auto',
        backdropFilter: 'blur(28px) saturate(210%)',
        WebkitBackdropFilter: 'blur(28px) saturate(210%)',
        boxShadow:
          '0 16px 36px -4px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.25) inset, 0 0 24px rgba(0, 179, 104, 0.14)',
      },
      default: {
        elevation: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 18,
      },
    }),
  },
  glassBarPhone: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 6,
  },
  glassBarTablet: {
    width: 440,
    maxWidth: '90%',
    paddingHorizontal: 12,
  },
  glassBarLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...Platform.select({
      web: {
        boxShadow:
          '0 14px 34px -4px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.7) inset, 0 1px 2px 0 rgba(255, 255, 255, 0.95) inset, 0 0 20px rgba(0, 135, 78, 0.08)',
      },
    }),
  },
  specularHighlight: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  specularHighlightLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconCapsule: {
    width: 52,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconCapsuleActiveDark: {
    backgroundColor: 'rgba(0, 179, 104, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.38)',
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(0, 179, 104, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
    }),
  },
  iconCapsuleActiveLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 135, 78, 0.25)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 135, 78, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      },
    }),
  },
  iconCapsuleLockedDark: {
    opacity: 0.65,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconCapsuleLockedLight: {
    opacity: 0.65,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  activeDot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primaryLight,
    ...Platform.select({
      web: {
        boxShadow: '0 0 6px #00B368',
      },
    }),
  },
  badgeContainer: {
    position: 'absolute',
    top: 3,
    right: 6,
    backgroundColor: '#00B368',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#0C1410',
  },
  badgeContainerLight: {
    borderColor: '#FFFFFF',
  },
  badgeContainerLockedDark: {
    backgroundColor: '#4B5563',
    borderColor: '#0C1410',
  },
  badgeContainerLockedLight: {
    backgroundColor: '#9CA3AF',
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
});

export default memo(LiquidGlassNavBar);
