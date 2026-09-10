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
  Drum,
  Share2,
  Radio,
  Sparkles,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { CHANTS_DATA } from '../data/mockData';

export default function ChantsModal({ visible, onClose }) {
  const [selectedChant, setSelectedChant] = useState(CHANTS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeDrumPad, setActiveDrumPad] = useState(null);

  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
  const beatTimerRef = useRef(null);
  const beatIndexRef = useRef(0);
  const lastSpokenLineRef = useRef(-1);

  // Animação de equalizador
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

  // 1. Som de Bombo de Bancada (Sub-Bass Stadium Kick)
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

  // 2. Som de Caixa / Tarol da Claque (Snare & Rattle)
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

  // 3. Som de Palmas Coletivas da Bancada (Terrace Claps)
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

  // 4. Som de Corneta / Fanfarra dos Arcos (Brass Horn Fanfare)
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
          // Batida forte: Bombo + Corneta de apoio
          playBombo();
          playCorneta(392, 0.2); // Sol
        } else if (beat === 1) {
          // Batida média: Caixa + Palmas
          playCaixa();
          playPalmas();
        } else if (beat === 2) {
          // Contra-tempo: Bombo duplo
          playBombo();
          setTimeout(() => playBombo(), 140);
          playCorneta(440, 0.18); // Lá
        } else if (beat === 3) {
          // Fecho do compasso: Caixa + Palmas + Fanfarra
          playCaixa();
          playPalmas();
          playCorneta(523.25, 0.25); // Dó agudo
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
            return 0; // Loop contínuo de apoio na bancada
          }

          // Verificar se alguma linha da letra começa neste segundo
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
      getAudioContext(); // Desbloqueia áudio no smartphone
      setIsPlaying(true);
      // Inicia com primeira linha da letra
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

  // Tocar Pad Individual de Bateria (Feedback auditivo imediato no smartphone)
  const triggerPad = (type) => {
    getAudioContext();
    setActiveDrumPad(type);
    setTimeout(() => setActiveDrumPad(null), 180);

    if (type === 'bombo') {
      playBombo();
    } else if (type === 'caixa') {
      playCaixa();
    } else if (type === 'palmas') {
      playPalmas();
    } else if (type === 'corneta') {
      playCorneta(440, 0.35);
    }
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
                <Drum size={20} color={COLORS.gold} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Cancioneiro Grupo 39</Text>
                <Text style={styles.headerSubtitle}>Letra e Ritmos da Bancada</Text>
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

                {/* Equalizador animado & BPM */}
                <View style={styles.audioStatusRow}>
                  <View style={styles.equalizerBars}>
                    <Animated.View style={[styles.eqBar, { height: eqAnim1 }]} />
                    <Animated.View style={[styles.eqBar, { height: eqAnim2 }]} />
                    <Animated.View style={[styles.eqBar, { height: eqAnim3 }]} />
                    <Animated.View style={[styles.eqBar, { height: eqAnim4 }]} />
                  </View>
                  <View style={styles.bpmTag}>
                    <Radio size={12} color={COLORS.primaryLight} />
                    <Text style={styles.bpmText}>{selectedChant.bpm} BPM</Text>
                  </View>
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
                    <Pause size={24} color="#FFF" />
                  ) : (
                    <Play size={24} color="#FFF" style={{ marginLeft: 3 }} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsMuted((prev) => !prev)}
                  style={[styles.subControlBtn, isMuted && styles.subControlBtnMuted]}
                  activeOpacity={0.7}
                >
                  {isMuted ? (
                    <VolumeX size={18} color="#FF6E6E" />
                  ) : (
                    <Volume2 size={18} color={COLORS.primaryLight} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Indicador de Som do Smartphone */}
              <View style={styles.speakerIndicatorRow}>
                <Volume2 size={13} color={isPlaying ? COLORS.primaryLight : COLORS.textMuted} />
                <Text style={[styles.speakerIndicatorText, isPlaying && styles.speakerIndicatorTextActive]}>
                  {isPlaying ? 'Som ativo no altifalante (Bateria & Voz)' : 'Toca para reproduzir no smartphone'}
                </Text>
              </View>
            </View>

            {/* Bateria Interativa da Claque (Toca no Ecrã) */}
            <View style={styles.drumPadSection}>
              <View style={styles.drumPadHeader}>
                <View style={styles.drumPadTitleRow}>
                  <Drum size={15} color={COLORS.gold} />
                  <Text style={styles.drumPadTitle}>Bateria da Claque (Toca no Smartphone)</Text>
                </View>
                <Text style={styles.drumPadSub}>Toca nos pads para acompanhar o ritmo</Text>
              </View>

              <View style={styles.drumGrid}>
                <TouchableOpacity
                  style={[styles.drumBtn, activeDrumPad === 'bombo' && styles.drumBtnActive]}
                  onPress={() => triggerPad('bombo')}
                  activeOpacity={0.75}
                >
                  <Text style={styles.drumBtnIcon}>🥁</Text>
                  <Text style={styles.drumBtnTitle}>Bombo</Text>
                  <Text style={styles.drumBtnNote}>Grave</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.drumBtn, activeDrumPad === 'caixa' && styles.drumBtnActive]}
                  onPress={() => triggerPad('caixa')}
                  activeOpacity={0.75}
                >
                  <Text style={styles.drumBtnIcon}>🥁</Text>
                  <Text style={styles.drumBtnTitle}>Caixa</Text>
                  <Text style={styles.drumBtnNote}>Tarol</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.drumBtn, activeDrumPad === 'palmas' && styles.drumBtnActive]}
                  onPress={() => triggerPad('palmas')}
                  activeOpacity={0.75}
                >
                  <Text style={styles.drumBtnIcon}>👏</Text>
                  <Text style={styles.drumBtnTitle}>Palmas</Text>
                  <Text style={styles.drumBtnNote}>Bancada</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.drumBtn, activeDrumPad === 'corneta' && styles.drumBtnActive]}
                  onPress={() => triggerPad('corneta')}
                  activeOpacity={0.75}
                >
                  <Text style={styles.drumBtnIcon}>🎺</Text>
                  <Text style={styles.drumBtnTitle}>Corneta</Text>
                  <Text style={styles.drumBtnNote}>Fanfarra</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Letras em Estilo Karaoke Sincronizado */}
            <View style={styles.lyricsContainer}>
              <View style={styles.lyricsHeaderRow}>
                <Text style={styles.lyricsHeading}>Letra da Bancada Poente</Text>
                <View style={styles.liveSyncBadge}>
                  <View style={[styles.syncDot, isPlaying && styles.syncDotActive]} />
                  <Text style={styles.syncBadgeText}>Sincronizado</Text>
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
                      isCurrent && styles.lyricLineBoxActive
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
                        isCurrent && styles.lyricLineTextActive,
                        isPast && styles.lyricLineTextPast
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
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
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
  categoryBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '700',
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
  bpmTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bpmText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  chantMainTitle: {
    color: '#FFF',
    fontSize: 18,
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
  subControlBtnMuted: {
    borderColor: 'rgba(255, 110, 110, 0.4)',
    backgroundColor: 'rgba(255, 110, 110, 0.1)',
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
      web: {
        boxShadow: '0 4px 18px rgba(0, 135, 78, 0.6)',
      },
    }),
  },
  speakerIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  speakerIndicatorText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  speakerIndicatorTextActive: {
    color: COLORS.primaryLight,
    fontWeight: '700',
  },

  // Pads de Bateria da Claque
  drumPadSection: {
    backgroundColor: '#111A14',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  drumPadHeader: {
    marginBottom: 12,
  },
  drumPadTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  drumPadTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  drumPadSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  drumGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  drumBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  drumBtnActive: {
    backgroundColor: 'rgba(0, 179, 104, 0.25)',
    borderColor: COLORS.primaryLight,
    transform: [{ scale: 0.94 }],
  },
  drumBtnIcon: {
    fontSize: 20,
    marginBottom: 3,
  },
  drumBtnTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  drumBtnNote: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 1,
  },

  // Letras
  lyricsContainer: {
    backgroundColor: '#0E1712',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
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
  liveSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 135, 78, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted,
  },
  syncDotActive: {
    backgroundColor: COLORS.primaryLight,
  },
  syncBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '700',
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
