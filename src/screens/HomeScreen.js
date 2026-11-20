import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Image,
  Modal,
  Linking,
  useWindowDimensions,
} from 'react-native';
import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapPin,
  Clock,
  Navigation,
  ChevronRight,
  Flame,
  Sparkles,
  Users,
  Drum,
  ShoppingBag,
  Radio,
  Award,
  Trophy,
  Table,
  IdCard,
  Camera,
  Calendar as CalendarIcon,
  Lock,
  Play,
  Newspaper,
  ExternalLink,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { NEXT_MATCH, MATCHDAY_DATA, PAST_RESULTS, CHANT_OF_THE_WEEK } from '../data/mockData';
import {
  getNextMatchData,
  fetchLiveResults,
  fetchRioAveNews,
  fetchLatestTransfer,
  FLASHSCORE_RESULTS_URL,
  FLASHSCORE_NEWS_URL,
  FLASHSCORE_FIXTURES_URL,
  FLASHSCORE_TRANSFERS_URL,
} from '../services/matchesService';
import ClubBadge from '../components/ClubBadge';
import TabelaModal from '../components/TabelaModal';
import SejaSocioModal from '../components/SejaSocioModal';
import JogosModal from '../components/JogosModal';
import ResultadoModal from '../components/ResultadoModal';
import GaleriaModal from '../components/GaleriaModal';
import EventosModal from '../components/EventosModal';

function SoccerBallIcon({ size = 15, color = COLORS.primaryLight }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 7l3.2 2.3-1.2 3.8H10l-1.2-3.8z" fill={color} fillOpacity="0.3" />
      <Path d="M12 7V2" />
      <Path d="M15.2 9.3l4.3-1.4" />
      <Path d="M14 13.1l2.8 3.5" />
      <Path d="M10 13.1l-2.8 3.5" />
      <Path d="M8.8 9.3l-4.3-1.4" />
    </Svg>
  );
}

