import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Platform } from 'react-native';
import { Bell, Sun, Moon } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export default function Header({ onOpenNotifications, visible = true, isDark = true, onToggleTheme }) {
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
    <Animated.View style={[styles.headerAnimatedWrapper, { height, opacity, transform: [{ translateY }] }, !isDark && styles.headerAnimatedWrapperLight]}>
      <View style={[styles.headerContainer, !isDark && styles.headerContainerLight]}>
        <View style={styles.leftBrand}>
          {/* Logótipo Oficial Grupo 39 */}
          <View style={[styles.logoWrapper, !isDark && styles.logoWrapperLight]}>
            <Image
              source={require('../../assets/logo_39.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.brandTitleRow}>
            <Text style={[styles.brandMainTitle, !isDark && styles.brandMainTitleLight]}>GRUPO 39</Text>
            <View style={styles.officialPill}>
              <Text style={styles.officialPillText}>OFICIAL</Text>
            </View>
          </View>
        </View>

        {/* Grupo de Ações à Direita: Alternar Tema & Notificações */}
        <View style={styles.rightActionsRow}>
          {/* Botão Alternador de Tema: Light / Black */}
          <TouchableOpacity
            style={[styles.themeToggleButton, !isDark && styles.themeToggleButtonLight]}
            onPress={onToggleTheme}
            activeOpacity={0.75}
            accessibilityLabel={isDark ? "Mudar para modo Light" : "Mudar para modo Black"}
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
  },
  leftBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logoWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#0D1410',
    borderWidth: 1.5,
    borderColor: '#00B368',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 0 10px rgba(0, 179, 104, 0.35)',
      },
    }),
  },
  logoWrapperLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00874E',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 135, 78, 0.2)',
      },
    }),
  },
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandMainTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  officialPill: {
    backgroundColor: 'rgba(0, 179, 104, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.45)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  officialPillText: {
    color: '#00B368',
    fontSize: 8.5,
    fontWeight: '800',
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
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  headerAnimatedWrapperLight: {
    backgroundColor: '#FFFFFF',
  },
  headerContainerLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  brandMainTitleLight: {
    color: '#14201A',
  },
  notifButtonLight: {
    backgroundColor: '#F0F4F2',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
});
