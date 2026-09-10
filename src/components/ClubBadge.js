import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const LOCAL_BADGES = {
  'rio ave fc': require('../../assets/badges/rio_ave.png'),
  'rio ave': require('../../assets/badges/rio_ave.png'),
  'rafc': require('../../assets/badges/rio_ave.png'),

  'estrela': require('../../assets/badges/estrela_amadora.png'),
  'estrela da amadora': require('../../assets/badges/estrela_amadora.png'),
  'cf estrela da amadora': require('../../assets/badges/estrela_amadora.png'),
  'estrela amadora': require('../../assets/badges/estrela_amadora.png'),
  'cfea': require('../../assets/badges/estrela_amadora.png'),

  'fc alverca': require('../../assets/badges/alverca.png'),
  'alverca': require('../../assets/badges/alverca.png'),

  'cd nacional': require('../../assets/badges/nacional.png'),
  'c.d. nacional': require('../../assets/badges/nacional.png'),
  'nacional': require('../../assets/badges/nacional.png'),

  'fc famalicão': require('../../assets/badges/famalicao.png'),
  'fc famalicao': require('../../assets/badges/famalicao.png'),
  'famalicão': require('../../assets/badges/famalicao.png'),
  'famalicao': require('../../assets/badges/famalicao.png'),

  'santa clara': require('../../assets/badges/santa_clara.png'),
  'cd santa clara': require('../../assets/badges/santa_clara.png'),

  'sporting cp': require('../../assets/badges/sporting.png'),
  'sporting': require('../../assets/badges/sporting.png'),
  'sporting lisbon': require('../../assets/badges/sporting.png'),

  'estoril praia': require('../../assets/badges/estoril.png'),
  'estoril': require('../../assets/badges/estoril.png'),

  'fc porto': require('../../assets/badges/porto.png'),
  'porto': require('../../assets/badges/porto.png'),

  'sc braga': require('../../assets/badges/braga.png'),
  'braga': require('../../assets/badges/braga.png'),

  'boavista fc': require('../../assets/badges/boavista.png'),
  'boavista': require('../../assets/badges/boavista.png'),
};

// Emblemas oficiais de alta definição (CDN) para garantir que NENHUM clube da Liga falhe
const CDN_BADGES = {
  'estrela': 'https://a.espncdn.com/i/teamlogos/soccer/500/21610.png',
  'rio ave': 'https://a.espncdn.com/i/teamlogos/soccer/500/3822.png',
  'benfica': 'https://a.espncdn.com/i/teamlogos/soccer/500/1929.png',
  'porto': 'https://a.espncdn.com/i/teamlogos/soccer/500/437.png',
  'sporting': 'https://a.espncdn.com/i/teamlogos/soccer/500/2250.png',
  'braga': 'https://a.espncdn.com/i/teamlogos/soccer/500/3821.png',
  'vitoria': 'https://a.espncdn.com/i/teamlogos/soccer/500/3823.png',
  'guimaraes': 'https://a.espncdn.com/i/teamlogos/soccer/500/3823.png',
  'alverca': 'https://a.espncdn.com/i/teamlogos/soccer/500/3829.png',
  'nacional': 'https://a.espncdn.com/i/teamlogos/soccer/500/3828.png',
  'santa clara': 'https://a.espncdn.com/i/teamlogos/soccer/500/4260.png',
  'estoril': 'https://a.espncdn.com/i/teamlogos/soccer/500/4261.png',
  'famalicao': 'https://a.espncdn.com/i/teamlogos/soccer/500/18816.png',
  'boavista': 'https://a.espncdn.com/i/teamlogos/soccer/500/3820.png',
  'moreirense': 'https://a.espncdn.com/i/teamlogos/soccer/500/3827.png',
  'gil vicente': 'https://a.espncdn.com/i/teamlogos/soccer/500/3826.png',
  'arouca': 'https://a.espncdn.com/i/teamlogos/soccer/500/14022.png',
  'farense': 'https://a.espncdn.com/i/teamlogos/soccer/500/3825.png',
  'casa pia': 'https://a.espncdn.com/i/teamlogos/soccer/500/20349.png',
  'avs': 'https://a.espncdn.com/i/teamlogos/soccer/500/22744.png',
};