function HomeScreen({
  user,
  transactions = [],
  onCheckout,
  onViewReceipt,
  onNavigateTab,
  onScroll,
  onOpenChants,
  onOpenStore,
  isDark = true,
  onOpenPwaInstall,
  isLoggedIn = false,
  onOpenAuth,
}) {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 650;
  const isSmallScreen = height < 740;

  // Modo Dia de Jogo: desativado por agora (só será ativo faltando 1 hora para o jogo)
  const isMatchdayActive = false;
  const [tabelaModalVisible, setTabelaModalVisible] = useState(false);
  const [socioModalVisible, setSocioModalVisible] = useState(false);
  const [jogosModalVisible, setJogosModalVisible] = useState(false);
  const [resultadoModalVisible, setResultadoModalVisible] = useState(false);
  const [galeriaModalVisible, setGaleriaModalVisible] = useState(false);
  const [eventosModalVisible, setEventosModalVisible] = useState(false);
  const [votedPlayerId, setVotedPlayerId] = useState(null);
  const [motmList, setMotmList] = useState(MATCHDAY_DATA.motmCandidates);
  const [nextMatch, setNextMatch] = useState(NEXT_MATCH);
  const [liveResults, setLiveResults] = useState(PAST_RESULTS);
  const [newsItems, setNewsItems] = useState([
    {
      id: 'news-init-1',
      title: 'Últimas Notícias e Antevisões do Rio Ave FC',
      subtitle: 'Acompanha crónicas, plantel e novidades dos Arcos',
      date: 'Atualidade',
      url: FLASHSCORE_NEWS_URL,
    },
    {
      id: 'news-init-2',
      title: 'Atualidade Verde e Branca · Liga Portugal Betclic',
      subtitle: 'Declarações pós-jogo e novidades dos Arcos',
      date: 'Atualidade',
      url: FLASHSCORE_NEWS_URL,
    },
  ]);
  const [latestTransfer, setLatestTransfer] = useState({
    id: 'transfer-init-1',
    title: 'Mercado e Transferências · Rio Ave FC',
    subtitle: 'Últimas entradas, saídas e empréstimos do plantel',
    date: 'Mercado',
    url: FLASHSCORE_TRANSFERS_URL,
  });
  const [newsSlideIndex, setNewsSlideIndex] = useState(0);
  const rollUpAnim = useRef(new Animated.Value(0)).current;
  const rollUpOpacity = useRef(new Animated.Value(1)).current;
  const [nowTs, setNowTs] = useState(() => Date.now());
  const mainScrollRef = useRef(null);

  // Atualizar relógio para a contagem decrescente a cada 30 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTs(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Contagem decrescente dinâmica para o próximo jogo
  const countdownInfo = useMemo(() => {
    const targetRaw = nextMatch?.rawDate || nextMatch?.date;
    if (!targetRaw) return null;
    const targetMs = new Date(targetRaw).getTime();
    if (Number.isNaN(targetMs)) return null;

    const diffMs = targetMs - nowTs;
    if (diffMs <= 0 && diffMs > -2 * 60 * 60 * 1000) {
      return { text: 'EM DIRETO AGORA', isLive: true };
    }
    if (diffMs <= 0) {
      return null;
    }

    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
      return { text: `Faltam ${days}d ${hours}h ${minutes}m`, isLive: false };
    }
    if (hours > 0) {
      return { text: `É hoje · Faltam ${hours}h ${minutes}m`, isLive: false, isToday: true };
    }
    return { text: `Arranca em ${Math.max(1, minutes)}m!`, isLive: false, isToday: true };
  }, [nextMatch?.rawDate, nextMatch?.date, nowTs]);

  // Ponto de Encontro / Convívio oficial no Estádio dos Arcos
  const meetingPointInfo = useMemo(() => {
    const mapQuery = 'Estádio do Rio Ave FC, Vila do Conde';
    return {
      timeLabel: '12:30',
      location: 'Estádio dos Arcos',
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
    };
  }, []);

  // Forma recente do Rio Ave FC (últimos 5 jogos)
  const recentForm = useMemo(() => {
    return (liveResults || []).slice(0, 5).map((item) => {
      if (item.outcome) return item.outcome;
      const isHome = item.home?.toLowerCase().includes('rio ave');
      const rafcGoals = isHome ? item.scoreHome : item.scoreAway;
      const oppGoals = isHome ? item.scoreAway : item.scoreHome;
      if (rafcGoals > oppGoals) return 'V';
      if (rafcGoals === oppGoals) return 'E';
      return 'D';
    }).reverse();
  }, [liveResults]);

  const handleOpenMeetingMap = useCallback(() => {
    if (!meetingPointInfo?.mapsUrl) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(meetingPointInfo.mapsUrl, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(meetingPointInfo.mapsUrl).catch(() => {});
    }
  }, [meetingPointInfo]);

  const handleOpenExternalUrl = useCallback((url) => {
    const targetUrl = url || FLASHSCORE_NEWS_URL;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(targetUrl).catch(() => {});
    }
  }, []);

  const handleOpenFlashscore = useCallback(() => {
    handleOpenExternalUrl(FLASHSCORE_RESULTS_URL);
  }, [handleOpenExternalUrl]);

  // Carregar dados oficiais do próximo jogo, último resultado e notícias em tempo real
  useEffect(() => {
    let isMounted = true;
    const syncMatches = () => {
      getNextMatchData(true)
        .then((liveMatch) => {
          if (isMounted && liveMatch) {
            setNextMatch(liveMatch);
          }
        })
        .catch((err) => console.warn('Erro ao atualizar próximo jogo:', err));

      fetchLiveResults(true)
        .then((results) => {
          if (isMounted && Array.isArray(results) && results.length > 0) {
            setLiveResults(results);
          }
        })
        .catch(() => {});

      fetchRioAveNews(true)
        .then((news) => {
          if (isMounted && Array.isArray(news) && news.length > 0) {
            setNewsItems(news.slice(0, 1));
          }
        })
        .catch(() => {});

      fetchLatestTransfer(true)
        .then((transfer) => {
          if (isMounted && transfer) {
            setLatestTransfer(transfer);
          }
        })
        .catch(() => {});
    };

    syncMatches();
    const interval = setInterval(syncMatches, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const lastResult = liveResults && liveResults.length > 0 ? liveResults[0] : null;

  const newsSlides = useMemo(() => {
    const slides = [];
    if (lastResult) {
      slides.push({ id: `slide-result-${lastResult.id}`, type: 'result', data: lastResult });
    }
    if (newsItems && newsItems.length > 0) {
      slides.push({ id: newsItems[0].id || 'slide-news-0', type: 'news', data: newsItems[0] });
    }
    if (latestTransfer) {
      slides.push({ id: latestTransfer.id || 'slide-transfer-0', type: 'transfer', data: latestTransfer });
    }
    return slides;
  }, [lastResult, newsItems, latestTransfer]);

  const goToNewsSlide = useCallback((nextIdx) => {
    if (newsSlides.length <= 1) return;
    const target = ((nextIdx % newsSlides.length) + newsSlides.length) % newsSlides.length;
    Animated.parallel([
      Animated.timing(rollUpOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(rollUpAnim, {
        toValue: -14,
        duration: 160,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      setNewsSlideIndex(target);
      rollUpAnim.setValue(16);
      Animated.parallel([
        Animated.timing(rollUpOpacity, {
          toValue: 1,
          duration: 240,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(rollUpAnim, {
          toValue: 0,
          duration: 240,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    });
  }, [newsSlides.length, rollUpAnim, rollUpOpacity]);

  useEffect(() => {
    if (newsSlides.length <= 1) return;
    const timer = setInterval(() => {
      goToNewsSlide(newsSlideIndex + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, [goToNewsSlide, newsSlideIndex, newsSlides.length]);

  const handleVoteMotm = useCallback((playerId) => {
    setVotedPlayerId((current) => {
      if (current === playerId) return current;
      setMotmList((prev) =>
        prev.map((p) => {
          if (p.id === playerId) {
            return { ...p, votes: p.votes + 1, pct: Math.min(100, p.pct + 3) };
          }
          return p;
        })
      );
      return playerId;
    });
  }, []);

  const handleJoinSocio = useCallback(() => {
    setSocioModalVisible(false);
    if (!isLoggedIn) {
      if (onOpenAuth) {
        onOpenAuth({
          initialTab: 'register',
          message: 'Cria a tua conta para te fazeres Sócio do Grupo 39 e prosseguires para a ativação da quota.',
          pendingAction: 'pay_quota',
        });
      }
    } else {
      if (onCheckout) {
        onCheckout({
          title: 'Inscrição de Sócio · Quota Anual 2026/2027',
          category: 'Quota Oficial Grupo 39',
          amount: 12.00,
          originalPrice: 12.00,
          type: 'quota',
          isNewMemberWelcome: true,
          phone: user?.phone || '912 345 678',
        });
      }
    }
  }, [isLoggedIn, onOpenAuth, onCheckout, user?.phone]);

  const activeNewsSlide = newsSlides[newsSlideIndex % Math.max(1, newsSlides.length)] || null;

  return (
    <View style={[styles.container, !isDark && styles.containerLight]}>
      {/* LOGÓTIPO DE FUNDO DA CLAQUE (GRUPO 39) */}
      <View style={styles.backgroundContainer} pointerEvents="none">
        <Image
          source={require('../../assets/logo_39.png')}
          style={[styles.backgroundImage, !isDark && styles.backgroundImageLight]}
          resizeMode="contain"
        />
        <View style={[styles.backgroundOverlay, !isDark && styles.backgroundOverlayLight]} />
      </View>

      <ScrollView
        ref={mainScrollRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: isTablet ? 115 : (isSmallScreen ? 100 : 112),
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* 0. SECÇÃO: NOTÍCIAS (ROLL-UP COM ÚLTIMO RESULTADO + 2 ÚLTIMAS NOTÍCIAS) */}
        {activeNewsSlide && (
          <View style={styles.lastResultSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWithIcon}>
                <View style={[styles.newsHeaderIconBox, !isDark && styles.newsHeaderIconBoxLight]}>
                  <Newspaper size={14} color={isDark ? '#F2B600' : '#00874E'} />
                </View>
                <Text style={[styles.sectionTitle, styles.newsSectionTitle, !isDark && styles.sectionTitleLight]}>
                  Notícias
                </Text>
              </View>

              <View style={styles.newsHeaderRight}>
                <View style={styles.newsDotsRow}>
                  {newsSlides.map((s, idx) => (
                    <TouchableOpacity
                      key={s.id}
                      onPress={() => goToNewsSlide(idx)}
                      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                      style={[
                        styles.newsDot,
                        idx === newsSlideIndex && styles.newsDotActive,
                        !isDark && styles.newsDotLight,
                        !isDark && idx === newsSlideIndex && styles.newsDotActiveLight,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                activeNewsSlide.type === 'result'
                  ? setResultadoModalVisible(true)
                  : activeNewsSlide.type === 'transfer'
                    ? handleOpenExternalUrl(activeNewsSlide.data?.url || FLASHSCORE_TRANSFERS_URL)
                    : handleOpenExternalUrl(activeNewsSlide.data?.url || FLASHSCORE_NEWS_URL)
              }
              activeOpacity={0.86}
              accessibilityLabel={
                activeNewsSlide.type === 'result'
                  ? 'Abrir último resultado do Rio Ave FC no Flashscore'
                  : activeNewsSlide.type === 'transfer'
                    ? 'Abrir transferências do Rio Ave FC no Flashscore'
                    : 'Abrir notícia do Rio Ave FC no Flashscore'
              }
            >
              <LinearGradient
                colors={
                  isDark
                    ? ['#203528', '#132219', '#0D1611']
                    : ['#FFFDF5', '#EDF9F2']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.newsFeaturedCard, !isDark && styles.newsFeaturedCardLight]}
              >
                <LinearGradient
                  colors={['#F2B600', '#00E676']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.newsAccentLeft}
                />

                <Animated.View
                  style={[
                    styles.newsFeaturedContent,
                    {
                      opacity: rollUpOpacity,
                      transform: [{ translateY: rollUpAnim }],
                    },
                  ]}
                >
                  {activeNewsSlide.type === 'result' ? (
                    <>
                      <View style={styles.lastResultTopRow}>
                        <View style={styles.newsTypePillResult}>
                          <Text style={styles.newsTypePillResultText}>ÚLTIMO RESULTADO</Text>
                        </View>
                        <Text style={[styles.lastResultDate, !isDark && styles.lastResultDateLight]}>
                          {activeNewsSlide.data.date}
                        </Text>
                      </View>

                      <View style={styles.lastResultScoreRow}>
                        <View style={styles.lastResultTeamGroup}>
                          <ClubBadge
                            name={activeNewsSlide.data.home}
                            logo={activeNewsSlide.data.homeLogo}
                            size="xs"
                            isDark={isDark}
                          />
                          <Text
                            style={[
                              styles.lastResultTeam,
                              activeNewsSlide.data.home.includes('Rio Ave') && styles.lastResultTeamHighlight,
                              !isDark && styles.lastResultTeamLight,
                            ]}
                            numberOfLines={1}
                          >
                            {activeNewsSlide.data.home}
                          </Text>
                        </View>

                        <View style={[styles.lastResultScoreBox, !isDark && styles.lastResultScoreBoxLight]}>
                          <Text style={[styles.lastResultScoreText, !isDark && styles.lastResultScoreTextLight]}>
                            {activeNewsSlide.data.scoreHome} - {activeNewsSlide.data.scoreAway}
                          </Text>
                        </View>

                        <View style={[styles.lastResultTeamGroup, styles.lastResultTeamGroupRight]}>
                          <Text
                            style={[
                              styles.lastResultTeam,
                              styles.lastResultTeamRight,
                              activeNewsSlide.data.away.includes('Rio Ave') && styles.lastResultTeamHighlight,
                              !isDark && styles.lastResultTeamLight,
                            ]}
                            numberOfLines={1}
                          >
                            {activeNewsSlide.data.away}
                          </Text>
                          <ClubBadge
                            name={activeNewsSlide.data.away}
                            logo={activeNewsSlide.data.awayLogo}
                            size="xs"
                            isDark={isDark}
                          />
                        </View>
                      </View>

                      {!!activeNewsSlide.data.scorers && (
                        <Text style={[styles.lastResultScorers, !isDark && styles.lastResultScorersLight]} numberOfLines={1}>
                          {activeNewsSlide.data.scorers}
                        </Text>
                      )}
                    </>
                  ) : (
                    <View style={styles.newsSlideBody}>
                      <View style={styles.lastResultTopRow}>
                        <View
                          style={
                            activeNewsSlide.type === 'transfer'
                              ? styles.newsTypePillTransfer
                              : styles.newsTypePillArticle
                          }
                        >
                          <Text
                            style={
                              activeNewsSlide.type === 'transfer'
                                ? styles.newsTypePillTransferText
                                : styles.newsTypePillArticleText
                            }
                          >
                            {activeNewsSlide.type === 'transfer'
                              ? 'TRANSFERÊNCIA'
                              : 'NOTÍCIA'}
                          </Text>
                        </View>
                        <Text style={[styles.lastResultDate, !isDark && styles.lastResultDateLight]}>
                          {activeNewsSlide.data.date}
                        </Text>
                      </View>

                      <Text style={[styles.newsArticleTitle, !isDark && styles.newsArticleTitleLight]} numberOfLines={2}>
                        {activeNewsSlide.data.title}
                      </Text>

                      <View style={styles.newsArticleFooter}>
                        <Text style={[styles.newsArticleSub, !isDark && styles.newsArticleSubLight]} numberOfLines={1}>
                          {activeNewsSlide.data.subtitle}
                        </Text>
                        <ChevronRight size={14} color={isDark ? '#F2B600' : '#00874E'} />
                      </View>
                    </View>
                  )}
                </Animated.View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

      {/* 1. HERO BANNER: PRÓXIMO JOGO COM SÍMBOLOS DOS CLUBES */}
      <LinearGradient
        colors={
          isDark
            ? ['#153826', '#0E2017', '#0B130F']
            : ['#E7F8EE', '#F4FBF7', '#FFFFFF']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroCard, !isDark && styles.heroCardLight, isSmallScreen && styles.heroCardSmall]}
      >
        {/* Faixa de destaque superior */}
        <LinearGradient
          colors={['#00E676', '#F2B600', '#00874E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroAccentStrip}
        />

        {/* Header do Confronto: Badge Próximo Jogo + Forma Recente */}
        <View style={styles.heroTopRow}>
          <View
            style={[
              styles.heroStatusPill,
              !isDark && styles.heroStatusPillLight,
              countdownInfo?.isLive && styles.heroStatusPillLive,
            ]}
          >
            <View
              style={[
                styles.heroStatusDot,
                countdownInfo?.isLive && styles.heroStatusDotLive,
              ]}
            />
            <Text
              style={[
                styles.heroStatusText,
                !isDark && styles.heroStatusTextLight,
                countdownInfo?.isLive && styles.heroStatusTextLive,
              ]}
            >
              {countdownInfo?.isLive
                ? 'EM DIRETO'
                : nextMatch.isHome
                  ? 'PRÓXIMO · CASA'
                  : 'PRÓXIMO · FORA'}
            </Text>
          </View>

          {recentForm.length > 0 && (
            <View style={[styles.formPill, !isDark && styles.formPillLight]}>
              <Text style={[styles.formLabel, !isDark && styles.formLabelLight]}>
                RAFC
              </Text>
              <View style={styles.formDotsRow}>
                {recentForm.map((res, idx) => (
                  <View
                    key={`form-${idx}`}
                    style={[
                      styles.formDot,
                      res === 'V'
                        ? styles.formDotWin
                        : res === 'E'
                          ? styles.formDotDraw
                          : styles.formDotLoss,
                    ]}
                  >
                    <Text style={styles.formDotText}>{res}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setJogosModalVisible(true)}
          activeOpacity={0.85}
          accessibilityLabel="Abrir jogos e calendário oficial"
        >
          <View style={styles.heroTopBar}>
            <View style={styles.compInfo}>
              <View style={styles.compRoundRow}>
                <Text style={[styles.compRound, !isDark && styles.compRoundLight]}>
                  {nextMatch.round || '7.ª Jornada'}
                </Text>
                <ChevronRight size={11} color={isDark ? '#00E676' : '#00874E'} />
              </View>
            </View>
          </View>

          {/* Equipas & Emblemas Reais */}
          <View style={styles.matchTeamsRow}>
          {/* Equipa Visitada / Casa */}
          <View style={styles.teamColumn}>
            <View style={[styles.emblemHalo, !isDark && styles.emblemHaloLight]}>
              <ClubBadge
                name={nextMatch.homeTeam.name}
                logo={nextMatch.homeTeam.logo}
                size={isSmallScreen ? 'sm' : 'md'}
                isDark={isDark}
              />
            </View>
            <Text style={[styles.teamName, !isDark && styles.teamNameLight]} numberOfLines={2}>
              {nextMatch.homeTeam.name}
            </Text>
            <Text style={[styles.teamRole, !isDark && styles.teamRoleLight]}>Anfitrião</Text>
          </View>

          {/* VS & Detalhes + Contagem Decrescente */}
          <View style={styles.vsColumn}>
            <View style={[styles.vsBadge, !isDark && styles.vsBadgeLight]}>
              <Text style={[styles.vsText, !isDark && styles.vsTextLight]}>VS</Text>
            </View>
            <View style={[styles.stadiumTag, !isDark && styles.stadiumTagLight]}>
              <MapPin size={10} color={COLORS.primaryLight} />
              <Text style={[styles.stadiumTagText, !isDark && styles.stadiumTagTextLight]} numberOfLines={1}>
                {nextMatch.stadium}
              </Text>
            </View>
            <Text style={[styles.matchTime, !isDark && styles.matchTimeLight]}>
              {nextMatch.dateFormatted}
            </Text>
            {countdownInfo && (
              <View
                style={[
                  styles.countdownPill,
                  !isDark && styles.countdownPillLight,
                  countdownInfo.isLive && styles.countdownPillLive,
                ]}
              >
                <Clock
                  size={9.5}
                  color={countdownInfo.isLive ? '#FF5252' : (isDark ? '#00E676' : '#00874E')}
                />
                <Text
                  style={[
                    styles.countdownText,
                    !isDark && styles.countdownTextLight,
                    countdownInfo.isLive && styles.countdownTextLive,
                  ]}
                  numberOfLines={1}
                >
                  {countdownInfo.text}
                </Text>
              </View>
            )}
          </View>

          {/* Equipa Visitante / Fora */}
          <View style={styles.teamColumn}>
            <View style={[styles.emblemHalo, !isDark && styles.emblemHaloLight]}>
              <ClubBadge
                name={nextMatch.awayTeam.name}
                logo={nextMatch.awayTeam.logo}
                size={isSmallScreen ? 'sm' : 'md'}
                isDark={isDark}
              />
            </View>
            <Text style={[styles.teamName, !isDark && styles.teamNameLight]} numberOfLines={2}>
              {nextMatch.awayTeam.name}
            </Text>
            <Text style={[styles.teamRole, !isDark && styles.teamRoleLight]}>Visitante</Text>
          </View>
        </View>
        </TouchableOpacity>

        {/* Ponto de Encontro / Convívio da Claque */}
        <TouchableOpacity
          onPress={handleOpenMeetingMap}
          activeOpacity={0.82}
          accessibilityLabel="Abrir ponto de encontro no mapa"
        >
          <LinearGradient
            colors={
              isDark
                ? ['rgba(0, 179, 104, 0.28)', 'rgba(0, 135, 78, 0.14)']
                : ['#E4F7EC', '#D3F1E0']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.meetingPointBar, !isDark && styles.meetingPointBarLight]}
          >
            <View style={styles.meetingPointBarTop}>
              <View style={[styles.meetingPointIconBox, !isDark && styles.meetingPointIconBoxLight]}>
                <Navigation size={11} color={isDark ? '#00E676' : '#00874E'} />
              </View>
              <Text
                style={[styles.meetingPointBarText, !isDark && styles.meetingPointBarTextLight]}
                numberOfLines={1}
              >
                <Text style={[styles.meetingPointBarBold, !isDark && styles.meetingPointBarBoldLight]}>
                  Concentração: {meetingPointInfo.timeLabel}
                </Text>
                {' · '}
                {meetingPointInfo.location}
              </Text>
            </View>
            <View style={styles.meetingMapTag}>
              <MapPin size={11} color="#FFFFFF" />
              <Text style={styles.meetingMapTagText}>Ver Mapa</Text>
              <ChevronRight size={12} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* 2. MODO DIA DE JOGO (ATIVO APENAS FALTANDO 1 HORA PARA O JOGO) */}
      {isMatchdayActive && (
        <View style={styles.matchdayCard}>
          <View style={styles.matchdayHeaderRow}>
            <View style={styles.matchdayLiveBadge}>
              <View style={styles.greenLivePulse} />
              <Text style={styles.matchdayLiveBadgeText}>MODO DIA DE JOGO</Text>
            </View>
            <Text style={styles.matchdayStatusText}>{MATCHDAY_DATA.status}</Text>
          </View>

          {/* Marcador em Direto */}
          <View style={styles.liveScoreboardRow}>
            <View style={styles.scoreTeamCol}>
              <Text style={styles.scoreTeamName}>RIO AVE</Text>
            </View>
            <View style={styles.scoreDigitsBox}>
              <Text style={styles.scoreDigitGreen}>{MATCHDAY_DATA.homeScore}</Text>
              <Text style={styles.scoreSeparator}>-</Text>
              <Text style={styles.scoreDigit}>{MATCHDAY_DATA.awayScore}</Text>
            </View>
            <View style={styles.scoreTeamColRight}>
              <Text style={styles.scoreTeamName}>E. AMADORA</Text>
            </View>
          </View>

          {/* Evento Recente */}
          <View style={styles.liveEventNotice}>
            <Text style={styles.liveEventText}>{MATCHDAY_DATA.events[0].text}</Text>
          </View>

          {/* Ponto de Encontro da Bancada Poente */}
          <View style={styles.meetingPointBox}>
            <View style={styles.meetingPointHeader}>
              <MapPin size={13} color={COLORS.gold} />
              <Text style={styles.meetingPointTitle}>{MATCHDAY_DATA.meetingPoint.title}</Text>
            </View>
            <Text style={styles.meetingPointDesc}>{MATCHDAY_DATA.meetingPoint.instructions}</Text>
          </View>

          {/* Votação: Guerreiro da Bancada */}
          <View style={styles.motmSection}>
            <View style={styles.motmHeader}>
              <Trophy size={14} color={COLORS.gold} />
              <Text style={styles.motmTitle}>Eleger "Guerreiro da Bancada"</Text>
            </View>

            <View style={styles.motmGrid}>
              {motmList.map((player) => {
                const hasVoted = votedPlayerId === player.id;
                return (
                  <TouchableOpacity
                    key={player.id}
                    style={[styles.motmCandidateCard, hasVoted && styles.motmCandidateCardActive]}
                    onPress={() => handleVoteMotm(player.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.motmTopLine}>
                      <Text style={styles.motmPlayerNumber}>#{player.number}</Text>
                      <Text style={[styles.motmPlayerName, hasVoted && styles.motmPlayerNameActive]}>
                        {player.name}
                      </Text>
                    </View>
                    <View style={styles.motmBarContainer}>
                      <View style={[styles.motmBarFill, { width: `${player.pct}%` }]} />
                    </View>
                    <View style={styles.motmBottomLine}>
                      <Text style={styles.motmVotesCount}>{player.votes} votos</Text>
                      <Text style={styles.motmPctText}>{player.pct}%</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* DESTAQUE PRINCIPAL: CÂNTICOS G39 (PLAYER / CÂNTICO DA SEMANA) */}
      <View style={[styles.chantsCenterWrapper, isSmallScreen && styles.chantsCenterWrapperSmall]}>
        <TouchableOpacity
          onPress={onOpenChants}
          activeOpacity={0.86}
          style={styles.chantsTouchFull}
        >
          <LinearGradient
            colors={
              isDark
                ? ['#00874E', '#005A34', '#0F2519']
                : ['#009958', '#007B46']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.chantsCenteredBtn, !isDark && styles.chantsCenteredBtnLight, isSmallScreen && styles.chantsCenteredBtnSmall]}
          >
            <View style={styles.chantsLogoWrapper}>
              <Image
                source={require('../../assets/logo_39.png')}
                style={styles.chantsLogoImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.chantsTextBoxCentered}>
              <View style={styles.chantsBadgeRow}>
                <Drum size={10} color="#F2B600" />
                <Text style={styles.chantsWeekBadgeText}>CÂNTICO DA SEMANA · G39</Text>
              </View>
              <Text style={styles.shortcutTitleCentered} numberOfLines={1}>
                {CHANT_OF_THE_WEEK.title}
              </Text>
              <Text style={styles.shortcutDescCentered} numberOfLines={1}>
                Letra e Ritmos · {CHANT_OF_THE_WEEK.tempo.split('·')[0].trim()}
              </Text>
            </View>
            <View style={styles.chantsPlayCircle}>
              <Play size={13} color="#0D1310" fill="#0D1310" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      </ScrollView>

      {/* Modal de Jogos e Calendário Oficial em Direto */}
      <JogosModal
        visible={jogosModalVisible}
        onClose={() => setJogosModalVisible(false)}
        isDark={isDark}
      />

      {/* Modal de Últimos Resultados Oficiais */}
      <ResultadoModal
        visible={resultadoModalVisible}
        onClose={() => setResultadoModalVisible(false)}
        isDark={isDark}
      />

      {/* Modal de Tabela Classificativa */}
      <TabelaModal
        visible={tabelaModalVisible}
        onClose={() => setTabelaModalVisible(false)}
        onNavigateTab={(tab) => {
          if (tab === 'calendar') {
            setJogosModalVisible(true);
          } else if (onNavigateTab) {
            onNavigateTab(tab);
          }
        }}
        isDark={isDark}
      />

      {/* Modal Seja Sócio */}
      <SejaSocioModal
        visible={socioModalVisible}
        onClose={() => setSocioModalVisible(false)}
        onJoinMember={handleJoinSocio}
        onNavigateTab={onNavigateTab}
        isDark={isDark}
        isLoggedIn={isLoggedIn}
      />

      {/* Modal Galeria / Instagram Ultras Grupo 39 */}
      <GaleriaModal
        visible={galeriaModalVisible}
        onClose={() => setGaleriaModalVisible(false)}
        isDark={isDark}
      />

      {/* Modal Eventos / Convívios & Cortejos Ultras Grupo 39 */}
      <EventosModal
        visible={eventosModalVisible}
        onClose={() => setEventosModalVisible(false)}
        isDark={isDark}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1310',
    position: 'relative',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 14,
  },
  lastResultSection: {
    width: '100%',
    marginTop: 0,
    marginBottom: 0,
  },
  newsHeaderIconBox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: 'rgba(242, 182, 0, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.36)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsHeaderIconBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.28)',
  },
  newsSectionTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  newsHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  newsDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  newsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  newsDotActive: {
    width: 16,
    backgroundColor: '#F2B600',
  },
  newsDotLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.2)',
  },
  newsDotActiveLight: {
    width: 16,
    backgroundColor: '#00874E',
  },
  newsFlashscoreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(242, 182, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.28)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  newsFlashscoreLinkLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.24)',
  },
  newsFeaturedCard: {
    borderRadius: 16,
    borderWidth: 1.3,
    borderColor: 'rgba(242, 182, 0, 0.45)',
    overflow: 'hidden',
    position: 'relative',
    minHeight: 94,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 22px rgba(0, 0, 0, 0.4), 0 0 16px rgba(242, 182, 0, 0.14)',
      },
      default: {
        shadowColor: '#F2B600',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
      },
    }),
  },
  newsFeaturedCardLight: {
    borderColor: 'rgba(0, 135, 78, 0.34)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 135, 78, 0.12)',
      },
    }),
  },
  newsAccentLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  newsFeaturedContent: {
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 14,
    gap: 7,
  },
  newsRollCard: {
    overflow: 'hidden',
    minHeight: 74,
    justifyContent: 'center',
  },
  newsTypePillResult: {
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newsTypePillResultText: {
    color: '#00E676',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  newsTypePillArticle: {
    backgroundColor: 'rgba(242, 182, 0, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.32)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newsTypePillArticleText: {
    color: '#F2B600',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  newsTypePillTransfer: {
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.36)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newsTypePillTransferText: {
    color: '#38BDF8',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  newsSlideBody: {
    gap: 5,
  },
  newsArticleTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 17,
  },
  newsArticleTitleLight: {
    color: '#14201A',
  },
  newsArticleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  newsArticleSub: {
    color: '#9CAFA4',
    fontSize: 10.5,
    fontWeight: '600',
    flex: 1,
  },
  newsArticleSubLight: {
    color: '#5A6E63',
  },
  seeAllLink: {
    color: '#00E676',
    fontSize: 11.5,
    fontWeight: '700',
  },
  seeAllLinkLight: {
    color: '#00874E',
  },
  lastResultCard: {
    backgroundColor: 'rgba(17, 26, 20, 0.84)',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  lastResultCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.14)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  lastResultTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  lastResultComp: {
    color: '#9CAFA4',
    fontSize: 10,
    fontWeight: '700',
    flex: 1,
  },
  lastResultCompLight: {
    color: '#5A6E63',
  },
  lastResultDate: {
    color: '#7E9187',
    fontSize: 10,
    fontWeight: '600',
  },
  lastResultDateLight: {
    color: '#7E9187',
  },
  lastResultScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  lastResultTeamGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lastResultTeamGroupRight: {
    justifyContent: 'flex-end',
  },
  lastResultTeam: {
    flexShrink: 1,
    color: '#D5E2DA',
    fontSize: 12.5,
    fontWeight: '700',
  },
  lastResultTeamRight: {
    textAlign: 'right',
  },
  lastResultTeamHighlight: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  lastResultTeamLight: {
    color: '#14201A',
  },
  lastResultScoreBox: {
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lastResultScoreBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.28)',
  },
  lastResultScoreText: {
    color: '#00E676',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  lastResultScoreTextLight: {
    color: '#00874E',
  },
  lastResultScorers: {
    color: '#9CAFA4',
    fontSize: 10.5,
    lineHeight: 15,
    textAlign: 'center',
  },
  lastResultScorersLight: {
    color: '#5A6E63',
  },
  containerLight: {
    backgroundColor: '#F5F8F6',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 0,
  },
  backgroundImage: {
    width: '92%',
    maxWidth: 440,
    aspectRatio: 1,
    opacity: 0.18,
  },
  backgroundImageLight: {
    opacity: 0.13,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  backgroundOverlayLight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },

  // Hero Match Card
  heroCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 230, 118, 0.32)',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    marginBottom: 0,
    flexShrink: 0,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.42), 0 0 18px rgba(0, 179, 104, 0.18)',
      },
      default: {
        shadowColor: '#00B368',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
  heroCardSmall: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 11,
    marginBottom: 0,
  },
  heroAccentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  heroStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  heroStatusPillLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.28)',
  },
  heroStatusPillLive: {
    backgroundColor: 'rgba(255, 82, 82, 0.18)',
    borderColor: 'rgba(255, 82, 82, 0.45)',
  },
  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
  },
  heroStatusDotLive: {
    backgroundColor: '#FF5252',
  },
  heroStatusText: {
    color: '#00E676',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  heroStatusTextLight: {
    color: '#00874E',
  },
  heroStatusTextLive: {
    color: '#FF5252',
  },
  formPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 999,
  },
  formPillLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderColor: 'rgba(0, 135, 78, 0.16)',
  },
  formLabel: {
    color: '#A5B8AE',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  formLabelLight: {
    color: '#4F665B',
  },
  formDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  formDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formDotWin: {
    backgroundColor: '#00B368',
  },
  formDotDraw: {
    backgroundColor: '#D9A100',
  },
  formDotLoss: {
    backgroundColor: '#D94343',
  },
  formDotText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  emblemHalo: {
    padding: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 230, 118, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 4,
  },
  emblemHaloLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.06)',
    borderColor: 'rgba(0, 135, 78, 0.14)',
  },
  vsBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 4,
  },
  vsBadgeLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.3)',
  },
  heroTopBar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  compInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compName: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  compRoundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  compRound: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 1,
  },
  liveMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryLight,
  },
  liveMatchBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },

  // Equipas
  matchTeamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamColumn: {
    flex: 1.2,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  teamEmblem: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#00874E',
    borderWidth: 2,
    borderColor: '#00B368',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  awayEmblem: {
    backgroundColor: '#A81C21',
    borderColor: '#E31B23',
  },
  teamInitials: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
  },
  awayInitials: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
  },
  teamName: {
    color: COLORS.white,
    fontSize: 12.5,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 15.5,
  },
  teamRole: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    marginTop: 1.5,
  },
  vsColumn: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  vsText: {
    color: '#F2B600',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  stadiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: '#1A2922',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginBottom: 3,
  },
  stadiumTagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  matchTime: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Contagem Decrescente (Countdown) por baixo da data/hora
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    backgroundColor: 'rgba(0, 179, 104, 0.13)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 999,
  },
  countdownPillLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.08)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  countdownPillLive: {
    backgroundColor: 'rgba(255, 82, 82, 0.16)',
    borderColor: 'rgba(255, 82, 82, 0.45)',
  },
  countdownText: {
    color: '#00E676',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  countdownTextLight: {
    color: '#00874E',
  },
  countdownTextLive: {
    color: '#FF5252',
  },

  // Secção Ponto de Encontro / Convívio no Rodapé do Hero Card
  meetingPointBar: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 2,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: 'rgba(0, 230, 118, 0.55)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 179, 104, 0.22)',
      },
      default: {
        shadowColor: '#00B368',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  meetingPointBarLight: {
    borderColor: 'rgba(0, 135, 78, 0.42)',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 12px rgba(0, 135, 78, 0.12)',
      },
    }),
  },
  meetingPointBarTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    width: '100%',
  },
  meetingPointIconBox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 230, 118, 0.24)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meetingPointIconBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.16)',
    borderColor: 'rgba(0, 135, 78, 0.3)',
  },
  meetingPointBarText: {
    color: '#E6F4EC',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    flexShrink: 1,
  },
  meetingPointBarTextLight: {
    color: '#1C3527',
  },
  meetingPointBarBold: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  meetingPointBarBoldLight: {
    color: '#006B3E',
  },
  meetingMapTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 5,
    backgroundColor: '#00874E',
    borderWidth: 1,
    borderColor: '#00C86F',
    paddingHorizontal: 16,
    paddingVertical: 5.5,
    borderRadius: 999,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 179, 104, 0.4)',
      },
    }),
  },
  meetingMapTagLight: {
    backgroundColor: '#00874E',
  },
  meetingMapTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.25,
  },
  meetingMapTagTextLight: {
    color: '#FFFFFF',
  },

  // Disponibilidade de Bilhetes no Hero Card
  heroAvailabilityWrapper: {
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 2,
    marginBottom: 6,
  },
  heroAvailabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  heroAvailabilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroAvailabilityPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
  },
  heroAvailabilityText: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroAvailabilityTextLight: {
    color: '#4B6355',
  },
  heroAvailabilityPct: {
    color: '#00E676',
    fontSize: 10,
    fontWeight: '900',
  },
  heroAvailabilityPctLight: {
    color: '#00874E',
  },
  heroAvailabilityTrack: {
    width: '100%',
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  heroAvailabilityTrackLight: {
    backgroundColor: '#E0E8E3',
  },
  heroAvailabilityFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#00B368',
  },

  // Botão Bilhete MB WAY Compacto e Centralizado
  heroBuyBtn: {
    alignSelf: 'center',
    marginTop: 8,
    backgroundColor: '#00874E',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#00B368',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 10px rgba(0, 135, 78, 0.3)',
      },
    }),
  },
  heroBuyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroBuyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketIconBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBuyTitle: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Botão "Bilhete" Adquirido em formato Card Organizado
  heroTicketPurchasedCard: {
    width: '100%',
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(12, 28, 19, 0.92)',
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 230, 118, 0.45)',
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(0, 230, 118, 0.22)',
      },
    }),
  },
  heroTicketPurchasedCardLight: {
    backgroundColor: '#EDF9F2',
    borderColor: 'rgba(0, 135, 78, 0.35)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 135, 78, 0.12)',
      },
    }),
  },
  heroTicketPurchasedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  ticketPurchasedIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 230, 118, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketPurchasedIconBoxLight: {
    backgroundColor: '#D1F2E0',
    borderColor: 'rgba(0, 135, 78, 0.35)',
  },
  ticketPurchasedCol: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  heroBuyTitlePurchased: {
    color: '#00E676',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  heroBuyTitlePurchasedLight: {
    color: '#00874E',
  },
  heroBuySubPurchased: {
    color: '#90ADA0',
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 1.5,
  },
  heroBuySubPurchasedLight: {
    color: '#4C6556',
  },
  heroTicketPurchasedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketPurchasedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 7.5,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: 'rgba(0, 230, 118, 0.35)',
  },
  ticketPurchasedBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  ticketPurchasedBadgeText: {
    color: '#00E676',
    fontSize: 10,
    fontWeight: '800',
  },
  ticketPurchasedBadgeTextLight: {
    color: '#00874E',
  },

  // Headers de Secção
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSeeAll: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },


  // News Card
  newsCard: {
    backgroundColor: '#14201A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    marginBottom: 14,
  },
  newsBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deslocacaoBadge: {
    backgroundColor: 'rgba(0, 179, 104, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deslocacaoBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
  },
  newsTimeAgo: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  newsCardTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 20,
  },
  newsCardDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  quickBookBusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A2922',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.4)',
  },
  quickBookBusText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },

  // Communique
  communiqueCard: {
    flexDirection: 'row',
    backgroundColor: '#14201A',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  communiqueIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communiqueContent: {
    flex: 1,
  },
  communiqueTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  communiqueDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },

  // Atalhos Rápidos da Claque
  chantsCenterWrapper: {
    alignItems: 'center',
    marginBottom: 0,
    flexShrink: 0,
  },
  chantsCenterWrapperSmall: {
    marginBottom: 0,
  },
  chantsTouchFull: {
    width: '100%',
  },
  chantsCenteredBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 230, 118, 0.42)',
    gap: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 135, 78, 0.35)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  chantsCenteredBtnSmall: {
    paddingVertical: 7,
    gap: 9,
  },
  chantsLogoWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F2B600',
  },
  chantsLogoImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  chantsTextBoxCentered: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  chantsBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 1.5,
  },
  chantsWeekBadgeText: {
    color: '#F2B600',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  shortcutHeaderRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  shortcutTitleCentered: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  shortcutDescCentered: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 10,
    marginTop: 1,
  },
  chantsPlayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00E676',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  shortcutsSection: {
    width: '100%',
    marginTop: 6,
  },
  shortcutsSectionSmall: {
    marginTop: 4,
  },
  shortcutsGridContainer: {
    gap: 9,
    width: '100%',
  },
  singleShortcutRow: {
    width: '100%',
  },
  animatedBusWrapperSingle: {
    width: '100%',
    borderRadius: 13,
  },
  subShortcutCardPulsingSingle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(22, 36, 25, 0.82)',
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#00B368',
    gap: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 0 12px rgba(0, 179, 104, 0.35)',
      },
    }),
  },
  subShortcutCardLockedSingle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(19, 26, 21, 0.82)',
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.35)',
    gap: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      },
    }),
  },
  busLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  busTextRowSingle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  busAvailabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(242, 182, 0, 0.12)',
    paddingHorizontal: 6.5,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: 'rgba(242, 182, 0, 0.3)',
    flexShrink: 0,
  },
  busAvailabilityBadgeLight: {
    backgroundColor: 'rgba(242, 182, 0, 0.14)',
    borderColor: 'rgba(180, 130, 0, 0.28)',
  },
  busAvailabilityMiniTrack: {
    width: 20,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  busAvailabilityMiniFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#FFD700',
  },
  busAvailabilityText: {
    color: '#FFD700',
    fontSize: 9.5,
    fontWeight: '800',
  },
  busAvailabilityTextLight: {
    color: '#8A6200',
  },
  subShortcutTextPulsingSingle: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.1,
  },
  subShortcutTextSingle: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  busSubtitleSingle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  busSubtitleSingleLight: {
    color: '#65786C',
  },
  singleRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  singleRowPriceBadge: {
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '900',
  },
  lockedBadgeTextSingle: {
    color: '#F2B600',
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: 'rgba(242, 182, 0, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.25)',
  },
  subShortcutsRow: {
    flexDirection: 'row',
    gap: 9,
    width: '100%',
  },
  animatedBusWrapper: {
    flex: 1,
    borderRadius: 12,
  },
  subShortcutCardPulsing: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162419',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderWidth: 1.5,
    borderColor: '#00B368',
    gap: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 0 12px rgba(0, 179, 104, 0.35)',
      },
    }),
  },
  subShortcutCardPulsingLight: {
    backgroundColor: '#EDF9F2',
    borderColor: '#00B368',
  },
  busTextRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subShortcutTextPulsing: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.1,
  },
  subShortcutTextPulsingLight: {
    color: '#00874E',
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B368',
  },
  subShortcutCardLocked: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131A15',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.35)',
    gap: 8,
  },
  subShortcutCardLockedLight: {
    backgroundColor: '#FFFDF0',
    borderColor: 'rgba(242, 182, 0, 0.4)',
  },
  subShortcutIconBgLocked: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: 'rgba(242, 182, 0, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busTextRowLocked: {
    flex: 1,
    justifyContent: 'center',
  },
  lockedBadgeText: {
    color: '#F2B600',
    fontSize: 9.5,
    fontWeight: '800',
    marginTop: 0.5,
  },

  subShortcutCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 26, 20, 0.80)',
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 9,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      },
    }),
  },
  subShortcutCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.12)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  subShortcutIconBgBus: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutIconBgCalendar: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutIconBgLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  subShortcutIconBgStore: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: 'rgba(242, 182, 0, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutIconBgStoreLight: {
    backgroundColor: 'rgba(242, 182, 0, 0.16)',
    borderColor: 'rgba(184, 134, 0, 0.26)',
  },
  shortcutTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  subShortcutIconBgCamera: {
    width: 30,
    height: 30,
    borderRadius: 8.5,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutText: {
    color: '#FFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  subShortcutSub: {
    color: '#8DA397',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  subShortcutSubLight: {
    color: '#5A6E63',
  },
  socioBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.35)',
    gap: 10,
  },
  socioBannerCardLight: {
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  socioBannerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subShortcutTextPagamentos: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  subShortcutTextPagamentosCompact: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  pagamentosCardFull: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(17, 26, 20, 0.84)',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    gap: 10,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  pagamentosCardFullLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  pagamentosFullLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pagamentosFullTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  pagamentosFullTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  pagamentosFullSub: {
    color: '#A0B4AA',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  pagamentosFullRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pagamentosCountPill: {
    backgroundColor: 'rgba(0, 179, 104, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.28)',
    paddingHorizontal: 8.5,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  pagamentosCountPillLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.09)',
    borderColor: 'rgba(0, 135, 78, 0.24)',
  },
  pagamentosCountText: {
    color: '#00E676',
    fontSize: 10.5,
    fontWeight: '800',
  },
  pagamentosCountTextLight: {
    color: '#00874E',
  },
  pagamentosCenterTextCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutsRowCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCentered: {
    textAlign: 'center',
  },
  lockedBadgeTextPagamentos: {
    color: '#F2B600',
    fontSize: 8.5,
    fontWeight: '800',
    marginTop: 0.5,
  },
  subShortcutTextLight: {
    color: '#15241C',
  },
  subShortcutCardDisabled: {
    opacity: 0.62,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  subShortcutCardDisabledLight: {
    backgroundColor: '#F0F4F1',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  subShortcutIconBgDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  subShortcutIconBgDisabledLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  subShortcutTextLockedCol: {
    flex: 1,
    justifyContent: 'center',
  },
  subShortcutBadgeSmall: {
    color: COLORS.primaryLight,
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 0.5,
  },
  subShortcutTextDisabled: {
    color: '#8A9E93',
  },
  subShortcutTextDisabledLight: {
    color: '#7A8C82',
  },
  lockedBadgeTextMuted: {
    color: '#7E9187',
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 0.5,
  },
  shortcutIconBgMusic: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00B368',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 179, 104, 0.4)',
      },
    }),
  },
  chantsArrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  shortcutBadgeGold: {
    backgroundColor: 'rgba(0, 179, 104, 0.22)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.4)',
  },
  shortcutBadgeText: {
    color: '#00B368',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  // Modo Dia de Jogo (Matchday Live Hub)
  matchdayCard: {
    backgroundColor: '#0A120D',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 179, 104, 0.4)',
    padding: 14,
    marginBottom: 14,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 0 16px rgba(0, 135, 78, 0.2)',
      },
    }),
  },
  matchdayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchdayLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  greenLivePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryLight,
  },
  matchdayLiveBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  matchdayStatusText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  liveScoreboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121F17',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  scoreTeamCol: {
    flex: 1,
  },
  scoreTeamColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  scoreTeamName: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scoreDigitsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  scoreDigitGreen: {
    color: COLORS.primaryLight,
    fontSize: 22,
    fontWeight: '900',
  },
  scoreDigit: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
  },
  scoreSeparator: {
    color: COLORS.textMuted,
    fontSize: 18,
    fontWeight: '700',
  },
  liveEventNotice: {
    backgroundColor: 'rgba(242, 182, 0, 0.12)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  liveEventText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  meetingPointBox: {
    backgroundColor: '#101A14',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 12,
  },
  meetingPointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  meetingPointTitle: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
  },
  meetingPointDesc: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    lineHeight: 14,
  },
  motmSection: {
    backgroundColor: '#0F1913',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  motmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  motmTitle: {
    color: COLORS.white,
    fontSize: 11.5,
    fontWeight: '800',
  },
  motmGrid: {
    gap: 6,
  },
  motmCandidateCard: {
    backgroundColor: '#16241B',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  motmCandidateCardActive: {
    borderColor: COLORS.primaryLight,
    backgroundColor: '#1A3022',
  },
  motmTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  motmPlayerNumber: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
  },
  motmPlayerName: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  motmPlayerNameActive: {
    color: COLORS.primaryLight,
  },
  motmBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  motmBarFill: {
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 2,
  },
  motmBottomLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  motmVotesCount: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '500',
  },
  motmPctText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
  },

  // Variantes para Modo Claro (Light Theme)
  containerLight: {
    backgroundColor: '#F4F7F5',
  },
  chantsCenteredBtnLight: {
    backgroundColor: '#00874E',
    borderColor: '#00A85F',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 14px rgba(0, 135, 78, 0.3)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  subShortcutCardPulsingLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00874E',
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 0 14px rgba(0, 135, 78, 0.3), 0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  subShortcutTextPulsingLight: {
    color: '#14201A',
  },
  subShortcutCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderColor: 'rgba(0, 135, 78, 0.16)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  subShortcutTextLight: {
    color: '#14201A',
  },
  heroCardLight: {
    borderColor: 'rgba(0, 135, 78, 0.25)',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 22px rgba(0, 135, 78, 0.1)',
      },
    }),
  },
  sectionTitleLight: {
    color: '#14201A',
  },
  communiqueCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.15)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  communiqueTitleLight: {
    color: '#14201A',
  },
  communiqueDescLight: {
    color: '#556960',
  },
  compNameLight: {
    color: '#14201A',
  },
  compRoundLight: {
    color: '#556960',
  },
  teamNameLight: {
    color: '#14201A',
  },
  teamRoleLight: {
    color: '#7E9187',
  },
  vsTextLight: {
    color: '#00874E',
  },
  stadiumTagLight: {
    backgroundColor: '#EDF5F0',
  },
  stadiumTagTextLight: {
    color: '#14201A',
  },
  matchTimeLight: {
    color: '#556960',
  },
});

export default memo(HomeScreen);
