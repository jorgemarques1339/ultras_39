import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Animated,
} from 'react-native';
import { X, Users, Shield, RefreshCw, WifiOff } from 'lucide-react-native';
import Svg, { Path, Rect, Defs, ClipPath, G } from 'react-native-svg';
import { COLORS } from '../theme/colors';
import { fetchRioAveRoster } from '../services/matchesService';

const FALLBACK_SQUAD = [
  {
    group: 'Guarda-Redes',
    players: [
      { id: '1', number: 1, name: 'Cezary Miszta', nat: 'Polónia', pos: 'GR', photo: null },
      { id: '22', number: 22, name: 'Kevin Chamorro', nat: 'Costa Rica', pos: 'GR', photo: null },
      { id: '32', number: 32, name: 'Vitor Hugo', nat: 'Brasil', pos: 'GR', photo: null },
      { id: '99', number: 99, name: 'Ennio van der Gouw', nat: 'Países Baixos', pos: 'GR', photo: 'https://a.espncdn.com/i/headshots/soccer/players/full/298877.png' },
    ],
  },
  {
    group: 'Defesas',
    players: [
      { id: '2', number: 2, name: 'Zé Carlos', nat: 'Portugal', pos: 'DEF', photo: null },
      { id: '5', number: 5, name: 'Andreas Ntoi', nat: 'Grécia', pos: 'DEF', photo: 'https://r2.thesportsdb.com/images/media/player/cutout/qp5rgf1669547896.png' },
      { id: '6', number: 6, name: 'Nelson Abbey', nat: 'Inglaterra', pos: 'DEF', photo: null },
      { id: '13', number: 13, name: 'Julien Lomboto', nat: 'França', pos: 'DEF', photo: null },
      { id: '14', number: 14, name: 'Jakub Brabec', nat: 'Chéquia', pos: 'DEF', photo: null },
      { id: '20', number: 20, name: 'João Tomé', nat: 'Portugal', pos: 'DEF', photo: null },
      { id: '23', number: 23, name: 'Francisco Petrasso', nat: 'Argentina', pos: 'DEF', photo: null },
      { id: '24', number: 24, name: 'Pedro Amaral', nat: 'Portugal', pos: 'DEF', photo: null },
      { id: '39', number: 39, name: 'Gustavo Mancha', nat: 'Brasil', pos: 'DEF', photo: null },
    ],
  },
  {
    group: 'Médios',
    players: [
      { id: '8', number: 8, name: 'Ryan Guilherme', nat: 'Brasil', pos: 'MED', photo: null },
      { id: '10', number: 10, name: 'Brandon Aguilera', nat: 'Costa Rica', pos: 'MED', photo: 'https://r2.thesportsdb.com/images/media/player/cutout/3wxs0r1697743731.png' },
      { id: '19', number: 19, name: 'Malik Sellouki', nat: 'França', pos: 'MED', photo: null },
      { id: '27', number: 27, name: 'Tobias Medina', nat: 'Argentina', pos: 'MED', photo: null },
      { id: '44', number: 44, name: 'Tamás Nikitscher', nat: 'Hungria', pos: 'MED', photo: null },
      { id: '54', number: 54, name: 'Georgios Liavas', nat: 'Grécia', pos: 'MED', photo: null },
      { id: '90', number: 90, name: 'Diogo Nascimento', nat: 'Portugal', pos: 'MED', photo: null },
    ],
  },
  {
    group: 'Avançados',
    players: [
      { id: '7', number: 7, name: 'Diogo Bezerra', nat: 'Brasil', pos: 'AVA', photo: null },
      { id: '9', number: 9, name: 'Tamble', nat: 'Guiné-Bissau', pos: 'AVA', photo: null },
      { id: '11', number: 11, name: 'Jalen Blesa', nat: 'Espanha', pos: 'AVA', photo: null },
      { id: '17', number: 17, name: 'Marios Vrousai', nat: 'Grécia', pos: 'AVA', photo: null },
      { id: '21', number: 21, name: 'Radek Siler', nat: 'Chéquia', pos: 'AVA', photo: null },
      { id: '30', number: 30, name: 'Roland Galcik', nat: 'Eslováquia', pos: 'AVA', photo: null },
      { id: '77', number: 77, name: 'Dario Spikic', nat: 'Croácia', pos: 'AVA', photo: null },
      { id: '80', number: 80, name: 'Sebastian Clemmensen', nat: 'Dinamarca', pos: 'AVA', photo: null },
    ],
  },
];

