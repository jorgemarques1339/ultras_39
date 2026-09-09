import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import {
  X,
  Smartphone,
  CheckCircle2,
  Download,
  WifiOff,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export default function WalletPassModal({ visible, onClose, user }) {
  const [walletType, setWalletType] = useState('apple'); // 'apple' | 'google'
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToWallet = () => {
    setIsSaved(true);
    setTimeout(() => {
      alert(
        walletType === 'apple'
          ? 'Cartão oficial do Grupo 39 adicionado com sucesso à tua Apple Wallet! Disponível no teu iPhone e Apple Watch.'
          : 'Cartão oficial do Grupo 39 adicionado com sucesso à tua Carteira do Google! Disponível no teu dispositivo Android.'
      );
    }, 400);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header do Modal */}
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderLeft}>
              <Smartphone size={20} color={COLORS.gold} />
              <Text style={styles.sheetTitle}>Passe Oficial de Carteira</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.sheetScroll} showsVerticalScrollIndicator={false}>
            {/* Alternador Apple Wallet vs Google Wallet */}
            <View style={styles.walletToggleRow}>
              <TouchableOpacity
                style={[styles.walletToggleBtn, walletType === 'apple' && styles.walletToggleActive]}
                onPress={() => setWalletType('apple')}
                activeOpacity={0.8}
              >
                <Text style={styles.walletToggleIcon}></Text>
                <Text style={[styles.walletToggleText, walletType === 'apple' && styles.walletToggleTextActive]}>
                  Apple Wallet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.walletToggleBtn, walletType === 'google' && styles.walletToggleActive]}
                onPress={() => setWalletType('google')}
                activeOpacity={0.8}
              >
                <Text style={styles.walletToggleIcon}>G</Text>
                <Text style={[styles.walletToggleText, walletType === 'google' && styles.walletToggleTextActive]}>
                  Google Wallet
                </Text>
              </TouchableOpacity>
            </View>

            {/* Visualização do Passe Digital (.pkpass) */}
            <View style={styles.passCard}>
              <View style={styles.passTopRibbon}>
                <View style={styles.passBrand}>
                  <Text style={styles.passBrandLetters}>G39</Text>
                  <View>
                    <Text style={styles.passClubTitle}>RIO AVE F.C.</Text>
                    <Text style={styles.passClaqueTitle}>GRUPO 39 · SÓCIO</Text>
                  </View>
                </View>
                <View style={styles.passTypeTag}>
                  <Text style={styles.passTypeTagText}>TORNIQUETE NFC</Text>
                </View>
              </View>

              <View style={styles.passDivider} />

              <View style={styles.passBodyRow}>
                <View style={styles.passField}>
                  <Text style={styles.passLabel}>ASSOCIADO</Text>
                  <Text style={styles.passValue} numberOfLines={1}>{user.name}</Text>
                </View>
                <View style={styles.passFieldRight}>
                  <Text style={styles.passLabel}>N.º SÓCIO</Text>
                  <Text style={styles.passValueGold}>#{user.memberNumber}</Text>
                </View>
              </View>

              <View style={styles.passBodyRow}>
                <View style={styles.passField}>
                  <Text style={styles.passLabel}>BANCADA / SETOR</Text>
                  <Text style={styles.passValue}>Bancada Poente · Porta 4</Text>
                </View>
                <View style={styles.passFieldRight}>
                  <Text style={styles.passLabel}>ESTADO</Text>
                  <Text style={styles.passValueGreen}>QUOTA EM DIA</Text>
                </View>
              </View>

              {/* Código de Barras / Torniquete Simulado */}
              <View style={styles.barcodeBox}>
                <View style={styles.barcodeLinesContainer}>
                  {/* Linhas simuladas de código de barras Code128 */}
                  {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 3, 6, 2, 4, 1, 5, 3, 2, 6, 4, 1, 3].map((w, i) => (
                    <View
                      key={i}
                      style={[
                        styles.barcodeBar,
                        { width: w * 2.2, opacity: i % 2 === 0 ? 1 : 0.4 }
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.barcodeNumber}>G39-{user.memberNumber}-2026-NFC-RAFC</Text>
                <View style={styles.offlineNotice}>
                  <WifiOff size={11} color={COLORS.textMuted} />
                  <Text style={styles.offlineNoticeText}>Funciona 100% offline nos torniquetes dos Arcos</Text>
                </View>
              </View>
            </View>

            {/* Informações de Vantagem */}
            <View style={styles.benefitsBox}>
              <View style={styles.benefitItem}>
                <CheckCircle2 size={15} color={COLORS.primaryLight} />
                <Text style={styles.benefitText}>Acesso direto por aproximação no leitor NFC</Text>
              </View>
              <View style={styles.benefitItem}>
                <CheckCircle2 size={15} color={COLORS.primaryLight} />
                <Text style={styles.benefitText}>Atualização automática ao pagar quotas via MB WAY</Text>
              </View>
              <View style={styles.benefitItem}>
                <CheckCircle2 size={15} color={COLORS.primaryLight} />
                <Text style={styles.benefitText}>Notificações no ecrã de bloqueio nos dias de jogo</Text>
              </View>
            </View>

            {/* Botão de Adicionar à Carteira */}
            <TouchableOpacity
              style={[
                styles.saveWalletBtn,
                walletType === 'apple' ? styles.appleBtn : styles.googleBtn,
                isSaved && styles.savedBtn
              ]}
              onPress={handleSaveToWallet}
              activeOpacity={0.85}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 size={18} color="#FFF" />
                  <Text style={styles.saveWalletBtnText}>Adicionado à Carteira</Text>
                </>
              ) : (
                <>
                  <Download size={18} color="#FFF" />
                  <Text style={styles.saveWalletBtnText}>
                    {walletType === 'apple' ? 'Adicionar à Apple Wallet' : 'Guardar no Google Wallet'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
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
  sheetContainer: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: '#0D1410',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  sheetScroll: {
    padding: 16,
    paddingBottom: 30,
  },
  walletToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  walletToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#14201A',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  walletToggleActive: {
    backgroundColor: '#1B2E24',
    borderColor: COLORS.primaryLight,
  },
  walletToggleIcon: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  walletToggleText: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  walletToggleTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  passCard: {
    backgroundColor: '#07100B',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#00874E',
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 135, 78, 0.25)',
      },
    }),
  },
  passTopRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  passBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  passBrandLetters: {
    backgroundColor: '#00874E',
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  passClubTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  passClaqueTitle: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
  },
  passTypeTag: {
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.4)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  passTypeTagText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '800',
  },
  passDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  passBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  passField: {
    flex: 1,
  },
  passFieldRight: {
    alignItems: 'flex-end',
  },
  passLabel: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  passValue: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  passValueGold: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '900',
  },
  passValueGreen: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '800',
  },
  barcodeBox: {
    backgroundColor: '#030805',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  barcodeLinesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    gap: 3,
    marginBottom: 6,
  },
  barcodeBar: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 1,
  },
  barcodeNumber: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  offlineNoticeText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
  benefitsBox: {
    backgroundColor: '#121C16',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    fontWeight: '500',
    flex: 1,
  },
  saveWalletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
      },
    }),
  },
  appleBtn: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  googleBtn: {
    backgroundColor: '#1A73E8',
  },
  savedBtn: {
    backgroundColor: '#00874E',
  },
  saveWalletBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
