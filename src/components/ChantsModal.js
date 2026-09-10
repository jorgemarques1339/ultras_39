import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Music,
  Share2,
  Radio,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { CHANTS_DATA } from '../data/mockData';

export default function ChantsModal({ visible, onClose }) {
  const [selectedChant, setSelectedChant] = useState(CHANTS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  // Iniciar ou parar reprodução com simulação de ritmo de bateria
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      playDrumBeat();
    }
  };

  const playDrumBeat = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx && !audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      } catch (e) {
        // Fallback silencioso
      }
    }
  };

  // Temporizador de progresso do cântico
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= selectedChant.duration) {
            return 0; // Loop contínuo de apoio na bancada
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, selectedChant]);

  const handleSelectChant = (chant) => {
    setSelectedChant(chant);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentTime(0);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header do Cancioneiro */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBadge}>
                <Music size={18} color={COLORS.gold} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Cancioneiro Grupo 39</Text>
                <Text style={styles.headerSubtitle}>Letras Oficiais & Ritmo de Bancada</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Abas dos Cânticos */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
              {CHANTS_DATA.map((chant) => {
                const isSelected = chant.id === selectedChant.id;
                return (
                  <TouchableOpacity
                    key={chant.id}
                    style={[styles.tabPill, isSelected && styles.tabPillActive]}
                    onPress={() => handleSelectChant(chant)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tabPillText, isSelected && styles.tabPillTextActive]}>
                      {chant.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Player & Letra Sincronizada */}
          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Cartão de Informação do Cântico */}
            <View style={styles.chantInfoCard}>
              <View style={styles.chantTopMeta}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{selectedChant.category}</Text>
                </View>
                <View style={styles.bpmTag}>
                  <Radio size={12} color={COLORS.primaryLight} />
                  <Text style={styles.bpmText}>{selectedChant.bpm} BPM</Text>
                </View>
              </View>

              <Text style={styles.chantMainTitle}>{selectedChant.title}</Text>

              {/* Barra de Progresso */}
              <View style={styles.progressRow}>
                <Text style={styles.timeText}>0:{String(currentTime).padStart(2, '0')}</Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${(currentTime / selectedChant.duration) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.timeText}>0:{String(selectedChant.duration).padStart(2, '0')}</Text>
              </View>

              {/* Botões de Controlo */}
              <View style={styles.controlsRow}>
                <TouchableOpacity onPress={handleReset} style={styles.subControlBtn} activeOpacity={0.7}>
                  <RotateCcw size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={togglePlay} style={styles.mainPlayBtn} activeOpacity={0.85}>
                  {isPlaying ? (
                    <Pause size={22} color="#FFF" />
                  ) : (
                    <Play size={22} color="#FFF" style={{ marginLeft: 2 }} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => alert('Letra copiada para partilha!')}
                  style={styles.subControlBtn}
                  activeOpacity={0.7}
                >
                  <Share2 size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Letras em Estilo Karaoke Sincronizado */}
            <View style={styles.lyricsContainer}>
              <Text style={styles.lyricsHeading}>Letra da Bancada Poente</Text>

              {selectedChant.lines.map((line, index) => {
                const nextLineTime = selectedChant.lines[index + 1]?.time || selectedChant.duration;
                const isCurrent = currentTime >= line.time && currentTime < nextLineTime;
                const isPast = currentTime >= nextLineTime;

                return (
                  <View
                    key={index}
                    style={[
                      styles.lyricLineBox,
                      isCurrent && styles.lyricLineBoxActive
                    ]}
                  >
                    <Text
                      style={[
                        styles.lyricLineText,
                        isCurrent && styles.lyricLineTextActive,
                        isPast && styles.lyricLineTextPast
                      ]}
                    >
                      {line.text}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: '#0C130F',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#0F1813',
  },
  tabsContent: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  tabPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#16231C',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabPillActive: {
    backgroundColor: '#00874E',
    borderColor: '#00B368',
  },
  tabPillText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  tabPillTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  chantInfoCard: {
    backgroundColor: '#131F18',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  chantTopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 135, 78, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 135, 78, 0.4)',
  },
  categoryBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '700',
  },
  bpmTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bpmText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  chantMainTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  timeText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  subControlBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  mainPlayBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#00B368',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 135, 78, 0.5)',
      },
    }),
  },
  lyricsContainer: {
    backgroundColor: '#0E1712',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  lyricsHeading: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  lyricLineBox: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  lyricLineBoxActive: {
    backgroundColor: 'rgba(0, 135, 78, 0.25)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryLight,
  },
  lyricLineText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  lyricLineTextActive: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  lyricLineTextPast: {
    color: COLORS.textMuted,
  },
});
