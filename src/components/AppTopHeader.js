import React, { memo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HEADER_TITLES = {
  home: 'GRUPO',
  apoio: 'APOIO',
  profile: 'SÓCIO',
};

const MATCH_CENTER_HEADER_DARK = [
  'rgba(10, 46, 30, 0.90)',
  'rgba(0, 90, 54, 0.88)',
  'rgba(9, 30, 21, 0.92)',
];

const MATCH_CENTER_HEADER_LIGHT = [
  'rgba(217, 244, 229, 0.88)',
  'rgba(236, 249, 242, 0.86)',
  'rgba(203, 238, 219, 0.88)',
];

function AppTopHeader({ activeTab, isDark = true }) {
  const prefix = HEADER_TITLES[activeTab] || 'GRUPO';
  const isHome = activeTab === 'home';

  const content = (
    <View style={styles.brandRow}>
      <View style={[styles.logoCircle, !isDark && styles.logoCircleLight]}>
        <Image
          source={require('../../assets/logo_39.png')}
          style={styles.logoImg}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.brandName, !isDark && styles.brandNameLight]}>
        {prefix} <Text style={[styles.greenText, !isDark && styles.greenTextLight]}>39</Text>
      </Text>
    </View>
  );

  if (isHome) {
    return (
      <LinearGradient
        colors={isDark ? MATCH_CENTER_HEADER_DARK : MATCH_CENTER_HEADER_LIGHT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          styles.headerHomeBorder,
          !isDark && styles.headerHomeBorderLight,
        ]}
      >
        {content}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.header, !isDark && styles.headerLight]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#0D1310',
    borderBottomWidth: 0,
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
  headerLight: {
    backgroundColor: '#F5F8F6',
  },
  headerHomeBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 135, 78, 0.35)',
  },
  headerHomeBorderLight: {
    borderBottomColor: 'rgba(0, 135, 81, 0.28)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0D1310',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 89, 0.4)',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoCircleLight: {
    backgroundColor: '#F5F8F6',
    borderColor: 'rgba(0, 135, 78, 0.35)',
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  brandName: {
    fontSize: 18.5,
    fontWeight: '900',
    letterSpacing: -0.2,
    color: '#FFFFFF',
  },
  brandNameLight: {
    color: '#111827',
  },
  greenText: {
    color: '#34d399',
  },
  greenTextLight: {
    color: '#00874E',
  },
});

export default memo(AppTopHeader);
