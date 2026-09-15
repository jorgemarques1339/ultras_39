import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { COLORS } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AnimatedSplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  // Valores de animação
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.6)).current;
  const ringScale = useRef(new Animated.Value(0.85)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(14)).current;
  const barProgress = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Sequência de Entrada: Logo expande e surge com glow
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(ringOpacity, {
        toValue: 0.8,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(ringScale, {
        toValue: 1.15,
        friction: 5,
        tension: 30,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 500,
        delay: 200,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(barProgress, {
        toValue: 1,
        duration: 1200,
        delay: 150,
        useNativeDriver: false,
      }),
    ]).start();

    // Pulso contínuo do anel de luz verde enquanto carrega
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(glowPulse, {
          toValue: 0.6,
          duration: 700,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    pulseLoop.start();

    // 2. Transição suave de saída após 1.6 segundos
    const timer = setTimeout(() => {
      pulseLoop.stop();
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(logoScale, {
          toValue: 1.12,
          duration: 400,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(() => {
        setVisible(false);
        if (onFinish) onFinish();
      });
    }, 1600);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, []);

  if (!visible) return null;

  const barWidthInterpolated = barProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Luz ambiente de fundo verde */}
      <View style={styles.ambientGlowBackground} pointerEvents="none" />

      <View style={styles.centerBox}>
        {/* Anel luminoso holográfico exterior */}
        <Animated.View
          style={[
            styles.outerPulseRing,
            {
              transform: [{ scale: ringScale }],
              opacity: ringOpacity,
            },
          ]}
        />

        {/* Glow verde pulsante por trás do logótipo */}
        <Animated.View
          style={[
            styles.logoGlowCircle,
            {
              opacity: glowPulse,
            },
          ]}
        />

        {/* Logótipo Oficial da Claque com animação de Spring */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/logo_39.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Textos da Claque com animação suave */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.titleText}>GRUPO 39</Text>
          <Text style={styles.subtitleText}>RIO AVE FC · BANCADA POENTE</Text>
          <View style={styles.badgeRow}>
            <View style={styles.greenDot} />
            <Text style={styles.taglineText}>ULTRAS VILACONDENSES</Text>
          </View>
        </Animated.View>

        {/* Barra de Carregamento Estilizada */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: barWidthInterpolated },
              ]}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0D1310',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999999,
    elevation: 999999,
  },
  ambientGlowBackground: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.4,
    height: SCREEN_WIDTH * 1.4,
    borderRadius: SCREEN_WIDTH * 0.7,
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  outerPulseRing: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 2,
    borderColor: 'rgba(0, 230, 118, 0.35)',
    top: -25,
  },
  logoGlowCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 179, 104, 0.28)',
    top: -10,
    ...Platform.select({
      web: {
        filter: 'blur(20px)',
      },
    }),
  },
  logoWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 10px 25px rgba(0, 230, 118, 0.35))',
      },
    }),
  },
  logoImage: {
    width: 175,
    height: 175,
  },
  textContainer: {
    alignItems: 'center',
    gap: 4,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-black' }),
    textShadowColor: 'rgba(0, 230, 118, 0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitleText: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.2,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.2)',
    marginTop: 8,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
  },
  taglineText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  progressContainer: {
    marginTop: 36,
    width: 140,
  },
  progressBarTrack: {
    height: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00E676',
    borderRadius: 2,
  },
});
