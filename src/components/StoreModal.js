import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {
  X,
  ShoppingBag,
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { STORE_PRODUCTS } from '../data/mockData';

export default function StoreModal({ visible, onClose, onCheckoutItem }) {
  const [selectedProduct, setSelectedProduct] = useState(STORE_PRODUCTS[0]);
  const [selectedSize, setSelectedSize] = useState(STORE_PRODUCTS[0].sizes[0]);

  const handleProductSelect = (item) => {
    setSelectedProduct(item);
    setSelectedSize(item.sizes[0]);
  };

  const handleBuy = () => {
    onClose();
    onCheckoutItem({
      title: `${selectedProduct.title} (${selectedSize})`,
      category: `Loja Oficial G39 · ${selectedProduct.category}`,
      amount: selectedProduct.price,
      originalPrice: selectedProduct.price + 3.00,
      discount: 3.00,
      type: 'store',
    });
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
          {/* Header da Loja */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBox}>
                <ShoppingBag size={18} color={COLORS.gold} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Loja Oficial Grupo 39</Text>
                <Text style={styles.headerSubtitle}>Merchandising Oficial com Pagamento MB WAY</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {/* Seletor Horizontal de Produtos */}
            <Text style={styles.sectionLabel}>Catálogo de Artigos da Claque</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsGrid}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={Platform.OS !== 'web'}
              overScrollMode="never"
            >
              {STORE_PRODUCTS.map((prod) => {
                const isSelected = prod.id === selectedProduct.id;
                return (
                  <TouchableOpacity
                    key={prod.id}
                    style={[styles.productMiniCard, isSelected && styles.productMiniCardActive]}
                    onPress={() => handleProductSelect(prod)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: prod.image }} style={styles.productMiniImg} />
                    <View style={styles.productMiniInfo}>
                      <Text style={styles.productMiniPrice}>{prod.price.toFixed(2)} €</Text>
                      <Text style={styles.productMiniTitle} numberOfLines={2}>{prod.title}</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.selectedTick}>
                        <Check size={12} color="#FFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Ficha Detalhada do Produto Selecionado */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <View style={styles.badgePill}>
                  <Sparkles size={11} color={COLORS.gold} />
                  <Text style={styles.badgePillText}>{selectedProduct.badge}</Text>
                </View>
                <Text style={styles.categoryName}>{selectedProduct.category}</Text>
              </View>

              <Text style={styles.detailTitle}>{selectedProduct.title}</Text>
              <Text style={styles.detailDesc}>{selectedProduct.description}</Text>

              {/* Preço e Desconto de Sócio */}
              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.priceNumber}>{selectedProduct.price.toFixed(2)} €</Text>
                  <Text style={styles.memberDiscount}>{selectedProduct.memberDiscount}</Text>
                </View>
                <View style={styles.inStockBadge}>
                  <ShieldCheck size={14} color={COLORS.primaryLight} />
                  <Text style={styles.inStockText}>Disponível na Sede</Text>
                </View>
              </View>

              {/* Seletor de Tamanho */}
              <Text style={styles.sizeLabel}>Tamanho / Formato</Text>
              <View style={styles.sizeOptionsRow}>
                {selectedProduct.sizes.map((sz) => (
                  <TouchableOpacity
                    key={sz}
                    style={[styles.sizeOption, selectedSize === sz && styles.sizeOptionActive]}
                    onPress={() => setSelectedSize(sz)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.sizeOptionText, selectedSize === sz && styles.sizeOptionTextActive]}>
                      {sz}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Botão de Compra via MB WAY */}
              <TouchableOpacity style={styles.buyMbWayBtn} onPress={handleBuy} activeOpacity={0.85}>
                <View style={styles.mbWayLogoSmall}>
                  <Text style={styles.mbWayLogoText}>MB</Text>
                </View>
                <Text style={styles.buyMbWayBtnText}>Comprar via MB WAY ({selectedProduct.price.toFixed(2)} €)</Text>
                <ChevronRight size={18} color="#FFF" />
              </TouchableOpacity>
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
    maxHeight: '90%',
    backgroundColor: '#0D1410',
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
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
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
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productsGrid: {
    gap: 12,
    paddingBottom: 16,
  },
  productMiniCard: {
    width: 140,
    backgroundColor: '#131F19',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    position: 'relative',
  },
  productMiniCardActive: {
    borderColor: COLORS.primaryLight,
    borderWidth: 1.5,
    backgroundColor: '#182B21',
  },
  productMiniImg: {
    width: '100%',
    height: 95,
    resizeMode: 'cover',
  },
  productMiniInfo: {
    padding: 10,
  },
  productMiniPrice: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '900',
  },
  productMiniTitle: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 15,
  },
  selectedTick: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#00874E',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCard: {
    backgroundColor: '#111A15',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePillText: {
    color: COLORS.gold,
    fontSize: 9.5,
    fontWeight: '800',
  },
  categoryName: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  detailTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  detailDesc: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B120E',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  priceNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
  },
  memberDiscount: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  inStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  inStockText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '600',
  },
  sizeLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sizeOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  sizeOption: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#19261F',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sizeOptionActive: {
    backgroundColor: '#00874E',
    borderColor: '#00B368',
  },
  sizeOptionText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    fontWeight: '700',
  },
  sizeOptionTextActive: {
    color: '#FFF',
  },
  buyMbWayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00874E',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00B368',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 135, 78, 0.4)',
      },
    }),
  },
  mbWayLogoSmall: {
    backgroundColor: '#E60000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mbWayLogoText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  buyMbWayBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
});
