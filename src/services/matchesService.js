import { NEXT_MATCH } from '../data/mockData';

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

/**
 * Procura os próximos jogos na API oficial e extrai o próximo confronto
 */
export async function fetchLiveSchedule(force = false) {
  const now = Date.now();
  if (!force && cachedUpcoming && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedUpcoming;
  }

  try {
    const response = await fetch(FIXTURES_API, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    const data = await response.json();
    const rawEvents = data.events || [];

    if (rawEvents.length === 0) {
      return cachedUpcoming || [];
    }

    const parsed = rawEvents.map((e, index) => {
      const comp = e.competitions?.[0];
      const home = comp?.competitors?.find((c) => c.homeAway === 'home');
      let homeName = home?.team?.displayName || home?.team?.name || 'Rio Ave FC';
      let awayName = away?.team?.displayName || away?.team?.name || 'Adversário';

      // Normalizar nomes para padrão formal português
      if (homeName.toLowerCase() === 'estrela') homeName = 'Estrela da Amadora';
      if (awayName.toLowerCase() === 'estrela') awayName = 'Estrela da Amadora';
      if (homeName.toLowerCase() === 'rio ave') homeName = 'Rio Ave FC';
      if (awayName.toLowerCase() === 'rio ave') awayName = 'Rio Ave FC';

      const isHome = homeName.toLowerCase().includes('rio ave');
      const formattedDate = formatMatchDatePt(e.date);

      return {
        id: e.id || `fix-${index}`,
        rawDate: e.date,
        date: e.date,
        dateFormatted: formattedDate.heroFormatted,
        time: formattedDate.time,
        dateFull: formattedDate.full,
        competition: e.league?.name || 'Liga Portugal Betclic',
        round: comp?.round ? `${comp.round}.ª Jornada` : `Jornada ${index + 6}`,
        homeTeam: {
          name: homeName,
          short: home?.team?.abbreviation || 'RAFC',
          logo: home?.team?.logos?.[0]?.href || null,
        },
        awayTeam: {
          name: awayName,
          short: away?.team?.abbreviation || 'ADV',
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
export async function getNextMatchData() {
  const matches = await fetchLiveSchedule();
  if (matches && matches.length > 0) {
    const next = matches[0];
    return {
      ...NEXT_MATCH,
      id: next.id,
      competition: next.competition.toUpperCase(),
      round: next.round,
      dateFormatted: next.dateFormatted,
      time: next.time,
      stadium: next.isHome ? 'Estádio dos Arcos' : next.venue,
      city: next.city,
      homeTeam: {
        ...NEXT_MATCH.homeTeam,
        name: next.homeTeam.name,
        logo: next.homeTeam.logo,
      },
      awayTeam: {
        ...NEXT_MATCH.awayTeam,
        name: next.awayTeam.name,
        logo: next.awayTeam.logo,
      },
      ticketPriceMember: next.ticketPriceMember || NEXT_MATCH.ticketPriceMember,
      ticketPricePublic: next.ticketPricePublic || NEXT_MATCH.ticketPricePublic,
    };
  }
  return NEXT_MATCH;
}
