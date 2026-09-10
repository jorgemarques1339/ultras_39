import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  useWindowDimensions,
} from 'react-native';
import {
  ShoppingBag,
  Truck,
  Tag,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Check,
  Eye,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { STORE_PRODUCTS } from '../data/mockData';

const CATEGORIES = ['Todos', 'Cachecóis', 'Vestuário', 'Acessórios', 'Autocolantes'];

function StoreScreen({ user, onCheckoutItem, onScroll, isDark = true, isLoggedIn = false, onOpenAuth }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;

  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedSizes, setSelectedSizes] = useState({
    'prod-scarf-26': 'Tamanho Único (140x18cm)',
    'prod-tshirt-vdc': 'L',
    'prod-cap-g39': 'Ajustável (Snapback)',
    'prod-stickers-pack': '10 Unidades Sortidas',
  });

  // Estado do Modal de Detalhes do Produto
  const [detailProduct, setDetailProduct] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [modalSize, setModalSize] = useState(null);

  const handleOpenProduct = useCallback((product) => {
    setDetailProduct(product);
    setActivePhotoIndex(0);
    const initialSize = selectedSizes[product.id] || (product.sizes ? product.sizes[0] : 'Único');
    setModalSize(initialSize);
  }, [selectedSizes]);

  const handleSizeChange = useCallback((productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  }, []);

  const handleModalSizeSelect = useCallback((size) => {
    setModalSize(size);
    if (detailProduct) {
      handleSizeChange(detailProduct.id, size);
    }
  }, [detailProduct, handleSizeChange]);

  const handleBuy = useCallback((product, chosenSize) => {
    const size = chosenSize || selectedSizes[product.id] || (product.sizes ? product.sizes[0] : 'Único');
    const pubPrice = product.publicPrice != null ? product.publicPrice : (product.price + 3.0);
    const finalAmount = isLoggedIn ? product.price : pubPrice;
    const discountAmount = isLoggedIn ? Math.max(0, pubPrice - product.price) : 0;

    if (onCheckoutItem) {
      onCheckoutItem({
        title: `${product.title} (${size})`,
        category: `Loja Oficial G39 · ${product.category} (${isLoggedIn ? 'Sócio' : 'Não Sócio'})`,
        amount: finalAmount,
        originalPrice: pubPrice,
        discount: discountAmount,
        type: 'store',
      });
    }
  }, [selectedSizes, onCheckoutItem, isLoggedIn]);

  const handleBuyFromModal = useCallback(() => {
    if (!detailProduct) return;
    const prod = detailProduct;
    const size = modalSize || selectedSizes[prod.id] || (prod.sizes ? prod.sizes[0] : 'Único');
    setDetailProduct(null);
    handleBuy(prod, size);
  }, [detailProduct, modalSize, selectedSizes, handleBuy]);

  const filteredProducts = useMemo(() => {
    return activeCategory === 'Todos'
      ? STORE_PRODUCTS
      : STORE_PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <ScrollView
      style={[styles.container, !isDark && styles.containerLight]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews={Platform.OS !== 'web'}
      overScrollMode="never"
    >
      {/* 1. FILTROS DE CATEGORIAS EM CHIPS RESPONSIVOS */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesBar}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={Platform.OS !== 'web'}
          overScrollMode="never"
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

      {/* AVISO DE PREÇOS NÃO SÓCIO (QUANDO SEM LOGIN) */}
      {!isLoggedIn && (
        <View style={[styles.guestStoreNotice, !isDark && styles.guestStoreNoticeLight]}>
          <View style={styles.guestStoreNoticeContent}>
            <View style={styles.guestStoreBadgeRow}>
              <View style={styles.guestStoreBadge}>
                <Text style={styles.guestStoreBadgeText}>PREÇO NÃO SÓCIO</Text>
              </View>
            </View>
            <Text style={[styles.guestStoreNoticeTitle, !isDark && styles.textDark]}>
              A visualizar preços sem desconto de sócio
            </Text>
            <Text style={[styles.guestStoreNoticeDesc, !isDark && styles.textMutedDark]}>
              Inicia sessão com a tua conta para desbloquear os preços exclusivos de sócio.
            </Text>
          </View>
          {onOpenAuth && (
            <TouchableOpacity
              style={styles.guestStoreLoginBtn}
              onPress={() => onOpenAuth('login')}
              activeOpacity={0.85}
            >
              <Text style={styles.guestStoreLoginBtnText}>Entrar</Text>
              <ChevronRight size={14} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 2. PRODUTO EM DESTAQUE ESPECIAL (AO CLICAR ABRE O MODAL DETALHADO) */}
      {activeCategory === 'Todos' && STORE_PRODUCTS[0] && (
        <TouchableOpacity
          style={[styles.featuredCard, !isDark && styles.featuredCardLight]}
          onPress={() => handleOpenProduct(STORE_PRODUCTS[0])}
          activeOpacity={0.88}
        >
          <View style={styles.featuredBadgeRow}>
            <View style={styles.featuredGoldBadge}>
              <Tag size={12} color="#000" />
              <Text style={styles.featuredGoldBadgeText}>ARTIGO DA SEMANA</Text>
            </View>
            <View style={styles.viewDetailsTag}>
              <Eye size={12} color={COLORS.primaryLight} />
              <Text style={styles.featuredStockText}>Ver Detalhes</Text>
            </View>
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
                  {isLoggedIn ? (
                    <View style={styles.priceRowFeatured}>
                      <Text style={styles.featuredPrice}>
                        {STORE_PRODUCTS[0].price.toFixed(2)} €
                      </Text>
                      <Text style={[styles.originalPrice, !isDark && styles.originalPriceLight]}>
                        {(STORE_PRODUCTS[0].publicPrice || 15.0).toFixed(2)} €
                      </Text>
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountBadgeText}>-20% SÓCIO</Text>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text style={[styles.guestPriceLabel, !isDark && styles.textMutedDark]}>Preço Não Sócio</Text>
                      <View style={styles.priceRowFeatured}>
                        <Text style={styles.featuredPrice}>
                          {(STORE_PRODUCTS[0].publicPrice || 15.0).toFixed(2)} €
                        </Text>
                        <View style={styles.guestPill}>
                          <Text style={styles.guestPillText}>SEM DESCONTO</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.cardBuyBtn}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    handleOpenProduct(STORE_PRODUCTS[0]);
                  }}
                  activeOpacity={0.85}
                >
                  <ShoppingBag size={14} color="#FFF" />
                  <Text style={styles.cardBuyBtnText}>Comprar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* 3. GRELHA DE PRODUTOS (AO CLICAR ABRE O MODAL DO PRODUTO) */}
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
            <TouchableOpacity
              key={product.id}
              style={[styles.productCard, !isDark && styles.productCardLight]}
              onPress={() => handleOpenProduct(product)}
              activeOpacity={0.88}
            >
              {/* Imagem & Badge Superior */}
              <View style={styles.productImgBox}>
                <Image source={{ uri: product.image }} style={styles.productImg} />
                <View style={styles.productBadgeOverlay}>
                  <Text style={styles.productBadgeOverlayText}>{product.badge}</Text>
                </View>
                <View style={styles.productClickHint}>
                  <Eye size={11} color="#FFF" />
                  <Text style={styles.productClickHintText}>Ver Fotos</Text>
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
                            onPress={(e) => {
                              e.stopPropagation?.();
                              handleSizeChange(product.id, s);
                            }}
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
                    {isLoggedIn ? (
                      <>
                        <Text style={[styles.priceLabel, !isDark && styles.textMutedDark]}>Preço Sócio G39</Text>
                        <View style={styles.priceRowCard}>
                          <Text style={styles.priceValue}>
                            {product.price.toFixed(2)} €
                          </Text>
                          <Text style={[styles.pricePublic, !isDark && styles.pricePublicLight]}>
                            {(product.publicPrice || product.price + 3.0).toFixed(2)} €
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={[styles.priceLabel, !isDark && styles.textMutedDark]}>Preço Não Sócio</Text>
                        <View style={styles.priceRowCard}>
                          <Text style={styles.priceValue}>
                            {(product.publicPrice || product.price + 3.0).toFixed(2)} €
                          </Text>
                        </View>
                      </>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.cardBuyBtn}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      handleOpenProduct(product);
                    }}
                    activeOpacity={0.85}
                  >
                    <ShoppingBag size={14} color="#FFF" />
                    <Text style={styles.cardBuyBtnText}>Comprar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. AVISO DE LEVANTAMENTO & APOIO */}
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

      <View style={{ height: 110 }} />

      {/* ========================================================================= */}
      {/* 5. MODAL DEDICADA DE DETALHES DO PRODUTO (ESTILO DESLOCAÇÕES)           */}
      {/* ========================================================================= */}
      <Modal
        visible={!!detailProduct}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailProduct(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              isTablet && styles.modalContainerTablet,
              !isDark && styles.modalContainerLight,
            ]}
          >
            {/* Barra de Arraste Mobile */}
            <View style={styles.modalDragHandle} />

            {/* Cabeçalho do Modal */}
            <View style={[styles.modalHeader, !isDark && styles.modalHeaderLight]}>
              <View style={styles.modalHeaderLeft}>
                <View style={[styles.modalHeaderIconBox, !isDark && styles.modalHeaderIconBoxLight]}>
                  <ShoppingBag size={18} color={COLORS.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalHeaderTitle, !isDark && styles.textDark]} numberOfLines={1}>
                    {detailProduct?.title || 'Detalhes do Artigo'}
                  </Text>
                  <Text style={[styles.modalHeaderSubtitle, !isDark && styles.textMutedDark]}>
                    Loja Oficial Grupo 39 · {detailProduct?.category}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setDetailProduct(null)}
                style={styles.modalCloseBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <X size={20} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={Platform.OS !== 'web'}
              overScrollMode="never"
            >
              {detailProduct && (
                <>
                  {/* Bloco de Galeria de Fotos */}
                  <View style={styles.galleryContainer}>
                    <View style={styles.mainImageWrapper}>
                      <Image
                        source={{
                          uri:
                            detailProduct.images && detailProduct.images[activePhotoIndex]
                              ? detailProduct.images[activePhotoIndex]
                              : detailProduct.image,
                        }}
                        style={styles.modalMainImg}
                        resizeMode="cover"
                      />

                      {/* Badges Flutuantes sobre a Foto */}
                      <View style={styles.modalBadgeRow}>
                        <View style={styles.modalTagBadge}>
                          <Sparkles size={11} color="#000" />
                          <Text style={styles.modalTagBadgeText}>{detailProduct.badge}</Text>
                        </View>
                        <View style={styles.modalStockBadge}>
                          <ShieldCheck size={12} color={COLORS.primaryLight} />
                          <Text style={styles.modalStockBadgeText}>Em Stock na Sede</Text>
                        </View>
                      </View>
                    </View>

                    {/* Miniaturas de Fotos Adicionais (Galeria) */}
                    {detailProduct.images && detailProduct.images.length > 1 && (
                      <View style={styles.thumbnailsRow}>
                        {detailProduct.images.map((imgUri, idx) => {
                          const isThumbActive = idx === activePhotoIndex;
                          return (
                            <TouchableOpacity
                              key={idx}
                              style={[
                                styles.thumbnailBox,
                                isThumbActive && styles.thumbnailBoxActive,
                              ]}
                              onPress={() => setActivePhotoIndex(idx)}
                              activeOpacity={0.8}
                            >
                              <Image source={{ uri: imgUri }} style={styles.thumbnailImg} />
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>

                  {/* Informações e Descrição do Produto */}
                  <View style={[styles.modalCardBody, !isDark && styles.modalCardBodyLight]}>
                    <View style={styles.modalCategoryRow}>
                      <Text style={styles.modalCategoryText}>{detailProduct.category}</Text>
                      <Text style={[styles.modalCodeText, !isDark && styles.textMutedDark]}>
                        REF: {detailProduct.id.toUpperCase()}
                      </Text>
                    </View>

                    <Text style={[styles.modalProductTitle, !isDark && styles.textDark]}>
                      {detailProduct.title}
                    </Text>

                    <Text style={[styles.modalProductDesc, !isDark && styles.modalProductDescLight]}>
                      {detailProduct.description}
                    </Text>

                    {/* Especificações Oficiais */}
                    {detailProduct.specs && (
                      <View style={[styles.specsContainer, !isDark && styles.specsContainerLight]}>
                        <Text style={[styles.specsTitle, !isDark && styles.textDark]}>
                          Especificações Oficiais
                        </Text>
                        <View style={styles.specsList}>
                          {detailProduct.specs.map((item, i) => (
                            <View key={i} style={styles.specItemRow}>
                              <Text style={[styles.specLabel, !isDark && styles.textMutedDark]}>
                                {item.label}
                              </Text>
                              <Text style={[styles.specValue, !isDark && styles.textDark]}>
                                {item.value}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Seletor de Tamanho / Formato */}
                    {detailProduct.sizes && (
                      <View style={styles.modalSizesSection}>
                        <Text style={[styles.modalSectionLabel, !isDark && styles.textDark]}>
                          Tamanho / Formato:
                        </Text>
                        <View style={styles.modalSizesRow}>
                          {detailProduct.sizes.map((s) => {
                            const isSelected = modalSize === s;
                            return (
                              <TouchableOpacity
                                key={s}
                                style={[
                                  styles.modalSizeChip,
                                  !isDark && styles.modalSizeChipLight,
                                  isSelected && styles.modalSizeChipActive,
                                ]}
                                onPress={() => handleModalSizeSelect(s)}
                                activeOpacity={0.75}
                              >
                                <Text
                                  style={[
                                    styles.modalSizeChipText,
                                    !isDark && styles.modalSizeChipTextLight,
                                    isSelected && styles.modalSizeChipTextActive,
                                  ]}
                                >
                                  {s}
                                </Text>
                                {isSelected && <Check size={12} color="#FFF" style={{ marginLeft: 4 }} />}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    )}

                    {/* Bloco de Valor e Desconto */}
                    <View style={[styles.modalPriceCard, !isDark && styles.modalPriceCardLight]}>
                      {isLoggedIn ? (
                        <View>
                          <Text style={[styles.modalPriceLabel, !isDark && styles.textMutedDark]}>
                            Valor Especial Sócio G39
                          </Text>
                          <View style={styles.modalPriceRow}>
                            <Text style={styles.modalPriceValue}>
                              {detailProduct.price.toFixed(2)} €
                            </Text>
                            <Text style={[styles.modalPricePublic, !isDark && styles.pricePublicLight]}>
                              {(detailProduct.publicPrice || detailProduct.price + 3.0).toFixed(2)} €
                            </Text>
                            <View style={styles.modalDiscountPill}>
                              <Text style={styles.modalDiscountPillText}>-20% SÓCIO</Text>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View>
                          <Text style={[styles.modalPriceLabel, !isDark && styles.textMutedDark]}>
                            Preço Não Sócio (Sem Desconto)
                          </Text>
                          <View style={styles.modalPriceRow}>
                            <Text style={styles.modalPriceValue}>
                              {(detailProduct.publicPrice || detailProduct.price + 3.0).toFixed(2)} €
                            </Text>
                            <View style={styles.guestPill}>
                              <Text style={styles.guestPillText}>SEM DESCONTO</Text>
                            </View>
                          </View>
                          {onOpenAuth && (
                            <TouchableOpacity
                              style={styles.modalLoginInvite}
                              onPress={() => {
                                setDetailProduct(null);
                                onOpenAuth('login');
                              }}
                              activeOpacity={0.8}
                            >
                              <Sparkles size={13} color={COLORS.primaryLight} />
                              <Text style={styles.modalLoginInviteText}>
                                És sócio? Entra para pagar {detailProduct.price.toFixed(2)} €
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>

                    {/* Botão de Compra com MB WAY */}
                    <TouchableOpacity
                      style={styles.modalBuyBtn}
                      onPress={handleBuyFromModal}
                      activeOpacity={0.88}
                    >
                      <View style={styles.mbWayLogoBox}>
                        <Text style={styles.mbWayLogoTxt}>MB</Text>
                      </View>
                      <Text style={styles.modalBuyBtnText}>
                        Comprar via MB WAY ({
                          (isLoggedIn ? detailProduct.price : (detailProduct.publicPrice || detailProduct.price + 3.0)).toFixed(2)
                        } €)
                      </Text>
                      <ChevronRight size={18} color="#FFF" />
                    </TouchableOpacity>

                    {/* Selo de Garantia e Recolha */}
                    <View style={styles.modalGuaranteeBox}>
                      <ShieldCheck size={15} color={COLORS.primaryLight} />
                      <Text style={[styles.modalGuaranteeText, !isDark && styles.textMutedDark]}>
                        Artigo 100% Oficial Grupo 39 · Levantamento imediato na Sede ou nos Arcos
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  viewDetailsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  productClickHint: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  productClickHintText: {
    color: '#FFF',
    fontSize: 9.5,
    fontWeight: '700',
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

  // Tamanhos no Card
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

  // Preço e Botão no Card
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
    alignItems: 'center',
  },
  infoIconBox: {
    width: 36,
    height: 36,
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
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 2,
  },
  infoDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },

  // ==========================================
  // ESTILOS DO MODAL DETALHADO DO PRODUTO
  // ==========================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 8, 0.85)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '92%',
    backgroundColor: '#111A15',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  modalContainerTablet: {
    borderRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    maxHeight: '85%',
  },
  modalContainerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  modalDragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'center',
    marginTop: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalHeaderLight: {
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalHeaderIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderIconBoxLight: {
    backgroundColor: 'rgba(242, 182, 0, 0.2)',
  },
  modalHeaderTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalHeaderSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 30,
  },

  // Galeria de Fotos
  galleryContainer: {
    padding: 14,
    paddingBottom: 8,
  },
  mainImageWrapper: {
    width: '100%',
    height: 230,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0D1510',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalMainImg: {
    width: '100%',
    height: '100%',
  },
  modalBadgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  modalTagBadgeText: {
    color: '#000',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  modalStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
  },
  modalStockBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '700',
  },
  thumbnailsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  thumbnailBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: '#0D1510',
  },
  thumbnailBoxActive: {
    borderColor: COLORS.primaryLight,
    ...Platform.select({
      web: {
        boxShadow: '0 0 10px rgba(0, 179, 104, 0.4)',
      },
    }),
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Corpo do Modal
  modalCardBody: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  modalCardBodyLight: {},
  modalCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalCategoryText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  modalCodeText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  modalProductTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
    lineHeight: 23,
  },
  modalProductDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  modalProductDescLight: {
    color: '#3A4E42',
  },

  // Especificações
  specsContainer: {
    backgroundColor: '#0F1812',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14,
  },
  specsContainerLight: {
    backgroundColor: '#F4F8F5',
    borderColor: 'rgba(0, 135, 78, 0.12)',
  },
  specsTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  specsList: {
    gap: 6,
  },
  specItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  specLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  specValue: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Tamanhos no Modal
  modalSizesSection: {
    marginBottom: 16,
  },
  modalSectionLabel: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalSizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalSizeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16241B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalSizeChipLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  modalSizeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  modalSizeChipText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    fontWeight: '700',
  },
  modalSizeChipTextLight: {
    color: '#43584B',
  },
  modalSizeChipTextActive: {
    color: '#FFF',
  },

  // Preço no Modal
  modalPriceCard: {
    backgroundColor: '#0F1812',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
    marginBottom: 16,
  },
  modalPriceCardLight: {
    backgroundColor: '#EDF7F1',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  modalPriceLabel: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    flexWrap: 'wrap',
  },
  modalPriceValue: {
    color: COLORS.primaryLight,
    fontSize: 22,
    fontWeight: '900',
  },
  modalPricePublic: {
    color: COLORS.textMuted,
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  modalDiscountPill: {
    backgroundColor: 'rgba(0, 179, 104, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
  },
  modalDiscountPillText: {
    color: '#00B368',
    fontSize: 9.5,
    fontWeight: '900',
  },

  // Botão de Compra no Modal
  modalBuyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#00874E',
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#00B368',
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 135, 78, 0.4)',
      },
    }),
  },
  mbWayLogoBox: {
    backgroundColor: '#F2B600',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  mbWayLogoTxt: {
    color: '#000',
    fontSize: 10.5,
    fontWeight: '900',
  },
  modalBuyBtnText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  modalGuaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  modalGuaranteeText: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Variantes Modo Claro
  containerLight: {
    backgroundColor: '#F4F7F5',
  },
  categoryChipLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  categoryChipTextLight: {
    color: '#556A5E',
  },
  featuredCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(242, 182, 0, 0.5)',
  },
  productCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.14)',
  },
  infoBannerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  infoIconBoxLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
  },
  infoTitleLight: {
    color: '#0E1712',
  },
  infoDescLight: {
    color: '#556A5E',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
  originalPriceLight: {
    color: '#8A9E92',
  },
  pricePublicLight: {
    color: '#8A9E92',
  },
  sizeChipLight: {
    backgroundColor: '#F4F8F6',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  sizeChipTextLight: {
    color: '#4B6154',
  },
  guestStoreNotice: {
    backgroundColor: '#131D17',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  guestStoreNoticeLight: {
    backgroundColor: '#FFFDF5',
    borderColor: 'rgba(242, 182, 0, 0.35)',
  },
  guestStoreNoticeContent: {
    flex: 1,
  },
  guestStoreBadgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  guestStoreBadge: {
    backgroundColor: 'rgba(242, 182, 0, 0.16)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.35)',
  },
  guestStoreBadgeText: {
    color: '#F2B600',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  guestStoreNoticeTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  guestStoreNoticeDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 15,
  },
  guestStoreLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  guestStoreLoginBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  guestPriceLabel: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '600',
    marginBottom: 1,
  },
  guestPill: {
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.25)',
  },
  guestPillText: {
    color: '#A0AEC0',
    fontSize: 9,
    fontWeight: '800',
  },
  modalLoginInvite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalLoginInviteText: {
    color: COLORS.primaryLight,
    fontSize: 11.5,
    fontWeight: '700',
  },
});

export default memo(StoreScreen);
