import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {
  ShoppingBag,
  Truck,
  Tag,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { STORE_PRODUCTS } from '../data/mockData';

const CATEGORIES = ['Todos', 'Cachecóis', 'Vestuário', 'Acessórios', 'Autocolantes'];

export default function StoreScreen({ user, onCheckoutItem, onScroll, isDark = true }) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedSizes, setSelectedSizes] = useState({
    'prod-scarf-26': 'Tamanho Único',
    'prod-tshirt-vdc': 'L',
    'prod-cap-g39': 'Ajustável',
    'prod-stickers-pack': '10 Sortidos',
  });

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleBuy = (product) => {
    const size = selectedSizes[product.id] || (product.sizes ? product.sizes[0] : 'Único');
    if (onCheckoutItem) {
      onCheckoutItem({
        title: `${product.title} (${size})`,
        category: `Loja Oficial G39 · ${product.category}`,
        amount: product.price,
        originalPrice: product.price + 3.0,
        discount: 3.0,
        type: 'store',
      });
    }
  };

  const filteredProducts =
    activeCategory === 'Todos'
      ? STORE_PRODUCTS
      : STORE_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <ScrollView
      style={[styles.container, !isDark && styles.containerLight]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {/* 1. FILTROS DE CATEGORIAS EM CHIPS RESPONSIVOS */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesBar}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  !isDark && styles.categoryChipLight,
                  isActive && styles.categoryChipActive,
                ]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    !isDark && styles.categoryChipTextLight,
                    isActive && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. PRODUTO EM DESTAQUE ESPECIAL (CACHECOL ÉPOCA 2026/2027) */}
      {activeCategory === 'Todos' && STORE_PRODUCTS[0] && (
        <View style={[styles.featuredCard, !isDark && styles.featuredCardLight]}>
          <View style={styles.featuredBadgeRow}>
            <View style={styles.featuredGoldBadge}>
              <Tag size={12} color="#000" />
              <Text style={styles.featuredGoldBadgeText}>ARTIGO DA SEMANA</Text>
            </View>
            <Text style={styles.featuredStockText}>🟢 Em Stock na Sede</Text>
          </View>

          <View style={styles.featuredContentRow}>
            <Image
              source={{ uri: STORE_PRODUCTS[0].image }}
              style={styles.featuredImg}
            />
            <View style={styles.featuredInfo}>
              <View>
                <Text style={styles.featuredCategory}>{STORE_PRODUCTS[0].category}</Text>
                <Text style={[styles.featuredTitle, !isDark && styles.textDark]} numberOfLines={2}>
                  {STORE_PRODUCTS[0].title}
                </Text>
                <Text style={[styles.featuredDesc, !isDark && styles.textMutedDark]} numberOfLines={2}>
                  {STORE_PRODUCTS[0].description}
                </Text>
              </View>

              <View style={styles.featuredBottomAction}>
                <View style={styles.priceContainerFeatured}>
                  <View style={styles.priceRowFeatured}>
                    <Text style={styles.featuredPrice}>
                      {STORE_PRODUCTS[0].price.toFixed(2)} €
                    </Text>
                    <Text style={[styles.originalPrice, !isDark && styles.originalPriceLight]}>15,00 €</Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountBadgeText}>-20% SÓCIO</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.cardBuyBtn}
                  onPress={() => handleBuy(STORE_PRODUCTS[0])}
                  activeOpacity={0.85}
                >
                  <ShoppingBag size={14} color="#FFF" />
                  <Text style={styles.cardBuyBtnText}>Comprar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 4. GRELHA DE TODOS OS PRODUTOS */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, !isDark && styles.textDark]}>
          {activeCategory === 'Todos' ? 'Todos os Artigos' : activeCategory}
        </Text>
        <Text style={[styles.sectionCount, !isDark && styles.textMutedDark]}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'artigo' : 'artigos'}
        </Text>
      </View>

      <View style={styles.productsGrid}>
        {filteredProducts.map((product) => {
          const currentSize =
            selectedSizes[product.id] || (product.sizes ? product.sizes[0] : null);

          return (
            <View key={product.id} style={[styles.productCard, !isDark && styles.productCardLight]}>
              {/* Imagem & Badge Superior */}
              <View style={styles.productImgBox}>
                <Image source={{ uri: product.image }} style={styles.productImg} />
                <View style={styles.productBadgeOverlay}>
                  <Text style={styles.productBadgeOverlayText}>{product.badge}</Text>
                </View>
              </View>

              {/* Informações do Produto */}
              <View style={styles.productBody}>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={[styles.productTitle, !isDark && styles.textDark]} numberOfLines={2}>
                  {product.title}
                </Text>
                <Text style={[styles.productDesc, !isDark && styles.textMutedDark]} numberOfLines={2}>
                  {product.description}
                </Text>

                {/* Seleção de Tamanhos se houver múltiplos */}
                {product.sizes && product.sizes.length > 1 && (
                  <View style={styles.sizesBox}>
                    <Text style={[styles.sizesLabel, !isDark && styles.textMutedDark]}>Tamanho:</Text>
                    <View style={styles.sizesRow}>
                      {product.sizes.map((s) => {
                        const isSizeActive = currentSize === s;
                        return (
                          <TouchableOpacity
                            key={s}
                            style={[
                              styles.sizeChip,
                              !isDark && styles.sizeChipLight,
                              isSizeActive && styles.sizeChipActive,
                            ]}
                            onPress={() => handleSizeChange(product.id, s)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.sizeChipText,
                                !isDark && styles.sizeChipTextLight,
                                isSizeActive && styles.sizeChipTextActive,
                              ]}
                            >
                              {s}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Bloco de Preços */}
                <View style={styles.priceContainer}>
                  <View>
                    <Text style={[styles.priceLabel, !isDark && styles.textMutedDark]}>Preço Sócio G39</Text>
                    <View style={styles.priceRowCard}>
                      <Text style={styles.priceValue}>
                        {product.price.toFixed(2)} €
                      </Text>
                      <Text style={[styles.pricePublic, !isDark && styles.pricePublicLight]}>
                        {(product.price + 3.0).toFixed(2)} €
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.cardBuyBtn}
                    onPress={() => handleBuy(product)}
                    activeOpacity={0.85}
                  >
                    <ShoppingBag size={14} color="#FFF" />
                    <Text style={styles.cardBuyBtnText}>Comprar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* 5. AVISO DE LEVANTAMENTO & APOIO */}
      <View style={[styles.infoBanner, !isDark && styles.infoBannerLight]}>
        <View style={[styles.infoIconBox, !isDark && styles.infoIconBoxLight]}>
          <Truck size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
        </View>
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, !isDark && styles.infoTitleLight]}>Pontos de Levantamento</Text>
          <Text style={[styles.infoDesc, !isDark && styles.infoDescLight]}>
            Podes levantar a tua encomenda gratuitamente na sede do Grupo 39 no Estádio
            dos Arcos às terças e quintas-feiras (19h30 - 21h30) ou na concentração
            antes dos jogos em casa.
          </Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1310',
  },
  contentContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },

  // Categorias
  categoriesWrapper: {
    marginBottom: 12,
    marginTop: 2,
  },
  categoriesBar: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
    paddingRight: 10,
  },
  categoryChip: {
    backgroundColor: '#16221A',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  categoryChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },

  // Artigo da Semana (Destaque)
  featuredCard: {
    backgroundColor: '#142018',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(242, 182, 0, 0.35)',
    marginBottom: 16,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  featuredGoldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featuredGoldBadgeText: {
    color: '#000',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  featuredStockText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  featuredContentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featuredImg: {
    width: 95,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#0D1510',
    resizeMode: 'cover',
  },
  featuredInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  featuredCategory: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: 3,
  },
  featuredDesc: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    lineHeight: 14,
  },
  featuredBottomAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  priceContainerFeatured: {
    flexShrink: 1,
  },
  priceRowFeatured: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 5,
  },
  featuredPrice: {
    color: COLORS.primaryLight,
    fontSize: 16,
    fontWeight: '900',
  },
  originalPrice: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
  },
  discountBadgeText: {
    color: '#00B368',
    fontSize: 9,
    fontWeight: '800',
  },

  // Grelha de Produtos
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionCount: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  productsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: '#121A15',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  productImgBox: {
    width: '100%',
    height: 140,
    backgroundColor: '#0D1510',
    position: 'relative',
  },
  productImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productBadgeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  productBadgeOverlayText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  productBody: {
    padding: 12,
  },
  productCategory: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  productTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  productDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },

  // Tamanhos
  sizesBox: {
    marginVertical: 6,
  },
  sizesLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sizeChip: {
    backgroundColor: '#16241B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sizeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  sizeChipText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  sizeChipTextActive: {
    color: '#FFF',
  },

  // Preço e Botão
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceLabel: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '600',
  },
  priceRowCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    flexWrap: 'wrap',
  },
  priceValue: {
    color: COLORS.primaryLight,
    fontSize: 16,
    fontWeight: '900',
  },
  pricePublic: {
    color: COLORS.textMuted,
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  cardBuyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 8,
    minHeight: 33,
    ...Platform.select({
      web: {
        boxShadow: '0 3px 10px rgba(0, 135, 78, 0.35)',
      },
    }),
  },
  cardBuyBtnText: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '800',
  },

  // Info Banner
  infoBanner: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#101B14',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.2)',
    alignItems: 'flex-start',
  },
  infoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 3,
  },
  infoDesc: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    lineHeight: 15,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  categoryChipLight: {
    backgroundColor: '#F2F6F4',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  categoryChipTextLight: {
    color: '#24382C',
  },
  featuredCardLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  productCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.14)',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
  sizeChipLight: {
    backgroundColor: '#F2F6F4',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  sizeChipTextLight: {
    color: '#24382C',
  },
  originalPriceLight: {
    color: '#7A9184',
  },
  pricePublicLight: {
    color: '#7A9184',
  },
  infoBannerLight: {
    backgroundColor: '#F4F9F6',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  infoIconBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  infoTitleLight: {
    color: '#00874E',
  },
  infoDescLight: {
    color: '#344D3F',
  },
});
