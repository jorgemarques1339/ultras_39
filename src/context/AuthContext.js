import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_USER } from '../data/mockData';

const AUTH_STORAGE_KEY = '@grupo39_user_session';

// Utilizador padrão pré-configurado
export const DEFAULT_DEMO_USER = {
  ...INITIAL_USER,
  email: 'exemplo@gmail.com',
  password: '1234567',
};

const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  authModalVisible: false,
  authModalOptions: {},
  openAuthModal: () => {},
  closeAuthModal: () => {},
  login: async () => ({ success: true }),
  register: async () => ({ success: true }),
  logout: async () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authModalOptions, setAuthModalOptions] = useState({});

  // Carregar sessão persistida ao iniciar a app
  useEffect(() => {
    let isMounted = true;
    const loadSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedSession && isMounted) {
          const parsed = JSON.parse(storedSession);
          setUser(parsed);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.warn('Erro ao carregar sessão persistida:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const openAuthModal = useCallback((options) => {
    if (typeof options === 'string') {
      setAuthModalOptions({ initialTab: options });
    } else if (options && typeof options === 'object') {
      setAuthModalOptions(options);
    } else {
      setAuthModalOptions({});
    }
    setAuthModalVisible(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalVisible(false);
    setAuthModalOptions({});
  }, []);

  const login = useCallback(async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Verificação de conta demo ou credenciais
    if (cleanEmail === 'exemplo@gmail.com' && cleanPass === '1234567') {
      const loggedUser = { ...DEFAULT_DEMO_USER };
      setUser(loggedUser);
      setIsLoggedIn(true);
      setAuthModalVisible(false);
      try {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
      } catch (e) {}
      return { success: true };
    }

    // Permitir qualquer outro utilizador se tiver password válida (mínimo 4 caracteres)
    if (cleanEmail.includes('@') && cleanPass.length >= 4) {
      const newUser = {
        ...INITIAL_USER,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        memberCategory: 'Sócio Convidado',
      };
      setUser(newUser);
      setIsLoggedIn(true);
      setAuthModalVisible(false);
      try {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      } catch (e) {}
      return { success: true };
    }

    return {
      success: false,
      error: 'Credenciais inválidas. Experimenta a conta demo: exemplo@gmail.com / 1234567',
    };
  }, []);

  const register = useCallback(async (name, email, password, phone = '912 000 000') => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const cleanName = (name || '').trim();

    if (!cleanName) {
      return { success: false, error: 'Por favor introduz o teu nome.' };
    }
    if (!cleanEmail.includes('@')) {
      return { success: false, error: 'Por favor introduz um email válido.' };
    }
    if (cleanPass.length < 4) {
      return { success: false, error: 'A palavra-passe deve ter pelo menos 4 caracteres.' };
    }

    const newUser = {
      ...INITIAL_USER,
      name: cleanName,
      email: cleanEmail,
      phone,
      memberCategory: 'Novo Sócio Grupo 39',
      quotaStatus: 'pendente',
      quotaAmount: 12.00,
    };

    setUser(newUser);
    setIsLoggedIn(true);
    setAuthModalVisible(false);
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch (e) {}

    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {}
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const updateUser = useCallback(async (updater) => {
    setUser((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        authModalVisible,
        authModalOptions,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
export default AuthContext;
