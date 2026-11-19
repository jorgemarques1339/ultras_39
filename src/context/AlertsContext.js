import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const READ_ALERTS_KEY = '@grupo39_read_alerts_v1';

/**
 * Fonte única de comunicados e alertas oficiais do Grupo 39.
 * Estruturada para poder ser facilmente substituída por um fetch remoto (Firebase / Supabase / JSON).
 */
export const INITIAL_ALERTS = [
  {
    id: 'alert-concentracao-arcos',
    category: 'jogo', // 'jogo' | 'bancada' | 'quota' | 'loja'
    priority: 'urgent', // 'urgent' | 'high' | 'normal'
    badge: 'JOGO',
    bannerTitle: 'Concentração 12:30 · Arcos',
    bannerSubtitle: 'Convívio da claque · Ver mapa',
    title: 'Concentração às 12:30 no Estádio dos Arcos',
    summary: 'Convívio da claque antes do jogo · Vê a localização no mapa',
    description:
      'A concentração oficial do Grupo 39 realiza-se às 12:30 junto ao Estádio dos Arcos. Junta-te à família verde e branca antes da entrada na Bancada Poente para apoiarmos o Rio Ave FC desde o primeiro minuto.',
    timeLabel: 'Hoje · 10:30',
    pinned: true,
    active: true,
    actionType: 'open_map',
    actionLabel: 'Abrir Estádio dos Arcos no Mapa',
  },
  {
    id: 'alert-bancada-poente',
    category: 'bancada',
    priority: 'high',
    badge: 'BANCADA',
    bannerTitle: 'Apoio Máximo · Porta 4',
    bannerSubtitle: 'Traz cachecol e apoia os 90m',
    title: 'Apoio Máximo nos 90 Minutos · Porta 4',
    summary: 'Traz cachecol e adereços verdes e brancos para a bancada',
    description:
      'No Estádio dos Arcos, o acesso ao setor da claque faz-se pela Porta 4. Pedimos a todos os membros que compareçam com adereços verdes e brancos, cachecol bem visível e apoio contínuo ao ritmo da bateria.',
    timeLabel: 'Hoje · 09:00',
    pinned: false,
    active: true,
    actionType: 'open_chants',
    actionLabel: 'Abrir Cânticos G39',
  },
  {
    id: 'alert-quotas-2627',
    category: 'quota',
    priority: 'normal',
    badge: 'QUOTAS',
    bannerTitle: 'Quota Anual · 12,00 €',
    bannerSubtitle: 'Regulariza via MB WAY',
    title: 'Quota Anual Grupo 39 (12,00 €)',
    summary: 'Regulariza via MB WAY em segundos e mantém o cartão ativo',
    description:
      'A quota anual de 12,00 € é essencial para sustentar o material de bancada e as iniciativas da claque. Mantém o teu cartão digital de sócio ativo e acede ao Apoio oficial do Grupo 39.',
    timeLabel: 'Ontem',
    pinned: false,
    active: true,
    actionType: 'pay_quota',
    actionLabel: 'Regularizar Quota via MB WAY',
  },
  {
    id: 'alert-loja-online',
    category: 'loja',
    priority: 'normal',
    badge: 'LOJA',
    bannerTitle: 'Loja G39 já na App',
    bannerSubtitle: 'Cachecóis e vestuário oficial',
    title: 'Nova Loja Online G39 já disponível na App',
    summary: 'Cachecóis, vestuário e material oficial sem sair da aplicação',
    description:
      'A Loja Oficial do Grupo 39 está agora integrada diretamente na aplicação. Explora os novos cachecóis, t-shirts e acessórios oficiais na aba Loja.',
    timeLabel: 'Há 2 dias',
    pinned: false,
    active: true,
    actionType: 'open_store',
    actionLabel: 'Visitar Loja Oficial G39',
  },
];

const AlertsContext = createContext({
  alerts: [],
  activeBannerAlerts: [],
  unreadCount: 0,
  alertsModalVisible: false,
  selectedCategoryFilter: 'all',
  openAlertsModal: () => {},
  closeAlertsModal: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
});

export function AlertsProvider({ children }) {
  const [readIds, setReadIds] = useState([]);
  const [alertsModalVisible, setAlertsModalVisible] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(READ_ALERTS_KEY)
      .then((stored) => {
        if (stored && isMounted) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              setReadIds(parsed);
            }
          } catch (_) {}
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const persistReadIds = useCallback((nextIds) => {
    AsyncStorage.setItem(READ_ALERTS_KEY, JSON.stringify(nextIds)).catch(() => {});
  }, []);

  const markAsRead = useCallback(
    (alertId) => {
      if (!alertId) return;
      setReadIds((prev) => {
        if (prev.includes(alertId)) return prev;
        const next = [...prev, alertId];
        persistReadIds(next);
        return next;
      });
    },
    [persistReadIds]
  );

  const markAllAsRead = useCallback(() => {
    const allIds = INITIAL_ALERTS.map((a) => a.id);
    setReadIds(allIds);
    persistReadIds(allIds);
  }, [persistReadIds]);

  const openAlertsModal = useCallback((category = 'all') => {
    setSelectedCategoryFilter(typeof category === 'string' ? category : 'all');
    setAlertsModalVisible(true);
  }, []);

  const closeAlertsModal = useCallback(() => {
    setAlertsModalVisible(false);
  }, []);

  const alerts = useMemo(() => {
    return INITIAL_ALERTS.map((item) => ({
      ...item,
      isRead: readIds.includes(item.id),
    }));
  }, [readIds]);

  const activeBannerAlerts = useMemo(() => {
    return alerts
      .filter((a) => a.active !== false)
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  }, [alerts]);

  const unreadCount = useMemo(() => {
    return alerts.filter((a) => !a.isRead).length;
  }, [alerts]);

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        activeBannerAlerts,
        unreadCount,
        alertsModalVisible,
        selectedCategoryFilter,
        openAlertsModal,
        closeAlertsModal,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  return useContext(AlertsContext);
}

export default AlertsContext;
