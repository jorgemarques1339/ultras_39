import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  Flame,
  Bus,
  MessageCircle,
  ShoppingBag,
  Send,
  X,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { FORUM_CATEGORIES, INITIAL_FORUM_POSTS } from '../data/mockData';

export default function ForumScreen({ user, onBuyTicket, onScroll, isDark = true }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState(INITIAL_FORUM_POSTS);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('opiniao');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Filtrar posts
  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((p) => p.categoryId === selectedCategory);

  // Upvote interativo
  const handleToggleUpvote = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const hasUpvoted = !post.hasUpvoted;
          return {
            ...post,
            hasUpvoted,
            upvotes: hasUpvoted ? post.upvotes + 1 : post.upvotes - 1,
          };
        }
        return post;
      })
    );
  };

  // Criar novo tópico
  const handleCreatePost = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Por favor preenche o título e conteúdo do tópico.');
      return;
    }

    const catObj = FORUM_CATEGORIES.find((c) => c.id === newCategory);
    const newPostObj = {
      id: `post-${Date.now()}`,
      categoryId: newCategory,
      categoryName: catObj ? catObj.title : 'Geral',
      author: user.name,
      authorBadge: 'Sócio G39',
      avatar: user.avatar,
      timeAgo: 'Agora mesmo',
      title: newTitle,
      content: newContent,
      upvotes: 1,
      hasUpvoted: true,
      commentsCount: 0,
      tag: 'DISCUSSÃO',
      tagColor: COLORS.primaryLight,
      replies: [],
    };

    setPosts([newPostObj, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsNewPostModalOpen(false);
  };

  // Adicionar resposta
  const handleAddReply = (postId) => {
    if (!replyText.trim()) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newReply = {
            id: `rep-${Date.now()}`,
            author: user.name,
            text: replyText,
            time: 'Agora mesmo',
          };
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            replies: [...post.replies, newReply],
          };
        }
        return post;
      })
    );
    setReplyText('');
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'bancada':
        return <Music size={14} color={COLORS.primaryLight} />;
      case 'deslocacao':
        return <Bus size={14} color={COLORS.gold} />;
      case 'opiniao':
        return <MessageCircle size={14} color="#00A3E0" />;
      case 'mercado':
        return <ShoppingBag size={14} color="#FF7043" />;
      default:
        return <Flame size={14} color={COLORS.gold} />;
    }
  };

  return (
    <View style={[styles.container, !isDark && styles.containerLight]}>
      {/* Barra de Filtro de Categorias */}
      <View style={[styles.categoriesBar, !isDark && styles.categoriesBarLight]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScrollView}
          contentContainerStyle={styles.categoriesContent}
        >
          {FORUM_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  !isDark && styles.categoryPillLight,
                  isSelected && styles.categoryPillSelected,
                  !isDark && isSelected && styles.categoryPillSelectedLight,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                {getCategoryIcon(cat.id)}
                <Text
                  style={[
                    styles.categoryPillText,
                    !isDark && styles.categoryPillTextLight,
                    isSelected && styles.categoryPillTextSelected,
                    !isDark && isSelected && styles.categoryPillTextSelectedLight,
                  ]}
                >
                  {cat.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Publicações */}
      <ScrollView
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {filteredPosts.map((post) => {
          const isExpanded = expandedPostId === post.id;

          return (
            <View key={post.id} style={[styles.postCard, !isDark && styles.postCardLight]}>
              {/* Header do Post */}
              <View style={styles.postTopRow}>
                <View style={styles.authorGroup}>
                  <View style={styles.authorAvatarPlaceholder}>
                    <Text style={styles.authorAvatarLetter}>
                      {post.author.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <View style={styles.authorNameRow}>
                      <Text style={[styles.authorName, !isDark && styles.textDark]}>{post.author}</Text>
                      <View style={styles.badgePill}>
                        <Text style={styles.badgePillText}>{post.authorBadge}</Text>
                      </View>
                    </View>
                    <Text style={[styles.postTimeAgo, !isDark && styles.textMutedDark]}>{post.timeAgo} · {post.categoryName}</Text>
                  </View>
                </View>
              </View>

              {/* Título & Conteúdo do Tópico */}
              <Text style={[styles.postTitle, !isDark && styles.textDark]}>{post.title}</Text>
              <Text style={[styles.postContent, !isDark && styles.postContentLight]}>{post.content}</Text>

              {/* Ações: Upvote, Comentários, Partilhar */}
              <View style={[styles.postActionsRow, !isDark && styles.postActionsRowLight]}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    post.hasUpvoted && styles.actionButtonActive,
                    !isDark && post.hasUpvoted && styles.actionButtonActiveLight,
                  ]}
                  onPress={() => handleToggleUpvote(post.id)}
                  activeOpacity={0.7}
                >
                  <ThumbsUp
                    size={16}
                    color={post.hasUpvoted ? (isDark ? COLORS.primaryLight : '#00874E') : (isDark ? COLORS.textSecondary : '#5A6E63')}
                    fill={post.hasUpvoted ? (isDark ? COLORS.primaryLight : '#00874E') : 'transparent'}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      !isDark && styles.actionTextLight,
                      post.hasUpvoted && styles.actionTextActive,
                      !isDark && post.hasUpvoted && styles.actionTextActiveLight,
                    ]}
                  >
                    {post.upvotes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setExpandedPostId(isExpanded ? null : post.id)}
                  activeOpacity={0.7}
                >
                  <MessageSquare size={16} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
                  <Text style={[styles.actionText, !isDark && styles.actionTextLight]}>
                    {post.commentsCount} respostas
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => alert('Link da publicação copiado para partilha!')}
                  activeOpacity={0.7}
                >
                  <Share2 size={16} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
                </TouchableOpacity>
              </View>

              {/* Seção Expandida de Respostas */}
              {isExpanded && (
                <View style={styles.repliesSection}>
                  <View style={[styles.repliesDivider, !isDark && styles.repliesDividerLight]} />
                  <Text style={[styles.repliesHeading, !isDark && styles.textDark]}>Respostas ({post.replies.length})</Text>

                  {post.replies.map((rep) => (
                    <View key={rep.id} style={[styles.singleReplyBox, !isDark && styles.singleReplyBoxLight]}>
                      <View style={styles.replyTop}>
                        <Text style={[styles.replyAuthor, !isDark && styles.replyAuthorLight]}>{rep.author}</Text>
                        <Text style={[styles.replyTime, !isDark && styles.textMutedDark]}>{rep.time}</Text>
                      </View>
                      <Text style={[styles.replyBody, !isDark && styles.postContentLight]}>{rep.text}</Text>
                    </View>
                  ))}

                  {/* Input de Nova Resposta */}
                  <View style={styles.replyInputRow}>
                    <TextInput
                      style={[styles.replyTextInput, !isDark && styles.replyTextInputLight]}
                      placeholder="Escreve uma resposta..."
                      placeholderTextColor={isDark ? COLORS.textMuted : '#7A9184'}
                      value={replyText}
                      onChangeText={setReplyText}
                    />
                    <TouchableOpacity
                      style={styles.replySendBtn}
                      onPress={() => handleAddReply(post.id)}
                      activeOpacity={0.8}
                    >
                      <Send size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Botão Flutuante de Criar Tópico Compacto */}
      <TouchableOpacity
        style={[styles.fabButton, !isTablet && styles.fabButtonPhone]}
        onPress={() => setIsNewPostModalOpen(true)}
        activeOpacity={0.85}
      >
        <Plus size={16} color="#FFF" />
        <Text style={styles.fabText}>Novo Tópico</Text>
      </TouchableOpacity>

      {/* Modal Criar Novo Tópico */}
      <Modal
        visible={isNewPostModalOpen}
        transparent
        animationType={isTablet ? 'fade' : 'slide'}
        onRequestClose={() => setIsNewPostModalOpen(false)}
      >
        <View style={[styles.modalOverlay, isTablet && styles.modalOverlayTablet]}>
          <View style={[styles.newPostContainer, isTablet && styles.newPostContainerTablet]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Publicar no Fórum G39</Text>
              <TouchableOpacity
                onPress={() => setIsNewPostModalOpen(false)}
                style={styles.closeModalBtn}
              >
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.newPostContent}>
              <Text style={styles.inputLabel}>Escolhe a Categoria</Text>
              <View style={styles.categoryPickerRow}>
                {FORUM_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.pickerPill,
                      newCategory === c.id && styles.pickerPillActive,
                    ]}
                    onPress={() => setNewCategory(c.id)}
                  >
                    <Text
                      style={[
                        styles.pickerPillText,
                        newCategory === c.id && styles.pickerPillTextActive,
                      ]}
                    >
                      {c.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Título da Mensagem</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex.: Organização de tifo para o próximo jogo..."
                placeholderTextColor={COLORS.textMuted}
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.inputLabel}>Conteúdo</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Partilha ideias, letras de cânticos ou informações da claque..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={4}
                value={newContent}
                onChangeText={setNewContent}
              />

              <TouchableOpacity
                style={styles.publishBtn}
                onPress={handleCreatePost}
                activeOpacity={0.85}
              >
                <Send size={18} color="#FFF" />
                <Text style={styles.publishBtnText}>Publicar Tópico</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1310',
    overflow: 'hidden',
  },
  categoriesBar: {
    backgroundColor: '#111A15',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    overflow: 'hidden',
  },
  categoriesScrollView: {
    overflow: 'hidden',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#18241E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryPillSelected: {
    backgroundColor: 'rgba(0, 135, 78, 0.3)',
    borderColor: COLORS.primaryLight,
  },
  categoryPillText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryPillTextSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
  feedContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  postCard: {
    backgroundColor: '#14201A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    marginBottom: 14,
  },
  postTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00B368',
  },
  authorAvatarLetter: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  badgePill: {
    backgroundColor: 'rgba(242, 182, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  badgePillText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '700',
  },
  postTimeAgo: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  postTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 20,
  },
  postContent: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  postActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(0, 135, 78, 0.2)',
  },
  actionText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  actionTextActive: {
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  repliesSection: {
    marginTop: 12,
  },
  repliesDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  repliesHeading: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  singleReplyBox: {
    backgroundColor: '#101713',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  replyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  replyAuthor: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  replyTime: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  replyBody: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  replyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  replyTextInput: {
    flex: 1,
    backgroundColor: '#0D1410',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
  },
  replySendBtn: {
    backgroundColor: '#00874E',
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButton: {
    position: 'absolute',
    bottom: 95,
    right: 18,
    backgroundColor: '#00874E',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#00B368',
    elevation: 6,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 135, 78, 0.4)',
      },
    }),
  },
  fabButtonPhone: {
    bottom: 80,
  },
  fabText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 8, 0.85)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalOverlayTablet: {
    justifyContent: 'center',
    padding: 24,
  },
  newPostContainer: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#111A15',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    maxHeight: '85%',
  },
  newPostContainerTablet: {
    borderRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalHeaderTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  closeModalBtn: {
    padding: 6,
  },
  newPostContent: {
    padding: 20,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  pickerPill: {
    backgroundColor: '#18241E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pickerPillActive: {
    backgroundColor: 'rgba(0, 135, 78, 0.3)',
    borderColor: COLORS.primaryLight,
  },
  pickerPillText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  pickerPillTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: '#0D1410',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  publishBtn: {
    backgroundColor: '#00874E',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#00B368',
  },
  publishBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  categoriesBarLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  categoryPillLight: {
    backgroundColor: '#F2F6F4',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  categoryPillTextLight: {
    color: '#24382C',
  },
  categoryPillSelectedLight: {
    backgroundColor: '#00874E',
    borderColor: '#00874E',
  },
  categoryPillTextSelectedLight: {
    color: '#FFFFFF',
  },
  postCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.14)',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 14px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
  postContentLight: {
    color: '#314438',
  },
  postActionsRowLight: {
    borderTopColor: 'rgba(0, 135, 78, 0.1)',
  },
  actionTextLight: {
    color: '#5A6E63',
  },
  actionButtonActiveLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  repliesDividerLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.12)',
  },
  singleReplyBoxLight: {
    backgroundColor: '#F4F7F5',
  },
  replyAuthorLight: {
    color: '#00874E',
  },
  replyTextInputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.25)',
    color: '#0E1712',
  },
});
