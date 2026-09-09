import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

const LOCAL_BADGES = {
  'rio ave fc': require('../../assets/badges/rio_ave.png'),
  'rio ave': require('../../assets/badges/rio_ave.png'),
  'rafc': require('../../assets/badges/rio_ave.png'),
  
  'estrela da amadora': require('../../assets/badges/estrela_amadora.png'),
  'cf estrela da amadora': require('../../assets/badges/estrela_amadora.png'),
  'cfea': require('../../assets/badges/estrela_amadora.png'),
  
  'fc alverca': require('../../assets/badges/alverca.png'),
  'alverca': require('../../assets/badges/alverca.png'),
  
  'cd nacional': require('../../assets/badges/nacional.png'),
  'nacional': require('../../assets/badges/nacional.png'),
  
  'fc famalicão': require('../../assets/badges/famalicao.png'),
  'famalicão': require('../../assets/badges/famalicao.png'),
  'famalicao': require('../../assets/badges/famalicao.png'),
  
  'santa clara': require('../../assets/badges/santa_clara.png'),
  'cd santa clara': require('../../assets/badges/santa_clara.png'),
  
  'sporting cp': require('../../assets/badges/sporting.png'),
  'sporting': require('../../assets/badges/sporting.png'),
  
  'estoril praia': require('../../assets/badges/estoril.png'),
  'estoril': require('../../assets/badges/estoril.png'),
  
  'fc porto': require('../../assets/badges/porto.png'),
  'porto': require('../../assets/badges/porto.png'),
  
  'sc braga': require('../../assets/badges/braga.png'),
  'braga': require('../../assets/badges/braga.png'),
  
  'boavista fc': require('../../assets/badges/boavista.png'),
  'boavista': require('../../assets/badges/boavista.png'),
};

export default function ClubBadge({ name = '', size = 'md', style, showContainer = true }) {
  const [loadError, setLoadError] = useState(false);

  const cleanName = (name || '').toLowerCase().trim();
  const badgeSource = LOCAL_BADGES[cleanName];

  const dimensions = {
    xs: { box: 24, img: 20, font: 9, radius: 6 },
    sm: { box: 32, img: 26, font: 10, radius: 8 },
    md: { box: 42, img: 34, font: 12, radius: 12 },
    lg: { box: 64, img: 52, font: 16, radius: 20 },
    xl: { box: 76, img: 62, font: 18, radius: 24 },
  }[size] || { box: 42, img: 34, font: 12, radius: 12 };

  const isRioAve = cleanName.includes('rio ave');

  if (!badgeSource || loadError) {
    // Fallback estilizado com iniciais
    const initials = (name || 'FC')
      .split(' ')
      .slice(0, 2)
      .map((w) => w.charAt(0))
      .join('')
      .toUpperCase();

    return (
      <View
        style={[
          styles.container,
          {
            width: dimensions.box,
            height: dimensions.box,
            borderRadius: dimensions.radius,
            backgroundColor: isRioAve ? '#00874E' : '#1A2922',
            borderColor: isRioAve ? '#00B368' : 'rgba(255, 255, 255, 0.12)',
          },
          style,
        ]}
      >
        <Text style={[styles.fallbackText, { fontSize: dimensions.font }]}>
          {initials}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        showContainer && styles.container,
        showContainer && {
          width: dimensions.box,
          height: dimensions.box,
          borderRadius: dimensions.radius,
          backgroundColor: isRioAve ? 'rgba(0, 135, 78, 0.18)' : '#14201A',
          borderColor: isRioAve ? 'rgba(0, 179, 104, 0.45)' : 'rgba(255, 255, 255, 0.1)',
        },
        style,
      ]}
    >
      <Image
        source={badgeSource}
        style={{
          width: dimensions.img,
          height: dimensions.img,
        }}
        resizeMode="contain"
        onError={() => setLoadError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  fallbackText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
