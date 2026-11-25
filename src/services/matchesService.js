import { NEXT_MATCH, PAST_RESULTS } from '../data/mockData.js';

export const FIXTURES_API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/por.1/teams/3822/schedule?fixture=true';
export const RESULTS_API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/por.1/teams/3822/schedule';
export const FLASHSCORE_RESULTS_URL = 'https://www.flashscore.pt/equipa/rio-ave/jPzXLi4l/resultados/';
export const FLASHSCORE_NEWS_URL = 'https://www.flashscore.pt/equipa/rio-ave/jPzXLi4l/noticias/';
export const FLASHSCORE_FIXTURES_URL = 'https://www.flashscore.pt/equipa/rio-ave/jPzXLi4l/lista/';
export const FLASHSCORE_TRANSFERS_URL = 'https://www.flashscore.pt/equipa/rio-ave/jPzXLi4l/transferencias/';

// Cache em memória para evitar chamadas de rede redundantes e arranque instantâneo
let cachedUpcoming = null;
let cachedResults = null;
let cachedNews = null;
let cachedTransfer = null;
let lastFetchTime = 0;
let lastResultsFetchTime = 0;
let lastNewsFetchTime = 0;
let lastTransferFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minuto

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    return await fetch(url, {
      ...options,
      signal: controller ? controller.signal : undefined,
    });
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Formata a data e hora oficial no padrão português
 */
export function formatMatchDatePt(dateString) {
  if (!dateString) return { full: 'A definir', time: '', short: '', heroFormatted: 'A definir' };
  try {
    const d = new Date(dateString);
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const mesesExtenso = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const diaSem = diasSemana[d.getDay()];
    const dia = d.getDate();
    const mes = meses[d.getMonth()];
    const mesExtenso = mesesExtenso[d.getMonth()];
    const ano = d.getFullYear();
    const horas = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    return {
      full: `${diaSem}, ${dia} ${mes} ${ano}`,
      time: `${horas}:${min}`,
      short: `${dia} ${mes}`,
      heroFormatted: `${dia} ${mesExtenso} · ${horas}:${min}`,
    };
  } catch (e) {
    return { full: dateString, time: '', short: dateString, heroFormatted: dateString };
  }
}

export function normalizeTeamName(rawName) {
  if (!rawName) return 'Clube';
  const clean = rawName.trim();
  const lower = clean.toLowerCase();

  if (lower === 'rio ave' || lower.includes('rio ave')) return 'Rio Ave FC';
  if (lower === 'estrela' || lower.includes('estrela')) return 'Estrela da Amadora';
  if (lower === 'alverca' || lower.includes('alverca')) return 'FC Alverca';
  if (lower === 'nacional' || lower.includes('nacional')) return 'CD Nacional';
  if (lower === 'famalicao' || lower === 'famalicão' || lower.includes('famalic')) return 'FC Famalicão';
  if (lower === 'santa clara' || lower.includes('santa clara')) return 'Santa Clara';
  if (lower === 'sporting' || lower.includes('sporting')) return 'Sporting CP';
  if (lower === 'estoril' || lower.includes('estoril')) return 'Estoril Praia';
  if (lower === 'porto' || lower.includes('porto')) return 'FC Porto';
  if (lower === 'braga' || lower.includes('braga')) return 'SC Braga';
  if (lower === 'boavista' || lower.includes('boavista')) return 'Boavista FC';
  if (lower === 'benfica' || lower.includes('benfica')) return 'SL Benfica';
  if (lower === 'moreirense' || lower.includes('moreirense')) return 'Moreirense FC';
  if (lower === 'gil vicente' || lower.includes('gil vicente')) return 'Gil Vicente';
  if (lower === 'arouca' || lower.includes('arouca')) return 'FC Arouca';
  if (lower === 'farense' || lower.includes('farense')) return 'SC Farense';
  if (lower === 'casa pia' || lower.includes('casa pia')) return 'Casa Pia AC';
  if (lower === 'avs' || lower.includes('avs')) return 'AVS Futebol SAD';

  return clean;
}

/**
 * Procura os próximos jogos na API oficial e extrai o próximo confronto
 */
