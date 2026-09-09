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
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { NEXT_MATCH } from '../data/mockData';
import ClubBadge from '../components/ClubBadge';

export default function HomeScreen({ user, onBuyTicket, onNavigateTab }) {
  // Contagem decrescente para o jogo real (14 Setembro 2026 às 20:15)
  const targetDate = new Date('2026-09-14T20:15:00').getTime();

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const diff = Math.max(0, targetDate - now);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [countdown, setCountdown] = useState(calculateTimeLeft());
  const [activeSlide, setActiveSlide] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const sliderRef = useRef(null);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
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

      {/* 2. HERO BANNER: PRÓXIMO JOGO COM SÍMBOLOS DOS CLUBES */}
      <View style={styles.heroCard}>
        {/* Header do Confronto */}
        <View style={styles.heroTopBar}>
          <View style={styles.compInfo}>
            <Text style={styles.compName}>{NEXT_MATCH.competition}</Text>
            <Text style={styles.compRound}>{NEXT_MATCH.round}</Text>
          </View>
          <View style={styles.liveMatchBadge}>
            <View style={styles.greenPulse} />
            <Text style={styles.liveMatchBadgeText}>Bancada Poente</Text>
          </View>
        </View>

        {/* Equipas & Emblemas Reais */}
        <View style={styles.matchTeamsRow}>
          {/* Rio Ave FC */}
          <View style={styles.teamColumn}>
            <ClubBadge name={NEXT_MATCH.homeTeam.name} size="lg" style={{ marginBottom: 8 }} />
            <Text style={styles.teamName}>{NEXT_MATCH.homeTeam.name}</Text>
            <Text style={styles.teamRole}>Anfitrião</Text>
          </View>

          {/* VS & Detalhes */}
          <View style={styles.vsColumn}>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.stadiumTag}>
              <MapPin size={11} color={COLORS.gold} />
              <Text style={styles.stadiumTagText}>{NEXT_MATCH.stadium}</Text>
            </View>
            <Text style={styles.matchTime}>{NEXT_MATCH.dateFormatted}</Text>
          </View>

          {/* Adversário Real */}
          <View style={styles.teamColumn}>
            <ClubBadge name={NEXT_MATCH.awayTeam.name} size="lg" style={{ marginBottom: 8 }} />
            <Text style={styles.teamName}>{NEXT_MATCH.awayTeam.name}</Text>
            <Text style={styles.teamRole}>Visitante</Text>
          </View>
        </View>

        {/* Contagem Decrescente em Tempo Real */}
        <View style={styles.countdownRow}>
          <View style={styles.countdownBlock}>
            <Text style={styles.countdownNumber}>
              {String(countdown.days).padStart(2, '0')}
            </Text>
            <Text style={styles.countdownLabel}>Dias</Text>
          </View>
          <Text style={styles.countdownColon}>:</Text>

          <View style={styles.countdownBlock}>
            <Text style={styles.countdownNumber}>
              {String(countdown.hours).padStart(2, '0')}
            </Text>
            <Text style={styles.countdownLabel}>Horas</Text>
          </View>
          <Text style={styles.countdownColon}>:</Text>

          <View style={styles.countdownBlock}>
            <Text style={styles.countdownNumber}>
              {String(countdown.minutes).padStart(2, '0')}
            </Text>
            <Text style={styles.countdownLabel}>Min</Text>
          </View>
          <Text style={styles.countdownColon}>:</Text>

          <View style={styles.countdownBlock}>
            <Text style={styles.countdownNumber}>
              {String(countdown.seconds).padStart(2, '0')}
            </Text>
            <Text style={styles.countdownLabel}>Seg</Text>
          </View>
        </View>

        {/* Info adicional: clima e vagas */}
        <View style={styles.weatherCapacityRow}>
          <Text style={styles.weatherInfoText}>🌤️ {NEXT_MATCH.weather}</Text>
          <Text style={styles.capacityText}>🔥 Lotação Bancada: 84%</Text>
        </View>

        {/* CTA BILHÉTICA INTEGRADO: COMPRA RÁPIDA MB WAY */}
        <TouchableOpacity
          style={styles.heroBuyBtn}
          onPress={() =>
            onBuyTicket({
              title: `Bilhete Bancada Grupo 39 · ${NEXT_MATCH.homeTeam.name} vs ${NEXT_MATCH.awayTeam.name}`,
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
            <View style={styles.ticketIconBox}>
              <Ticket size={18} color="#FFF" />
            </View>
            <View style={styles.btnTextBox}>
              <Text style={styles.heroBuyTitle}>
                Garantir Bilhete / Bancada Grupo 39
              </Text>
              <Text style={styles.heroBuySub}>
                Preço de Sócio: {NEXT_MATCH.ticketPriceMember.toFixed(2)} € (Checkout MB WAY)
              </Text>
            </View>
            <ChevronRight size={18} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>


      {/* 4. FEED RÁPIDO: AVISOS DE DESLOCAÇÕES & NOTÍCIAS */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleWithIcon}>
          <Bus size={18} color={COLORS.primaryLight} />
          <Text style={styles.sectionTitle}>Deslocações & Notícias</Text>
        </View>
      </View>

      {/* Card Deslocação Guimarães */}
      <View style={styles.newsCard}>
        <View style={styles.newsBadgeRow}>
          <View style={styles.deslocacaoBadge}>
            <Text style={styles.deslocacaoBadgeText}>CARAVANA G39</Text>
          </View>
          <Text style={styles.newsTimeAgo}>19 de Setembro · 7.ª Jornada</Text>
        </View>
        <Text style={styles.newsCardTitle}>
          Autocarros para Alverca (FC Alverca vs Rio Ave FC)
        </Text>
        <Text style={styles.newsCardDesc}>
          Inscrições abertas na sede e pela app! Saída do Cais da Alfândega às 11h30. O pack inclui viagem ida/volta + bilhete no setor visitante por apenas 15,00 €.
        </Text>

        <TouchableOpacity
          style={styles.quickBookBusBtn}
          onPress={() =>
            onBuyTicket({
              title: 'Pack Deslocação Alverca (Autocarro + Bilhete Visitante)',
              category: 'Deslocação Grupo 39',
              amount: 15.00,
              originalPrice: 20.00,
              discount: 5.00,
              type: 'bus',
            })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.quickBookBusText}>Reservar Lugar via MB WAY (15,00 €)</Text>
          <ChevronRight size={14} color={COLORS.gold} />
        </TouchableOpacity>
      </View>

      {/* Card Comunicado da Bancada */}
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 18,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4), 0 0 24px rgba(0, 135, 78, 0.12)',
      },
    }),
  },
  heroTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  compInfo: {
    justifyContent: 'center',
  },
  compName: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  compRound: {
    color: COLORS.textSecondary,
    fontSize: 11,
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
    marginBottom: 16,
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
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: 110,
  },
  teamRole: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  vsColumn: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  vsText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  stadiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1A2922',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  stadiumTagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  matchTime: {
    color: COLORS.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },

  // Countdown
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D1410',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 4,
  },
  countdownBlock: {
    alignItems: 'center',
    minWidth: 36,
  },
  countdownNumber: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  countdownLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  countdownColon: {
    color: COLORS.primaryLight,
    fontSize: 15,
    fontWeight: '800',
    marginHorizontal: 2,
    marginBottom: 10,
  },
  weatherCapacityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  weatherInfoText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  capacityText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '600',
  },

  // Botão Bilhete MB WAY
  heroBuyBtn: {
    backgroundColor: '#00874E',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#00B368',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 18px rgba(0, 135, 78, 0.4)',
      },
    }),
  },
  heroBuyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  btnTextBox: {
    flex: 1,
  },
  heroBuyTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  heroBuySub: {
    color: '#D2F5E2',
    fontSize: 10,
    marginTop: 2,
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
});
