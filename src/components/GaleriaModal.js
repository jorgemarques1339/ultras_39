import React, { useState, memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Linking,
  useWindowDimensions,
} from 'react-native';
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Ellipsis,
  CircleCheckBig,
  ExternalLink,
  Maximize2,
  Camera,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const GALLERY_POSTS = [
  {
    id: 'post-1',
    image: require('../../assets/gallery/post1.jpg'),
    location: 'Estádio dos Arcos · Vila do Conde',
    initialLikes: 2139,
    caption: 'O nosso amor não tem divisão! 🟢⚪️ 90 minutos a cantar pela caravela do Rio Ave FC. A Bancada Poente em chamas com a nossa gente!',
    hashtags: '#Grupo39 #RAFC #BancadaPoente #Ultras1984 #RioAveFC #FumigenosG39',
    commentsCount: 84,
    timeAgo: 'HÁ 2 DIAS',
  },
  {
    id: 'post-2',
    image: require('../../assets/gallery/post2.jpg'),
    location: 'Vila do Conde · Rumo aos Arcos',
    initialLikes: 2480,
    caption: 'Das margens do Rio Ave até à bancada. Unidos pelo mesmo símbolo, pela mesma terra! Cortejo monumental na chegada ao estádio. 🥁🏴‍☠️',
    hashtags: '#CortejoG39 #UltrasRioAve #RioAveFC #SemprePresentes #VilaDoConde',
    commentsCount: 112,
    timeAgo: 'HÁ 5 DIAS',
  },
  {
    id: 'post-3',
    image: require('../../assets/gallery/post3.jpg'),
    location: 'Setor Visitante · Fora de Casa',
    initialLikes: 1942,
    caption: 'Mais de 300 quilómetros pela camisola verde e branca. Onde o Rio Ave jogar, o Grupo 39 vai estar! 🚌💨 Bilhetes do setor visitante totalmente esgotados.',
    hashtags: '#CaravanaG39 #DeslocacaoOficial #RioAveFC #BancadaVisitante #FamiliaG39',
    commentsCount: 67,
    timeAgo: '1 DE SETEMBRO',
  },
];

