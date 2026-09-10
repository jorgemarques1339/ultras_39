import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  Radio,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { CHANTS_DATA } from '../data/mockData';

export default function ChantsModal({ visible, onClose, isDark = true }) {
  const [selectedChant, setSelectedChant] = useState(CHANTS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
  const beatTimerRef = useRef(null);
  const beatIndexRef = useRef(0);
  const lastSpokenLineRef = useRef(-1);

  // Animação do equalizador
  const eqAnim1 = useRef(new Animated.Value(6)).current;
  const eqAnim2 = useRef(new Animated.Value(14)).current;
  const eqAnim3 = useRef(new Animated.Value(10)).current;
  const eqAnim4 = useRef(new Animated.Value(18)).current;

  // Efeito de animação do equalizador quando está a tocar
  useEffect(() => {
    let animLoop;
    if (isPlaying) {
      animLoop = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(eqAnim1, { toValue: 18, duration: 250, useNativeDriver: false }),
            Animated.timing(eqAnim1, { toValue: 6, duration: 250, useNativeDriver: false }),
          ]),
          Animated.sequence([
            Animated.timing(eqAnim2, { toValue: 8, duration: 200, useNativeDriver: false }),
            Animated.timing(eqAnim2, { toValue: 20, duration: 200, useNativeDriver: false }),
          ]),
          Animated.sequence([
            Animated.timing(eqAnim3, { toValue: 22, duration: 280, useNativeDriver: false }),
            Animated.timing(eqAnim3, { toValue: 8, duration: 280, useNativeDriver: false }),
          ]),
          Animated.sequence([
            Animated.timing(eqAnim4, { toValue: 10, duration: 220, useNativeDriver: false }),
            Animated.timing(eqAnim4, { toValue: 24, duration: 220, useNativeDriver: false }),
          ]),
        ])
      );
      animLoop.start();
    } else {
      eqAnim1.setValue(6);
      eqAnim2.setValue(10);
      eqAnim3.setValue(8);
      eqAnim4.setValue(12);
    }
    return () => {
      if (animLoop) animLoop.stop();
    };
  }, [isPlaying]);

  // Obter ou desbloquear o AudioContext no smartphone/navegador
  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      return audioContextRef.current;
    } catch (e) {
      return null;
    }
  };

  // Som de Bombo de Bancada (Sub-Bass Stadium Kick)
  const playBombo = (time = 0) => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const t = time || ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(42, t + 0.16);

      gain.gain.setValueAtTime(1.0, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.33);
    } catch (e) {}
  };

  // Som de Caixa / Tarol da Claque
  const playCaixa = (time = 0) => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const t = time || ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.14);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1100, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.13);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
      oscGain.gain.setValueAtTime(0.4, t);
      oscGain.gain.exponentialRampToValueAtTime(0.005, t + 0.08);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noise.start(t);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch (e) {}
  };

  // Som de Palmas Coletivas da Bancada
  const playPalmas = (time = 0) => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const t = time || ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.16);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1350, t);
      filter.Q.setValueAtTime(2.2, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.65, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(t);
    } catch (e) {}
  };

  // Som de Corneta / Fanfarra dos Arcos
  const playCorneta = (freq = 392, duration = 0.24, time = 0) => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const t = time || ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    } catch (e) {}
  };

  // Canto vocal sincronizado com a letra através da síntese de voz nativa do smartphone
  const speakChantLyric = (text) => {
    if (isMuted) return;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const clean = text.replace(/[🥁👏🌊🟢⚪🎺🏆]/g, '').trim();
        if (clean) {
          const utter = new SpeechSynthesisUtterance(clean);
          utter.lang = 'pt-PT';
          utter.rate = 1.15;
          utter.pitch = 1.1;
          utter.volume = 1.0;
          window.speechSynthesis.speak(utter);
        }
      } catch (e) {}
    }
  };

  // Parar reprodução e voz ao fechar modal
  useEffect(() => {
    if (!visible) {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
      clearInterval(beatTimerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [visible]);

  // Loop de Bateria e Ritmo em tempo real baseado no BPM do cântico
  useEffect(() => {
    if (isPlaying) {
      const beatMs = Math.round((60 / (selectedChant.bpm || 118)) * 1000);

      beatTimerRef.current = setInterval(() => {
        const beat = beatIndexRef.current % 4;
        beatIndexRef.current += 1;

        if (beat === 0) {
          playBombo();
          playCorneta(392, 0.2);
        } else if (beat === 1) {
          playCaixa();
          playPalmas();
        } else if (beat === 2) {
          playBombo();
          setTimeout(() => playBombo(), 140);
          playCorneta(440, 0.18);
        } else if (beat === 3) {
          playCaixa();
          playPalmas();
          playCorneta(523.25, 0.25);
        }
      }, beatMs);
    } else {
      clearInterval(beatTimerRef.current);
      beatIndexRef.current = 0;
    }

    return () => clearInterval(beatTimerRef.current);
  }, [isPlaying, selectedChant, isMuted]);

  // Temporizador de progresso do cântico (1 segundo) e sincronização de voz
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= selectedChant.duration) {
            lastSpokenLineRef.current = -1;
            return 0;
          }

          const lineIndex = selectedChant.lines.findIndex((l) => l.time === next);
          if (lineIndex !== -1 && lineIndex !== lastSpokenLineRef.current) {
            lastSpokenLineRef.current = lineIndex;
            speakChantLyric(selectedChant.lines[lineIndex].text);
          }

          return next;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, selectedChant, isMuted]);

  // Alternar Play / Pause
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
      clearInterval(beatTimerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      getAudioContext();
      setIsPlaying(true);
      const currentLine = selectedChant.lines.find((l) => l.time <= currentTime) || selectedChant.lines[0];
      if (currentLine) {
        speakChantLyric(currentLine.text);
      }
    }
  };

  const handleSelectChant = (chant) => {
    setSelectedChant(chant);
    setCurrentTime(0);
    lastSpokenLineRef.current = -1;
    setIsPlaying(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleReset = () => {
    setCurrentTime(0);
    lastSpokenLineRef.current = -1;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (isPlaying) {
      speakChantLyric(selectedChant.lines[0].text);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, !isDark && styles.overlayLight]}>
        <View style={[styles.container, !isDark && styles.containerLight]}>
          {/* Header do Cancioneiro */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconBadge, !isDark && styles.headerIconBadgeLight]}>
                <Music size={20} color={isDark ? COLORS.gold : '#00874E'} />
              </View>
              <View>
                <Text style={[styles.headerTitle, !isDark && styles.headerTitleLight]}>
                  Cancioneiro Grupo 39
                </Text>
                <Text style={[styles.headerSubtitle, !isDark && styles.headerSubtitleLight]}>
                  Letra e Ritmos da Bancada
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          {/* Abas dos Cânticos */}
          <View style={[styles.tabsContainer, !isDark && styles.tabsContainerLight]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContent}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={Platform.OS !== 'web'}
              overScrollMode="never"
            >
              {CHANTS_DATA.map((chant) => {
                const isSelected = chant.id === selectedChant.id;
                return (
                  <TouchableOpacity
                    key={chant.id}
                    style={[
                      styles.tabPill,
                      !isDark && styles.tabPillLight,
                      isSelected && styles.tabPillActive,
                      isSelected && !isDark && styles.tabPillActiveLight,
                    ]}
                    onPress={() => handleSelectChant(chant)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.tabPillText,
                        !isDark && styles.tabPillTextLight,
                        isSelected && styles.tabPillTextActive,
                      ]}
                    >
                      {chant.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Player & Letra Sincronizada (Apenas estes dois elementos) */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {/* 1. CARTÃO DO PLAYER */}
            <View style={[styles.chantInfoCard, !isDark && styles.chantInfoCardLight]}>
              <View style={styles.chantTopMeta}>
                <View style={[styles.categoryBadge, !isDark && styles.categoryBadgeLight]}>
                  <Text style={[styles.categoryBadgeText, !isDark && styles.categoryBadgeTextLight]}>
                    {selectedChant.category}
                  </Text>
                </View>

                {/* Equalizador animado & BPM */}
                <View style={styles.audioStatusRow}>
                  <View style={styles.equalizerBars}>
                    <Animated.View style={[styles.eqBar, !isDark && styles.eqBarLight, { height: eqAnim1 }]} />
                    <Animated.View style={[styles.eqBar, !isDark && styles.eqBarLight, { height: eqAnim2 }]} />
                    <Animated.View style={[styles.eqBar, !isDark && styles.eqBarLight, { height: eqAnim3 }]} />
                    <Animated.View style={[styles.eqBar, !isDark && styles.eqBarLight, { height: eqAnim4 }]} />
                  </View>
                  <View style={[styles.bpmTag, !isDark && styles.bpmTagLight]}>
                    <Radio size={12} color={isDark ? COLORS.primaryLight : '#00874E'} />
                    <Text style={[styles.bpmText, !isDark && styles.bpmTextLight]}>
                      {selectedChant.bpm} BPM
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={[styles.chantMainTitle, !isDark && styles.chantMainTitleLight]}>
                {selectedChant.title}
              </Text>

              {/* Barra de Progresso */}
              <View style={styles.progressRow}>
                <Text style={[styles.timeText, !isDark && styles.timeTextLight]}>
                  0:{String(currentTime).padStart(2, '0')}
                </Text>
                <View style={[styles.progressBarBg, !isDark && styles.progressBarBgLight]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      !isDark && styles.progressBarFillLight,
                      { width: `${(currentTime / selectedChant.duration) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={[styles.timeText, !isDark && styles.timeTextLight]}>
                  0:{String(selectedChant.duration).padStart(2, '0')}
                </Text>
              </View>

              {/* Botões de Controlo */}
              <View style={styles.controlsRow}>
                <TouchableOpacity
                  onPress={handleReset}
                  style={[styles.subControlBtn, !isDark && styles.subControlBtnLight]}
                  activeOpacity={0.7}
                >
                  <RotateCcw size={18} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={togglePlay}
                  style={[styles.mainPlayBtn, !isDark && styles.mainPlayBtnLight]}
                  activeOpacity={0.85}
                >
                  {isPlaying ? (
                    <Pause size={24} color="#FFF" />
                  ) : (
                    <Play size={24} color="#FFF" style={{ marginLeft: 3 }} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsMuted((prev) => !prev)}
                  style={[
                    styles.subControlBtn,
                    !isDark && styles.subControlBtnLight,
                    isMuted && styles.subControlBtnMuted,
                    isMuted && !isDark && styles.subControlBtnMutedLight,
                  ]}
                  activeOpacity={0.7}
                >
                  {isMuted ? (
                    <VolumeX size={18} color="#FF6E6E" />
                  ) : (
                    <Volume2 size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Indicador de Som do Smartphone */}
              <View style={[styles.speakerIndicatorRow, !isDark && styles.speakerIndicatorRowLight]}>
                <Volume2
                  size={13}
                  color={
                    isPlaying
                      ? (isDark ? COLORS.primaryLight : '#00874E')
                      : (isDark ? COLORS.textMuted : '#94A3B8')
                  }
                />
                <Text
                  style={[
                    styles.speakerIndicatorText,
                    !isDark && styles.speakerIndicatorTextLight,
                    isPlaying && styles.speakerIndicatorTextActive,
                    isPlaying && !isDark && styles.speakerIndicatorTextActiveLight,
                  ]}
                >
                  {isPlaying
                    ? 'Som ativo no altifalante (Bateria & Voz)'
                    : 'Toca para reproduzir no smartphone'}
                </Text>
              </View>
            </View>

            {/* 2. LETRAS EM ESTILO KARAOKE SINCRONIZADO */}
            <View style={[styles.lyricsContainer, !isDark && styles.lyricsContainerLight]}>
              <View style={styles.lyricsHeaderRow}>
                <Text style={[styles.lyricsHeading, !isDark && styles.lyricsHeadingLight]}>
                  Letra da Bancada Poente
                </Text>
                <View style={[styles.liveSyncBadge, !isDark && styles.liveSyncBadgeLight]}>
                  <View
                    style={[
                      styles.syncDot,
                      !isDark && styles.syncDotLight,
                      isPlaying && styles.syncDotActive,
                      isPlaying && !isDark && styles.syncDotActiveLight,
                    ]}
                  />
                  <Text style={[styles.syncBadgeText, !isDark && styles.syncBadgeTextLight]}>
                    Sincronizado
                  </Text>
                </View>
              </View>

              {selectedChant.lines.map((line, index) => {
                const nextLineTime = selectedChant.lines[index + 1]?.time || selectedChant.duration;
                const isCurrent = currentTime >= line.time && currentTime < nextLineTime;
                const isPast = currentTime >= nextLineTime;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.lyricLineBox,
                      !isDark && styles.lyricLineBoxLight,
                      isCurrent && styles.lyricLineBoxActive,
                      isCurrent && !isDark && styles.lyricLineBoxActiveLight,
                    ]}
                    onPress={() => {
                      setCurrentTime(line.time);
                      speakChantLyric(line.text);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.lyricLineText,
                        !isDark && styles.lyricLineTextLight,
                        isCurrent && styles.lyricLineTextActive,
                        isCurrent && !isDark && styles.lyricLineTextActiveLight,
                        isPast && styles.lyricLineTextPast,
                        isPast && !isDark && styles.lyricLineTextPastLight,
                      ]}
                    >
                      {line.text}
                    </Text>
                  </TouchableOpacity>
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
  overlayLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  container: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '92%',
    backgroundColor: '#0C130F',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8E5',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.12)',
      },
    }),
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
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#EBEFEA',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  headerTitleLight: {
    color: '#121614',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  headerSubtitleLight: {
    color: '#5A6E63',
  },
  closeBtn: {
    padding: 6,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#0F1813',
  },
  tabsContainerLight: {
    backgroundColor: '#F8FAF9',
    borderBottomColor: '#EBEFEA',
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
  tabPillLight: {
    backgroundColor: '#ECEFEF',
    borderColor: '#DDE3DF',
  },
  tabPillActive: {
    backgroundColor: '#00874E',
    borderColor: '#00B368',
  },
  tabPillActiveLight: {
    backgroundColor: '#00874E',
    borderColor: '#00874E',
  },
  tabPillText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  tabPillTextLight: {
    color: '#5A6E63',
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
    paddingBottom: 36,
  },
  chantInfoCard: {
    backgroundColor: '#131F18',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  chantInfoCardLight: {
    backgroundColor: '#F4F7F5',
    borderColor: '#DDE3DF',
  },
  chantTopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 135, 78, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 135, 78, 0.4)',
  },
  categoryBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  categoryBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '700',
  },
  categoryBadgeTextLight: {
    color: '#00874E',
  },
  audioStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  equalizerBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 18,
  },
  eqBar: {
    width: 3,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 1.5,
  },
  eqBarLight: {
    backgroundColor: '#00874E',
  },
  bpmTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bpmTagLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  bpmText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  bpmTextLight: {
    color: '#5A6E63',
  },
  chantMainTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 14,
  },
  chantMainTitleLight: {
    color: '#121614',
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
  timeTextLight: {
    color: '#5A6E63',
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarBgLight: {
    backgroundColor: '#DCE3DE',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 3,
  },
  progressBarFillLight: {
    backgroundColor: '#00874E',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    marginBottom: 10,
  },
  subControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  subControlBtnLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE3DE',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  subControlBtnMuted: {
    borderColor: 'rgba(255, 110, 110, 0.4)',
    backgroundColor: 'rgba(255, 110, 110, 0.1)',
  },
  subControlBtnMutedLight: {
    borderColor: 'rgba(220, 38, 38, 0.35)',
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
  },
  mainPlayBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#00B368',
    ...Platform.select({
      ios: {
        shadowColor: '#00874E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 18px rgba(0, 135, 78, 0.5)',
      },
    }),
  },
  mainPlayBtnLight: {
    borderColor: '#007040',
  },
  speakerIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  speakerIndicatorRowLight: {
    borderTopColor: '#EBEFEA',
  },
  speakerIndicatorText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  speakerIndicatorTextLight: {
    color: '#64748B',
  },
  speakerIndicatorTextActive: {
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  speakerIndicatorTextActiveLight: {
    color: '#00874E',
    fontWeight: '700',
  },
  lyricsContainer: {
    backgroundColor: '#0E1712',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  lyricsContainerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE3DF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  lyricsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lyricsHeading: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lyricsHeadingLight: {
    color: '#00874E',
  },
  liveSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 135, 78, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveSyncBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted,
  },
  syncDotLight: {
    backgroundColor: '#94A3B8',
  },
  syncDotActive: {
    backgroundColor: COLORS.primaryLight,
  },
  syncDotActiveLight: {
    backgroundColor: '#00874E',
  },
  syncBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '700',
  },
  syncBadgeTextLight: {
    color: '#00874E',
  },
  lyricLineBox: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  lyricLineBoxLight: {
    backgroundColor: '#F8FAF9',
    borderWidth: 1,
    borderColor: '#EBEFEA',
  },
  lyricLineBoxActive: {
    backgroundColor: 'rgba(0, 135, 78, 0.25)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryLight,
  },
  lyricLineBoxActiveLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderColor: 'rgba(0, 135, 78, 0.3)',
    borderLeftWidth: 3,
    borderLeftColor: '#00874E',
  },
  lyricLineText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  lyricLineTextLight: {
    color: '#334155',
  },
  lyricLineTextActive: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  lyricLineTextActiveLight: {
    color: '#00874E',
    fontWeight: '800',
  },
  lyricLineTextPast: {
    color: COLORS.textMuted,
  },
  lyricLineTextPastLight: {
    color: '#94A3B8',
  },
});
