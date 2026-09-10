// Serviço de Gestão de Notificações do Smartphone (Web Push & Local Notifications)
import { Platform } from 'react-native';

export function isNotificationSupported() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return 'Notification' in window;
}

export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission; // 'default' | 'granted' | 'denied'
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    console.warn('[Notification] API não suportada neste navegador.');
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    return permission;
  } catch (error) {
    console.error('[Notification] Erro ao pedir permissão:', error);
    return 'denied';
  }
}

export async function sendSmartphoneNotification(title, options = {}) {
  if (!isNotificationSupported()) return false;

  const currentPermission = Notification.permission;
  if (currentPermission !== 'granted') {
    const asked = await requestNotificationPermission();
    if (asked !== 'granted') return false;
  }

  const notificationOptions = {
    body: options.body || 'Nova atualização do Grupo 39!',
    icon: options.icon || '/icons/icon-192.png',
    badge: options.badge || '/icons/icon-192.png',
    vibrate: options.vibrate || [200, 100, 200, 100, 300],
    tag: options.tag || 'grupo39-alert',
    renotify: true,
    data: {
      url: options.url || '/',
      timestamp: Date.now(),
    },
    ...options,
  };

  try {
    // Tenta primeiro enviar através do Service Worker (para suporte completo a ecrã de bloqueio em smartphones)
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        await registration.showNotification(title, notificationOptions);
        return true;
      }
    }

    // Fallback para construtor Notification
    new Notification(title, notificationOptions);
    return true;
  } catch (err) {
    console.warn('[Notification] Erro ao disparar notificação nativa:', err);
    return false;
  }
}
