import React, { useState, useEffect, useMemo, memo } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  Bus,
  Ticket,
  Landmark,
  Copy,
  Check,
  CheckCircle2,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  ChevronRight,
  ArrowLeft,
  Info,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const IBAN_CLUBE = 'PT50 0018 0003 4730 0587 0202 9';
const IBAN_RAW = 'PT50001800034730058702029';

const PACK_OPTIONS = [
  {
    id: 'bilhete_deslocacao',
    title: 'Bilhete + Deslocação',
    desc: 'Autocarro Ida/Volta + Bilhete Setor G39',
    memberPrice: 7.5,
    price: 10.0,
    badge: null,
  },
];

function DeslocacaoModal({
  visible,
  onClose,
  nextMatch,
  user,
  isDark = true,
  isLoggedIn = false,
}) {
  const [step, setStep] = useState('select'); // 'select' | 'payment' | 'confirmed'
  const [selectedPackId, setSelectedPackId] = useState('bilhete_deslocacao');
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const reservationRef = useMemo(() => {
    const code = Math.floor(1000 + Math.random() * 9000);
    return `G39-DESL-${code}`;
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setStep('select');
      setSelectedPackId('bilhete_deslocacao');
      setQuantity(1);
      setFullName(user?.name || '');
      setPhone(user?.phone || '');
      setCopiedIban(false);
      setCopiedRef(false);
      setErrorMsg('');
    }
  }, [visible, user?.name, user?.phone]);

  const selectedPack = PACK_OPTIONS.find((p) => p.id === selectedPackId) || PACK_OPTIONS[0];
  const rawTotal = useMemo(() => {
    if (selectedPack.id === 'bilhete_deslocacao' && isLoggedIn) {
      return selectedPack.memberPrice + Math.max(0, quantity - 1) * selectedPack.price;
    }
    return selectedPack.price * quantity;
  }, [selectedPack, isLoggedIn, quantity]);
  const totalAmount = rawTotal.toFixed(2).replace('.', ',');

  const matchTitle = nextMatch
    ? `${nextMatch.homeTeam?.name || 'Equipa Casa'} vs ${nextMatch.awayTeam?.name || 'Rio Ave FC'}`
    : 'Próxima Deslocação · Rio Ave FC';

  const handleCopyText = async (text, type) => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        await Share.share({ message: text });
      }
      if (type === 'iban') {
        setCopiedIban(true);
        setTimeout(() => setCopiedIban(false), 2500);
      } else {
        setCopiedRef(true);
        setTimeout(() => setCopiedRef(false), 2500);
      }
    } catch (_) {
      if (type === 'iban') {
        setCopiedIban(true);
        setTimeout(() => setCopiedIban(false), 2500);
      }
    }
  };

  const handleContinueToPayment = () => {
    if (!fullName.trim()) {
      setErrorMsg('Por favor indica o teu nome completo para a lista da deslocação.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMsg('Indica um número de telemóvel válido para contacto.');
      return;
    }
    setErrorMsg('');
    setStep('payment');
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, !isDark && styles.containerLight]}>
          {/* Header */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              {step === 'payment' ? (
                <TouchableOpacity
                  onPress={() => setStep('select')}
                  style={[styles.backBtn, !isDark && styles.closeBtnLight]}
                  activeOpacity={0.7}
                >
                  <ArrowLeft size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                  <Bus size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
                </View>
              )}
              <View style={styles.headerTitleCol}>
                <Text style={[styles.headerTitle, !isDark && styles.textDark]} numberOfLines={1}>
                  {step === 'payment'
                    ? 'Transferência Bancária'
                    : step === 'confirmed'
                      ? 'Reserva Registada'
                      : 'Bilhete + Deslocação'}
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
                      {nextMatch?.dateFormatted || 'Próxima Jornada'}
                    </Text>
                  </View>
                  <View style={styles.matchMetaRow}>
                    <MapPin size={13} color={isDark ? COLORS.textMuted : '#5A6E63'} />
                    <Text style={[styles.matchMetaSub, !isDark && styles.textMutedDark]} numberOfLines={1}>
                      {nextMatch?.stadium || 'Estádio a confirmar'}
                    </Text>
                  </View>
                </View>

                {/* Seleção de Pack */}
                <Text style={[styles.sectionLabel, !isDark && styles.textDark]}>
                  1. Escolhe a tua opção
                </Text>
                <View style={styles.packsList}>
                  {PACK_OPTIONS.map((pack) => {
                    const isSelected = pack.id === selectedPackId;
                    const displayPrice =
                      pack.id === 'bilhete_deslocacao' && isLoggedIn ? pack.memberPrice : pack.price;
                    return (
                      <TouchableOpacity
                        key={pack.id}
                        style={[
                          styles.packCard,
                          !isDark && styles.packCardLight,
                          isSelected && styles.packCardSelected,
                          !isDark && isSelected && styles.packCardSelectedLight,
                        ]}
                        onPress={() => setSelectedPackId(pack.id)}
                        activeOpacity={0.82}
                      >
                        <View style={styles.packCardLeft}>
                          <View style={styles.packTitleRow}>
                            {pack.id === 'bilhete_deslocacao' ? (
                              <Ticket size={15} color={isSelected ? '#00E676' : '#8DA397'} />
                            ) : (
                              <Bus size={15} color={isSelected ? '#00E676' : '#8DA397'} />
                            )}
                            <Text style={[styles.packTitle, !isDark && styles.textDark]}>
                              {pack.title}
                            </Text>
                            {pack.badge && (
                              <View style={styles.packBadge}>
                                <Text style={styles.packBadgeText}>{pack.badge}</Text>
                              </View>
                            )}
                          </View>
                          <Text style={[styles.packDesc, !isDark && styles.textMutedDark]}>
                            {pack.desc}
                          </Text>
                        </View>
                        <Text style={[styles.packPrice, !isDark && styles.packPriceLight]}>
                          {displayPrice.toFixed(2).replace('.', ',')} €
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Quantidade */}
                <View style={[styles.qtyRow, !isDark && styles.qtyRowLight]}>
                  <View style={styles.qtyLeft}>
                    <Users size={16} color={isDark ? '#00E676' : '#00874E'} />
                    <Text style={[styles.qtyLabel, !isDark && styles.textDark]}>
                      Número de Lugares
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

                {selectedPackId === 'bilhete_deslocacao' && isLoggedIn && (
                  <Text style={[styles.memberRuleNote, !isDark && styles.memberRuleNoteLight]}>
                    {quantity === 1
                      ? 'Preço de Sócio aplicado (7,50 € · máx. 1 por sócio). Bilhetes extra: 10,00 €/un.'
                      : `1 bilhete de Sócio (7,50 €) + ${quantity - 1} bilhete(s) Não Sócio (10,00 €/un.)`}
                  </Text>
                )}

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

                {/* Total + Botão Continuar */}
                <View style={[styles.totalBox, !isDark && styles.totalBoxLight]}>
                  <Text style={[styles.totalLabel, !isDark && styles.textMutedDark]}>
                    Total a Transferir
                  </Text>
                  <Text style={styles.totalValue}>{totalAmount} €</Text>
                </View>

                <TouchableOpacity onPress={handleContinueToPayment} activeOpacity={0.86}>
                  <LinearGradient
                    colors={['#00B368', '#00874E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtn}
                  >
                    <Landmark size={16} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>
                      Pagar por Transferência Bancária
                    </Text>
                    <ChevronRight size={16} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {step === 'payment' && (
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
                      IBAN Oficial
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
                        {copiedIban ? (
                          <Check size={13} color="#FFF" />
                        ) : (
                          <Copy size={13} color="#FFF" />
                        )}
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
                        {reservationRef}
                      </Text>
                      <TouchableOpacity
                        style={[styles.copyBtn, copiedRef && styles.copyBtnDone]}
                        onPress={() => handleCopyText(reservationRef, 'ref')}
                        activeOpacity={0.8}
                      >
                        {copiedRef ? (
                          <Check size={13} color="#FFF" />
                        ) : (
                          <Copy size={13} color="#FFF" />
                        )}
                        <Text style={styles.copyBtnText}>
                          {copiedRef ? 'Copiado' : 'Copiar'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={[styles.bankSummaryRow, !isDark && styles.bankSummaryRowLight]}>
                    <View>
                      <Text style={[styles.bankFieldLabel, !isDark && styles.textMutedDark]}>
                        Opção · Quantidade
                      </Text>
                      <Text style={[styles.bankSummaryText, !isDark && styles.textDark]}>
                        {selectedPack.title} ({quantity}x)
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.bankFieldLabel, !isDark && styles.textMutedDark]}>
                        Montante
                      </Text>
                      <Text style={styles.bankAmountText}>{totalAmount} €</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.infoNotice, !isDark && styles.infoNoticeLight]}>
                  <Info size={15} color={isDark ? '#00E676' : '#00874E'} />
                  <Text style={[styles.infoNoticeText, !isDark && styles.textMutedDark]}>
                    Efetua a transferência no teu homebanking com a referência acima indicada e confirma abaixo para registar o teu lugar.
                  </Text>
                </View>

                <TouchableOpacity onPress={() => setStep('confirmed')} activeOpacity={0.86}>
                  <LinearGradient
                    colors={['#00B368', '#00874E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtn}
                  >
                    <CheckCircle2 size={17} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>
                      Já Efetuei a Transferência · Confirmar
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {step === 'confirmed' && (
              <View style={styles.confirmedBox}>
                <View style={styles.confirmedIconCircle}>
                  <CheckCircle2 size={34} color="#00E676" />
                </View>
                <Text style={[styles.confirmedTitle, !isDark && styles.textDark]}>
                  Pedido de Deslocação Registado!
                </Text>
                <Text style={[styles.confirmedDesc, !isDark && styles.textMutedDark]}>
                  A tua reserva ({quantity}x {selectedPack.title}) em nome de {fullName} ficou associada à referência {reservationRef}. Assim que a transferência de {totalAmount} € for validada, o teu lugar fica confirmado.
                </Text>

                <View style={[styles.confirmedRefPill, !isDark && styles.confirmedRefPillLight]}>
                  <Text style={[styles.confirmedRefLabel, !isDark && styles.textMutedDark]}>
                    IBAN: {IBAN_CLUBE}
                  </Text>
                  <Text style={styles.confirmedRefCode}>Ref: {reservationRef}</Text>
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

            <View style={{ height: 20 }} />
          </ScrollView>
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
      web: { backdropFilter: 'blur(10px)' },
    }),
  },
  container: {
    backgroundColor: '#0D1410',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    overflow: 'hidden',
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.22)',
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
    backgroundColor: '#FFFFFF',
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
    borderRadius: 10,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFF',
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLight: {
    backgroundColor: '#F0F4F2',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  scrollContent: {
    gap: 12,
  },
  matchBanner: {
    backgroundColor: '#14201A',
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.2)',
    gap: 5,
  },
  matchBannerLight: {
    backgroundColor: '#F3FAF6',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  matchMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchMetaText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  matchMetaSub: {
    color: '#9CAFA4',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  sectionLabel: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
    marginTop: 2,
  },
  packsList: {
    gap: 8,
  },
  packCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#14201A',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
  },
  packCardLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.14)',
  },
  packCardSelected: {
    borderColor: '#00E676',
    backgroundColor: 'rgba(0, 179, 104, 0.14)',
  },
  packCardSelectedLight: {
    borderColor: '#00874E',
    backgroundColor: '#E9F8F0',
  },
  packCardLeft: {
    flex: 1,
    gap: 3,
  },
  packTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  packTitle: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  packBadge: {
    backgroundColor: 'rgba(242, 182, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  packBadgeText: {
    color: '#F2B600',
    fontSize: 8,
    fontWeight: '900',
  },
  packDesc: {
    color: '#9CAFA4',
    fontSize: 11,
  },
  packPrice: {
    color: '#00E676',
    fontSize: 15,
    fontWeight: '900',
  },
  packPriceLight: {
    color: '#00874E',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#14201A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  qtyRowLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.14)',
  },
  qtyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyLabel: {
    color: '#FFF',
    fontSize: 12.5,
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
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnLight: {
    backgroundColor: '#E5EFE9',
  },
  qtyBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
  },
  qtyValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    minWidth: 18,
    textAlign: 'center',
  },
  memberRuleNote: {
    color: '#00E676',
    fontSize: 11,
    fontWeight: '700',
    marginTop: -4,
    paddingHorizontal: 2,
  },
  memberRuleNoteLight: {
    color: '#00874E',
  },
  inputsGroup: {
    gap: 8,
  },
  input: {
    backgroundColor: '#14201A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 13,
  },
  inputLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.2)',
    color: '#0E1712',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 11.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  totalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.25)',
  },
  totalBoxLight: {
    backgroundColor: '#EAF7F0',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  totalLabel: {
    color: '#9CAFA4',
    fontSize: 12,
    fontWeight: '700',
  },
  totalValue: {
    color: '#00E676',
    fontSize: 18,
    fontWeight: '900',
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
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '900',
  },
  bankCard: {
    backgroundColor: '#14201A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(242, 182, 0, 0.4)',
    gap: 12,
  },
  bankCardLight: {
    backgroundColor: '#F9FCF9',
    borderColor: 'rgba(0, 135, 78, 0.28)',
  },
  bankHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bankHeaderTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  bankField: {
    gap: 5,
  },
  bankFieldLabel: {
    color: '#9CAFA4',
    fontSize: 10.5,
    fontWeight: '700',
  },
  ibanBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0B120E',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  ibanBoxLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  ibanValue: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.4,
    flex: 1,
  },
  refValue: {
    color: '#F2B600',
    fontSize: 13,
    fontWeight: '900',
    flex: 1,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00874E',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },
  copyBtnDone: {
    backgroundColor: '#00B368',
  },
  copyBtnText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  bankSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  bankSummaryRowLight: {
    borderTopColor: 'rgba(0, 135, 78, 0.14)',
  },
  bankSummaryText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
    marginTop: 2,
  },
  bankAmountText: {
    color: '#00E676',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  infoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderRadius: 12,
    padding: 11,
  },
  infoNoticeLight: {
    backgroundColor: '#EDF7F1',
  },
  infoNoticeText: {
    color: '#B5C7BD',
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
  },
  confirmedBox: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  confirmedIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmedTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  confirmedDesc: {
    color: '#9CAFA4',
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
  },
  confirmedRefPill: {
    width: '100%',
    backgroundColor: '#14201A',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.25)',
  },
  confirmedRefPillLight: {
    backgroundColor: '#F3FAF6',
    borderColor: 'rgba(0, 135, 78, 0.22)',
  },
  confirmedRefLabel: {
    color: '#9CAFA4',
    fontSize: 11,
    fontWeight: '700',
  },
  confirmedRefCode: {
    color: '#F2B600',
    fontSize: 13.5,
    fontWeight: '900',
  },
  doneBtn: {
    width: '100%',
    backgroundColor: '#00874E',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#5A6E63',
  },
});

export default memo(DeslocacaoModal);
