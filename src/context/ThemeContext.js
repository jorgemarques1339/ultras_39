import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cores para o tema Black (Dark Verde Rio Ave)
export const DARK_THEME = {
  mode: 'black',
  primary: '#00874E',
  primaryDark: '#005D35',
  primaryLight: '#00B368',
  primaryGlow: 'rgba(0, 179, 104, 0.45)',
  white: '#FFFFFF',
  gold: '#00B368',
  goldGlow: 'rgba(0, 179, 104, 0.35)',

  bgDark: '#0D1310',
  bgCard: '#131D18',
  bgCardElevated: '#1A2721',
  bgInput: '#18241E',
  headerBg: '#0D1310',
  navBg: 'rgba(11, 18, 14, 0.94)',

  mbwayBlue: '#004B87',
  mbwayTeal: '#00A3E0',
  mbwayRed: '#E31B23',

  success: '#00C853',
  warning: '#00B368',
  error: '#FF5252',
  info: '#00B368',

  textPrimary: '#FFFFFF',
  textSecondary: '#A0B4AA',
  textMuted: '#677E73',
  textGold: '#00B368',

  glassBg: 'rgba(19, 29, 24, 0.78)',
  glassBgHeavy: 'rgba(13, 19, 16, 0.92)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassBorderActive: 'rgba(0, 179, 104, 0.6)',
  glassHighlight: 'rgba(255, 255, 255, 0.2)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
};

// Cores para o tema Light (Branco & Verde Rio Ave)
export const LIGHT_THEME = {
  mode: 'light',
  primary: '#00874E',
  primaryDark: '#005D35',
  primaryLight: '#00874E',
  primaryGlow: 'rgba(0, 135, 78, 0.25)',
  white: '#1A2420',
  gold: '#00874E',
  goldGlow: 'rgba(0, 135, 78, 0.2)',

  bgDark: '#FFFFFF',
  bgCard: '#FFFFFF',
  bgCardElevated: '#F8FAF9',
  bgInput: '#F0F4F2',
  headerBg: '#FFFFFF',
  navBg: 'rgba(255, 255, 255, 0.96)',

  mbwayBlue: '#004B87',
  mbwayTeal: '#00A3E0',
  mbwayRed: '#E31B23',

  success: '#00874E',
  warning: '#00874E',
  error: '#D32F2F',
  info: '#00874E',

  textPrimary: '#14201A',
  textSecondary: '#4A5D53',
  textMuted: '#7E9187',
  textGold: '#00874E',

  glassBg: 'rgba(255, 255, 255, 0.92)',
  glassBgHeavy: 'rgba(244, 247, 245, 0.98)',
  glassBorder: 'rgba(0, 135, 78, 0.15)',
  glassBorderActive: 'rgba(0, 135, 78, 0.45)',
  glassHighlight: 'rgba(0, 135, 78, 0.1)',
  cardBorder: 'rgba(0, 135, 78, 0.12)',
};

const THEME_STORAGE_KEY = '@grupo39_app_theme';

// Utilitário para ler o tema guardado
const getStoredTheme = async () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) return saved;
    }
    const val = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    return val;
  } catch (e) {
    return null;
  }
};

// Utilitário para persistir o tema escolhido
const setStoredTheme = async (mode) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (e) {
    // Ignorar erros de armazenamento
  }
};

const ThemeContext = createContext({
  theme: DARK_THEME,
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  // Inicialização síncrona se disponível no browser para evitar flicker
  const [isDark, setIsDark] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (saved === 'light') return false;
        if (saved === 'black' || saved === 'dark') return true;
      }
    } catch (e) {}
    return true;
  });

  // Carregamento assíncrono via AsyncStorage para compatibilidade total iOS/Android
  useEffect(() => {
    let isMounted = true;
    const loadTheme = async () => {
      try {
        const saved = await getStoredTheme();
        if (isMounted && saved) {
          if (saved === 'light') {
            setIsDark(false);
          } else if (saved === 'black' || saved === 'dark') {
            setIsDark(true);
          }
        }
      } catch (e) {}
    };
    loadTheme();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const nextVal = !prev;
      const nextMode = nextVal ? 'black' : 'light';
      setStoredTheme(nextMode);
      return nextVal;
    });
  };

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