function GaleriaModal({ visible, onClose, isDark = true }) {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 650;

  // Estado dos Likes
  const [likesState, setLikesState] = useState({
    'post-1': { liked: false, count: GALLERY_POSTS[0].initialLikes },
    'post-2': { liked: false, count: GALLERY_POSTS[1].initialLikes },
    'post-3': { liked: false, count: GALLERY_POSTS[2].initialLikes },
  });

  // Estado dos Marcadores (Salvos)
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});

  // Imagem selecionada para visualização em ecrã inteiro ("Abre em grande")
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleLike = (postId) => {
    setLikesState((prev) => {
      const current = prev[postId] || { liked: false, count: 2000 };
      const nextLiked = !current.liked;
      return {
        ...prev,
        [postId]: {
          liked: nextLiked,
          count: nextLiked ? current.count + 1 : current.count - 1,
        },
      };
    });
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleOpenInstagram = () => {
    const url = 'https://www.instagram.com/rioavefc/';
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url).catch(() => {});
    }
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
        <View style={[styles.container, !isDark && styles.containerLight, isTablet && styles.containerTablet]}>
          {/* Header Superior estilo Instagram Feed */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerLeft}>
              <View style={styles.cameraIconBox}>
                <Camera size={18} color="#00B368" />
              </View>
              <View>
                <View style={styles.headerUsernameRow}>
                  <Text style={[styles.headerUsername, !isDark && styles.textDark]}>
                    ultra_grupo39
                  </Text>
                  <View style={styles.verifiedBadge}>
                    <CircleCheckBig size={13} color="#00874E" fill="#00874E" />
                  </View>
                </View>
                <Text style={[styles.headerSubtitle, !isDark && styles.textMutedDark]}>
                  Feed Oficial dos Ultras · Rio Ave FC
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                style={[styles.instaIconBtn, !isDark && styles.instaIconBtnLight]}
                onPress={handleOpenInstagram}
                activeOpacity={0.7}
                accessibilityLabel="Abrir no Instagram"
              >
                <ExternalLink size={15} color={isDark ? COLORS.primaryLight : '#00874E'} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
                activeOpacity={0.7}
                accessibilityLabel="Fechar Galeria"
              >
                <X size={17} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Feed de Publicações Instagram */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollBodyContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={Platform.OS !== 'web'}
            overScrollMode="never"
          >
            {GALLERY_POSTS.map((post) => {
              const postLikes = likesState[post.id] || {
                liked: false,
                count: post.initialLikes,
              };
              const isBookmarked = !!bookmarkedPosts[post.id];

              return (
                <View
                  key={post.id}
                  style={[styles.postCard, !isDark && styles.postCardLight]}
                >
                  {/* Cabeçalho da Foto (Autor & Localização) */}
                  <View style={styles.postHeader}>
                    <View style={styles.postUserRow}>
                      <View style={styles.avatarBorder}>
                        <Image
                          source={require('../../assets/logo_39.png')}
                          style={styles.postAvatar}
                          resizeMode="contain"
                        />
                      </View>
                      <View>
                        <View style={styles.postUsernameRow}>
                          <Text style={[styles.postUsername, !isDark && styles.textDark]}>
                            ultra_grupo39
                          </Text>
                          <CircleCheckBig size={11} color="#00874E" fill="#00874E" />
                        </View>
                        <Text style={[styles.postLocation, !isDark && styles.textMutedDark]}>
                          {post.location}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Ellipsis size={18} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
                    </TouchableOpacity>
                  </View>

                  {/* Imagem do Post: CLICAR ABRE EM GRANDE */}
                  <TouchableOpacity
                    activeOpacity={0.92}
                    onPress={() => setSelectedImage(post)}
                    style={styles.imageTouchable}
                  >
                    <Image
                      source={post.image}
                      style={styles.postMainImg}
                      resizeMode="cover"
                    />
                    {/* Badge indicadora de toque para expandir */}
                    <View style={styles.expandBadge}>
                      <Maximize2 size={13} color="#FFF" />
                      <Text style={styles.expandBadgeText}>Ver em grande</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Barra de Ações (Gosto, Comentário, Partilha, Salvar) */}
                  <View style={styles.actionBar}>
                    <View style={styles.actionLeft}>
                      <TouchableOpacity
                        onPress={() => toggleLike(post.id)}
                        style={styles.actionIconBtn}
                        activeOpacity={0.7}
                      >
                        <Heart
                          size={22}
                          color={postLikes.liked ? '#E31B23' : (isDark ? '#FFF' : '#0E1712')}
                          fill={postLikes.liked ? '#E31B23' : 'transparent'}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionIconBtn}
                        activeOpacity={0.7}
                        onPress={handleOpenInstagram}
                      >
                        <MessageCircle
                          size={22}
                          color={isDark ? '#FFF' : '#0E1712'}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionIconBtn}
                        activeOpacity={0.7}
                        onPress={handleOpenInstagram}
                      >
                        <Send size={20} color={isDark ? '#FFF' : '#0E1712'} />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleBookmark(post.id)}
                      activeOpacity={0.7}
                    >
                      <Bookmark
                        size={22}
                        color={isBookmarked ? (isDark ? COLORS.primaryLight : '#00874E') : (isDark ? '#FFF' : '#0E1712')}
                        fill={isBookmarked ? (isDark ? COLORS.primaryLight : '#00874E') : 'transparent'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Contador de Gostos */}
                  <Text style={[styles.likesCountText, !isDark && styles.textDark]}>
                    {postLikes.count.toLocaleString('pt-PT')} gostos
                  </Text>

                  {/* Legenda do Post */}
                  <View style={styles.captionBox}>
                    <Text style={[styles.captionText, !isDark && styles.textDark]}>
                      <Text style={[styles.captionUsername, !isDark && styles.textDark]}>
                        ultra_grupo39{' '}
                      </Text>
                      {post.caption}
                    </Text>

                    <Text style={styles.hashtagsText}>{post.hashtags}</Text>

                    <TouchableOpacity
                      onPress={handleOpenInstagram}
                      activeOpacity={0.7}
                      style={{ marginTop: 6 }}
                    >
                      <Text style={[styles.viewCommentsText, !isDark && styles.textMutedDark]}>
                        Ver todos os {post.commentsCount} comentários
                      </Text>
                    </TouchableOpacity>

                    <Text style={[styles.timeAgoText, !isDark && styles.textMutedDark]}>
                      {post.timeAgo}
                    </Text>
                  </View>
                </View>
              );
            })}
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>

      {/* MODAL DE IMAGEM EM GRANDE (FULLSCREEN LIGHTBOX VIEWER) */}
      {selectedImage && (
        <Modal
          visible={!!selectedImage}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedImage(null)}
        >
          <View style={styles.fullscreenBackdrop}>
            {/* Top Bar do Visualizador Fullscreen */}
            <View style={styles.fullscreenTopBar}>
              <View style={styles.fullscreenTitleGroup}>
                <Text style={styles.fullscreenLocationText}>
                  {selectedImage.location}
                </Text>
                <Text style={styles.fullscreenTimeText}>
                  {selectedImage.timeAgo}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.fullscreenCloseBtn}
                onPress={() => setSelectedImage(null)}
                activeOpacity={0.8}
                accessibilityLabel="Fechar visualização em grande"
              >
                <X size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Imagem em Grande Centralizada */}
            <TouchableOpacity
              style={styles.fullscreenImageContainer}
              activeOpacity={1}
              onPress={() => setSelectedImage(null)}
            >
              <Image
                source={selectedImage.image}
                style={[
                  styles.fullscreenImage,
                  { maxWidth: Math.min(width - 24, 760), maxHeight: height * 0.72 },
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Rodapé com Legenda da Foto */}
            <View style={styles.fullscreenFooter}>
              <Text style={styles.fullscreenCaptionText} numberOfLines={3}>
                <Text style={{ fontWeight: '800', color: '#00B368' }}>ultra_grupo39: </Text>
                {selectedImage.caption}
              </Text>
              <Text style={styles.fullscreenHashtagsText} numberOfLines={1}>
                {selectedImage.hashtags}
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  container: {
    width: '100%',
    maxWidth: 520,
    height: '92%',
    backgroundColor: '#0D1410',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.8), 0 0 24px rgba(0, 179, 104, 0.2)',
      },
    }),
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.22)',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  containerTablet: {
    maxWidth: 560,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#0D1410',
  },
  headerLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cameraIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
  },
  headerUsernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerUsername: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  verifiedBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instaIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
  },
  instaIconBtnLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  scrollBody: {
    flex: 1,
  },
  scrollBodyContent: {
    paddingVertical: 12,
    gap: 18,
  },
  postCard: {
    backgroundColor: '#121A15',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  postCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.1)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  postUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBorder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#00B368',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  postUsernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  postUsername: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  postLocation: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    marginTop: 1,
  },
  imageTouchable: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#090E0B',
  },
  postMainImg: {
    width: '100%',
    height: '100%',
  },
  expandBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  expandBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIconBtn: {
    padding: 2,
  },
  likesCountText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  captionBox: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  captionUsername: {
    fontWeight: '800',
  },
  captionText: {
    color: '#FFF',
    fontSize: 12.5,
    lineHeight: 18,
  },
  hashtagsText: {
    color: '#00B368',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 4,
  },
  viewCommentsText: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    fontWeight: '500',
  },
  timeAgoText: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.96)',
    justifyContent: 'space-between',
  },
  fullscreenTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'web' ? 20 : 44,
    paddingBottom: 12,
  },
  fullscreenTitleGroup: {
    flex: 1,
  },
  fullscreenLocationText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  fullscreenTimeText: {
    color: '#8FA89B',
    fontSize: 11,
    marginTop: 2,
  },
  fullscreenCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  fullscreenFooter: {
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === 'web' ? 24 : 40,
    paddingTop: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  fullscreenCaptionText: {
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18,
  },
  fullscreenHashtagsText: {
    color: '#00B368',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  textDark: {
    color: '#14201A',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});

export default memo(GaleriaModal);
