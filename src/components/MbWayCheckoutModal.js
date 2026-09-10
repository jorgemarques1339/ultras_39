import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Platform,
  ScrollView,
  useWindowDimensions,
  Image,
} from 'react-native';
import {
  X,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Receipt,
  ChevronRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react-native';
import confetti from 'canvas-confetti';
import { COLORS } from '../theme/colors';
import { useAppTheme } from '../context/ThemeContext';

export default function MbWayCheckoutModal({
  visible,
  onClose,
  checkoutData, // { title, category, amount, originalPrice, discount, phone, type, isNewMemberWelcome }
  onPaymentSuccess,
  onViewReceipt,
  onGoProfile,
  user,
  isDark,
}) {
  const themeContext = useAppTheme?.();
  const isEffectiveDark = isDark !== undefined ? isDark : (themeContext?.isDark ?? true);
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;

  // Estados: 'form' | 'pending' | 'success' | 'failed'
  const [status, setStatus] = useState('form');
  const [phoneNumber, setPhoneNumber] = useState('912 345 678');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(299); // 4 minutos e 59 segundos
  const [lastTransaction, setLastTransaction] = useState(null);

  // Animação de pulso para estado pendente
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  const safeData = checkoutData || {
    title: 'Bilhete Bancada Grupo 39',
    category: 'Bilhética Oficial RAFC',
    amount: 7.50,
    originalPrice: 10.00,
    discount: 2.50,
    phone: '912 345 678',
    type: 'ticket',
  };

  // Reiniciar estado ao abrir
  useEffect(() => {
    if (visible && checkoutData) {
      setStatus('form');
      setPhoneNumber(checkoutData.phone || '912 345 678');
      setIsEditingPhone(false);
      setTimeLeft(299);
    }
  }, [visible, checkoutData]);

  // Contagem decrescente no estado Pendente
  useEffect(() => {
    if (status === 'pending') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setStatus('failed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Simulação automática opcional de aprovação por webhook após 6.5s
      const autoApproveTimeout = setTimeout(() => {
        triggerApproval();
      }, 6500);

      return () => {
        clearInterval(timerRef.current);
        clearTimeout(autoApproveTimeout);
        pulseAnim.stopAnimation();
      };
    }
  }, [status]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartPayment = () => {
    if (!phoneNumber || phoneNumber.replace(/\s/g, '').length < 9) {
      alert('Por favor insere um número de telemóvel MB WAY válido (9 dígitos).');
      return;
    }
    setStatus('pending');
    setTimeLeft(299);
  };

  const triggerApproval = () => {
    if (status !== 'pending') return;
    if (timerRef.current) clearInterval(timerRef.current);

    const txId = `MBW-${Date.now().toString().slice(-4)}-RAFC`;
    const tx = {
      id: txId,
      title: safeData.title,
      category: safeData.category,
      amount: safeData.amount,
      date: new Date().toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      phone: phoneNumber,
      sibsRef: `SIBS-PT-039-${Math.floor(100000 + Math.random() * 900000)}`,
      authCode: `AUT-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Concluído',
      statusColor: COLORS.success,
      type: safeData.type,
    };

    setLastTransaction(tx);
    setStatus('success');

    if (Platform.OS === 'web' && typeof confetti === 'function') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00874E', '#00B368', '#FFFFFF', '#F2B600'],
        });
      } catch (e) {
        // ignore
      }
    }

    if (onPaymentSuccess) {
      onPaymentSuccess(tx);
    }
  };

  const triggerReject = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('failed');
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isTablet ? 'fade' : 'slide'}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, isTablet && styles.modalOverlayTablet]}>
        <View style={[styles.sheetContainer, isTablet && styles.sheetContainerTablet, !isEffectiveDark && styles.sheetContainerLight]}>
          {/* Header da BottomSheet */}
          <View style={[styles.sheetHeader, !isEffectiveDark && styles.sheetHeaderLight]}>
            <View style={styles.brandRow}>
              {/* Logótipo Estilizado MB WAY */}
              <View style={styles.mbwayLogoBadge}>
                <Text style={styles.mbwayLogoText}>MB</Text>
                <View style={styles.mbwayRedDot} />
                <Text style={styles.mbwayLogoSub}>WAY</Text>
              </View>
              <View style={styles.headerTitles}>
                <Text style={[styles.headerTitle, !isEffectiveDark && styles.headerTitleLight]}>Checkout Oficial</Text>
                <Text style={[styles.headerSubtitle, !isEffectiveDark && styles.headerSubtitleLight]}>SIBS Pagamentos Portugal</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, !isEffectiveDark && styles.closeButtonLight]}
              activeOpacity={0.7}
            >
              <X size={20} color={isEffectiveDark ? COLORS.textSecondary : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.sheetBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {/* ESTADO 1: FORMULÁRIO DE CHECKOUT */}
            {status === 'form' && (
              <View>
                {/* Resumo do Produto / Quota / Bilhete */}
                <View style={[styles.itemSummaryCard, !isEffectiveDark && styles.itemSummaryCardLight]}>
                  <View style={[styles.itemCategoryBadge, !isEffectiveDark && styles.itemCategoryBadgeLight]}>
                    <Text style={[styles.itemCategoryText, !isEffectiveDark && styles.itemCategoryTextLight]}>{safeData.category}</Text>
                  </View>
                  <Text style={[styles.itemTitle, !isEffectiveDark && styles.itemTitleLight]}>{safeData.title}</Text>

                  <View style={[styles.divider, !isEffectiveDark && styles.dividerLight]} />

                  <View style={styles.priceRow}>
                    <Text style={[styles.priceLabel, !isEffectiveDark && styles.textMutedLight]}>Preço Geral</Text>
                    <Text style={[styles.priceOld, !isEffectiveDark && styles.textMutedLight]}>
                      {safeData.originalPrice
                        ? `${safeData.originalPrice.toFixed(2)} €`
                        : `${safeData.amount.toFixed(2)} €`}
                    </Text>
                  </View>

                  {safeData.discount && (
                    <View style={styles.priceRow}>
                      <View style={styles.discountBadge}>
                        <Sparkles size={12} color={COLORS.gold} />
                        <Text style={styles.discountText}>Vantagem Sócio G39</Text>
                      </View>
                      <Text style={styles.discountAmount}>
                        -{safeData.discount.toFixed(2)} €
                      </Text>
                    </View>
                  )}

                  <View style={styles.priceRow}>
                    <Text style={[styles.priceLabel, !isEffectiveDark && styles.textMutedLight]}>Taxa SIBS / MB WAY</Text>
                    <Text style={[styles.freeFeeText, !isEffectiveDark && styles.freeFeeTextLight]}>Grátis (0,00 €)</Text>
                  </View>

                  <View style={[styles.divider, !isEffectiveDark && styles.dividerLight]} />

                  <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, !isEffectiveDark && styles.totalLabelLight]}>Total a Pagar</Text>
                    <Text style={[styles.totalAmount, !isEffectiveDark && styles.totalAmountLight]}>
                      {safeData.amount.toFixed(2)} €
                    </Text>
                  </View>
                </View>

                {/* Secção do Telemóvel MB WAY */}
                <View style={[styles.phoneSection, !isEffectiveDark && styles.phoneSectionLight]}>
                  <View style={styles.phoneHeaderRow}>
                    <View style={styles.iconWithText}>
                      <Smartphone size={16} color={isEffectiveDark ? COLORS.primaryLight : '#00874E'} />
                      <Text style={[styles.phoneSectionTitle, !isEffectiveDark && styles.phoneSectionTitleLight]}>
                        Número de Telemóvel MB WAY
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setIsEditingPhone(!isEditingPhone)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.changePhoneText, !isEffectiveDark && styles.changePhoneTextLight]}>
                        {isEditingPhone ? 'Guardar' : 'Alterar'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.phoneInputContainer, !isEffectiveDark && styles.phoneInputContainerLight]}>
                    <View style={[styles.countryBadge, !isEffectiveDark && styles.countryBadgeLight]}>
                      <Text style={styles.flagEmoji}>🇵🇹</Text>
                      <Text style={[styles.countryCode, !isEffectiveDark && styles.countryCodeLight]}>+351</Text>
                    </View>
                    <TextInput
                      style={[styles.phoneInput, !isEffectiveDark && styles.phoneInputLight]}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      editable={isEditingPhone}
                      placeholder="912 345 678"
                      placeholderTextColor={isEffectiveDark ? COLORS.textMuted : '#8FA497'}
                    />
                  </View>
                  <Text style={[styles.phoneHelperText, !isEffectiveDark && styles.textMutedLight]}>
                    Enviaremos uma notificação instantânea para o teu telemóvel.
                  </Text>
                </View>

                {/* Botão de Ação "Pagar com MB WAY" */}
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={handleStartPayment}
                  activeOpacity={0.85}
                >
                  <View style={styles.payButtonContent}>
                    <View style={styles.miniMbwayBadge}>
                      <Text style={styles.miniMbwayText}>MB</Text>
                      <View style={styles.miniDot} />
                      <Text style={styles.miniMbwaySub}>WAY</Text>
                    </View>
                    <Text style={styles.payButtonText}>
                      Pagar {safeData.amount.toFixed(2)} €
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.securitySealRow}>
                  <ShieldCheck size={14} color={isEffectiveDark ? COLORS.textSecondary : '#5A6E63'} />
                  <Text style={[styles.securitySealText, !isEffectiveDark && styles.textMutedLight]}>
                    Pagamento 100% encriptado e certificado pela SIBS Portugal
                  </Text>
                </View>
              </View>
            )}

            {/* ESTADO 2: PENDENTE / AGUARDANDO CONFIRMAÇÃO */}
            {status === 'pending' && (
              <View style={styles.pendingContainer}>
                {/* Radar animado em torno do logo MB WAY */}
                <View style={styles.radarWrapper}>
                  <Animated.View
                    style={[
                      styles.radarPulseRing,
                      { transform: [{ scale: pulseAnim }] },
                    ]}
                  />
                  <View style={styles.pulsingCenterLogo}>
                    <Text style={styles.pulsingLogoText}>MB</Text>
                    <View style={styles.pulsingRedDot} />
                    <Text style={styles.pulsingLogoSub}>WAY</Text>
                  </View>
                </View>

                <Text style={[styles.pendingHeading, !isEffectiveDark && styles.pendingHeadingLight]}>
                  Confirma o pagamento na tua app MB WAY
                </Text>
                <Text style={[styles.pendingInstructions, !isEffectiveDark && styles.pendingInstructionsLight]}>
                  Enviámos um pedido de{' '}
                  <Text style={{ fontWeight: '700', color: isEffectiveDark ? COLORS.white : '#0E1712' }}>
                    {safeData.amount.toFixed(2)} €
                  </Text>{' '}
                  para o número{' '}
                  <Text style={{ fontWeight: '700', color: isEffectiveDark ? COLORS.primaryLight : '#00874E' }}>
                    +351 {phoneNumber}
                  </Text>
                  . Abre a notificação no teu telemóvel para autorizar.
                </Text>

                {/* Timer Decrescente */}
                <View style={[styles.timerBadge, !isEffectiveDark && styles.timerBadgeLight]}>
                  <Clock size={16} color={COLORS.gold} />
                  <Text style={styles.timerText}>{formatTimer(timeLeft)}</Text>
                </View>

                {/* Controles de Simulação Interativa (Demonstração Webhook) */}
                <View style={[styles.simulationCard, !isEffectiveDark && styles.simulationCardLight]}>
                  <Text style={[styles.simulationTitle, !isEffectiveDark && styles.simulationTitleLight]}>
                    ⚡ Simulação Interativa de Webhook SIBS:
                  </Text>
                  <View style={styles.simulationButtonsRow}>
                    <TouchableOpacity
                      style={styles.simSuccessBtn}
                      onPress={triggerApproval}
                      activeOpacity={0.8}
                    >
                      <CheckCircle2 size={16} color="#FFF" />
                      <Text style={styles.simBtnText}>Aprovar no MB WAY</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.simRejectBtn}
                      onPress={triggerReject}
                      activeOpacity={0.8}
                    >
                      <AlertCircle size={16} color="#FFF" />
                      <Text style={styles.simBtnText}>Recusar</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Botões de Ação Auxiliar */}
                <View style={styles.pendingActionsRow}>
                  <TouchableOpacity
                    style={styles.resendBtn}
                    onPress={() => {
                      setTimeLeft(299);
                      alert('Nova notificação disparada com sucesso para +351 ' + phoneNumber);
                    }}
                    activeOpacity={0.7}
                  >
                    <RefreshCw size={14} color={isEffectiveDark ? COLORS.textSecondary : '#5A6E63'} />
                    <Text style={[styles.resendBtnText, !isEffectiveDark && styles.textMutedLight]}>Reenviar Notificação</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setStatus('form')}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.cancelBtnText, !isEffectiveDark && styles.cancelBtnTextLight]}>Alterar Número</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ESTADO 3: SUCESSO */}
            {status === 'success' && (
              safeData.type === 'quota' || safeData.isNewMemberWelcome ? (
                /* MENSAGEM DE BOAS-VINDAS: NOVO SÓCIO GRUPO 39 */
                <View style={styles.welcomeContainer}>
                  <View style={styles.welcomeCelebrationBadge}>
                    <Sparkles size={13} color="#F2B600" />
                    <Text style={styles.welcomeCelebrationBadgeText}>NOVO ASSOCIADO GRUPO 39</Text>
                  </View>

                  <View style={styles.welcomeIconCircle}>
                    <ShieldCheck size={44} color="#FFF" />
                  </View>

                  <Text style={[styles.welcomeTitle, !isEffectiveDark && styles.textDark]}>
                    Bem-vindo à Família!
                  </Text>
                  <Text style={[styles.welcomeSubtitle, !isEffectiveDark && styles.textMutedLight]}>
                    Parabéns! O teu registo de sócio e a quota para a <Text style={styles.welcomeHighlight}>Época 2026/2027</Text> foram confirmados com sucesso.
                  </Text>

                  {/* Cartão de Sócio Oficial Ativado */}
                  <View style={[styles.welcomeCard, !isEffectiveDark && styles.welcomeCardLight]}>
                    <View style={styles.welcomeCardHeader}>
                      <View style={styles.welcomeCardLogoRow}>
                        <View style={styles.welcomeMiniLogo}>
                          <Image
                            source={require('../../assets/logo_39.png')}
                            style={styles.welcomeMiniLogoImg}
                            resizeMode="contain"
                          />
                        </View>
                        <View>
                          <Text style={styles.welcomeCardOrg}>GRUPO 39 · ULTRAS</Text>
                          <Text style={styles.welcomeCardOrgSub}>Rio Ave Futebol Clube</Text>
                        </View>
                      </View>
                      <View style={styles.activeQuotaBadge}>
                        <View style={styles.activeQuotaDot} />
                        <Text style={styles.activeQuotaText}>QUOTA ATIVA</Text>
                      </View>
                    </View>

                    <View style={styles.welcomeDivider} />

                    <View style={styles.welcomeCardBody}>
                      <View style={styles.welcomeCardRow}>
                        <Text style={styles.welcomeCardLabel}>Nome do Sócio</Text>
                        <Text style={styles.welcomeCardValueName} numberOfLines={1}>
                          {user?.name || safeData.userName || 'Sócio Grupo 39'}
                        </Text>
                      </View>
                      <View style={styles.welcomeCardGrid}>
                        <View style={styles.welcomeCardCol}>
                          <Text style={styles.welcomeCardLabel}>N.º Sócio</Text>
                          <Text style={styles.welcomeCardValueGold}>
                            {user?.memberNumber || '039-1984'}
                          </Text>
                        </View>
                        <View style={styles.welcomeCardCol}>
                          <Text style={styles.welcomeCardLabel}>Categoria</Text>
                          <Text style={styles.welcomeCardValue}>Sócio Efetivo</Text>
                        </View>
                        <View style={styles.welcomeCardCol}>
                          <Text style={styles.welcomeCardLabel}>Validade</Text>
                          <Text style={styles.welcomeCardValueGreen}>2026/2027</Text>
                        </View>
                      </View>
                    </View>

                    {/* Vantagens Ativas */}
                    <View style={styles.welcomePerksBox}>
                      <View style={styles.welcomePerkItem}>
                        <CheckCircle2 size={12} color="#00E676" />
                        <Text style={styles.welcomePerkText}>Desconto nos bilhetes em todos os jogos nos Arcos</Text>
                      </View>
                      <View style={styles.welcomePerkItem}>
                        <CheckCircle2 size={12} color="#00E676" />
                        <Text style={styles.welcomePerkText}>Prioridade e preço exclusivo em autocarros oficiais</Text>
                      </View>
                      <View style={styles.welcomePerkItem}>
                        <CheckCircle2 size={12} color="#00E676" />
                        <Text style={styles.welcomePerkText}>Cartão digital e acesso imediato ao Fórum</Text>
                      </View>
                    </View>
                  </View>

                  {/* Resumo Rápido da Quota Paga */}
                  <View style={[styles.miniReceiptRow, !isEffectiveDark && styles.miniReceiptRowLight]}>
                    <Text style={[styles.miniReceiptText, !isEffectiveDark && styles.textMutedLight]}>
                      Quota Anual 12,00 € paga por MB WAY
                    </Text>
                    <Text style={styles.miniReceiptRef}>
                      {lastTransaction?.sibsRef || 'SIBS-PT-039-98214'}
                    </Text>
                  </View>

                  {/* Botões de Ação de Boas-Vindas */}
                  <TouchableOpacity
                    style={styles.welcomeProfileBtn}
                    onPress={() => {
                      onClose();
                      if (onGoProfile) onGoProfile();
                    }}
                    activeOpacity={0.85}
                  >
                    <ShieldCheck size={18} color="#FFF" />
                    <Text style={styles.welcomeProfileBtnText}>Ver o meu Cartão de Sócio</Text>
                    <ChevronRight size={16} color="#FFF" />
                  </TouchableOpacity>

                  <View style={styles.welcomeSecRow}>
                    <TouchableOpacity
                      style={styles.welcomeReceiptBtn}
                      onPress={() => {
                        onClose();
                        if (onViewReceipt && lastTransaction) {
                          onViewReceipt(lastTransaction);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Receipt size={14} color={isEffectiveDark ? COLORS.textSecondary : '#5A6E63'} />
                      <Text style={[styles.welcomeReceiptBtnText, !isEffectiveDark && styles.textMutedLight]}>
                        Ver Comprovativo SIBS
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.welcomeCloseBtn}
                      onPress={onClose}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.welcomeCloseBtnText, !isEffectiveDark && styles.textMutedLight]}>
                        Concluir
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* SUCESSO STANDARD (ex: BILHÉTICA OU LOJA) */
                <View style={styles.successContainer}>
                  <View style={styles.successIconCircle}>
                    <CheckCircle2 size={46} color="#FFF" />
                  </View>

                  <Text style={[styles.successTitle, !isEffectiveDark && styles.successTitleLight]}>Pagamento Confirmado!</Text>
                  <Text style={[styles.successSubtitle, !isEffectiveDark && styles.successSubtitleLight]}>
                    A transação MB WAY foi autorizada pela SIBS com sucesso.
                  </Text>

                  {/* Cartão de Confirmação Rápida */}
                  <View style={[styles.successReceiptCard, !isEffectiveDark && styles.successReceiptCardLight]}>
                    <View style={styles.successReceiptRow}>
                      <Text style={[styles.receiptLabel, !isEffectiveDark && styles.textMutedLight]}>Valor Pago</Text>
                      <Text style={[styles.receiptValueHighlight, !isEffectiveDark && styles.totalAmountLight]}>
                        {safeData.amount.toFixed(2)} €
                      </Text>
                    </View>
                    <View style={styles.successReceiptRow}>
                      <Text style={[styles.receiptLabel, !isEffectiveDark && styles.textMutedLight]}>Referência SIBS</Text>
                      <Text style={[styles.receiptValue, !isEffectiveDark && styles.receiptValueLight]}>
                        {lastTransaction?.sibsRef || 'SIBS-PT-039-98214'}
                      </Text>
                    </View>
                    <View style={styles.successReceiptRow}>
                      <Text style={[styles.receiptLabel, !isEffectiveDark && styles.textMutedLight]}>Destinatário</Text>
                      <Text style={[styles.receiptValue, !isEffectiveDark && styles.receiptValueLight]}>
                        Grupo 39 - Rio Ave F.C.
                      </Text>
                    </View>
                    <View style={styles.successReceiptRow}>
                      <Text style={[styles.receiptLabel, !isEffectiveDark && styles.textMutedLight]}>Telemóvel</Text>
                      <Text style={[styles.receiptValue, !isEffectiveDark && styles.receiptValueLight]}>+351 {phoneNumber}</Text>
                    </View>
                  </View>

                  {/* Botões do Sucesso */}
                  <TouchableOpacity
                    style={styles.viewReceiptBtn}
                    onPress={() => {
                      onClose();
                      if (onViewReceipt && lastTransaction) {
                        onViewReceipt(lastTransaction);
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <Receipt size={18} color="#FFF" />
                    <Text style={styles.viewReceiptBtnText}>
                      Ver Comprovativo Oficial
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.doneBtnText, !isEffectiveDark && styles.textMutedLight]}>Concluir e Voltar</Text>
                  </TouchableOpacity>
                </View>
              )
            )}

            {/* ESTADO 4: EXPIRADO / REJEITADO */}
            {status === 'failed' && (
              <View style={styles.failedContainer}>
                <View style={styles.failedIconCircle}>
                  <AlertCircle size={44} color="#FFF" />
                </View>

                <Text style={[styles.failedTitle, !isEffectiveDark && styles.failedTitleLight]}>Transação Não Concluída</Text>
                <Text style={[styles.failedSubtitle, !isEffectiveDark && styles.failedSubtitleLight]}>
                  O tempo limite de 5 minutos expirou ou a operação foi cancelada na app MB WAY.
                </Text>

                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => {
                    setStatus('form');
                    setTimeLeft(299);
                  }}
                  activeOpacity={0.85}
                >
                  <RefreshCw size={16} color="#FFF" />
                  <Text style={styles.retryBtnText}>Tentar Novamente</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeFailedBtn}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.closeFailedBtnText, !isEffectiveDark && styles.textMutedLight]}>Fechar</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 8, 0.78)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalOverlayTablet: {
    justifyContent: 'center',
    padding: 24,
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#111A15',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '92%',
    overflow: 'hidden',
  },
  sheetContainerTablet: {
    borderRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    maxHeight: '85%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mbwayLogoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004B87',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  mbwayLogoText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  mbwayRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E31B23',
    marginHorizontal: 2,
    marginBottom: 4,
  },
  mbwayLogoSub: {
    color: '#00A3E0',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  headerTitles: {
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  sheetBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  itemSummaryCard: {
    backgroundColor: '#16231D',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.2)',
    marginBottom: 16,
  },
  itemCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 135, 78, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemCategoryText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  itemTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  priceOld: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discountText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  discountAmount: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  freeFeeText: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  totalAmount: {
    color: COLORS.primaryLight,
    fontSize: 22,
    fontWeight: '900',
  },
  phoneSection: {
    backgroundColor: '#16231D',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 18,
  },
  phoneHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneSectionTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  changePhoneText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1410',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    height: 48,
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCode: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    paddingLeft: 12,
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  phoneHelperText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 8,
  },
  payButton: {
    backgroundColor: '#00874E',
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00B368',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 135, 78, 0.35)',
      },
    }),
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniMbwayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004B87',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  miniMbwayText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  miniDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E31B23',
    marginHorizontal: 1,
    marginBottom: 3,
  },
  miniMbwaySub: {
    color: '#00A3E0',
    fontSize: 11,
    fontWeight: '800',
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  securitySealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  securitySealText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  pendingContainer: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  radarWrapper: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  radarPulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 163, 224, 0.22)',
    borderWidth: 2,
    borderColor: 'rgba(0, 163, 224, 0.5)',
  },
  pulsingCenterLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004B87',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    elevation: 8,
  },
  pulsingLogoText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 20,
  },
  pulsingRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E31B23',
    marginHorizontal: 3,
    marginBottom: 6,
  },
  pulsingLogoSub: {
    color: '#00A3E0',
    fontWeight: '900',
    fontSize: 20,
  },
  pendingHeading: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  pendingInstructions: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
    marginBottom: 18,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(242, 182, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  timerText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  simulationCard: {
    width: '100%',
    backgroundColor: '#18251F',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    marginBottom: 18,
  },
  simulationTitle: {
    color: COLORS.textGold,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  simulationButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  simSuccessBtn: {
    flex: 1.2,
    backgroundColor: '#00874E',
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  simRejectBtn: {
    flex: 0.8,
    backgroundColor: '#C62828',
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  simBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pendingActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 6,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  resendBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  cancelBtn: {
    padding: 8,
  },
  cancelBtnText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  welcomeCelebrationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(242, 182, 0, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  welcomeCelebrationBadgeText: {
    color: '#F2B600',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  welcomeIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#00E676',
    ...Platform.select({
      web: {
        boxShadow: '0 0 24px rgba(0, 230, 118, 0.4)',
      },
    }),
  },
  welcomeTitle: {
    color: '#FFF',
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    color: '#A2B5AB',
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  welcomeHighlight: {
    color: '#00E676',
    fontWeight: '800',
  },
  welcomeCard: {
    width: '100%',
    backgroundColor: '#0F1A13',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 179, 104, 0.4)',
    padding: 14,
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px rgba(0, 135, 78, 0.2)',
      },
    }),
  },
  welcomeCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.25)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  welcomeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  welcomeCardLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  welcomeMiniLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00B368',
  },
  welcomeMiniLogoImg: {
    width: 24,
    height: 24,
  },
  welcomeCardOrg: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  welcomeCardOrgSub: {
    color: '#7E9187',
    fontSize: 9.5,
    fontWeight: '600',
  },
  activeQuotaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.4)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeQuotaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
  },
  activeQuotaText: {
    color: '#00E676',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  welcomeDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 10,
  },
  welcomeCardBody: {
    gap: 8,
    marginBottom: 10,
  },
  welcomeCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeCardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 8,
    borderRadius: 8,
  },
  welcomeCardCol: {
    alignItems: 'center',
  },
  welcomeCardLabel: {
    color: '#7E9187',
    fontSize: 9.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  welcomeCardValueName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  welcomeCardValueGold: {
    color: '#F2B600',
    fontSize: 12,
    fontWeight: '900',
  },
  welcomeCardValue: {
    color: '#E0EDE5',
    fontSize: 11,
    fontWeight: '700',
  },
  welcomeCardValueGreen: {
    color: '#00E676',
    fontSize: 11.5,
    fontWeight: '800',
  },
  welcomePerksBox: {
    backgroundColor: 'rgba(0, 179, 104, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.2)',
    borderRadius: 8,
    padding: 8,
    gap: 5,
  },
  welcomePerkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  welcomePerkText: {
    color: '#CFDFD6',
    fontSize: 10.5,
    fontWeight: '600',
  },
  miniReceiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  miniReceiptRowLight: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    paddingTop: 8,
  },
  miniReceiptText: {
    color: '#8A9E93',
    fontSize: 11,
    fontWeight: '600',
  },
  miniReceiptRef: {
    color: '#F2B600',
    fontSize: 10.5,
    fontWeight: '700',
  },
  welcomeProfileBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00874E',
    borderRadius: 13,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#00B368',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 135, 78, 0.4)',
      },
    }),
  },
  welcomeProfileBtnText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  welcomeSecRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  welcomeReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
  },
  welcomeReceiptBtnText: {
    color: '#8A9E93',
    fontSize: 11.5,
    fontWeight: '700',
  },
  welcomeCloseBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  welcomeCloseBtnText: {
    color: '#7E9187',
    fontSize: 11.5,
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 4,
    borderColor: '#00B368',
    ...Platform.select({
      web: {
        boxShadow: '0 0 25px rgba(0, 179, 104, 0.5)',
      },
    }),
  },
  successTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  successSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 12,
  },
  successReceiptCard: {
    width: '100%',
    backgroundColor: '#16231D',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
  },
  successReceiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  receiptValue: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  receiptValueHighlight: {
    color: COLORS.primaryLight,
    fontSize: 16,
    fontWeight: '800',
  },
  viewReceiptBtn: {
    width: '100%',
    backgroundColor: '#00874E',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  viewReceiptBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  doneBtn: {
    paddingVertical: 10,
  },
  doneBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  failedContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  failedIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#C62828',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  failedTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  failedSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  retryBtn: {
    width: '100%',
    backgroundColor: '#00874E',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  retryBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  closeFailedBtn: {
    paddingVertical: 10,
  },
  closeFailedBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  // Estilos do Tema Claro (Light Mode)
  sheetContainerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 -10px 35px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  sheetHeaderLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerTitleLight: {
    color: '#0E1712',
  },
  headerSubtitleLight: {
    color: '#00874E',
  },
  closeButtonLight: {
    backgroundColor: '#F0F4F2',
  },
  itemSummaryCardLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.18)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
  itemCategoryBadgeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  itemCategoryTextLight: {
    color: '#00874E',
  },
  itemTitleLight: {
    color: '#0E1712',
  },
  dividerLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  textMutedLight: {
    color: '#5A6E63',
  },
  freeFeeTextLight: {
    color: '#00874E',
  },
  totalLabelLight: {
    color: '#0E1712',
  },
  totalAmountLight: {
    color: '#00874E',
  },
  phoneSectionLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  phoneSectionTitleLight: {
    color: '#0E1712',
  },
  changePhoneTextLight: {
    color: '#00874E',
  },
  phoneInputContainerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  countryBadgeLight: {
    borderRightColor: 'rgba(0, 135, 78, 0.18)',
  },
  countryCodeLight: {
    color: '#0E1712',
  },
  phoneInputLight: {
    color: '#0E1712',
  },
  pendingHeadingLight: {
    color: '#0E1712',
  },
  pendingInstructionsLight: {
    color: '#5A6E63',
  },
  timerBadgeLight: {
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    borderColor: 'rgba(242, 182, 0, 0.4)',
  },
  simulationCardLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  simulationTitleLight: {
    color: '#A07000',
  },
  cancelBtnTextLight: {
    color: '#00874E',
  },
  successTitleLight: {
    color: '#0E1712',
  },
  successSubtitleLight: {
    color: '#5A6E63',
  },
  successReceiptCardLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  receiptValueLight: {
    color: '#0E1712',
  },
  failedTitleLight: {
    color: '#0E1712',
  },
});
