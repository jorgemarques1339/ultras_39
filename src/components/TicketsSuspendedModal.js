import React, { memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Store, AlertCircle, MapPin, X } from 'lucide-react-native';

function TicketsSuspendedModal({ visible, onClose, isDark = true }) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.card, !isDark && styles.cardLight]}>
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, !isDark && styles.iconBoxLight]}>
                <Store size={19} color={isDark ? '#00E676' : '#00874E'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, !isDark && styles.textDark]}>
                  Bilhetes & Deslocações
                </Text>
                <Text style={[styles.sub, !isDark && styles.textMutedDark]}>
                  Compra na app temporariamente suspensa
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              activeOpacity={0.7}
            >
              <X size={16} color={isDark ? '#A0B4AA' : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={[styles.alertBox, !isDark && styles.alertBoxLight]}>
              <AlertCircle size={18} color={isDark ? '#FFB74D' : '#D97706'} />
              <Text style={[styles.message, !isDark && styles.textDark]}>
                De momento, a compra de bilhetes e deslocações pela aplicação está suspensa. Para garantires o teu lugar, dirige-te à Loja do Rio Ave FC para dares o teu nome e efetuares o pagamento diretamente na loja.
              </Text>
            </View>

            <View style={[styles.storeRow, !isDark && styles.storeRowLight]}>
              <MapPin size={15} color={isDark ? '#00E676' : '#00874E'} />
              <Text style={[styles.storeText, !isDark && styles.textDark]}>
                Loja Oficial do Rio Ave FC · Estádio dos Arcos
              </Text>
            </View>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
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
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  card: {
    backgroundColor: '#0D1410',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    overflow: 'hidden',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.2)',
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
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxLight: {
    backgroundColor: '#EBF7F0',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
  },
  sub: {
    color: '#8FA89B',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 1,
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
  body: {
    padding: 18,
    paddingBottom: 28,
    gap: 12,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(255, 183, 77, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 77, 0.28)',
    borderRadius: 14,
    padding: 14,
  },
  alertBoxLight: {
    backgroundColor: '#FFFBEB',
    borderColor: 'rgba(217, 119, 6, 0.25)',
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '600',
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#121E18',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },
  storeRowLight: {
    backgroundColor: '#F3F8F5',
    borderColor: 'rgba(0, 135, 78, 0.16)',
  },
  storeText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: '#00874E',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  doneBtnText: {
    color: '#FFFFFF',
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

export default memo(TicketsSuspendedModal);