function resolveBadgeSource(name, logoUrl) {
  const clean = (name || '').toLowerCase().trim();

  // 1. Verificação direta no mapa local
  if (LOCAL_BADGES[clean]) {
    return { source: LOCAL_BADGES[clean], isUri: false };
  }

  // 2. Verificação por inclusão de palavras-chave locais
  if (clean.includes('estrela')) return { source: LOCAL_BADGES['estrela'], isUri: false };
  if (clean.includes('rio ave')) return { source: LOCAL_BADGES['rio ave'], isUri: false };
  if (clean.includes('alverca')) return { source: LOCAL_BADGES['alverca'], isUri: false };
  if (clean.includes('nacional')) return { source: LOCAL_BADGES['nacional'], isUri: false };
  if (clean.includes('famalic')) return { source: LOCAL_BADGES['famalicao'], isUri: false };
  if (clean.includes('santa clara')) return { source: LOCAL_BADGES['santa clara'], isUri: false };
  if (clean.includes('sporting')) return { source: LOCAL_BADGES['sporting'], isUri: false };
  if (clean.includes('estoril')) return { source: LOCAL_BADGES['estoril'], isUri: false };
  if (clean.includes('porto')) return { source: LOCAL_BADGES['porto'], isUri: false };
  if (clean.includes('braga')) return { source: LOCAL_BADGES['braga'], isUri: false };
  if (clean.includes('boavista')) return { source: LOCAL_BADGES['boavista'], isUri: false };

  // 3. Se foi fornecido logoUrl válido da API (ESPN)
  if (logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('http')) {
    return { source: { uri: logoUrl }, isUri: true };
  }

  // 4. Verificação no mapa de CDN de segurança
  for (const [key, url] of Object.entries(CDN_BADGES)) {
    if (clean.includes(key)) {
      return { source: { uri: url }, isUri: true };
    }
  }

  return null;
}

export default function ClubBadge({
  name = '',
  logo = null,
  logoUrl = null,
  size = 'md',
  style,
  showContainer = true,
  isDark = true,
}) {
  const [hasError, setHasError] = useState(false);

  const cleanName = (name || '').toLowerCase().trim();
  const isRioAve = cleanName.includes('rio ave');

  const resolved = resolveBadgeSource(name, logo || logoUrl);

  const dimensions = {
    xs: { box: 24, img: 20, font: 9, radius: 6 },
    sm: { box: 32, img: 26, font: 10, radius: 8 },
    md: { box: 42, img: 34, font: 12, radius: 12 },
    lg: { box: 64, img: 52, font: 16, radius: 20 },
    xl: { box: 76, img: 62, font: 18, radius: 24 },
  }[size] || { box: 42, img: 34, font: 12, radius: 12 };

  // Se não encontrar nenhuma fonte ou a imagem falhar
  if (!resolved || hasError) {
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
            backgroundColor: isRioAve ? '#00874E' : (isDark ? '#1A2922' : '#E8EFEA'),
            borderColor: isRioAve ? '#00B368' : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 135, 78, 0.2)'),
          },
          style,
        ]}
      >
        <Text
          style={[
            styles.fallbackText,
            {
              fontSize: dimensions.font,
              color: isRioAve ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#0E1712'),
            },
          ]}
        >
          {initials}
        </Text>
      </View>
    );
  }

  const containerBg = isRioAve
    ? (isDark ? 'rgba(0, 135, 78, 0.18)' : '#EDF5F0')
    : (isDark ? '#14201A' : '#F7FAF8');

  const containerBorder = isRioAve
    ? (isDark ? 'rgba(0, 179, 104, 0.45)' : 'rgba(0, 135, 78, 0.3)')
    : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 135, 78, 0.16)');

  return (
    <View
      style={[
        showContainer && styles.container,
        showContainer && {
          width: dimensions.box,
          height: dimensions.box,
          borderRadius: dimensions.radius,
          backgroundColor: containerBg,
          borderColor: containerBorder,
        },
        style,
      ]}
    >
      <Image
        source={resolved.source}
        style={{
          width: dimensions.img,
          height: dimensions.img,
        }}
        resizeMode="contain"
        onError={() => setHasError(true)}
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
    fontWeight: '900',
  },
});
