import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { RefreshCw, ExternalLink, WifiOff } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const STORE_URL = 'https://verdant-ember-d4vt.here.now/';

const NativeWebView =
  Platform.OS !== 'web' ? require('react-native-webview').WebView : null;

function StoreScreen({ isDark = true, isActive = false }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;

  const [hasActivated, setHasActivated] = useState(isActive);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const webViewRef = useRef(null);

  useEffect(() => {
    if (isActive && !hasActivated) {
      setHasActivated(true);
    }
  }, [isActive, hasActivated]);

  const handleReload = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    if (Platform.OS !== 'web' && webViewRef.current) {
      webViewRef.current.reload();
    } else {
      setReloadKey((k) => k + 1);
    }
  }, []);

  const handleOpenExternal = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(STORE_URL, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(STORE_URL).catch(() => {});
    }
  }, []);

  return (
    <View
      style={[
        styles.container,
        !isDark && styles.containerLight,
        { paddingBottom: isTablet ? 86 : 78 },
      ]}
    >
      {/* Área Principal do WebView */}
      <View style={styles.webViewWrapper}>
        {hasError ? (
          <View style={[styles.errorState, !isDark && styles.errorStateLight]}>
            <View style={styles.errorIconBox}>
              <WifiOff size={28} color={COLORS.primaryLight} />
            </View>
            <Text style={[styles.errorTitle, !isDark && styles.textDark]}>
              Não foi possível carregar a Loja
            </Text>
            <Text style={[styles.errorDesc, !isDark && styles.textMutedDark]}>
              Verifica a tua ligação à internet ou abre a loja diretamente no navegador.
            </Text>
            <View style={styles.errorActions}>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={handleReload}
                activeOpacity={0.85}
              >
                <RefreshCw size={15} color="#FFF" />
                <Text style={styles.retryBtnText}>Tentar Novamente</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.externalBtn, !isDark && styles.externalBtnLight]}
                onPress={handleOpenExternal}
                activeOpacity={0.8}
              >
                <ExternalLink size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
                <Text style={[styles.externalBtnText, !isDark && { color: '#00874E' }]}>
                  Abrir no Browser
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : hasActivated ? (
          Platform.OS === 'web' ? (
            <iframe
              key={reloadKey}
              src={STORE_URL}
              title="Loja Oficial Grupo 39"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: isDark ? '#0D1310' : '#FFFFFF',
              }}
              allow="payment; clipboard-write; fullscreen"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          ) : (
            NativeWebView && (
              <NativeWebView
                ref={webViewRef}
                source={{ uri: STORE_URL }}
                style={[styles.nativeWebView, !isDark && styles.nativeWebViewLight]}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState={false}
                onLoadStart={() => {
                  setIsLoading(true);
                  setHasError(false);
                }}
                onLoadEnd={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                allowsBackForwardNavigationGestures
              />
            )
          )
        ) : null}

        {isLoading && !hasError && hasActivated && (
          <View
            style={[styles.loadingOverlay, !isDark && styles.loadingOverlayLight]}
            pointerEvents="none"
          >
            <ActivityIndicator size="large" color={COLORS.primaryLight} />
            <Text style={[styles.loadingText, !isDark && styles.textMutedDark]}>
              A carregar Loja Oficial G39...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1310',
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  webViewWrapper: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  nativeWebView: {
    flex: 1,
    backgroundColor: '#0D1310',
  },
  nativeWebViewLight: {
    backgroundColor: '#FFFFFF',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 19, 16, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingOverlayLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A0B4AA',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#0D1310',
  },
  errorStateLight: {
    backgroundColor: '#FFFFFF',
  },
  errorIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  errorDesc: {
    fontSize: 13,
    color: '#A0B4AA',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  externalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },
  externalBtnLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.08)',
    borderColor: 'rgba(0, 135, 78, 0.3)',
  },
  externalBtnText: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
  textDark: {
    color: '#14201A',
  },
  textMutedDark: {
    color: '#5A6E63',
  },
});

export default memo(StoreScreen);
