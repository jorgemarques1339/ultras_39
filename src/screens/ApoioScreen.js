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
  useWindowDimensions,
} from 'react-native';
import { RefreshCw, ExternalLink, WifiOff } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const TYPEBOT_BASE_URL = 'https://typebot.co/faq-13ru6o5';

const NativeWebView =
  Platform.OS !== 'web' ? require('react-native-webview').WebView : null;

function buildNativeThemeScript(isDark) {
  return `
    (function() {
      try {
        var id = 'g39-adaptive-theme';
        var existing = document.getElementById(id);
        if (!existing) {
          existing = document.createElement('style');
          existing.id = id;
          document.head.appendChild(existing);
        }
        existing.innerHTML = ${
          isDark
            ? "'html { filter: invert(0.95) hue-rotate(180deg); background: #FFFFFF !important; } img, video { filter: invert(1) hue-rotate(180deg); }'"
            : "'html { filter: none; background: #FFFFFF !important; } img, video { filter: none; }'"
        };
      } catch (e) {}
    })();
    true;
  `;
}

function ApoioScreen({ user, isDark = true, isActive = false }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;

  const [hasActivated, setHasActivated] = useState(isActive);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const webViewRef = useRef(null);

  // Construir URL do Typebot (passando o nome do sócio se disponível)
  const botUrl = useMemo(() => {
    if (user?.name) {
      return `${TYPEBOT_BASE_URL}?nome=${encodeURIComponent(user.name)}`;
    }
    return TYPEBOT_BASE_URL;
  }, [user?.name]);

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

  // Atualizar o tema dinamicamente na WebView nativa quando o utilizador alterna Black/Light
  useEffect(() => {
    if (Platform.OS !== 'web' && webViewRef.current && hasActivated && !isLoading) {
      webViewRef.current.injectJavaScript(buildNativeThemeScript(isDark));
    }
  }, [isDark, hasActivated, isLoading]);

  const handleLoadFinished = useCallback(() => {
    setIsLoading(false);
    if (Platform.OS !== 'web' && webViewRef.current) {
      webViewRef.current.injectJavaScript(buildNativeThemeScript(isDark));
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
      window.open(botUrl, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(botUrl).catch(() => {});
    }
  }, [botUrl]);

  return (
    <View
      style={[
        styles.container,
        !isDark && styles.containerLight,
        // Espaço inferior para que a caixa de resposta/botões do Typebot fiquem sempre acima da barra flutuante
        { paddingBottom: isTablet ? 86 : 78 },
      ]}
    >
      <View style={styles.webViewWrapper}>
        {hasError ? (
          <View style={[styles.errorState, !isDark && styles.errorStateLight]}>
            <View style={styles.errorIconBox}>
              <WifiOff size={28} color={COLORS.primaryLight} />
            </View>
            <Text style={[styles.errorTitle, !isDark && styles.textDark]}>
              Não foi possível carregar o Apoio
            </Text>
            <Text style={[styles.errorDesc, !isDark && styles.textMutedDark]}>
              Verifica a tua ligação à internet ou abre o assistente diretamente no navegador.
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
              src={botUrl}
              title="Apoio ao Adepto · Grupo 39"
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
                backgroundColor: '#FFFFFF',
                filter: isDark ? 'invert(0.95) hue-rotate(180deg)' : 'none',
                transition: 'filter 0.25s ease',
              }}
              allow="microphone; clipboard-write"
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
                source={{ uri: botUrl }}
                style={[styles.nativeWebView, !isDark && styles.nativeWebViewLight]}
                javaScriptEnabled
                domStorageEnabled
                injectedJavaScript={buildNativeThemeScript(isDark)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
                allowsInlineMediaPlayback
                keyboardDisplayRequiresUserAction={false}
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

        {/* Botão flutuante discreto para reiniciar a conversa */}
        {!hasError && !isLoading && hasActivated && (
          <TouchableOpacity
            style={[styles.restartFab, !isDark && styles.restartFabLight]}
            onPress={handleReload}
            activeOpacity={0.8}
            accessibilityLabel="Reiniciar conversa de apoio"
          >
            <RefreshCw size={13} color={isDark ? '#00E676' : '#00874E'} />
          </TouchableOpacity>
        )}

        {/* Ecrã de carregamento com logótipo Grupo 39 */}
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
              A ligar ao Apoio Grupo 39...
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
    // Cor exata resultante de #FFFFFF com invert(0.95) -> rgb(13, 13, 13) para eliminar qualquer corte visual
    backgroundColor: '#0D0D0D',
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
    backgroundColor: '#0D0D0D',
  },
  nativeWebViewLight: {
    backgroundColor: '#FFFFFF',
  },
  restartFab: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(13, 19, 16, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'pointer',
      },
    }),
  },
  restartFabLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(0, 135, 78, 0.28)',
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

export default memo(ApoioScreen);
