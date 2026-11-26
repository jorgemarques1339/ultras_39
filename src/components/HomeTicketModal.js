import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Share,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  Ticket,
  Landmark,
  Banknote,
  Copy,
  Check,
  CheckCircle2,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  ArrowLeft,
  Info,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import confetti from 'canvas-confetti';
import { COLORS } from '../theme/colors';

const IBAN_CLUBE = 'PT50 0018 0003 4730 0587 0202 9';
const IBAN_RAW = 'PT50001800034730058702029';
const HOME_TICKET_PRICE = 5.0;

const PAYMENT_METHODS = [
  {
    id: 'transfer',
    title: 'Transferência Bancária',
    desc: 'Transfere para o IBAN oficial do Grupo 39 com a referência do jogo.',
  },
  {
    id: 'cash',
    title: 'Dinheiro na Sede do Grupo',
    desc: 'Pagamento presencial em numerário na Sede do Grupo 39 (Arcos).',
  },
];

function HomeTicketModal({
  visible,
  onClose,
  match,
  user,
  isDark = true,
}) {
  const [step, setStep] = useState('select'); // 'select' | 'details' | 'confirmed'
  const [method, setMethod] = useState('transfer'); // 'transfer' | 'cash'
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const copyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const matchTitle = match
    ? `${match.homeTeam?.name || 'Rio Ave FC'} vs ${match.awayTeam?.name || 'Adversário'}`
    : 'Rio Ave FC · Jogo em Casa';

  const totalNum = HOME_TICKET_PRICE * quantity;
  const totalFormatted = totalNum.toFixed(2).replace('.', ',');

  const ticketRef = useMemo(() => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return method === 'transfer' ? `G39-BILH-${rand}` : `G39-SEDE-${rand}`;
  }, [visible, method]);

  useEffect(() => {
    if (visible) {
      setStep('select');
      setMethod('transfer');
      setQuantity(1);
      setFullName(user?.name || '');
      setPhone(user?.phone || '');
      setCopiedIban(false);
      setCopiedRef(false);
      setErrorMsg('');
    }
  }, [visible, user?.name, user?.phone]);

  const handleCopyText = async (text, type) => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        await Share.share({ message: text });
      }
    } catch (_) {}

    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    if (type === 'iban') {
      setCopiedIban(true);
      copyTimerRef.current = setTimeout(() => setCopiedIban(false), 2500);
    } else {
      setCopiedRef(true);
      copyTimerRef.current = setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const handleContinue = () => {
    if (!fullName.trim()) {
      setErrorMsg('Por favor indica o teu nome completo.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMsg('Indica um número de telemóvel válido para contacto.');
      return;
    }
    setErrorMsg('');
    setStep('details');
  };

  const handleConfirm = () => {
    if (Platform.OS === 'web') {
      try {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.7 },
          colors: ['#00874E', '#00E676', '#FFFFFF'],
        });
      } catch (_) {}
    }
    setStep('confirmed');
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
              {step === 'details' ? (
                <TouchableOpacity
                  onPress={() => setStep('select')}
                  style={[styles.backBtn, !isDark && styles.closeBtnLight]}
                  activeOpacity={0.7}
                >
                  <ArrowLeft size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                  <Ticket size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
                </View>
              )}
              <View style={styles.headerTitleCol}>
                <Text style={[styles.headerTitle, !isDark && styles.textDark]} numberOfLines={1}>
                  {step === 'details'
                    ? method === 'transfer'
                      ? 'Transferência Bancária'
                      : 'Dinheiro na Sede'
                    : step === 'confirmed'
                      ? 'Reserva de Bilhete Registada'
                      : 'Bilhetes · Jogo em Casa'}
                </Text>
                <Text style={[styles.headerSubtitle, !isDark && styles.headerSubtitleLight]} numberOfLines={1}>
                  {matchTitle}
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
            {step === 'select' && (
              <>
                {/* Resumo do Jogo */}
                <View style={[styles.matchBanner, !isDark && styles.matchBannerLight]}>
                  <View style={styles.matchMetaRow}>
                    <CalendarIcon size={13} color={isDark ? '#00E676' : '#00874E'} />
                    <Text style={[styles.matchMetaText, !isDark && styles.textDark]}>
                      {match?.dateShort || 'Próximo Jogo'} · {match?.time || '20:30'}
                    </Text>
                  </View>
                  <View style={styles.matchMetaRow}>
                    <MapPin size={13} color={isDark ? COLORS.textMuted : '#5A6E63'} />
                    <Text style={[styles.matchMetaSub, !isDark && styles.textMutedDark]} numberOfLines={1}>
                      Estádio do Rio Ave FC (Arcos) · Setor Grupo 39
                    </Text>
                  </View>
                  <View style={styles.pricePillRow}>
                    <Text style={[styles.pricePillText, !isDark && styles.pricePillTextLight]}>
                      Bilhete Claque: 5,00 € / unidade
                    </Text>
                  </View>
                </View>

                {/* Quantidade */}
                <View style={[styles.qtyRow, !isDark && styles.qtyRowLight]}>
                  <View style={styles.qtyLeft}>
                    <Users size={16} color={isDark ? '#00E676' : '#00874E'} />
                    <Text style={[styles.qtyLabel, !isDark && styles.textDark]}>
                      Quantidade de Bilhetes
                    </Text>
                  </View>
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={[styles.qtyBtn, !isDark && styles.qtyBtnLight]}
                      onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.qtyBtnText, !isDark && styles.textDark]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.qtyValue, !isDark && styles.textDark]}>{quantity}</Text>
                    <TouchableOpacity
                      style={[styles.qtyBtn, !isDark && styles.qtyBtnLight]}
                      onPress={() => setQuantity((q) => Math.min(5, q + 1))}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.qtyBtnText, !isDark && styles.textDark]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Método de Pagamento */}
                <Text style={[styles.sectionLabel, !isDark && styles.textDark]}>
                  1. Método de pagamento
                </Text>
                <View style={styles.methodsList}>
                  {PAYMENT_METHODS.map((opt) => {
                    const isSelected = opt.id === method;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        style={[
                          styles.methodCard,
                          !isDark && styles.methodCardLight,
                          isSelected && styles.methodCardSelected,
                          !isDark && isSelected && styles.methodCardSelectedLight,
                        ]}
                        onPress={() => setMethod(opt.id)}
                        activeOpacity={0.82}
                      >
                        <View
                          style={[
                            styles.methodIconBox,
                            isSelected && styles.methodIconBoxSelected,
                            !isDark && !isSelected && styles.methodIconBoxLight,
                          ]}
                        >
                          {opt.id === 'transfer' ? (
                            <Landmark
                              size={18}
                              color={isSelected ? '#00E676' : isDark ? '#8DA397' : '#556A5E'}
                            />
                          ) : (
                            <Banknote
                              size={18}
                              color={isSelected ? '#00E676' : isDark ? '#8DA397' : '#556A5E'}
                            />
                          )}
                        </View>
                        <View style={styles.methodTextCol}>
                          <Text style={[styles.methodTitle, !isDark && styles.textDark]}>
                            {opt.title}
                          </Text>
                          <Text style={[styles.methodDesc, !isDark && styles.textMutedDark]}>
                            {opt.desc}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Dados do Comprador */}
                <Text style={[styles.sectionLabel, !isDark && styles.textDark]}>
                  2. Dados do Comprador
                </Text>
                <View style={styles.inputsGroup}>
                  <TextInput
                    style={[styles.input, !isDark && styles.inputLight]}
                    placeholder="Nome completo"
                    placeholderTextColor={isDark ? '#6D8276' : '#8A9E93'}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                  <TextInput
                    style={[styles.input, !isDark && styles.inputLight]}
                    placeholder="Telemóvel (ex: 912 345 678)"
                    placeholderTextColor={isDark ? '#6D8276' : '#8A9E93'}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>

                {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

                {/* Total */}
                <View style={[styles.totalBox, !isDark && styles.totalBoxLight]}>
                  <Text style={[styles.totalLabel, !isDark && styles.textMutedDark]}>
                    Total ({quantity}x Bilhete · 5,00 €)
                  </Text>
                  <Text style={[styles.totalValue, !isDark && styles.totalValueLight]}>
                    {totalFormatted} €
                  </Text>
                </View>

                <TouchableOpacity onPress={handleContinue} activeOpacity={0.86}>
                  <LinearGradient
                    colors={['#00B368', '#00874E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtn}
                  >
                    {method === 'transfer' ? (
                      <Landmark size={16} color="#FFFFFF" />
                    ) : (
                      <Banknote size={16} color="#FFFFFF" />
                    )}
                    <Text style={styles.primaryBtnText}>
                      {method === 'transfer'
                        ? 'Pagar por Transferência Bancária'
                        : 'Pagar em Dinheiro na Sede'}
                    </Text>
                    <ChevronRight size={16} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {step === 'details' && method === 'transfer' && (
              <>
                <View style={[styles.bankCard, !isDark && styles.bankCardLight]}>
                  <View style={styles.bankHeaderRow}>
                    <Landmark size={18} color="#F2B600" />
                    <Text style={[styles.bankHeaderTitle, !isDark && styles.textDark]}>
                      Dados para Transferência Bancária
                    </Text>
                  </View>

                  <View style={styles.bankField}>
                    <Text style={[styles.bankFieldLabel, !isDark && styles.textMutedDark]}>
                      IBAN Oficial do Grupo 39
                    </Text>
                    <View style={[styles.ibanBox, !isDark && styles.ibanBoxLight]}>
                      <Text style={[styles.ibanValue, !isDark && styles.textDark]} selectable>
                        {IBAN_CLUBE}
                      </Text>
                      <TouchableOpacity
                        style={[styles.copyBtn, copiedIban && styles.copyBtnDone]}
                        onPress={() => handleCopyText(IBAN_RAW, 'iban')}
                        activeOpacity={0.8}
                      >
                        {copiedIban ? <Check size={13} color="#FFF" /> : <Copy size={13} color="#FFF" />}
                        <Text style={styles.copyBtnText}>
                          {copiedIban ? 'Copiado' : 'Copiar'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.bankField}>
                    <Text style={[styles.bankFieldLabel, !isDark && styles.textMutedDark]}>
                      Referência / Descrição da Transferência
                    </Text>
                    <View style={[styles.ibanBox, !isDark && styles.ibanBoxLight]}>
                      <Text style={[styles.refValue, !isDark && styles.textDark]} selectable>
                        {ticketRef}
                      </Text>
                      <TouchableOpacity
                        style={[styles.copyBtn, copiedRef && styles.copyBtnDone]}
                        onPress={() => handleCopyText(ticketRef, 'ref')}
                        activeOpacity={0.8}
                      >
                        {copiedRef ? <Check size={13} color="#FFF" /> : <Copy size={13} color="#FFF" />}
                        <Text style={styles.copyBtnText}>
                          {copiedRef ? 'Copiado' : 'Copiar'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={[styles.bankSummaryRow, !isDark && styles.bankSummaryRowLight]}>
                    <View>
                      <Text style={[styles.bankFieldLabel, !isDark && styles.textMutedDark]}>
                        Bilhetes
                      </Text>
                      <Text style={[styles.bankSummaryText, !isDark && styles.textDark]}>
                        {quantity}x Bilhete Casa · {fullName}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.bankFieldLabel, !isDark && styles.textMutedDark]}>
                        Montante
                      </Text>
                      <Text style={[styles.bankAmountText, !isDark && styles.bankAmountTextLight]}>
                        {totalFormatted} €
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.infoNotice, !isDark && styles.infoNoticeLight]}>
                  <Info size={15} color={isDark ? '#00E676' : '#00874E'} />
                  <Text style={[styles.infoNoticeText, !isDark && styles.textMutedDark]}>
                    Efetua a transferência com a referência acima indicada e confirma abaixo para registar o teu bilhete.
                  </Text>
                </View>

                <TouchableOpacity onPress={handleConfirm} activeOpacity={0.86}>
                  <LinearGradient
                    colors={['#00B368', '#00874E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtn}
                  >
                    <CheckCircle2 size={16} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>
                      Confirmar Transferência Efetuada
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {step === 'details' && method === 'cash' && (
              <>
                <View style={[styles.bankCard, !isDark && styles.bankCardLight]}>
                  <View style={styles.bankHeaderRow}>
                    <Banknote size={18} color="#00E676" />
                    <Text style={[styles.bankHeaderTitle, !isDark && styles.textDark]}>
                      Pagamento em Dinheiro na Sede
                    </Text>
                  </View>

                  <View style={[styles.sedeInfoBox, !isDark && styles.sedeInfoBoxLight]}>
                    <View style={styles.sedeInfoRow}>
                      <MapPin size={15} color={isDark ? '#00E676' : '#00874E'} />
                      <Text style={[styles.sedeInfoText, !isDark && styles.textDark]}>
                        Sede do Grupo 39 · Junto ao Estádio dos Arcos (Porta 4), Vila do Conde
                      </Text>
                    </View>
                    <View style={styles.sedeInfoRow}>
                      <Clock size={15} color={isDark ? '#00E676' : '#00874E'} />
                      <Text style={[styles.sedeInfoText, !isDark && styles.textMutedDark]}>
                        Dias de jogo (2h antes do início) e Quartas/Sextas das 19h00 às 22h00
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bankField}>
                    <Text style={[styles.bankFieldLabel, !isDark && styles.textMutedDark]}>
                      Código de Reserva na Sede
                    </Text>
                    <View style={[styles.ibanBox, !isDark && styles.ibanBoxLight]}>
                      <Text style={[styles.refValue, !isDark && styles.textDark]} selectable>
                        {ticketRef}
                      </Text>
                      <TouchableOpacity
                        style={[styles.copyBtn, copiedRef && styles.copyBtnDone]}
                        onPress={() => handleCopyText(ticketRef, 'ref')}
                        activeOpacity={0.8}
                      >
                        {copiedRef ? <Check size={13} color="#FFF" /> : <Copy size={13} color="#FFF" />}
                        <Text style={styles.copyBtnText}>
                          {copiedRef ? 'Copiado' : 'Copiar'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={[styles.bankSummaryRow, !isDark && styles.bankSummaryRowLight]}>
                    <View>
                      <Text style={[styles.bankFieldLabel, !isDark && styles.textMutedDark]}>
                        Bilhetes
                      </Text>
                      <Text style={[styles.bankSummaryText, !isDark && styles.textDark]}>
                        {quantity}x Bilhete Casa · {fullName}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.bankFieldLabel, !isDark && styles.textMutedDark]}>
                        A entregar na Sede
                      </Text>
                      <Text style={[styles.bankAmountText, !isDark && styles.bankAmountTextLight]}>
                        {totalFormatted} €
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.infoNotice, !isDark && styles.infoNoticeLight]}>
                  <Info size={15} color={isDark ? '#00E676' : '#00874E'} />
                  <Text style={[styles.infoNoticeText, !isDark && styles.textMutedDark]}>
                    Apresenta o código acima na Sede do Grupo 39 para levantar e pagar os teus bilhetes em dinheiro.
                  </Text>
                </View>

                <TouchableOpacity onPress={handleConfirm} activeOpacity={0.86}>
                  <LinearGradient
                    colors={['#00B368', '#00874E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtn}
                  >
                    <CheckCircle2 size={16} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>
                      Registar Reserva na Sede
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {step === 'confirmed' && (
              <View style={styles.confirmedWrap}>
                <View style={styles.confirmedIconCircle}>
                  <CheckCircle2 size={38} color="#00E676" />
                </View>
                <Text style={[styles.confirmedTitle, !isDark && styles.textDark]}>
                  Reserva de Bilhete Registada!
                </Text>
                <Text style={[styles.confirmedSub, !isDark && styles.textMutedDark]}>
                  {method === 'transfer'
                    ? 'A tua transferência foi registada para levantamento do bilhete do jogo em casa.'
                    : 'O teu pedido de bilhete para pagamento na Sede do Grupo 39 foi registado.'}
                </Text>

                <View style={[styles.confirmedSummary, !isDark && styles.confirmedSummaryLight]}>
                  <View style={styles.confirmedRow}>
                    <Text style={[styles.confirmedLabel, !isDark && styles.textMutedDark]}>Jogo</Text>
                    <Text style={[styles.confirmedValue, !isDark && styles.textDark]}>{matchTitle}</Text>
                  </View>
                  <View style={styles.confirmedRow}>
                    <Text style={[styles.confirmedLabel, !isDark && styles.textMutedDark]}>Quantidade</Text>
                    <Text style={[styles.confirmedValue, !isDark && styles.textDark]}>{quantity}x Bilhete</Text>
                  </View>
                  <View style={styles.confirmedRow}>
                    <Text style={[styles.confirmedLabel, !isDark && styles.textMutedDark]}>Referência</Text>
                    <Text style={[styles.confirmedValue, !isDark && styles.textDark]}>{ticketRef}</Text>
                  </View>
                  <View style={styles.confirmedRow}>
                    <Text style={[styles.confirmedLabel, !isDark && styles.textMutedDark]}>Total</Text>
                    <Text style={styles.confirmedValueGreen}>{totalFormatted} €</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={onClose}
                  activeOpacity={0.85}
                >
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
  matchBanner: {
    backgroundColor: '#132119',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.22)',
    gap: 5,
  },
  matchBannerLight: {
    backgroundColor: '#F3FAF6',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  matchMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchMetaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  matchMetaSub: {
    color: '#8FA89B',
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
  },
  pricePillRow: {
    marginTop: 3,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pricePillText: {
    color: '#00E676',
    fontSize: 11,
    fontWeight: '800',
  },
  pricePillTextLight: {
    color: '#00874E',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121E18',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  qtyRowLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.16)',
  },
  qtyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnLight: {
    backgroundColor: '#E8F5EE',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  qtyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  qtyValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    minWidth: 18,
    textAlign: 'center',
  },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  methodsList: {
    gap: 10,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#121E18',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    borderRadius: 14,
    padding: 12,
  },
  methodCardLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.16)',
  },
  methodCardSelected: {
    borderColor: '#00E676',
    backgroundColor: 'rgba(0, 135, 78, 0.16)',
  },
  methodCardSelectedLight: {
    borderColor: '#00874E',
    backgroundColor: '#E8F5EE',
  },
  methodIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIconBoxLight: {
    backgroundColor: '#E7EFEA',
  },
  methodIconBoxSelected: {
    backgroundColor: 'rgba(0, 230, 118, 0.16)',
  },
  methodTextCol: {
    flex: 1,
  },
  methodTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  methodDesc: {
    color: '#8FA89B',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  inputsGroup: {
    gap: 9,
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
  totalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111B16',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  totalBoxLight: {
    backgroundColor: '#F3F8F5',
    borderColor: 'rgba(0, 135, 78, 0.16)',
  },
  totalLabel: {
    color: '#8FA89B',
    fontSize: 12.5,
    fontWeight: '700',
  },
  totalValue: {
    color: '#00E676',
    fontSize: 18,
    fontWeight: '900',
  },
  totalValueLight: {
    color: '#00874E',
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
  bankCard: {
    backgroundColor: '#121E18',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.25)',
    gap: 12,
  },
  bankCardLight: {
    backgroundColor: '#F7FBF9',
    borderColor: 'rgba(0, 135, 78, 0.22)',
  },
  bankHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bankHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  bankField: {
    gap: 5,
  },
  bankFieldLabel: {
    color: '#8FA89B',
    fontSize: 11,
    fontWeight: '700',
  },
  ibanBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0C1410',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingLeft: 11,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  ibanBoxLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  ibanValue: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  refValue: {
    flex: 1,
    color: '#00E676',
    fontSize: 13,
    fontWeight: '900',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00874E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyBtnDone: {
    backgroundColor: '#00B368',
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  bankSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  bankSummaryRowLight: {
    borderTopColor: 'rgba(0, 135, 78, 0.14)',
  },
  bankSummaryText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
  bankAmountText: {
    color: '#00E676',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  bankAmountTextLight: {
    color: '#00874E',
  },
  sedeInfoBox: {
    backgroundColor: '#0C1410',
    borderRadius: 12,
    padding: 11,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sedeInfoBoxLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  sedeInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  sedeInfoText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  infoNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(0, 179, 104, 0.1)',
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
  },
  infoNoticeLight: {
    backgroundColor: '#EDF7F1',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  infoNoticeText: {
    flex: 1,
    color: '#C7D8CE',
    fontSize: 11.5,
    lineHeight: 16,
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
  confirmedSummary: {
    width: '100%',
    backgroundColor: '#121E18',
    borderRadius: 14,
    padding: 13,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 4,
  },
  confirmedSummaryLight: {
    backgroundColor: '#F4FAF6',
    borderColor: 'rgba(0, 135, 78, 0.16)',
  },
  confirmedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmedLabel: {
    color: '#8FA89B',
    fontSize: 12,
    fontWeight: '600',
  },
  confirmedValue: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  confirmedValueGreen: {
    color: '#00E676',
    fontSize: 14,
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

export default memo(HomeTicketModal);
