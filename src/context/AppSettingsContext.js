import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const APP_SETTINGS_STORAGE_KEY = '@grupo39_app_settings';

export const DEFAULT_APP_SETTINGS = {
  notifications: true,
  nfc: true,
  sound: true,
};

const AppSettingsContext = createContext({
  appSettings: DEFAULT_APP_SETTINGS,
  updateAppSetting: async () => {},
});

export function AppSettingsProvider({ children }) {
  const [appSettings, setAppSettings] = useState(DEFAULT_APP_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(APP_SETTINGS_STORAGE_KEY)
      .then((stored) => {
        if (stored && isMounted) {
          setAppSettings({ ...DEFAULT_APP_SETTINGS, ...JSON.parse(stored) });
        }
      })
      .catch((err) => console.warn('Erro ao carregar definições da app:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const updateAppSetting = useCallback(async (key, value) => {
    setAppSettings((prev) => {
      const next = { ...prev, [key]: value };
      AsyncStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(next)).catch((err) =>
        console.warn('Erro ao guardar definições:', err)
      );
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ appSettings, updateAppSetting }),
    [appSettings, updateAppSetting]
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppSettingsContext);
}
