import React, { useRef, useEffect, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Platform } from 'react-native';
import { Bell, Sun, Moon, User } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

function Header({
  onOpenNotifications,
  visible = true,
  isDark = true,
  onToggleTheme,
  isLoggedIn = false,
  onOpenAuth,
  onNavigateProfile,
}) {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  const height = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 52],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-52, 0],
  });

  return (
    <Animated.View
      style={[
        styles.headerAnimatedWrapper,
        { height, opacity, transform: [{ translateY }] },
        !isDark && styles.headerAnimatedWrapperLight,
      ]}
    >
      <View style={[styles.headerContainer, !isDark && styles.headerContainerLight]}>
        {/* Espaço à esquerda: Estado de Sócio (quando autenticado) */}
        <View style={styles.leftActionsContainer}>
          {isLoggedIn && (
            <TouchableOpacity
              style={[styles.headerMemberBadge, !isDark && styles.headerMemberBadgeLight]}
              onPress={onNavigateProfile}
              activeOpacity={0.8}
            >
              <View style={styles.headerMemberDot} />
              <Text style={[styles.headerMemberText, !isDark && styles.headerMemberTextLight]}>
                Sócio
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Logótipo Oficial Perfeitamente Centrado no Header */}
        <View style={styles.centerBrand} pointerEvents="none">
          <View style={[styles.logoWrapper, !isDark && styles.logoWrapperLight]}>
            <Image
              source={require('../../assets/logo_39.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Grupo de Ações à Direita: Alternar Tema & Notificações */}
        <View style={styles.rightActionsRow}>
          {/* Botão Alternador de Tema: Light / Black */}
          <TouchableOpacity
            style={[styles.themeToggleButton, !isDark && styles.themeToggleButtonLight]}
            onPress={onToggleTheme}
            activeOpacity={0.75}
            accessibilityLabel={isDark ? 'Mudar para modo Light' : 'Mudar para modo Black'}
          >
            {isDark ? (
              <Sun size={17} color="#00B368" />
            ) : (
              <Moon size={17} color="#00874E" />
            )}
          </TouchableOpacity>

          {/* Sino de Notificações */}
          <TouchableOpacity
            style={[styles.notifButton, !isDark && styles.notifButtonLight]}
            onPress={onOpenNotifications}
            activeOpacity={0.7}
            accessibilityLabel="Ver Notificações"
          >
            <Bell size={18} color={isDark ? COLORS.textSecondary : '#4A5D53'} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerAnimatedWrapper: {
    overflow: 'hidden',
    backgroundColor: '#0D1310',
    zIndex: 900,
  },
  headerContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#0D1310',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    position: 'relative',
  },
  leftActionsContainer: {
    minWidth: 76,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  headerLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 20,
  },
  headerLoginBtnLight: {
    backgroundColor: '#EDF6F1',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  headerLoginBtnText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  headerLoginBtnTextLight: {
    color: '#00874E',
  },
  headerMemberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.4)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  headerMemberBadgeLight: {
    backgroundColor: '#E8F5EE',
    borderColor: 'rgba(0, 135, 78, 0.3)',
  },
  headerMemberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
  },
  headerMemberText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerMemberTextLight: {
    color: '#0E1712',
  },
  leftSpacer: {
    width: 76,
  },
  centerBrand: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: '#0D1410',
    borderWidth: 1.5,
    borderColor: '#00B368',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 0 12px rgba(0, 179, 104, 0.4)',
      },
    }),
  },
  logoWrapperLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00874E',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 135, 78, 0.25)',
      },
    }),
  },
  logoImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  themeToggleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleButtonLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  notifButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primaryLight,
  },
  headerAnimatedWrapperLight: {
    backgroundColor: '#FFFFFF',
  },
  headerContainerLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  notifButtonLight: {
    backgroundColor: '#F0F4F2',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
});

export default memo(Header);
