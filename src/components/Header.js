import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Bell } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export default function Header({ onOpenNotifications, visible = true }) {
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
    <Animated.View style={[styles.headerAnimatedWrapper, { height, opacity, transform: [{ translateY }] }]}>
      <View style={styles.headerContainer}>
        <View style={styles.leftBrand}>
          {/* Emblema Grupo 39 & Rio Ave FC */}
          <View style={styles.emblemWrapper}>
            <View style={styles.emblemBadge}>
              <Text style={styles.emblemLetters}>G39</Text>
            </View>
            <View style={styles.rioAveMiniBadge}>
              <Text style={styles.rioAveLetters}>RAFC</Text>
            </View>
          </View>

          <View style={styles.brandTitleRow}>
            <Text style={styles.brandMainTitle}>GRUPO 39</Text>
            <View style={styles.officialPill}>
              <Text style={styles.officialPillText}>OFICIAL</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.notifButton}
          onPress={onOpenNotifications}
          activeOpacity={0.7}
        >
          <Bell size={18} color={COLORS.textSecondary} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
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
  emblemWrapper: {
    position: 'relative',
  },
  emblemBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#00874E',
    borderWidth: 1.5,
    borderColor: '#00B368',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemLetters: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  rioAveMiniBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#111A15',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 3,
    paddingVertical: 0.5,
    borderRadius: 4,
  },
  rioAveLetters: {
    color: COLORS.gold,
    fontSize: 7,
    fontWeight: '900',
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
    backgroundColor: 'rgba(242, 182, 0, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.4)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  officialPillText: {
    color: COLORS.gold,
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
});