export async function fetchLiveSchedule(force = false) {
  const now = Date.now();
  if (!force && cachedUpcoming && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedUpcoming;
  }

  try {
    const [fixturesRes, resultsRes] = await Promise.all([
      fetchWithTimeout(FIXTURES_API, { headers: { Accept: 'application/json' } }),
      fetchWithTimeout(RESULTS_API, { headers: { Accept: 'application/json' } }).catch(() => null),
    ]);

    if (!fixturesRes.ok) {
      throw new Error(`Status ${fixturesRes.status}`);
    }

    const data = await fixturesRes.json();
    const rawEvents = data.events || [];

    if (rawEvents.length === 0) {
      return cachedUpcoming || [];
    }

    let completedCount = 6;
    if (resultsRes && resultsRes.ok) {
      try {
        const resultsData = await resultsRes.json();
        if (Array.isArray(resultsData.events)) {
          completedCount = resultsData.events.length;
        }
      } catch (_) { }
    }

    const upcomingEvents = rawEvents
      .filter((e) => {
        const comp = e.competitions?.[0];
        if (comp?.status?.type?.completed === true) return false;
        const ts = new Date(e.date).getTime();
        return Number.isNaN(ts) || ts >= now - 2 * 60 * 60 * 1000;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const parsed = upcomingEvents.map((e, index) => {
      const comp = e.competitions?.[0];
      const home = comp?.competitors?.find((c) => c.homeAway === 'home');
      const away = comp?.competitors?.find((c) => c.homeAway === 'away');
      const rawHomeName = home?.team?.displayName || home?.team?.name || 'Rio Ave FC';
      const rawAwayName = away?.team?.displayName || away?.team?.name || 'Adversário';

      const homeName = normalizeTeamName(rawHomeName);
      const awayName = normalizeTeamName(rawAwayName);

      const isHome = homeName.toLowerCase().includes('rio ave');
      const formattedDate = formatMatchDatePt(e.date);
      const roundNum = completedCount + 1 + index;

      return {
        id: e.id || `fix-${index}`,
        rawDate: e.date,
        date: e.date,
        dateFormatted: formattedDate.heroFormatted,
        time: formattedDate.time,
        dateFull: formattedDate.full,
        competition: 'Liga Portugal Betclic',
        round: `${roundNum}.ª Jornada`,
        homeTeam: {
          name: homeName,
          short: home?.team?.abbreviation || (isHome ? 'RAFC' : 'ADV'),
          logo: home?.team?.logos?.[0]?.href || null,
        },
        awayTeam: {
          name: awayName,
          short: away?.team?.abbreviation || (!isHome ? 'RAFC' : 'ADV'),
          logo: away?.team?.logos?.[0]?.href || null,
        },
        isHome,
        venue: comp?.venue?.fullName || (isHome ? 'Estádio do Rio Ave FC (Arcos)' : 'Estádio Fora'),
        city: comp?.venue?.address?.city || (isHome ? 'Vila do Conde' : 'Portugal'),
      };
    });

    cachedUpcoming = parsed;
    lastFetchTime = now;
    return parsed;
  } catch (err) {
    console.warn('Erro ao obter jogos oficiais:', err);
    return cachedUpcoming || [];
  }
}

/**
 * Devolve os detalhes completos do próximo jogo para o Hero Card
 */
export async function getNextMatchData(force = false) {
  const matches = await fetchLiveSchedule(force);
  if (matches && matches.length > 0) {
    const next = matches[0];
    return {
      ...NEXT_MATCH,
      id: next.id,
      competition: 'LIGA PORTUGAL BETCLIC',
      round: next.round,
      rawDate: next.rawDate,
      dateFormatted: next.dateFormatted,
      time: next.time,
      stadium: next.isHome ? 'Estádio dos Arcos' : next.venue,
      city: next.city,
      isHome: next.isHome,
      homeTeam: {
        name: next.homeTeam.name,
        short: next.homeTeam.short,
        logo: next.homeTeam.logo,
      },
      awayTeam: {
        name: next.awayTeam.name,
        short: next.awayTeam.short,
        logo: next.awayTeam.logo,
      },
      flashscoreUrl: FLASHSCORE_FIXTURES_URL,
    };
  }
  return { ...NEXT_MATCH, flashscoreUrl: FLASHSCORE_FIXTURES_URL };
}

/**
 * Procura os resultados já terminados do Rio Ave FC ordenados do mais recente para o mais antigo
 */
export async function fetchLiveResults(force = false) {
  const now = Date.now();
  if (!force && cachedResults && (now - lastResultsFetchTime < CACHE_TTL_MS)) {
    return cachedResults;
  }

  try {
    const res = await fetchWithTimeout(RESULTS_API, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      throw new Error(`Status ${res.status}`);
    }

    const data = await res.json();
    const rawEvents = data.events || [];

    const completed = rawEvents
      .filter((e) => {
        const comp = e.competitions?.[0];
        const statusCompleted = comp?.status?.type?.completed;
        const home = comp?.competitors?.find((c) => c.homeAway === 'home');
        const away = comp?.competitors?.find((c) => c.homeAway === 'away');
        const hasScores = home?.score != null && away?.score != null;
        return (statusCompleted === true || (hasScores && new Date(e.date).getTime() < now));
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (completed.length === 0) {
      return cachedResults || PAST_RESULTS || [];
    }

    const total = completed.length;
    const parsed = completed.map((e, index) => {
      const comp = e.competitions?.[0];
      const home = comp?.competitors?.find((c) => c.homeAway === 'home');
      const away = comp?.competitors?.find((c) => c.homeAway === 'away');
      const homeName = normalizeTeamName(home?.team?.displayName || home?.team?.name || 'Clube');
      const awayName = normalizeTeamName(away?.team?.displayName || away?.team?.name || 'Clube');
      const scoreHome = parseInt(home?.score?.displayValue ?? home?.score?.value ?? '0', 10);
      const scoreAway = parseInt(away?.score?.displayValue ?? away?.score?.value ?? '0', 10);
      const isHome = homeName.toLowerCase().includes('rio ave');
      const rafcGoals = isHome ? scoreHome : scoreAway;
      const oppGoals = isHome ? scoreAway : scoreHome;
      const outcome = rafcGoals > oppGoals ? 'V' : rafcGoals === oppGoals ? 'E' : 'D';
      const formattedDate = formatMatchDatePt(e.date);

      return {
        id: e.id || `res-live-${index}`,
        competition: `Liga Portugal Betclic · ${total - index}.ª Jornada`,
        date: formattedDate.short || e.date,
        rawDate: e.date,
        home: homeName,
        away: awayName,
        scoreHome: Number.isNaN(scoreHome) ? 0 : scoreHome,
        scoreAway: Number.isNaN(scoreAway) ? 0 : scoreAway,
        homeLogo: home?.team?.logos?.[0]?.href || null,
        awayLogo: away?.team?.logos?.[0]?.href || null,
        outcome,
        stadium: comp?.venue?.fullName || (isHome ? 'Estádio dos Arcos, Vila do Conde' : 'Estádio Fora'),
        flashscoreUrl: FLASHSCORE_RESULTS_URL,
      };
    });

    cachedResults = parsed;
    lastResultsFetchTime = now;
    return parsed;
  } catch (err) {
    console.warn('Erro ao obter resultados em direto:', err);
    return cachedResults || PAST_RESULTS || [];
  }
}

/**
 * Devolve o último resultado oficial terminado do Rio Ave FC
 */
export async function getLastResultData(force = false) {
  const results = await fetchLiveResults(force);
  if (results && results.length > 0) {
    return results[0];
  }
  return PAST_RESULTS?.[0] || null;
}

const FALLBACK_NEWS = [
  {
    id: 'news-fs-1',
    title: 'Últimas Notícias e Antevisões do Rio Ave FC',
    subtitle: 'Acompanha crónicas, plantel e novidades dos Arcos',
    summary: 'Fica a par das antevisões de jornada, declarações do treinador e novidades do plantel verde e branco.',
    image: null,
    date: 'Atualidade',
    url: FLASHSCORE_NEWS_URL,
  },
  {
    id: 'news-fs-2',
    title: 'Atualidade Verde e Branca · Liga Portugal Betclic',
    subtitle: 'Declarações pós-jogo e novidades dos Arcos',
    summary: 'Análises, estatísticas e toda a informação atualizada sobre o Rio Ave FC.',
    image: null,
    date: 'Atualidade',
    url: FLASHSCORE_NEWS_URL,
  },
];

function stripHtmlTags(raw = '') {
  return String(raw)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Procura a última notícia do Rio Ave FC (Google News RSS)
 */
export async function fetchRioAveNews(force = false) {
  const now = Date.now();
  if (!force && cachedNews && (now - lastNewsFetchTime < CACHE_TTL_MS * 5)) {
    return cachedNews;
  }

  try {
    const queries = [
      'https://news.google.com/rss/search?q=Rio+Ave+FC+site:flashscore.pt&hl=pt-PT&gl=PT&ceid=PT:pt-150',
      'https://news.google.com/rss/search?q=Rio+Ave+FC&hl=pt-PT&gl=PT&ceid=PT:pt-150',
    ];

    for (const rssUrl of queries) {
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      const res = await fetchWithTimeout(apiUrl, { headers: { Accept: 'application/json' } });
      if (!res.ok) continue;

      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      if (items.length > 0) {
        const topOne = items.slice(0, 1).map((item, idx) => {
          const cleanTitle = (item.title || '').replace(/\s*-\s*[^-]+$/, '').trim() || item.title;
          const rawDesc = stripHtmlTags(item.description || item.content || '');
          const cleanSummary =
            rawDesc && rawDesc.toLowerCase() !== cleanTitle.toLowerCase()
              ? rawDesc
              : 'Lê a notícia completa e acompanha toda a atualidade do Rio Ave FC.';
          const formatted = item.pubDate ? formatMatchDatePt(item.pubDate) : null;
          return {
            id: item.guid || `news-live-${idx}`,
            title: cleanTitle || 'Notícia Rio Ave FC',
            subtitle: item.author || 'Abrir artigo completo',
            summary: cleanSummary,
            date: formatted?.short || 'Recente',
            url: item.link || FLASHSCORE_NEWS_URL,
          };
        });
        cachedNews = topOne;
        lastNewsFetchTime = now;
        return topOne;
      }
    }

    return cachedNews || FALLBACK_NEWS;
  } catch (err) {
    console.warn('Erro ao obter notícias do Rio Ave FC:', err);
    return cachedNews || FALLBACK_NEWS;
  }
}

const FALLBACK_TRANSFER = {
  id: 'transfer-fs-1',
  title: 'Mercado e Transferências · Rio Ave FC',
  subtitle: 'Consulta as últimas entradas, saídas e empréstimos',
  date: 'Mercado',
  url: FLASHSCORE_TRANSFERS_URL,
};

/**
 * Procura a última transferência / movimentação de mercado do Rio Ave FC
 */
export async function fetchLatestTransfer(force = false) {
  const now = Date.now();
  if (!force && cachedTransfer && (now - lastTransferFetchTime < CACHE_TTL_MS * 5)) {
    return cachedTransfer;
  }

  try {
    const queries = [
      'https://news.google.com/rss/search?q=Rio+Ave+transferencia+OR+reforco+OR+contratacao+site:flashscore.pt&hl=pt-PT&gl=PT&ceid=PT:pt-150',
      'https://news.google.com/rss/search?q=Rio+Ave+FC+transferencia+OR+reforco+OR+mercado&hl=pt-PT&gl=PT&ceid=PT:pt-150',
    ];

    for (const rssUrl of queries) {
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      const res = await fetchWithTimeout(apiUrl, { headers: { Accept: 'application/json' } });
      if (!res.ok) continue;

      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      if (items.length > 0) {
        const first = items[0];
        const cleanTitle = (first.title || '').replace(/\s*-\s*[^-]+$/, '').trim() || first.title;
        const formatted = first.pubDate ? formatMatchDatePt(first.pubDate) : null;
        const transferObj = {
          id: first.guid || 'transfer-live-1',
          title: cleanTitle || FALLBACK_TRANSFER.title,
          subtitle: 'Movimentações do plantel verde e branco',
          date: formatted?.short || 'Mercado',
          url: FLASHSCORE_TRANSFERS_URL,
        };
        cachedTransfer = transferObj;
        lastTransferFetchTime = now;
        return transferObj;
      }
    }

    return cachedTransfer || FALLBACK_TRANSFER;
  } catch (err) {
    console.warn('Erro ao obter transferências do Rio Ave FC:', err);
    return cachedTransfer || FALLBACK_TRANSFER;
  }
}
