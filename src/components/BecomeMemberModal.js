import React, { useState, useEffect, memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  Send,
} from 'lucide-react-native';
import confetti from 'canvas-confetti';
import { COLORS } from '../theme/colors';

const MEMBERSHIP_CRITERIA = [
  {
    id: 'rio-ave',
    title: 'Ser sócio do Rio Ave FC',
    desc: 'É obrigatório teres cartão de sócio ativo do Rio Ave FC.',
  },
  {
    id: 'form',
    title: 'Preencher o formulário',
    desc: 'Indicar os teus dados de contacto e n.º de sócio do clube.',
  },
  {
    id: 'fee',
    title: 'Custo de 12 euros / ano',
    desc: 'Quota anual oficial de apoio à claque Grupo 39.',
  },
];

function BecomeMemberModal({ visible, onClose, isDark = true }) {
  const [step, setStep] = useState('criteria'); // 'criteria' | 'form' | 'submitted'
  const [fullName, setFullName] = useState('');
  const [rioAveMemberNumber, setRioAveMemberNumber] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (visible) {
      setStep('criteria');
      setFullName('');
      setRioAveMemberNumber('');
      setWhatsapp('');
      setErrorMsg('');
    }
  }, [visible]);

  const handleSubmitForm = () => {
    if (!fullName.trim()) {
      setErrorMsg('Por favor indica o teu nome completo.');
      return;
    }
    if (!rioAveMemberNumber.trim()) {
      setErrorMsg('Indica o teu número de sócio do Rio Ave FC.');
      return;
    }
    if (!whatsapp.trim() || whatsapp.replace(/\s/g, '').length < 9) {
      setErrorMsg('Indica um número de WhatsApp válido (9 dígitos).');
      return;
    }

    setErrorMsg('');
    if (Platform.OS === 'web') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#00874E', '#00E676', '#FFFFFF'],
        });
      } catch (_) {}
    }
    setStep('submitted');
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.container, !isDark && styles.containerLight]}>
          {/* Header */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              {step === 'form' ? (
                <TouchableOpacity
                  onPress={() => {
                    setErrorMsg('');
                    setStep('criteria');
                  }}
                  style={[styles.backBtn, !isDark && styles.closeBtnLight]}
                  activeOpacity={0.7}
                >
                  <ArrowLeft size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                  <ShieldCheck size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
                </View>
              )}
              <View style={styles.headerTitleCol}>
                <Text style={[styles.headerTitle, !isDark && styles.textDark]} numberOfLines={1}>
                  {step === 'form'
                    ? 'Formulário de Inscrição'
                    : step === 'submitted'
                      ? 'Pedido Registado'
                      : 'Ser Sócio do Grupo 39'}
                </Text>
                <Text style={[styles.headerSubtitle, !isDark && styles.headerSubtitleLight]} numberOfLines={1}>
                  {step === 'form'
                    ? 'Contacto direto via WhatsApp da Direção'
                    : 'Critérios obrigatórios de adesão'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              activeOpacity={0.7}
            >
              <X size={15} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {step === 'criteria' && (
              <>
                <View style={[styles.noticeBanner, !isDark && styles.noticeBannerLight]}>
                  <Text style={[styles.noticeBannerText, !isDark && styles.textDark]}>
                    Para seres sócio do <Text style={styles.boldGreen}>Grupo 39</Text>, tens de cumprir obrigatoriamente os seguintes critérios:
                  </Text>
                </View>

                <View style={styles.criteriaList}>
                  {MEMBERSHIP_CRITERIA.map((item) => (
                    <View
                      key={item.id}
                      style={[styles.criteriaCard, !isDark && styles.criteriaCardLight]}
                    >
                      <View style={styles.criteriaCheckBox}>
                        <CheckCircle2 size={18} color={isDark ? '#00E676' : '#00874E'} />
                      </View>
                      <View style={styles.criteriaTextCol}>
                        <Text style={[styles.criteriaTitle, !isDark && styles.textDark]}>
                          {item.title}
                        </Text>
                        <Text style={[styles.criteriaDesc, !isDark && styles.textMutedDark]}>
                          {item.desc}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={[styles.questionBox, !isDark && styles.questionBoxLight]}>
                  <Text style={[styles.questionText, !isDark && styles.textDark]}>
                    Cumpres todos estes critérios (incluindo ser sócio do Rio Ave FC)?
                  </Text>
                </View>

                <TouchableOpacity onPress={() => setStep('form')} activeOpacity={0.86}>
                  <LinearGradient
                    colors={['#00B368', '#00874E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtn}
                  >
                    <Text style={styles.primaryBtnText}>
                      Sim, preencher formulário
                    </Text>
                    <ChevronRight size={16} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cancelBtn, !isDark && styles.cancelBtnLight]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.cancelBtnText, !isDark && styles.textMutedDark]}>
                    Ainda não cumpro os critérios
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'form' && (
              <>
                <View style={[styles.whatsappNotice, !isDark && styles.whatsappNoticeLight]}>
                  <MessageCircle size={16} color={isDark ? '#00E676' : '#00874E'} />
                  <Text style={[styles.whatsappNoticeText, !isDark && styles.textDark]}>
                    Preenche os teus dados abaixo. A Direção do Grupo 39 irá falar contigo via <Text style={styles.boldGreen}>WhatsApp</Text> para concluir a inscrição (12 €/ano) e enviar os teus dados de Login.
                  </Text>
                </View>

                <View style={styles.inputsGroup}>
                  <View style={styles.inputField}>
                    <Text style={[styles.inputLabel, !isDark && styles.textDark]}>
                      Nome Completo *
                    </Text>
                    <TextInput
                      style={[styles.input, !isDark && styles.inputLight]}
                      placeholder="Ex: João Silva"
                      placeholderTextColor={isDark ? '#6D8276' : '#8A9E93'}
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>

                  <View style={styles.inputField}>
                    <Text style={[styles.inputLabel, !isDark && styles.textDark]}>
                      N.º de Sócio do Rio Ave FC *
                    </Text>
                    <TextInput
                      style={[styles.input, !isDark && styles.inputLight]}
                      placeholder="Ex: 4521"
                      placeholderTextColor={isDark ? '#6D8276' : '#8A9E93'}
                      keyboardType="number-pad"
                      value={rioAveMemberNumber}
                      onChangeText={setRioAveMemberNumber}
                    />
                  </View>

                  <View style={styles.inputField}>
                    <Text style={[styles.inputLabel, !isDark && styles.textDark]}>
                      Telemóvel / WhatsApp *
                    </Text>
                    <TextInput
                      style={[styles.input, !isDark && styles.inputLight]}
                      placeholder="Ex: 912 345 678"
                      placeholderTextColor={isDark ? '#6D8276' : '#8A9E93'}
                      keyboardType="phone-pad"
                      value={whatsapp}
                      onChangeText={setWhatsapp}
                    />
                  </View>
                </View>

                {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

                <TouchableOpacity onPress={handleSubmitForm} activeOpacity={0.86}>
                  <LinearGradient
                    colors={['#00B368', '#00874E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtn}
                  >
                    <Send size={15} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>
                      Enviar Pedido para a Direção
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {step === 'submitted' && (
              <View style={styles.confirmedWrap}>
                <View style={styles.confirmedIconCircle}>
                  <MessageCircle size={34} color="#00E676" />
                </View>
                <Text style={[styles.confirmedTitle, !isDark && styles.textDark]}>
                  Pedido Enviado com Sucesso!
                </Text>
                <Text style={[styles.confirmedSub, !isDark && styles.textMutedDark]}>
                  Obrigado, <Text style={styles.boldGreen}>{fullName}</Text>! A Direção do Grupo 39 irá contactar-te em breve via <Text style={styles.boldGreen}>WhatsApp</Text> para validar a tua inscrição (12,00 €/ano) e entregar os teus dados de Login.
                </Text>

                <View style={[styles.summaryCard, !isDark && styles.summaryCardLight]}>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, !isDark && styles.textMutedDark]}>Nome</Text>
                    <Text style={[styles.summaryVal, !isDark && styles.textDark]}>{fullName}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, !isDark && styles.textMutedDark]}>Sócio Rio Ave</Text>
                    <Text style={[styles.summaryVal, !isDark && styles.textDark]}>#{rioAveMemberNumber}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, !isDark && styles.textMutedDark]}>WhatsApp</Text>
                    <Text style={[styles.summaryVal, !isDark && styles.textDark]}>{whatsapp}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, !isDark && styles.textMutedDark]}>Quota Anual</Text>
                    <Text style={styles.summaryValGreen}>12,00 € / ano</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
                  <Text style={styles.doneBtnText}>Concluir</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
  container: {
    backgroundColor: '#0D1410',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    overflow: 'hidden',
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLight: {
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBoxLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 179, 104, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  headerSubtitleLight: {
    color: '#00874E',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLight: {
    backgroundColor: '#EDF5F0',
  },
  scrollBody: {
    flexGrow: 0,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
    gap: 12,
  },
  noticeBanner: {
    backgroundColor: '#132119',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.22)',
  },
  noticeBannerLight: {
    backgroundColor: '#F3FAF6',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  noticeBannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  boldGreen: {
    color: '#00B368',
    fontWeight: '800',
  },
  criteriaList: {
    gap: 9,
  },
  criteriaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: '#121E18',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.2)',
    borderRadius: 14,
    padding: 12,
  },
  criteriaCardLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.16)',
  },
  criteriaCheckBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  criteriaTextCol: {
    flex: 1,
  },
  criteriaTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  criteriaDesc: {
    color: '#8FA89B',
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 15,
  },
  questionBox: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    borderRadius: 12,
    padding: 11,
  },
  questionBoxLight: {
    backgroundColor: '#EBF7F0',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelBtnLight: {
    backgroundColor: '#F3F6F4',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  cancelBtnText: {
    color: '#8FA89B',
    fontSize: 12.5,
    fontWeight: '700',
  },
  whatsappNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    backgroundColor: 'rgba(0, 179, 104, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
  },
  whatsappNoticeLight: {
    backgroundColor: '#EDF7F1',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  whatsappNoticeText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  inputsGroup: {
    gap: 11,
  },
  inputField: {
    gap: 5,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#131F19',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
  },
  inputLight: {
    backgroundColor: '#F4F8F6',
    borderColor: 'rgba(0, 135, 78, 0.2)',
    color: '#0E1712',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    fontWeight: '700',
  },
  confirmedWrap: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  confirmedIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmedTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  confirmedSub: {
    color: '#8FA89B',
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#121E18',
    borderRadius: 14,
    padding: 13,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 4,
  },
  summaryCardLight: {
    backgroundColor: '#F4FAF6',
    borderColor: 'rgba(0, 135, 78, 0.16)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#8FA89B',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryVal: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  summaryValGreen: {
    color: '#00E676',
    fontSize: 13.5,
    fontWeight: '900',
  },
  doneBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#00874E',
    marginTop: 6,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});

export default memo(BecomeMemberModal);
