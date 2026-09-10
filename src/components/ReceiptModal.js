import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { X, CheckCircle2, ShieldCheck, Download, Share2, QrCode } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { useAppTheme } from '../context/ThemeContext';

export default function ReceiptModal({ visible, onClose, transaction, isDark }) {
  const themeContext = useAppTheme?.();
  const isEffectiveDark = isDark !== undefined ? isDark : (themeContext?.isDark ?? true);

  if (!visible || !transaction) return null;

  const safeTx = transaction || {
    amount: 0,
    date: '',
    phone: '',
    sibsRef: '',
    authCode: '',
    title: '',
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.cardContainer, !isEffectiveDark && styles.cardContainerLight]}>
          {/* Header */}
          <View style={[styles.header, !isEffectiveDark && styles.headerLight]}>
            <View style={styles.brandRow}>
              <View style={styles.mbwayLogoBadge}>
                <Text style={styles.mbwayLogoText}>MB</Text>
                <View style={styles.mbwayRedDot} />
                <Text style={styles.mbwayLogoSub}>WAY</Text>
              </View>
              <Text style={[styles.headerTitle, !isEffectiveDark && styles.headerTitleLight]}>Comprovativo Oficial</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, !isEffectiveDark && styles.closeBtnLight]}>
              <X size={20} color={isEffectiveDark ? COLORS.textSecondary : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {/* Stamp Status */}
            <View style={styles.stampBox}>
              <CheckCircle2 size={32} color={isEffectiveDark ? COLORS.primaryLight : '#00874E'} />
              <Text style={[styles.stampTitle, !isEffectiveDark && styles.textDark]}>Transação Autorizada</Text>
              <Text style={[styles.stampSub, !isEffectiveDark && styles.textMutedDark]}>Rede SIBS Portugal · Grupo 39 RAFC</Text>
            </View>

            {/* Total Amount Box */}
            <View style={[styles.amountBox, !isEffectiveDark && styles.amountBoxLight]}>
              <Text style={[styles.amountLabel, !isEffectiveDark && styles.textMutedDark]}>Valor Liquidado</Text>
              <Text style={[styles.amountText, !isEffectiveDark && styles.amountTextLight]}>{transaction.amount.toFixed(2)} €</Text>
              <Text style={[styles.amountStatus, !isEffectiveDark && styles.amountStatusLight]}>Processado com Sucesso</Text>
            </View>

            {/* Details Table */}
            <View style={[styles.detailsList, !isEffectiveDark && styles.detailsListLight]}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailKey, !isEffectiveDark && styles.textMutedDark]}>Descrição:</Text>
                <Text style={[styles.detailVal, !isEffectiveDark && styles.textDark]}>{transaction.title}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailKey, !isEffectiveDark && styles.textMutedDark]}>Data & Hora:</Text>
                <Text style={[styles.detailVal, !isEffectiveDark && styles.textDark]}>{transaction.date}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailKey, !isEffectiveDark && styles.textMutedDark]}>N.º Telemóvel:</Text>
                <Text style={[styles.detailVal, !isEffectiveDark && styles.textDark]}>+351 {transaction.phone}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailKey, !isEffectiveDark && styles.textMutedDark]}>Entidade Beneficiária:</Text>
                <Text style={[styles.detailVal, !isEffectiveDark && styles.textDark]}>Claque Oficial Grupo 39</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailKey, !isEffectiveDark && styles.textMutedDark]}>NIF Institucional:</Text>
                <Text style={[styles.detailVal, !isEffectiveDark && styles.textDark]}>501 239 840</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailKey, !isEffectiveDark && styles.textMutedDark]}>ID Transação SIBS:</Text>
                <Text style={[styles.detailVal, styles.mono, !isEffectiveDark && styles.monoLight]}>
                  {transaction.sibsRef || 'SIBS-PT-039-98214'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailKey, !isEffectiveDark && styles.textMutedDark]}>Código de Autorização:</Text>
                <Text style={[styles.detailVal, styles.mono, !isEffectiveDark && styles.monoLight]}>
                  {transaction.authCode || 'AUT-78942'}
                </Text>
              </View>
            </View>

            {/* QR de Validação de Torniquete / Bilhética */}
            <View style={[styles.qrValidationCard, !isEffectiveDark && styles.qrValidationCardLight]}>
              <View style={[styles.qrBox, !isEffectiveDark && styles.qrBoxLight]}>
                <QrCode size={44} color={isEffectiveDark ? COLORS.primaryLight : '#00874E'} />
              </View>
              <View style={styles.qrInfo}>
                <Text style={[styles.qrTitle, !isEffectiveDark && styles.textDark]}>Código Digital Único</Text>
                <Text style={[styles.qrDesc, !isEffectiveDark && styles.textMutedDark]}>
                  Apresenta este QR code no torniquete de acesso ou guarda o PDF.
                </Text>
              </View>
            </View>

            <View style={styles.sealRow}>
              <ShieldCheck size={14} color={isEffectiveDark ? COLORS.primaryLight : '#00874E'} />
              <Text style={[styles.sealText, !isEffectiveDark && styles.textMutedDark]}>
                Documento emitido eletronicamente conforme diretiva SIBS MB WAY.
              </Text>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => alert('Comprovativo descarregado em formato PDF com sucesso!')}
              activeOpacity={0.8}
            >
              <Download size={16} color="#FFF" />
              <Text style={styles.actionBtnText}>Guardar PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnOutline]}
              onPress={() => alert('Link de partilha do comprovativo copiado!')}
              activeOpacity={0.8}
            >
              <Share2 size={16} color={COLORS.primaryLight} />
              <Text style={[styles.actionBtnText, { color: COLORS.primaryLight }]}>
                Partilhar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 8, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#111A15',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mbwayLogoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004B87',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mbwayLogoText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  mbwayRedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E31B23',
    marginHorizontal: 1,
    marginBottom: 3,
  },
  mbwayLogoSub: {
    color: '#00A3E0',
    fontSize: 11,
    fontWeight: '800',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  content: {
    padding: 20,
  },
  stampBox: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  stampTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
  },
  stampSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  amountBox: {
    backgroundColor: '#16231D',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
    marginVertical: 14,
  },
  amountLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  amountText: {
    color: COLORS.primaryLight,
    fontSize: 28,
    fontWeight: '900',
    marginVertical: 4,
  },
  amountStatus: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  detailsList: {
    backgroundColor: '#141E18',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 10,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailKey: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  detailVal: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '60%',
  },
  mono: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: COLORS.textGold,
  },
  qrValidationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#19261F',
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.2)',
    marginBottom: 14,
  },
  qrBox: {
    backgroundColor: '#0D1410',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  qrInfo: {
    flex: 1,
  },
  qrTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },
  qrDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  sealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sealText: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#00874E',
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Estilos Light
  cardContainerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 35px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  headerLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerTitleLight: {
    color: '#0E1712',
  },
  closeBtnLight: {
    backgroundColor: '#F0F4F2',
  },
  amountBoxLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  amountTextLight: {
    color: '#00874E',
  },
  amountStatusLight: {
    color: '#00874E',
  },
  detailsListLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#5A6E63',
  },
  monoLight: {
    color: '#00874E',
  },
  qrValidationCardLight: {
    backgroundColor: '#F7FAF8',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  qrBoxLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
});
