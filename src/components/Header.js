import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export default function Header({ onOpenNotifications }) {
  return (
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

        <View style={styles.titleInfo}>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandMainTitle}>GRUPO 39</Text>
            <View style={styles.officialPill}>
              <Text style={styles.officialPillText}>OFICIAL</Text>
            </View>
          </View>
          <Text style={styles.subTitle} numberOfLines={1}>Rio Ave F.C. · Vila do Conde</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.notifButton}
        onPress={onOpenNotifications}
        activeOpacity={0.7}
      >
        <Bell size={20} color={COLORS.textSecondary} />
        <View style={styles.notifDot} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#0D1310',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  leftBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  emblemWrapper: {
    position: 'relative',
  },
  emblemBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#00874E',
    borderWidth: 2,
    borderColor: '#00B368',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemLetters: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  rioAveMiniBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#111A15',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  rioAveLetters: {
    color: COLORS.gold,
    fontSize: 8,
    fontWeight: '900',
  },
  titleInfo: {
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandMainTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  officialPill: {
    backgroundColor: 'rgba(242, 182, 0, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  officialPillText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '800',
  },
  subTitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
  },
});
