import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshCw, ExternalLink, WifiOff } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const STORE_URL = 'https://verdant-ember-d4vt.here.now/';

const NativeWebView =
  Platform.OS !== 'web' ? require('react-native-webview').WebView : null;

// CSS/JS injetado em Android/iOS para dar sensação 100% nativa à loja embutida
const NATIVE_EMBED_JS = `
  (function() {
    try {
      var style = document.createElement('style');
      style.innerHTML = [
        'html, body { overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; }',
        'body { padding-bottom: 92px !important; }',
        '::-webkit-scrollbar { display: none; }'
      ].join(' ');
      document.head.appendChild(style);
    } catch (e) {}
  })();
  true;
`;

function StoreScreen({ isDark = true, isActive = false }) {
  const [hasActivated, setHasActivated] = useState(isActive);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const webViewRef = useRef(null);
  const iframeRef = useRef(null);

  const themedStoreUrl = useMemo(
    () => `${STORE_URL}?theme=${isDark ? 'dark' : 'light'}`,
    [isDark]
  );

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    if (Platform.OS === 'web') {
      try {
        iframeRef.current?.contentWindow?.postMessage({ type: 'g39-theme', theme }, '*');
      } catch (_) {}
    } else if (webViewRef.current && hasActivated && !isLoading) {
      webViewRef.current.injectJavaScript(
        `(function(){ if(typeof applyStoreTheme==='function'){ applyStoreTheme('${theme}'); } })(); true;`
      );
    }
  }, [isDark, hasActivated, isLoading]);

  useEffect(() => {
    if (isActive && !hasActivated) {
      setHasActivated(true);
    }
  }, [isActive, hasActivated]);

  // Fallback de segurança para nunca deixar o ecrã de carregamento preso
  useEffect(() => {
    if (!hasActivated || !isLoading) return;
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(safetyTimer);
  }, [hasActivated, isLoading, reloadKey]);

  const handleLoadFinished = useCallback(() => {
    setIsLoading(false);
    const theme = isDark ? 'dark' : 'light';
    if (Platform.OS === 'web') {
      try {
        iframeRef.current?.contentWindow?.postMessage({ type: 'g39-theme', theme }, '*');
      } catch (_) {}
    } else if (webViewRef.current) {
      webViewRef.current.injectJavaScript(
        `(function(){ if(typeof applyStoreTheme==='function'){ applyStoreTheme('${theme}'); } })(); true;`
      );
    }
  }, [isDark]);

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
    <View style={[styles.container, !isDark && styles.containerLight]}>
      {/* Área Edge-to-Edge Imersiva da Loja */}
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
              ref={iframeRef}
              key={reloadKey}
              src={themedStoreUrl}
              title="Loja Oficial Grupo 39"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
                backgroundColor: isDark ? '#0D1310' : '#FFFFFF',
              }}
              allow="payment; clipboard-write; fullscreen"
              onLoad={handleLoadFinished}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          ) : (
            NativeWebView && (
              <NativeWebView
                ref={webViewRef}
                source={{ uri: themedStoreUrl }}
                style={[styles.nativeWebView, !isDark && styles.nativeWebViewLight]}
                javaScriptEnabled
                domStorageEnabled
                injectedJavaScript={NATIVE_EMBED_JS}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
                pullToRefreshEnabled
                allowsInlineMediaPlayback
                allowsBackForwardNavigationGestures
                startInLoadingState={false}
                onLoadStart={() => {
                  setIsLoading(true);
                  setHasError(false);
                }}
                onLoadEnd={handleLoadFinished}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />
            )
          )
        ) : null}

        {/* Degradê inferior subtil para fundir a loja com a barra de navegação flutuante */}
        {!hasError && (
          <LinearGradient
            colors={
              isDark
                ? ['rgba(13, 19, 16, 0)', 'rgba(13, 19, 16, 0.72)', 'rgba(13, 19, 16, 0.95)']
                : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.72)', 'rgba(255, 255, 255, 0.96)']
            }
            style={styles.bottomNavFade}
            pointerEvents="none"
          />
        )}

        {/* Ecrã de transição nativo com logótipo Grupo 39 enquanto a loja carrega */}
        {isLoading && !hasError && hasActivated && (
          <View
            style={[styles.loadingOverlay, !isDark && styles.loadingOverlayLight]}
            pointerEvents="none"
          >
            <View style={[styles.loaderLogoCircle, !isDark && styles.loaderLogoCircleLight]}>
              <Image
                source={require('../../assets/logo_39.png')}
                style={styles.loaderLogo}
                resizeMode="contain"
              />
            </View>
            <ActivityIndicator size="small" color={COLORS.primaryLight} style={{ marginTop: 6 }} />
            <Text style={[styles.loadingText, !isDark && styles.textMutedDark]}>
              A preparar Loja Oficial...
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
    width: '100%',
    height: '100%',
    backgroundColor: '#0D1310',
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  webViewWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  bottomNavFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 86,
    zIndex: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0D1310',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    zIndex: 10,
  },
  loadingOverlayLight: {
    backgroundColor: '#FFFFFF',
  },
  loaderLogoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderLogoCircleLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.08)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  loaderLogo: {
    width: 48,
    height: 48,
  },
  loadingText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#A0B4AA',
    letterSpacing: 0.2,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 80,
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
