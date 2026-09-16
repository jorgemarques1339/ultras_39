import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import {
  X,
  Ticket,
  Bus,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  User,
  CreditCard,
  ChevronRight,
  Receipt,
  FileText,
  Trash2,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

// Representação de Código de Barras Vetorial Realista
function VectorBarcode({ code = 'G39-TKT-2026-8941', color = '#FFFFFF' }) {
  const bars = [
    3, 1, 2, 1, 3, 2, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2,
    3, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2,
  ];

  return (
    <View style={styles.barcodeContainer}>
      <View style={styles.barcodeLinesRow}>
        {bars.map((w, idx) => (
          <View
            key={idx}
            style={{
              width: w,
              height: 44,
              backgroundColor: color,
              marginHorizontal: 1,
              borderRadius: 0.5,
              opacity: idx % 7 === 0 ? 0.45 : 0.95,
            }}
          />
        ))}
      </View>
      <Text style={[styles.barcodeText, { color }]}>{code}</Text>
    </View>
  );
}

// Representação de QR Code Digital de Alta Resolução Vetorial
function DigitalQrCode({ size = 150, isDark = true }) {
  const qrColor = isDark ? '#FFFFFF' : '#0D1A13';
  return (
    <View style={[styles.qrWrapper, !isDark && styles.qrWrapperLight]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Cantos de Localização (Finder Patterns) */}
        {/* Top-Left */}
        <Rect x="6" y="6" width="26" height="26" rx="4" fill={qrColor} />
        <Rect x="10" y="10" width="18" height="18" rx="2" fill={isDark ? '#14201A' : '#FFFFFF'} />
        <Rect x="14" y="14" width="10" height="10" rx="1.5" fill="#00E676" />

        {/* Top-Right */}
        <Rect x="68" y="6" width="26" height="26" rx="4" fill={qrColor} />
        <Rect x="72" y="10" width="18" height="18" rx="2" fill={isDark ? '#14201A' : '#FFFFFF'} />
        <Rect x="76" y="14" width="10" height="10" rx="1.5" fill="#00E676" />

        {/* Bottom-Left */}
        <Rect x="6" y="68" width="26" height="26" rx="4" fill={qrColor} />
        <Rect x="10" y="72" width="18" height="18" rx="2" fill={isDark ? '#14201A' : '#FFFFFF'} />
        <Rect x="14" y="76" width="10" height="10" rx="1.5" fill="#00E676" />

        {/* Matriz de Dados QR */}
        <Rect x="38" y="8" width="6" height="6" fill={qrColor} />
        <Rect x="48" y="8" width="6" height="6" fill={qrColor} />
        <Rect x="58" y="8" width="6" height="6" fill={qrColor} />
        <Rect x="38" y="18" width="6" height="6" fill={qrColor} />
        <Rect x="52" y="18" width="6" height="6" fill={qrColor} />
        <Rect x="44" y="26" width="6" height="6" fill={qrColor} />
        <Rect x="56" y="26" width="6" height="6" fill={qrColor} />

        <Rect x="8" y="38" width="6" height="6" fill={qrColor} />
        <Rect x="18" y="38" width="6" height="6" fill={qrColor} />
        <Rect x="26" y="44" width="6" height="6" fill={qrColor} />
        <Rect x="8" y="52" width="6" height="6" fill={qrColor} />
        <Rect x="20" y="56" width="6" height="6" fill={qrColor} />

        {/* Centro & Logo Micro Badge */}
        <Rect x="36" y="36" width="28" height="28" rx="4" fill="#00874E" />
        <Path
          d="M44 50 L48 54 L56 44"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dados Inferiores e Direitos */}
        <Rect x="68" y="38" width="6" height="6" fill={qrColor} />
        <Rect x="82" y="44" width="6" height="6" fill={qrColor} />
        <Rect x="74" y="52" width="6" height="6" fill={qrColor} />
        <Rect x="88" y="56" width="6" height="6" fill={qrColor} />

        <Rect x="38" y="68" width="6" height="6" fill={qrColor} />
        <Rect x="48" y="74" width="6" height="6" fill={qrColor} />
        <Rect x="58" y="70" width="6" height="6" fill={qrColor} />
        <Rect x="44" y="82" width="6" height="6" fill={qrColor} />
        <Rect x="54" y="88" width="6" height="6" fill={qrColor} />

        <Rect x="68" y="68" width="6" height="6" fill={qrColor} />
        <Rect x="76" y="76" width="6" height="6" fill={qrColor} />
        <Rect x="86" y="82" width="6" height="6" fill={qrColor} />
        <Rect x="72" y="88" width="6" height="6" fill={qrColor} />
      </Svg>
    </View>
  );
}

