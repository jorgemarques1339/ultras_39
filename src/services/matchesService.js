import { NEXT_MATCH } from '../data/mockData.js';

export const FIXTURES_API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/por.1/teams/3822/schedule?fixture=true';
export const RESULTS_API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/por.1/teams/3822/schedule';

// Cache em memória para evitar chamadas de rede redundantes e arranque instantâneo
let cachedUpcoming = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minuto

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
      fetch(FIXTURES_API, { headers: { Accept: 'application/json' } }),
      fetch(RESULTS_API, { headers: { Accept: 'application/json' } }).catch(() => null),
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
      } catch (_) {}
    }

    const parsed = rawEvents.map((e, index) => {
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
        ticketPriceMember: isHome ? 7.50 : null,
        ticketPricePublic: isHome ? 10.00 : null,
        ticketPrice: isHome ? '8,00 €' : null,
        busAvailable: !isHome,
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
      ticketPriceMember: next.ticketPriceMember || NEXT_MATCH.ticketPriceMember,
      ticketPricePublic: next.ticketPricePublic || NEXT_MATCH.ticketPricePublic,
    };
  }
  return NEXT_MATCH;
}
