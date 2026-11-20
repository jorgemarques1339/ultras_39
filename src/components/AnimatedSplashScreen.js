import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Platform,
} from 'react-native';

const BAR_WIDTH = 160;
const USE_NATIVE = Platform.OS !== 'web';

export default function AnimatedSplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);
  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const barTranslateX = useRef(new Animated.Value(-BAR_WIDTH)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isMounted = true;

    const completeSplash = () => {
      if (finishedRef.current || !isMounted) return;
      finishedRef.current = true;
      setVisible(false);
      if (onFinishRef.current) onFinishRef.current();
    };

    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(barTranslateX, {
          toValue: 0,
          duration: 950,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: USE_NATIVE,
        }),
      ]),
      Animated.delay(120),
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.ease),
        useNativeDriver: USE_NATIVE,
      }),
    ]);

    sequence.start(() => {
      completeSplash();
    });

    // Segurança para garantir que o ecrã inicial fecha sempre mesmo se a animação for interrompida
    const safetyTimer = setTimeout(completeSplash, 2000);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      sequence.stop();
    };
  }, []);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { opacity: containerOpacity }]}
    >
      <Animated.View style={[styles.logoWrapper, { opacity: logoOpacity }]}>
        <Image
          source={require('../../assets/logo_39.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { transform: [{ translateX: barTranslateX }] },
            ]}
          />
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
  logoWrapper: {
    marginBottom: 28,
  },
  logo: {
    width: 150,
    height: 150,
  },
  progressContainer: {
    width: BAR_WIDTH,
  },
  progressBarTrack: {
    width: BAR_WIDTH,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: BAR_WIDTH,
    height: '100%',
    backgroundColor: '#00E676',
    borderRadius: 2,
  },
});
