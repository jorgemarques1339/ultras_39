import React, { useState } from 'react';
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
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { CALENDAR_MATCHES, PAST_RESULTS } from '../data/mockData';
import ClubBadge from '../components/ClubBadge';

export default function CalendarScreen({ onBuyTicket }) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'results'

  return (
    <View style={styles.container}>
      {/* Tabs Superiores */}
      <View style={styles.topTabsBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'upcoming' && styles.tabBtnActive]}
          onPress={() => setActiveTab('upcoming')}
          activeOpacity={0.8}
        >
          <CalendarIcon
            size={16}
            color={activeTab === 'upcoming' ? COLORS.primaryLight : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'upcoming' && styles.tabBtnTextActive,
            ]}
          >
            Próximos Jogos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'results' && styles.tabBtnActive]}
          onPress={() => setActiveTab('results')}
          activeOpacity={0.8}
        >
          <Trophy
            size={16}
            color={activeTab === 'results' ? COLORS.gold : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'results' && styles.tabBtnTextActive,
            ]}
          >
            Resultados Anteriores
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ABA 1: PRÓXIMOS JOGOS COM SÍMBOLOS */}
        {activeTab === 'upcoming' && (
          <View>
            {CALENDAR_MATCHES.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <View style={styles.matchHeader}>
                  <Text style={styles.compTitle}>
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
                        match.home.includes('Rio Ave') && styles.teamRioAve,
                      ]}
                      numberOfLines={1}
                    >
                      {match.home}
                    </Text>
                  </View>

                  <View style={styles.vsBadge}>
                    <Text style={styles.vsBadgeText}>VS</Text>
                  </View>

                  <View style={[styles.teamSide, styles.teamSideAway]}>
                    <Text
                      style={[
                        styles.teamTitle,
                        styles.teamTitleAway,
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
                <View style={styles.matchDetailsRow}>
                  <View style={styles.detailItem}>
                    <Clock size={13} color={COLORS.gold} />
                    <Text style={styles.detailText}>{match.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MapPin size={13} color={COLORS.primaryLight} />
                    <Text style={styles.detailText} numberOfLines={1}>
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
                          amount: match.busPrice || 15.0,
                          originalPrice: (match.busPrice || 15.0) + 5,
                          discount: 5,
                          type: 'bus',
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Navigation size={15} color="#FFF" />
                      <Text style={styles.ticketButtonText}>
                        Caravana Autocarro MB WAY ({(match.busPrice || 15.0).toFixed(2)} €)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {/* CARD INFORMATIVO: LOCALIZAÇÃO DO ESTÁDIO DOS ARCOS */}
            <View style={styles.stadiumInfoCard}>
              <View style={styles.stadiumInfoHeader}>
                <MapPin size={18} color={COLORS.primaryLight} />
                <Text style={styles.stadiumInfoTitle}>Estádio dos Arcos (Vila do Conde)</Text>
              </View>
              <Text style={styles.stadiumInfoDesc}>
                Avenida Bento de Freitas, 4480-811 Vila do Conde. Ponto de concentração do Grupo 39 na Porta 4 (Bancada Poente) e sede náutica no Cais da Alfândega.
              </Text>
              <TouchableOpacity
                style={styles.gpsButton}
                onPress={() => alert('Coordenadas GPS 41.3533° N, 8.7455° W abertas no mapa!')}
                activeOpacity={0.8}
              >
                <Navigation size={14} color={COLORS.gold} />
                <Text style={styles.gpsButtonText}>Abrir Rota GPS para o Estádio</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ABA 2: RESULTADOS COM SÍMBOLOS */}
        {activeTab === 'results' && (
          <View>
            {PAST_RESULTS.map((res) => (
              <View key={res.id} style={styles.resultCard}>
                <View style={styles.resultTopBar}>
                  <Text style={styles.resultComp}>{res.competition}</Text>
                  <Text style={styles.resultDate}>{res.date}</Text>
                </View>

                {/* Placar com Símbolos Oficiais */}
                <View style={styles.scoreboardRow}>
                  <View style={styles.scoreTeamSide}>
                    <ClubBadge name={res.home} size="sm" />
                    <Text
                      style={[
                        styles.scoreTeamName,
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
    backgroundColor: '#B58500',
    borderColor: '#F2B600',
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
    borderColor: 'rgba(242, 182, 0, 0.3)',
  },
  gpsButtonText: {
    color: COLORS.gold,
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
});
