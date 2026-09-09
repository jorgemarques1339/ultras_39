import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  MapPin,
  Ticket,
  ChevronRight,
  Flame,
  Bus,
  Sparkles,
  Users,
  Music,
  ShoppingBag,
  Radio,
  Award,
  CheckCircle2,
  Trophy,
  Calendar,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { NEXT_MATCH, MATCHDAY_DATA } from '../data/mockData';
import ClubBadge from '../components/ClubBadge';
import DeslocacaoModal from '../components/DeslocacaoModal';

export default function HomeScreen({
  user,
  onBuyTicket,
  onNavigateTab,
  onScroll,
  onOpenChants,
  onOpenStore,
}) {
  // Modo Dia de Jogo: desativado por agora (só será ativo faltando 1 hora para o jogo)
  const isMatchdayActive = false;
  const [deslocacaoModalVisible, setDeslocacaoModalVisible] = useState(false);
  const [votedPlayerId, setVotedPlayerId] = useState(null);
  const [motmList, setMotmList] = useState(MATCHDAY_DATA.motmCandidates);
  const [isMatchdayExpanded, setIsMatchdayExpanded] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const sliderRef = useRef(null);
  const mainScrollRef = useRef(null);

  const SLIDES = [
    {
      id: 'welcome',
      icon: Sparkles,
      iconColor: COLORS.gold,
      tag: 'Vila do Conde no Coração',
      badge: `Sócio #${user.memberNumber}`,
      title: `Bem-vindo à família, ${user.name.split(' ')[0]}!`,
      subtitle: 'Orgulho Vilacondense. A tua camisola 12 começa aqui.',
    },
    {
      id: 'match',
      icon: Flame,
      iconColor: '#FF8A00',
      tag: '6.ª Jornada Betclic',
      badge: '14 Set · 20h15',
      title: 'Rio Ave FC vs Estrela da Amadora',
      subtitle: 'Bancada Poente nos Arcos · Concentração Porta 4 às 19h15',
    },
    {
      id: 'bus',
      icon: Bus,
      iconColor: COLORS.primaryLight,
      tag: 'Caravana G39 Alverca',
      badge: 'Pack 15,00 €',
      title: 'Rumo à 7.ª Jornada em Alverca',
      subtitle: 'Sábado, 19 Setembro · Viagem e bilhete incluídos.',
    },
  ];

  // Transição automática suave dos slides deslizantes
  useEffect(() => {
    if (containerWidth <= 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % SLIDES.length;
        sliderRef.current?.scrollTo({ x: next * containerWidth, animated: true });
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [containerWidth, SLIDES.length]);

  const handleSliderScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    if (containerWidth > 0) {
      const idx = Math.round(x / containerWidth);
      if (idx !== activeSlide && idx >= 0 && idx < SLIDES.length) {
        setActiveSlide(idx);
      }
    }
  };

  const goToSlide = (idx) => {
    setActiveSlide(idx);
    sliderRef.current?.scrollTo({ x: idx * containerWidth, animated: true });
  };

  const handleVoteMotm = (playerId) => {
    if (votedPlayerId === playerId) return;
    setVotedPlayerId(playerId);
    setMotmList((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          return { ...p, votes: p.votes + 1, pct: Math.min(100, p.pct + 3) };
        }
        return p;
      })
    );
  };

  return (
    <ScrollView
      ref={mainScrollRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {/* 1. BANNER COMPACTO DESLIZANTE DE BOAS-VINDAS & DESTAQUES */}
      <View
        style={styles.sliderWrapper}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && w !== containerWidth) {
            setContainerWidth(w);
          }
        }}
      >
        <ScrollView
          ref={sliderRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleSliderScroll}
          scrollEventThrottle={16}
          style={styles.sliderScrollView}
        >
          {SLIDES.map((slide) => {
            const IconComp = slide.icon;
            return (
              <View
                key={slide.id}
                style={[
                  styles.compactSlideCard,
                  containerWidth > 0 && { width: containerWidth },
                ]}
              >
                <View style={styles.slideGlow} />

                <View style={styles.slideHeaderRow}>
                  <View style={styles.slideTagPill}>
                    <IconComp size={10} color={slide.iconColor} />
                    <Text style={[styles.slideTagText, { color: slide.iconColor }]}>
                      {slide.tag}
                    </Text>
                  </View>
                  <Text style={styles.slideBadgeText}>{slide.badge}</Text>
                </View>

                <Text style={styles.slideTitle} numberOfLines={1}>
                  {slide.title}
                </Text>
                <Text style={styles.slideSubtitle} numberOfLines={1}>
                  {slide.subtitle}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Indicadores de Paginação Deslizante */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => goToSlide(idx)}
              style={[
                styles.dot,
                activeSlide === idx ? styles.dotActive : styles.dotInactive,
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
            />
          ))}
        </View>
      </View>

      {/* ATALHO PRINCIPAL: CÂNTICOS G39 (CENTRALIZADO) */}
      <View style={styles.chantsCenterWrapper}>
        <TouchableOpacity
          style={styles.chantsCenteredBtn}
          onPress={onOpenChants}
          activeOpacity={0.8}
        >
          <View style={styles.shortcutIconBgMusic}>
            <Music size={18} color={COLORS.gold} />
          </View>
          <View style={styles.chantsTextBox}>
            <View style={styles.shortcutHeaderRow}>
              <Text style={styles.shortcutTitle}>Canticos G39</Text>
              <View style={styles.shortcutBadgeGold}>
                <Text style={styles.shortcutBadgeText}>ÁUDIO & BATERIA</Text>
              </View>
            </View>
            <Text style={styles.shortcutDesc}>Letras e ritmo oficial de bancada</Text>
          </View>
          <ChevronRight size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* 2 BOTÕES POR DEBAIXO: DESLOCAÇÕES & CALENDÁRIO */}
      <View style={styles.subShortcutsRow}>
        <TouchableOpacity
          style={styles.subShortcutCard}
          onPress={() => setDeslocacaoModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.subShortcutIconBgBus}>
            <Bus size={15} color={COLORS.gold} />
          </View>
          <Text style={styles.subShortcutText}>Deslocações</Text>
          <ChevronRight size={13} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.subShortcutCard}
          onPress={() => onNavigateTab('calendar')}
          activeOpacity={0.8}
        >
          <View style={styles.subShortcutIconBgCalendar}>
            <Calendar size={15} color={COLORS.primaryLight} />
          </View>
          <Text style={styles.subShortcutText}>Calendário</Text>
          <ChevronRight size={13} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* 2. HERO BANNER: PRÓXIMO JOGO COM SÍMBOLOS DOS CLUBES */}
      <View style={styles.heroCard}>
        {/* Header do Confronto */}
        <View style={styles.heroTopBar}>
          <View style={styles.compInfo}>
            <Text style={styles.compName}>LIGA PORTUGAL BETCLIC</Text>
            <Text style={styles.compRound}>6.ª Jornada</Text>
          </View>
        </View>

        {/* Equipas & Emblemas Reais */}
        <View style={styles.matchTeamsRow}>
          {/* Rio Ave FC */}
          <View style={styles.teamColumn}>
            <ClubBadge name={NEXT_MATCH.homeTeam.name} size="md" style={{ marginBottom: 4 }} />
            <Text style={styles.teamName}>{NEXT_MATCH.homeTeam.name}</Text>
            <Text style={styles.teamRole}>Anfitrião</Text>
          </View>

          {/* VS & Detalhes */}
          <View style={styles.vsColumn}>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.stadiumTag}>
              <MapPin size={10} color={COLORS.gold} />
              <Text style={styles.stadiumTagText}>{NEXT_MATCH.stadium}</Text>
            </View>
            <Text style={styles.matchTime}>{NEXT_MATCH.dateFormatted}</Text>
          </View>

          {/* Adversário Real */}
          <View style={styles.teamColumn}>
            <ClubBadge name={NEXT_MATCH.awayTeam.name} size="md" style={{ marginBottom: 4 }} />
            <Text style={styles.teamName}>{NEXT_MATCH.awayTeam.name}</Text>
            <Text style={styles.teamRole}>Visitante</Text>
          </View>
        </View>

        {/* CTA BILHÉTICA INTEGRADO: COMPRA RÁPIDA MB WAY */}
        <TouchableOpacity
          style={styles.heroBuyBtn}
          onPress={() =>
            onBuyTicket({
              title: `Bilhete Grupo 39 · ${NEXT_MATCH.homeTeam.name} vs ${NEXT_MATCH.awayTeam.name}`,
              category: 'Bilhética Oficial RAFC',
              amount: NEXT_MATCH.ticketPriceMember,
              originalPrice: NEXT_MATCH.ticketPricePublic,
              discount: NEXT_MATCH.ticketPricePublic - NEXT_MATCH.ticketPriceMember,
              type: 'ticket',
            })
          }
          activeOpacity={0.85}
        >
          <View style={styles.heroBuyContent}>
            <View style={styles.heroBuyLeft}>
              <View style={styles.ticketIconBox}>
                <Ticket size={13} color="#FFF" />
              </View>
              <Text style={styles.heroBuyTitle}>Comprar Bilhete</Text>
            </View>
            <ChevronRight size={14} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>

      {/* 3. MODO DIA DE JOGO (ATIVO APENAS FALTANDO 1 HORA PARA O JOGO) */}
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

      {/* 4. FEED: NOTÍCIAS & COMUNICADOS */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleWithIcon}>
          <Radio size={18} color={COLORS.primaryLight} />
          <Text style={styles.sectionTitle}>Notícias</Text>
        </View>
      </View>

      {/* Comunicado 1: Concentração e Apoio no Jogo */}
      <View style={styles.communiqueCard}>
        <View style={styles.communiqueIcon}>
          <Users size={20} color={COLORS.gold} />
        </View>
        <View style={styles.communiqueContent}>
          <Text style={styles.communiqueTitle}>Apoio Máximo: Rio Ave FC vs Estrela da Amadora</Text>
          <Text style={styles.communiqueDesc}>
            Segunda-feira, 14 de Setembro às 20h15 nos Arcos. Concentração do Grupo 39 na Porta 4 da Bancada Poente a partir das 19h15 para recepção ao autocarro da equipa.
          </Text>
        </View>
      </View>

      {/* Comunicado 2: Quotas e Informações */}
      <View style={styles.communiqueCard}>
        <View style={styles.communiqueIcon}>
          <Award size={20} color={COLORS.primaryLight} />
        </View>
        <View style={styles.communiqueContent}>
          <Text style={styles.communiqueTitle}>Campanha de Quotas Época 2026/2027</Text>
          <Text style={styles.communiqueDesc}>
            Garante o teu selo de associado ativo e prioridade máxima na bilhética oficial nos Arcos. Regularização disponível na aba de Perfil com liquidação direta via MB WAY.
          </Text>
        </View>
      </View>

      {/* Modal Dedicado da Deslocação Oficial */}
      <DeslocacaoModal
        visible={deslocacaoModalVisible}
        onClose={() => setDeslocacaoModalVisible(false)}
        onBuyTicket={onBuyTicket}
      />

      {/* Espaço para a barra flutuante */}
      <View style={{ height: 140 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1310',
    overflow: 'hidden',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // 1. Compact Sliding Highlights Banner
  sliderWrapper: {
    marginBottom: 14,
    overflow: 'hidden',
  },
  sliderScrollView: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  compactSlideCard: {
    backgroundColor: '#121C16',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  slideGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 179, 104, 0.08)',
  },
  slideHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  slideTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  slideTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  slideBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
  },
  slideTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  slideSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 16,
    backgroundColor: COLORS.primaryLight,
  },
  dotInactive: {
    width: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Hero Match Card
  heroCard: {
    backgroundColor: '#14201A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px rgba(0, 135, 78, 0.1)',
      },
    }),
  },
  heroTopBar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    marginBottom: 10,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
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
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: 100,
  },
  teamRole: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 1,
  },
  vsColumn: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  vsText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 2,
  },
  stadiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#1A2922',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  stadiumTagText: {
    color: COLORS.white,
    fontSize: 9.5,
    fontWeight: '600',
  },
  matchTime: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Botão Bilhete MB WAY Compacto
  heroBuyBtn: {
    backgroundColor: '#00874E',
    borderRadius: 8,
    paddingVertical: 5.5,
    paddingHorizontal: 10,
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
    justifyContent: 'space-between',
  },
  heroBuyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketIconBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBuyTitle: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.2,
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
    borderColor: 'rgba(242, 182, 0, 0.3)',
  },
  quickBookBusText: {
    color: COLORS.gold,
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
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
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
    marginBottom: 8,
  },
  chantsCenteredBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121C16',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.25)',
    gap: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  chantsTextBox: {
    flex: 1,
  },
  subShortcutsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  subShortcutCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111A14',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  subShortcutIconBgBus: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutIconBgCalendar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subShortcutText: {
    flex: 1,
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  shortcutIconBgMusic: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shortcutTitle: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  shortcutBadgeGold: {
    backgroundColor: 'rgba(242, 182, 0, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  shortcutBadgeText: {
    color: COLORS.gold,
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  shortcutDesc: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1,
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
});