export default function BilheteModal({
  visible,
  onClose,
  ticket,
  nextMatch,
  user,
  isDark = true,
  onViewReceipt,
  onDeleteTicket,
}) {
  if (!visible) return null;

  const isBusPack =
    ticket?.type === 'bus' ||
    ticket?.type === 'caravan' ||
    ticket?.title?.toLowerCase().includes('deslocação') ||
    ticket?.title?.toLowerCase().includes('autocarro');

  const matchTitle =
    ticket?.matchTitle ||
    (nextMatch
      ? `${nextMatch.homeTeam?.name || 'FC Alverca'} vs ${nextMatch.awayTeam?.name || 'Rio Ave FC'}`
      : 'FC Alverca vs Rio Ave FC');

  const matchDate =
    ticket?.matchDate || nextMatch?.dateFormatted || '19 Setembro 2026 · 18:00';

  const stadium =
    ticket?.stadium || nextMatch?.stadium || 'Complexo Desportivo FC Alverca';

  const sector =
    ticket?.sector ||
    (nextMatch?.isHome
      ? 'Bancada Poente · Porta 3 (Setor Grupo 39)'
      : 'Setor Visitante Oficial (Bancada Poente G39)');

  const ticketCode =
    ticket?.authCode ||
    ticket?.sibsRef ||
    `G39-TKT-${(ticket?.id || '9841').slice(-6).toUpperCase()}`;

  const userName = user?.name || 'Adepto do Rio Ave FC';
  const memberText = user?.memberNumber
    ? `Sócio #${user.memberNumber}`
    : 'Adepto Convidado';

  const priceText = ticket?.amount
    ? `${Number(ticket.amount).toFixed(2)} €`
    : '7.50 €';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            !isDark && styles.modalContainerLight,
          ]}
        >
          {/* Header Superior */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.headerIconBox,
                  isBusPack && styles.headerIconBoxBus,
                  !isDark && styles.headerIconBoxLight,
                ]}
              >
                {isBusPack ? (
                  <Bus size={18} color="#00E676" />
                ) : (
                  <Ticket size={18} color="#00E676" />
                )}
              </View>
              <View>
                <Text style={[styles.headerTitle, !isDark && styles.textDark]}>
                  {isBusPack ? 'Pack Deslocação Oficial' : 'Bilhete Oficial de Jogo'}
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    !isDark && styles.headerSubtitleLight,
                  ]}
                >
                  Grupo 39 · Rio Ave FC
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              activeOpacity={0.8}
            >
              <X size={20} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* CARTÃO DE BILHETE ESTILO STADIUM PASS */}
            <View
              style={[
                styles.ticketCard,
                !isDark && styles.ticketCardLight,
              ]}
            >
              {/* Top Banner do Jogo */}
              <View style={styles.ticketTopBanner}>
                <View style={styles.compBadge}>
                  <Text style={styles.compBadgeText}>
                    {nextMatch?.competition || 'LIGA PORTUGAL BETCLIC'}
                  </Text>
                </View>
                <View style={styles.activeStatusBadge}>
                  <CheckCircle2 size={12} color="#00E676" />
                  <Text style={styles.activeStatusText}>VÁLIDO & ATIVO</Text>
                </View>
              </View>

              {/* Confronto e Equipas */}
              <View style={styles.matchRow}>
                <Text
                  style={[styles.matchTitleText, !isDark && styles.textDark]}
                  numberOfLines={2}
                >
                  {matchTitle}
                </Text>
                <Text
                  style={[styles.matchSubText, !isDark && styles.textMutedDark]}
                >
                  {isBusPack
                    ? 'Pack Caravana G39 · Autocarro + Bilhete Visitante'
                    : 'Acesso Oficial à Bancada Poente'}
                </Text>
              </View>

              {/* Informações de Local e Horário */}
              <View
                style={[
                  styles.matchInfoRow,
                  !isDark && styles.matchInfoRowLight,
                ]}
              >
                <View style={styles.matchInfoItem}>
                  <Calendar size={13} color={COLORS.primaryLight} />
                  <Text
                    style={[
                      styles.matchInfoText,
                      !isDark && styles.textDark,
                    ]}
                  >
                    {matchDate}
                  </Text>
                </View>
                <View style={styles.matchInfoItem}>
                  <MapPin size={13} color={COLORS.primaryLight} />
                  <Text
                    style={[
                      styles.matchInfoText,
                      !isDark && styles.textDark,
                    ]}
                    numberOfLines={1}
                  >
                    {stadium}
                  </Text>
                </View>
              </View>

              {/* PERFORAÇÃO DE CORTE DO BILHETE (TICKET NOTCHES) */}
              <View style={styles.cutDividerWrapper}>
                <View
                  style={[
                    styles.leftNotch,
                    !isDark && styles.notchLight,
                  ]}
                />
                <View style={styles.dashedLine} />
                <View
                  style={[
                    styles.rightNotch,
                    !isDark && styles.notchLight,
                  ]}
                />
              </View>

              {/* SECÇÃO QR CODE DE VALIDAÇÃO NO TORNIQUETE */}
              <View style={styles.qrSection}>
                <DigitalQrCode size={145} isDark={isDark} />
                <Text
                  style={[styles.qrScanNotice, !isDark && styles.textDark]}
                >
                  Apresenta este código no torniquete de entrada
                </Text>
                <Text
                  style={[
                    styles.qrScanSub,
                    !isDark && styles.textMutedDark,
                  ]}
                >
                  Válido para 1 entrada direta no estádio
                </Text>

                {/* Código de Barras Realista */}
                <VectorBarcode
                  code={ticketCode}
                  color={isDark ? '#E0F2E9' : '#1A2E22'}
                />
              </View>

              {/* SEPARADOR SUTIL */}
              <View
                style={[
                  styles.innerSeparator,
                  !isDark && styles.innerSeparatorLight,
                ]}
              />

              {/* GRELHA DE DETALHES DO BILHETE / TITULAR */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text
                    style={[
                      styles.detailLabel,
                      !isDark && styles.textMutedDark,
                    ]}
                  >
                    TITULAR
                  </Text>
                  <Text
                    style={[styles.detailValue, !isDark && styles.textDark]}
                    numberOfLines={1}
                  >
                    {userName}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text
                    style={[
                      styles.detailLabel,
                      !isDark && styles.textMutedDark,
                    ]}
                  >
                    CATEGORIA
                  </Text>
                  <Text
                    style={[styles.detailValue, !isDark && styles.textDark]}
                    numberOfLines={1}
                  >
                    {memberText}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text
                    style={[
                      styles.detailLabel,
                      !isDark && styles.textMutedDark,
                    ]}
                  >
                    SETOR / BANCADA
                  </Text>
                  <Text
                    style={[
                      styles.detailValueGreen,
                      !isDark && styles.detailValueGreenLight,
                    ]}
                    numberOfLines={1}
                  >
                    {sector}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text
                    style={[
                      styles.detailLabel,
                      !isDark && styles.textMutedDark,
                    ]}
                  >
                    VALOR LIQUIDADO
                  </Text>
                  <Text
                    style={[
                      styles.detailValuePrice,
                      !isDark && styles.detailValuePriceLight,
                    ]}
                  >
                    {priceText}
                  </Text>
                </View>
              </View>

              {/* SE FOR DESLOCAÇÃO: CAIXA COM HORÁRIO E LOCAL DO AUTOCARRO */}
              {isBusPack && (
                <View
                  style={[
                    styles.busScheduleCard,
                    !isDark && styles.busScheduleCardLight,
                  ]}
                >
                  <View style={styles.busScheduleHeader}>
                    <Bus size={15} color="#00E676" />
                    <Text style={styles.busScheduleTitle}>
                      Embarque na Caravana Grupo 39
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.busScheduleText,
                      !isDark && styles.textDark,
                    ]}
                  >
                    📍 Ponto de Encontro: Estádio dos Arcos (Porta 1)
                  </Text>
                  <Text
                    style={[
                      styles.busScheduleText,
                      !isDark && styles.textDark,
                    ]}
                  >
                    ⏰ Partida do Autocarro: 13:30 (Comparecer às 13:15)
                  </Text>
                  <Text style={styles.busScheduleNotice}>
                    * Apresenta este bilhete digital ao coordenador de autocarro ao embarcar.
                  </Text>
                </View>
              )}
            </View>

            {/* BOTÕES DE AÇÃO INFERIORES */}
            <View style={styles.actionButtonsCol}>
              {onViewReceipt && (
                <TouchableOpacity
                  style={[
                    styles.receiptBtn,
                    !isDark && styles.receiptBtnLight,
                  ]}
                  onPress={() => {
                    onClose();
                    onViewReceipt(ticket);
                  }}
                  activeOpacity={0.8}
                >
                  <FileText size={16} color={COLORS.primaryLight} />
                  <Text
                    style={[
                      styles.receiptBtnText,
                      !isDark && styles.textDark,
                    ]}
                  >
                    Ver Comprovativo MB WAY (SIBS)
                  </Text>
                  <ChevronRight
                    size={14}
                    color={isDark ? COLORS.textMuted : '#7E9187'}
                  />
                </TouchableOpacity>
              )}

              {onDeleteTicket && (
                <TouchableOpacity
                  style={[
                    styles.deleteTicketBtn,
                    !isDark && styles.deleteTicketBtnLight,
                  ]}
                  onPress={() => {
                    onDeleteTicket(ticket);
                    onClose();
                  }}
                  activeOpacity={0.8}
                >
                  <Trash2 size={16} color="#FF5252" />
                  <Text style={styles.deleteTicketBtnText}>
                    Apagar Bilhete
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.closePrimaryBtn}
                onPress={onClose}
                activeOpacity={0.85}
              >
                <Text style={styles.closePrimaryBtnText}>Fechar Bilhete</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 7, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '92%',
    backgroundColor: '#0F1A14',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.28)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.65), 0 0 20px rgba(0, 179, 104, 0.2)',
      },
    }),
  },
  modalContainerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#122018',
  },
  headerLight: {
    backgroundColor: '#F3FAF6',
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBoxBus: {
    backgroundColor: 'rgba(0, 230, 118, 0.18)',
  },
  headerIconBoxLight: {
    backgroundColor: '#E6F7EE',
    borderColor: 'rgba(0, 135, 78, 0.3)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  headerSubtitle: {
    color: '#7E9689',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 1,
  },
  headerSubtitleLight: {
    color: '#5A6E63',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // Ticket Card
  ticketCard: {
    backgroundColor: '#14221A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  ticketCardLight: {
    backgroundColor: '#F7FCF9',
    borderColor: 'rgba(0, 135, 78, 0.22)',
  },
  ticketTopBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
  },
  compBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  compBadgeText: {
    color: '#00E676',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  activeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 230, 118, 0.14)',
    paddingHorizontal: 7.5,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: 'rgba(0, 230, 118, 0.35)',
  },
  activeStatusText: {
    color: '#00E676',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  matchRow: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  matchTitleText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  matchSubText: {
    color: '#8BA194',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },

  matchInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  matchInfoRowLight: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  matchInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  matchInfoText: {
    color: '#D2E3DA',
    fontSize: 11.5,
    fontWeight: '700',
  },

  // Perforated Divider (Ticket Notches)
  cutDividerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 24,
    marginVertical: 4,
  },
  leftNotch: {
    position: 'absolute',
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0F1A14',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
  },
  rightNotch: {
    position: 'absolute',
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0F1A14',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
  },
  notchLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.22)',
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    borderStyle: 'dashed',
    marginHorizontal: 16,
  },

  // QR Code Section
  qrSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: '#122018',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrWrapperLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  qrScanNotice: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  qrScanSub: {
    color: '#7E9689',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },

  // Barcode
  barcodeContainer: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  barcodeLinesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 4,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', web: 'monospace' }),
  },

  innerSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 14,
    marginVertical: 10,
  },
  innerSeparatorLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },

  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  detailItem: {
    width: '48%',
    backgroundColor: 'rgba(16, 26, 20, 0.65)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailLabel: {
    color: '#6F877B',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  detailValue: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  detailValueGreen: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  detailValueGreenLight: {
    color: '#00874E',
  },
  detailValuePrice: {
    color: '#00E676',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
  detailValuePriceLight: {
    color: '#00874E',
  },

  // Bus schedule card
  busScheduleCard: {
    marginHorizontal: 14,
    marginBottom: 14,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.25)',
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  busScheduleCardLight: {
    backgroundColor: '#EDF9F2',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  busScheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  busScheduleTitle: {
    color: '#00E676',
    fontSize: 11.5,
    fontWeight: '900',
  },
  busScheduleText: {
    color: '#E0EDE6',
    fontSize: 11,
    fontWeight: '700',
  },
  busScheduleNotice: {
    color: '#7E988A',
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 3,
    fontStyle: 'italic',
  },

  // Action buttons
  actionButtonsCol: {
    gap: 9,
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20, 32, 25, 0.85)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
  },
  receiptBtnLight: {
    backgroundColor: '#F3FAF6',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  receiptBtnText: {
    flex: 1,
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '700',
    marginLeft: 8,
  },
  deleteTicketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.12)',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.35)',
    gap: 8,
  },
  deleteTicketBtnLight: {
    backgroundColor: '#FFF0F0',
    borderColor: 'rgba(255, 82, 82, 0.3)',
  },
  deleteTicketBtnText: {
    color: '#FF5252',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  closePrimaryBtn: {
    backgroundColor: '#00874E',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePrimaryBtnText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  textDark: {
    color: '#0E1E15',
  },
  textMutedDark: {
    color: '#5A6E63',
  },
});