export function RioAveJerseyIcon({ size = 28 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Defs>
        <ClipPath id="rioAveJerseyClip">
          <Path d="M18 9 L26 5 C28.5 9, 35.5 9, 38 5 L46 9 L58 19 L51 28 L45 24 L45 57 L19 57 L19 24 L13 28 L6 19 Z" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#rioAveJerseyClip)">
        <Rect x="0" y="0" width="64" height="64" fill="#FFFFFF" />
        <Rect x="20" y="0" width="7" height="64" fill="#008751" />
        <Rect x="37" y="0" width="7" height="64" fill="#008751" />
        <Rect x="4" y="16" width="12" height="14" fill="#008751" />
        <Rect x="48" y="16" width="12" height="14" fill="#008751" />
      </G>
      <Path
        d="M18 9 L26 5 C28.5 9, 35.5 9, 38 5 L46 9 L58 19 L51 28 L45 24 L45 57 L19 57 L19 24 L13 28 L6 19 Z"
        stroke="#008751"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Path
        d="M25.5 5.5 C28.5 10.5, 35.5 10.5, 38.5 5.5"
        stroke="#008751"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

const PlayerAvatar = memo(function PlayerAvatar({ name, photo, number, isDark }) {
  const [imgFailed, setImgFailed] = useState(false);

  const initials = (name || 'RA')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  return (
    <View style={styles.avatarContainer}>
      <View style={[styles.avatarCircle, !isDark && styles.avatarCircleLight]}>
        {photo && !imgFailed ? (
          <Image
            source={{ uri: photo }}
            style={styles.avatarImage}
            resizeMode="cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <Text style={[styles.avatarInitials, !isDark && styles.avatarInitialsLight]}>
            {initials || 'RA'}
          </Text>
        )}
      </View>
      {number !== null && number !== undefined && (
        <View style={[styles.jerseyMiniBadge, !isDark && styles.jerseyMiniBadgeLight]}>
          <Text style={styles.jerseyMiniText}>{number}</Text>
        </View>
      )}
    </View>
  );
});

function PlantelModal({ visible, onClose, isDark = true }) {
  const [squad, setSquad] = useState(FALLBACK_SQUAD);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadRoster = useCallback(async (force = false) => {
    setIsLoading(true);
    setFetchError(false);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      })
    ).start();

    try {
      const data = await fetchRioAveRoster(force);
      if (Array.isArray(data) && data.length > 0) {
        setSquad(data);
      }
    } catch (_) {
      setFetchError(true);
    } finally {
      setIsLoading(false);
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [spinAnim]);

  useEffect(() => {
    if (visible) {
      loadRoster(false);
    }
  }, [visible, loadRoster]);

  if (!visible) return null;

  const totalPlayers = squad.reduce((sum, s) => sum + s.players.length, 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.card, !isDark && styles.cardLight]}>
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                <RioAveJerseyIcon size={24} />
              </View>
              <View>
                <Text style={[styles.title, !isDark && styles.textDark]}>Plantel Rio Ave FC</Text>
                <Text style={[styles.subtitle, !isDark && styles.textMutedDark]}>
                  Equipa Principal · 2026/2027
                </Text>
              </View>
            </View>
            <View style={styles.headerRightActions}>
              <TouchableOpacity
                onPress={() => loadRoster(true)}
                style={[styles.refreshBtn, !isDark && styles.refreshBtnLight]}
                activeOpacity={0.7}
                disabled={isLoading}
                accessibilityLabel="Atualizar plantel"
              >
                <Animated.View style={[styles.spinIconWrap, { transform: [{ rotate: spin }] }]}>
                  <RefreshCw size={14} color={isDark ? COLORS.primaryLight : '#00874E'} />
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={18} color={isDark ? COLORS.textMuted : '#5A6E63'} />
              </TouchableOpacity>
            </View>
          </View>

          {fetchError && (
            <View style={styles.offlineNotice}>
              <WifiOff size={13} color="#FFB74D" />
              <Text style={styles.offlineNoticeText}>
                A exibir plantel guardado em cache.
              </Text>
              <TouchableOpacity onPress={() => loadRoster(true)} activeOpacity={0.7}>
                <Text style={styles.offlineRetryText}>Tentar de novo</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            {squad.map((section) => (
              <View key={section.group} style={styles.groupBlock}>
                <View style={styles.groupHeader}>
                  <Shield size={13} color={isDark ? '#00E676' : '#008751'} />
                  <Text style={[styles.groupTitle, !isDark && styles.groupTitleLight]}>
                    {section.group} ({section.players.length})
                  </Text>
                </View>

                <View style={styles.playersList}>
                  {section.players.map((p) => (
                    <View key={`${section.group}-${p.id || p.name}`} style={[styles.playerRow, !isDark && styles.playerRowLight]}>
                      <PlayerAvatar
                        name={p.name}
                        photo={p.photo}
                        number={p.number}
                        isDark={isDark}
                      />
                      <View style={styles.playerInfo}>
                        <Text style={[styles.playerName, !isDark && styles.textDark]} numberOfLines={1}>
                          {p.name}
                        </Text>
                        <Text style={[styles.playerNat, !isDark && styles.textMutedDark]} numberOfLines={1}>
                          {p.nat}
                        </Text>
                      </View>
                      <View style={[styles.posPill, !isDark && styles.posPillLight]}>
                        <Text style={[styles.posText, !isDark && styles.posTextLight]}>{p.pos}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.footer, !isDark && styles.footerLight]}>
            <View style={styles.footerInfo}>
              <Users size={13} color={isDark ? '#8FA89B' : '#556A5E'} />
              <Text style={[styles.footerInfoText, !isDark && styles.textMutedDark]}>
                {totalPlayers} jogadores · 2026/2027
              </Text>
            </View>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.doneBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'flex-end',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#0D1410',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    overflow: 'hidden',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLight: {
    borderBottomColor: 'rgba(0, 135, 81, 0.12)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 135, 81, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBoxLight: {
    backgroundColor: '#EBF7F0',
    borderColor: 'rgba(0, 135, 81, 0.25)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    color: '#8FA89B',
    fontSize: 11.5,
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spinIconWrap: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshBtnLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.22)',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: 'rgba(255, 183, 77, 0.1)',
  },
  offlineNoticeText: {
    flex: 1,
    color: '#FFB74D',
    fontSize: 11,
    fontWeight: '600',
  },
  offlineRetryText: {
    color: '#00E676',
    fontSize: 11,
    fontWeight: '800',
  },
  body: {
    flexGrow: 1,
  },
  bodyContent: {
    padding: 16,
    gap: 16,
  },
  groupBlock: {
    gap: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupTitle: {
    color: '#00E676',
    fontSize: 12.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  groupTitleLight: {
    color: '#008751',
  },
  playersList: {
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121F19',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 13,
    paddingVertical: 8,
    paddingHorizontal: 11,
    gap: 12,
  },
  playerRowLight: {
    backgroundColor: '#F6FAF7',
    borderColor: 'rgba(0, 135, 81, 0.14)',
  },
  avatarContainer: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 135, 81, 0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarCircleLight: {
    backgroundColor: '#E3F3EA',
    borderColor: 'rgba(0, 135, 81, 0.35)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    color: '#00E676',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  avatarInitialsLight: {
    color: '#008751',
  },
  jerseyMiniBadge: {
    position: 'absolute',
    right: -3,
    bottom: -2,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    paddingHorizontal: 4,
    backgroundColor: '#008751',
    borderWidth: 1.5,
    borderColor: '#0D1410',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jerseyMiniBadgeLight: {
    borderColor: '#FFFFFF',
  },
  jerseyMiniText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  playerNat: {
    color: '#8FA89B',
    fontSize: 11,
    marginTop: 1,
  },
  posPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
  },
  posPillLight: {
    backgroundColor: '#E7EFEA',
  },
  posText: {
    color: '#C7D8CE',
    fontSize: 10.5,
    fontWeight: '800',
  },
  posTextLight: {
    color: '#3D5448',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerLight: {
    borderTopColor: 'rgba(0, 135, 81, 0.12)',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerInfoText: {
    color: '#8FA89B',
    fontSize: 11.5,
    fontWeight: '600',
  },
  doneBtn: {
    backgroundColor: '#008751',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00E676',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});

export default memo(PlantelModal);
