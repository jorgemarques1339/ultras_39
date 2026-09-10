import React, { useState, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Ticket,
  ChevronRight,
  Trophy,
  Navigation,
  ArrowLeft,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { CALENDAR_MATCHES, PAST_RESULTS } from '../data/mockData';
import ClubBadge from '../components/ClubBadge';

function CalendarScreen({ onBuyTicket, onScroll, onBack, isDark = true }) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'results'

  return (
    <View style={[styles.container, !isDark && styles.containerLight]}>
      {/* Botão de Retorno (se acedido via atalho da Home) */}
      {onBack && (
        <View style={[styles.backNavRow, !isDark && styles.backNavRowLight]}>
          <TouchableOpacity
            style={styles.backNavBtn}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={16} color={isDark ? COLORS.primaryLight : '#00874E'} />
            <Text style={[styles.backNavText, !isDark && { color: '#00874E' }]}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tabs Superiores */}
      <View style={[styles.topTabsBar, !isDark && styles.topTabsBarLight]}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            !isDark && styles.tabBtnLight,
            activeTab === 'upcoming' && styles.tabBtnActive,
            !isDark && activeTab === 'upcoming' && styles.tabBtnActiveLight,
          ]}
          onPress={() => setActiveTab('upcoming')}
          activeOpacity={0.8}
        >
          <CalendarIcon
            size={16}
            color={activeTab === 'upcoming' ? (isDark ? COLORS.primaryLight : '#00874E') : (isDark ? COLORS.textSecondary : '#5A6E63')}
          />
          <Text
            style={[
              styles.tabBtnText,
              !isDark && styles.tabBtnTextLight,
              activeTab === 'upcoming' && styles.tabBtnTextActive,
              !isDark && activeTab === 'upcoming' && styles.tabBtnTextActiveLight,
            ]}
          >
            Próximos Jogos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBtn,
            !isDark && styles.tabBtnLight,
            activeTab === 'results' && styles.tabBtnActive,
            !isDark && activeTab === 'results' && styles.tabBtnActiveLight,
          ]}
          onPress={() => setActiveTab('results')}
          activeOpacity={0.8}
        >
          <Trophy
            size={16}
            color={activeTab === 'results' ? (isDark ? COLORS.gold : '#00874E') : (isDark ? COLORS.textSecondary : '#5A6E63')}
          />
          <Text
            style={[
              styles.tabBtnText,
              !isDark && styles.tabBtnTextLight,
              activeTab === 'results' && styles.tabBtnTextActive,
              !isDark && activeTab === 'results' && styles.tabBtnTextActiveLight,
            ]}
          >
            Resultados Anteriores
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={Platform.OS !== 'web'}
        overScrollMode="never"
      >
        {/* ABA 1: PRÓXIMOS JOGOS COM SÍMBOLOS */}
        {activeTab === 'upcoming' && (
          <View>
            {CALENDAR_MATCHES.map((match) => (
              <View key={match.id} style={[styles.matchCard, !isDark && styles.matchCardLight]}>
                <View style={styles.matchHeader}>
                  <Text style={[styles.compTitle, !isDark && styles.textMutedDark]}>
                    {match.competition} · {match.round}
                  </Text>
                  <View
                    style={[
                      styles.homeAwayTag,
                      match.isHome ? styles.homeTag : styles.awayTag,
                    ]}
                  >
                    <Text
                      style={[
                        styles.homeAwayText,
                        match.isHome ? styles.homeText : styles.awayText,
                      ]}
                    >
                      {match.isHome ? 'CASA (ARCOS)' : 'FORA'}
                    </Text>
                  </View>
                </View>

                {/* Confronto com Símbolos Oficiais */}
                <View style={styles.teamsRow}>
                  <View style={styles.teamSide}>
                    <ClubBadge name={match.home} size="sm" />
                    <Text
                      style={[
                        styles.teamTitle,
                        !isDark && styles.textDark,
                        match.home.includes('Rio Ave') && styles.teamRioAve,
                      ]}
                      numberOfLines={1}
                    >
                      {match.home}
                    </Text>
                  </View>

                  <View style={[styles.vsBadge, !isDark && styles.vsBadgeLight]}>
                    <Text style={[styles.vsBadgeText, !isDark && styles.textMutedDark]}>VS</Text>
                  </View>

                  <View style={[styles.teamSide, styles.teamSideAway]}>
                    <Text
                      style={[
                        styles.teamTitle,
                        styles.teamTitleAway,
                        !isDark && styles.textDark,
                        match.away.includes('Rio Ave') && styles.teamRioAve,
                      ]}
                      numberOfLines={1}
                    >
                      {match.away}
                    </Text>
                    <ClubBadge name={match.away} size="sm" />
                  </View>
                </View>

                {/* Info Estádio & Data */}
                <View style={[styles.matchDetailsRow, !isDark && styles.matchDetailsRowLight]}>
                  <View style={styles.detailItem}>
                    <Clock size={13} color={isDark ? COLORS.gold : '#00874E'} />
                    <Text style={[styles.detailText, !isDark && styles.textMutedDark]}>{match.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MapPin size={13} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    <Text style={[styles.detailText, !isDark && styles.textMutedDark]} numberOfLines={1}>
                      {match.stadium}
                    </Text>
                  </View>
                </View>

                {/* Ação de Bilhética / Autocarro */}
                <View style={styles.matchActions}>
                  {match.isHome ? (
                    <TouchableOpacity
                      style={styles.ticketButton}
                      onPress={() =>
                        onBuyTicket({
                          title: `Bilhete ${match.home} vs ${match.away}`,
                          category: 'Bilhética Liga Portugal',
                          amount: match.priceMember,
                          originalPrice: match.priceMember + 10,
                          discount: 10,
                          type: 'ticket',
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Ticket size={15} color="#FFF" />
                      <Text style={styles.ticketButtonText}>
                        Garantir Bilhete MB WAY ({match.priceMember.toFixed(2)} €)
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.ticketButton, styles.busButton]}
                      onPress={() =>
                        onBuyTicket({
                          title: `Pack Deslocação + Bilhete ${match.home} vs ${match.away}`,
                          category: 'Deslocação Oficial Grupo 39',
                          amount: match.busPrice || 7.50,
                          originalPrice: (match.busPrice || 7.50) + 7.50,
                          discount: 7.50,
                          type: 'bus',
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Navigation size={15} color="#FFF" />
                      <Text style={styles.ticketButtonText}>
                        Caravana Autocarro MB WAY ({(match.busPrice || 7.50).toFixed(2)} €)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {/* CARD INFORMATIVO: LOCALIZAÇÃO DO ESTÁDIO DOS ARCOS */}
            <View style={[styles.stadiumInfoCard, !isDark && styles.stadiumInfoCardLight]}>
              <View style={styles.stadiumInfoHeader}>
                <MapPin size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
                <Text style={[styles.stadiumInfoTitle, !isDark && styles.textDark]}>Estádio dos Arcos (Vila do Conde)</Text>
              </View>
              <Text style={[styles.stadiumInfoDesc, !isDark && styles.textMutedDark]}>
                Avenida Bento de Freitas, 4480-811 Vila do Conde. Ponto de concentração do Grupo 39 na Porta 4 (Bancada Poente) e sede náutica no Cais da Alfândega.
              </Text>
              <TouchableOpacity
                style={styles.gpsButton}
                onPress={() => alert('Coordenadas GPS 41.3533° N, 8.7455° W abertas no mapa!')}
                activeOpacity={0.8}
              >
                <Navigation size={14} color={isDark ? COLORS.gold : '#00874E'} />
                <Text style={styles.gpsButtonText}>Abrir Rota GPS para o Estádio</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ABA 2: RESULTADOS COM SÍMBOLOS */}
        {activeTab === 'results' && (
          <View>
            {PAST_RESULTS.map((res) => (
              <View key={res.id} style={[styles.resultCard, !isDark && styles.matchCardLight]}>
                <View style={styles.resultTopBar}>
                  <Text style={[styles.resultComp, !isDark && styles.textMutedDark]}>{res.competition}</Text>
                  <Text style={[styles.resultDate, !isDark && styles.textMutedDark]}>{res.date}</Text>
                </View>

                {/* Placar com Símbolos Oficiais */}
                <View style={styles.scoreboardRow}>
                  <View style={styles.scoreTeamSide}>
                    <ClubBadge name={res.home} size="sm" />
                    <Text
                      style={[
                        styles.scoreTeamName,
                        !isDark && styles.textDark,
                        res.home.includes('Rio Ave') && styles.teamRioAve,
                      ]}
                      numberOfLines={1}
                    >
                      {res.home}
                    </Text>
                  </View>

                  <View style={styles.scorePill}>
                    <Text style={styles.scoreDigits}>
                      {res.scoreHome} - {res.scoreAway}
                    </Text>
                  </View>

                  <View style={[styles.scoreTeamSide, styles.scoreTeamSideAway]}>
                    <Text
                      style={[
                        styles.scoreTeamName,
                        styles.scoreTeamNameAway,
                        !isDark && styles.textDark,
                        res.away.includes('Rio Ave') && styles.teamRioAve,
                      ]}
                      numberOfLines={1}
                    >
                      {res.away}
                    </Text>
                    <ClubBadge name={res.away} size="sm" />
                  </View>
                </View>

                {/* Marcadores dos Golos */}
                <View style={styles.scorersContainer}>
                  <Text style={styles.scorersText}>{res.scorers}</Text>
                </View>

                {/* Resumo da Bancada */}
                <View style={styles.highlightsContainer}>
                  <Text style={styles.highlightsText}>"{res.highlights}"</Text>
                  <Text style={styles.stadiumNote}>🏟️ {res.stadium}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1310',
    overflow: 'hidden',
  },
  backNavRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#0D1310',
  },
  backNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 135, 78, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 135, 78, 0.3)',
  },
  backNavText: {
    color: COLORS.primaryLight,
    fontSize: 11.5,
    fontWeight: '700',
  },
  topTabsBar: {
    flexDirection: 'row',
    backgroundColor: '#111A15',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#18241E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(0, 135, 78, 0.25)',
    borderColor: COLORS.primaryLight,
  },
  tabBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Match Cards
  matchCard: {
    backgroundColor: '#14201A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    marginBottom: 14,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  compTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  homeAwayTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  homeTag: {
    backgroundColor: 'rgba(0, 179, 104, 0.2)',
  },
  awayTag: {
    backgroundColor: 'rgba(242, 182, 0, 0.2)',
  },
  homeAwayText: {
    fontSize: 10,
    fontWeight: '800',
  },
  homeText: {
    color: COLORS.primaryLight,
  },
  awayText: {
    color: COLORS.gold,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  teamSideAway: {
    justifyContent: 'flex-end',
  },
  teamTitle: {
    color: COLORS.white,
    fontSize: 12.5,
    fontWeight: '700',
    flexShrink: 1,
  },
  teamTitleAway: {
    textAlign: 'right',
  },
  teamRioAve: {
    color: COLORS.primaryLight,
    fontWeight: '900',
  },
  vsBadge: {
    backgroundColor: '#1A2922',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  vsBadgeText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
  },
  matchDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0D1410',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  matchActions: {
    marginTop: 2,
  },
  ticketButton: {
    backgroundColor: '#00874E',
    borderRadius: 12,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#00B368',
  },
  busButton: {
    backgroundColor: '#005D35',
    borderColor: '#00B368',
  },
  ticketButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Stadium Info Card
  stadiumInfoCard: {
    backgroundColor: '#14201A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
    padding: 16,
    marginBottom: 16,
  },
  stadiumInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stadiumInfoTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  stadiumInfoDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#192821',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
  },
  gpsButtonText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },

  // Resultados
  resultCard: {
    backgroundColor: '#14201A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    marginBottom: 14,
  },
  resultTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultComp: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  resultDate: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  scoreboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scoreTeamSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  scoreTeamSideAway: {
    justifyContent: 'flex-end',
  },
  scoreTeamName: {
    color: COLORS.white,
    fontSize: 12.5,
    fontWeight: '700',
    flexShrink: 1,
  },
  scoreTeamNameAway: {
    textAlign: 'right',
  },
  scorePill: {
    backgroundColor: '#00874E',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  scoreDigits: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  scorersContainer: {
    backgroundColor: '#0D1410',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  scorersText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  highlightsContainer: {
    paddingTop: 4,
  },
  highlightsText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 16,
    marginBottom: 4,
  },
  stadiumNote: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  backNavRowLight: {
    backgroundColor: '#FFFFFF',
  },
  topTabsBarLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  tabBtnLight: {
    backgroundColor: '#F2F6F4',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  tabBtnTextLight: {
    color: '#24382C',
  },
  tabBtnActiveLight: {
    backgroundColor: '#00874E',
    borderColor: '#00874E',
  },
  tabBtnTextActiveLight: {
    color: '#FFFFFF',
  },
  matchCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.14)',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 14px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
  vsBadgeLight: {
    backgroundColor: '#F2F6F4',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  matchDetailsRowLight: {
    backgroundColor: '#F8FAF9',
  },
  stadiumInfoCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.14)',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 14px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
});

export default memo(CalendarScreen);
