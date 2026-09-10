import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
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
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Users,
  Sparkles,
  Clock,
  FolderKanban,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { FORUM_CATEGORIES, INITIAL_FORUM_POSTS } from '../data/mockData';

export default function ForumScreen({ user, onBuyTicket, onScroll, isDark = true }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;

  // Efeito de pulso contínuo para destacar a categoria com novos comunicados
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 750,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 750,
          useNativeDriver: false,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  // Se selectedCategory for null, exibe a vista principal com as Categorias (Diretório / Núcleo do Fórum)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [posts, setPosts] = useState(INITIAL_FORUM_POSTS);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('bancada');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Categoria ativa selecionada
  const activeCategoryObj = FORUM_CATEGORIES.find((c) => c.id === selectedCategory);

  // Filtrar posts da categoria ativa
  const categoryPosts = selectedCategory
    ? posts.filter((p) => p.categoryId === selectedCategory)
    : [];

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

  // Abrir modal de novo tópico pré-selecionando categoria se aplicável
  const handleOpenNewPost = (categoryId) => {
    if (categoryId) {
      setNewCategory(categoryId);
    } else if (selectedCategory) {
      setNewCategory(selectedCategory);
    } else {
      setNewCategory('bancada');
    }
    setIsNewPostModalOpen(true);
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

    // Se estiver na vista geral e publicou, abre logo a categoria onde publicou
    if (!selectedCategory) {
      setSelectedCategory(newCategory);
    }
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

  const getCategoryIcon = (id, size = 18) => {
    switch (id) {
      case 'bancada':
        return <Flame size={size} color={COLORS.primaryLight} />;
      case 'deslocacao':
        return <Bus size={size} color={COLORS.gold} />;
      case 'opiniao':
        return <MessageCircle size={size} color="#00A3E0" />;
      case 'mercado':
        return <ShoppingBag size={size} color="#FF7043" />;
      default:
        return <Flame size={size} color={COLORS.primaryLight} />;
    }
  };

  const getCategoryThemeColor = (id) => {
    switch (id) {
      case 'bancada':
        return COLORS.primaryLight;
      case 'deslocacao':
        return COLORS.gold;
      case 'opiniao':
        return '#00A3E0';
      case 'mercado':
        return '#FF7043';
      default:
        return COLORS.primaryLight;
    }
  };

  // Obter contagem em tempo real de posts numa categoria
  const getCategoryStats = (catId) => {
    const matchingPosts = posts.filter((p) => p.categoryId === catId);
    const repliesTotal = matchingPosts.reduce((acc, p) => acc + (p.replies?.length || 0), 0);
    return {
      topics: matchingPosts.length,
      replies: repliesTotal + matchingPosts.length,
      lastPost: matchingPosts[0] || null,
    };
  };

  // =========================================================================
  // VISTA 1: DIRETÓRIO DE CATEGORIAS (O NÚCLEO DOS FÓRUNS CLÁSSICOS)
  // =========================================================================
  if (selectedCategory === null) {
    return (
      <View style={[styles.container, !isDark && styles.containerLight]}>
        <ScrollView
          contentContainerStyle={styles.directoryContent}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {/* Cabeçalho da Lista de Categorias */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <FolderKanban size={17} color={COLORS.primaryLight} />
              <Text style={[styles.sectionTitleText, !isDark && styles.textDark]}>
                Categorias Oficiais
              </Text>
            </View>
          </View>

          {/* Lista de Categorias (Estilo Cartão de Fórum Clássico) */}
          <View style={styles.categoriesList}>
            {FORUM_CATEGORIES.map((cat) => {
              const stats = getCategoryStats(cat.id);
              const themeColor = getCategoryThemeColor(cat.id);
              const isPulsing = cat.id === 'bancada' && stats.topics > 0;

              const cardContent = (
                <TouchableOpacity
                  style={[
                    styles.categoryBoardCard,
                    isPulsing && styles.categoryBoardCardPulsing,
                    !isDark && styles.categoryBoardCardLight,
                    !isDark && isPulsing && styles.categoryBoardCardPulsingLight,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.82}
                >
                  {/* Linha Superior: Ícone, Nome e Seta */}
                  <View style={styles.categoryCardTop}>
                    <View
                      style={[
                        styles.categoryIconCircle,
                        isPulsing && styles.categoryIconCirclePulsing,
                        {
                          backgroundColor: `${themeColor}22`,
                          borderColor: isPulsing ? COLORS.primaryLight : `${themeColor}55`,
                        },
                      ]}
                    >
                      {getCategoryIcon(cat.id, 20)}
                    </View>

                    <View style={styles.categoryTitleBox}>
                      <View style={styles.categoryTitleRow}>
                        <Text
                          style={[
                            styles.categoryName,
                            isPulsing && styles.categoryNamePulsing,
                            !isDark && styles.textDark,
                          ]}
                          numberOfLines={1}
                        >
                          {cat.title}
                        </Text>
                        {isPulsing && <View style={styles.livePulseDot} />}
                        {isPulsing && (
                          <View style={styles.comunicadoActiveBadge}>
                            <Sparkles size={9} color="#FFF" />
                            <Text style={styles.comunicadoActiveBadgeText}>NOVO</Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[styles.categoryDesc, !isDark && styles.postContentLight]}
                        numberOfLines={2}
                      >
                        {cat.desc}
                      </Text>
                    </View>

                    <View style={styles.enterCategoryArrow}>
                      <ChevronRight size={18} color={isPulsing ? COLORS.primaryLight : themeColor} />
                    </View>
                  </View>

                  {/* Barra de Estatísticas da Categoria */}
                  <View style={[styles.categoryStatsBar, { marginBottom: 0 }, !isDark && styles.categoryStatsBarLight]}>
                    <View style={styles.statPill}>
                      <MessageSquare size={11} color={themeColor} />
                      <Text style={[styles.statPillText, !isDark && styles.textDark]}>
                        {stats.topics} {stats.topics === 1 ? 'tópico' : 'tópicos'}
                      </Text>
                    </View>
                    <View style={styles.statPill}>
                      <Users size={11} color={COLORS.textMuted} />
                      <Text style={[styles.statPillText, !isDark && styles.textDark]}>
                        {stats.replies} {stats.replies === 1 ? 'mensagem' : 'mensagens'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );

              if (isPulsing) {
                return (
                  <Animated.View
                    key={cat.id}
                    style={[styles.animatedCategoryWrapper, { transform: [{ scale: pulseAnim }] }]}
                  >
                    {cardContent}
                  </Animated.View>
                );
              }

              return (
                <View key={cat.id}>
                  {cardContent}
                </View>
              );
            })}
          </View>

          <View style={{ height: 140 }} />
        </ScrollView>

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
                  {FORUM_CATEGORIES.map((c) => (
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

                <Text style={styles.inputLabel}>Título do Tópico</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ex.: Organização para o próximo jogo nos Arcos..."
                  placeholderTextColor={COLORS.textMuted}
                  value={newTitle}
                  onChangeText={setNewTitle}
                />

                <Text style={styles.inputLabel}>Conteúdo da Mensagem</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Partilha novidades, ideias de bancada, cânticos ou debate..."
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

  // =========================================================================
  // VISTA 2: LISTA DE TODOS OS POSTS DA CATEGORIA SELECIONADA
  // =========================================================================
  return (
    <View style={[styles.container, !isDark && styles.containerLight]}>
      {/* Barra de Navegação Superior da Categoria */}
      <View style={[styles.categoryNavHeader, !isDark && styles.categoryNavHeaderLight]}>
        <TouchableOpacity
          style={[styles.backToCategoriesBtn, !isDark && styles.backToCategoriesBtnLight]}
          onPress={() => setSelectedCategory(null)}
          activeOpacity={0.75}
        >
          <ArrowLeft size={16} color={COLORS.primaryLight} />
          <Text style={[styles.backToCategoriesText, !isDark && styles.backToCategoriesTextLight]}>
            Categorias
          </Text>
        </TouchableOpacity>

        <View style={styles.navBreadcrumb}>
          <Text style={[styles.breadcrumbRoot, !isDark && styles.textMutedDark]}>Fórum</Text>
          <ChevronRight size={13} color={COLORS.textMuted} />
          <Text style={[styles.breadcrumbActive, !isDark && styles.textDark]} numberOfLines={1}>
            {activeCategoryObj?.title || 'Categoria'}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Cartão de Destaque da Categoria Selecionada */}
        <View style={[styles.activeCategoryHero, !isDark && styles.activeCategoryHeroLight]}>
          <View style={styles.activeCategoryHeroTop}>
            <View
              style={[
                styles.categoryIconCircleLarge,
                {
                  backgroundColor: `${getCategoryThemeColor(selectedCategory)}22`,
                  borderColor: `${getCategoryThemeColor(selectedCategory)}55`,
                },
              ]}
            >
              {getCategoryIcon(selectedCategory, 22)}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.activeCategoryTitle, !isDark && styles.textDark]}>
                {activeCategoryObj?.title}
              </Text>
              <Text style={[styles.activeCategoryDesc, !isDark && styles.postContentLight]}>
                {activeCategoryObj?.desc}
              </Text>
            </View>
          </View>

          <View style={styles.activeCategoryHeroBottom}>
            <View style={styles.categoryCountBadge}>
              <Sparkles size={11} color={COLORS.primaryLight} />
              <Text style={styles.categoryCountBadgeText}>
                {categoryPosts.length} {categoryPosts.length === 1 ? 'TÓPICO ATIVO' : 'TÓPICOS ATIVOS'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.heroNewPostBtn}
              onPress={() => handleOpenNewPost(selectedCategory)}
              activeOpacity={0.85}
            >
              <Plus size={14} color="#FFF" />
              <Text style={styles.heroNewPostBtnText}>Criar Tópico</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de Publicações da Categoria */}
        {categoryPosts.length === 0 ? (
          <View style={[styles.emptyStateBox, !isDark && styles.emptyStateBoxLight]}>
            <MessageSquare size={36} color={COLORS.textMuted} />
            <Text style={[styles.emptyStateTitle, !isDark && styles.textDark]}>
              Ainda não existem tópicos nesta secção
            </Text>
            <Text style={[styles.emptyStateDesc, !isDark && styles.textMutedDark]}>
              Sê o primeiro associado a iniciar uma conversa na Bancada Poente!
            </Text>
            <TouchableOpacity
              style={styles.emptyStateBtn}
              onPress={() => handleOpenNewPost(selectedCategory)}
              activeOpacity={0.85}
            >
              <Plus size={14} color="#FFF" />
              <Text style={styles.emptyStateBtnText}>Publicar Primeiro Tópico</Text>
            </TouchableOpacity>
          </View>
        ) : (
          categoryPosts.map((post) => {
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
                        <Text style={[styles.authorName, !isDark && styles.textDark]}>
                          {post.author}
                        </Text>
                        <View style={styles.badgePill}>
                          <Text style={styles.badgePillText}>{post.authorBadge}</Text>
                        </View>
                      </View>
                      <Text style={[styles.postTimeAgo, !isDark && styles.textMutedDark]}>
                        {post.timeAgo}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.postTagPill,
                      {
                        backgroundColor: `${post.tagColor || COLORS.primaryLight}22`,
                        borderColor: `${post.tagColor || COLORS.primaryLight}55`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.postTagText,
                        { color: post.tagColor || COLORS.primaryLight },
                      ]}
                    >
                      {post.tag}
                    </Text>
                  </View>
                </View>

                {/* Título & Conteúdo do Tópico */}
                <Text style={[styles.postTitle, !isDark && styles.textDark]}>{post.title}</Text>
                <Text style={[styles.postContent, !isDark && styles.postContentLight]}>
                  {post.content}
                </Text>

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
                      size={15}
                      color={
                        post.hasUpvoted
                          ? isDark
                            ? COLORS.primaryLight
                            : '#00874E'
                          : isDark
                          ? COLORS.textSecondary
                          : '#5A6E63'
                      }
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
                    <MessageSquare size={15} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
                    <Text style={[styles.actionText, !isDark && styles.actionTextLight]}>
                      {post.commentsCount} {post.commentsCount === 1 ? 'resposta' : 'respostas'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => alert('Link do tópico copiado para partilha!')}
                    activeOpacity={0.7}
                  >
                    <Share2 size={15} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
                  </TouchableOpacity>
                </View>

                {/* Seção Expandida de Respostas */}
                {isExpanded && (
                  <View style={styles.repliesSection}>
                    <View style={[styles.repliesDivider, !isDark && styles.repliesDividerLight]} />
                    <Text style={[styles.repliesHeading, !isDark && styles.textDark]}>
                      Respostas ({post.replies?.length || 0})
                    </Text>

                    {post.replies && post.replies.map((rep) => (
                      <View key={rep.id} style={[styles.singleReplyBox, !isDark && styles.singleReplyBoxLight]}>
                        <View style={styles.replyTop}>
                          <Text style={[styles.replyAuthor, !isDark && styles.replyAuthorLight]}>
                            {rep.author}
                          </Text>
                          <Text style={[styles.replyTime, !isDark && styles.textMutedDark]}>
                            {rep.time}
                          </Text>
                        </View>
                        <Text style={[styles.replyBody, !isDark && styles.postContentLight]}>
                          {rep.text}
                        </Text>
                      </View>
                    ))}

                    {/* Input de Nova Resposta */}
                    <View style={styles.replyInputRow}>
                      <TextInput
                        style={[styles.replyTextInput, !isDark && styles.replyTextInputLight]}
                        placeholder="Escreve uma resposta na bancada..."
                        placeholderTextColor={isDark ? COLORS.textMuted : '#7A9184'}
                        value={replyText}
                        onChangeText={setReplyText}
                      />
                      <TouchableOpacity
                        style={styles.replySendBtn}
                        onPress={() => handleAddReply(post.id)}
                        activeOpacity={0.8}
                      >
                        <Send size={15} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Botão Flutuante Criar Tópico */}
      <TouchableOpacity
        style={[styles.fabButton, !isTablet && styles.fabButtonPhone]}
        onPress={() => handleOpenNewPost(selectedCategory)}
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
                {FORUM_CATEGORIES.map((c) => (
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

              <Text style={styles.inputLabel}>Título do Tópico</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex.: Organização para o próximo jogo nos Arcos..."
                placeholderTextColor={COLORS.textMuted}
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.inputLabel}>Conteúdo da Mensagem</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Partilha novidades, ideias de bancada, cânticos ou debate..."
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
  directoryContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  forumHubBanner: {
    backgroundColor: '#121F17',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px rgba(0, 135, 78, 0.1)',
      },
    }),
  },
  hubBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hubLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  greenLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryLight,
  },
  hubLiveBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  hubOnlineText: {
    color: COLORS.gold,
    fontSize: 10.5,
    fontWeight: '700',
  },
  hubMainTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  hubSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  globalStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0D1510',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 12,
  },
  globalStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  globalStatNumber: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  globalStatLabel: {
    color: COLORS.textMuted,
    fontSize: 9.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 1,
  },
  globalStatDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  communityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 179, 104, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.2)',
  },
  communityNoticeText: {
    color: COLORS.primaryLight,
    fontSize: 10.5,
    fontWeight: '600',
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitleText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  newTopicQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#00874E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  newTopicQuickText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  categoriesList: {
    gap: 12,
  },
  animatedCategoryWrapper: {
    width: '100%',
  },
  categoryBoardCard: {
    backgroundColor: '#14201A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  categoryBoardCardPulsing: {
    borderColor: '#00B368',
    borderWidth: 1.5,
    backgroundColor: '#12261C',
    ...Platform.select({
      web: {
        boxShadow: '0 0 18px rgba(0, 179, 104, 0.4), 0 4px 16px rgba(0, 0, 0, 0.35)',
      },
    }),
  },
  categoryBoardCardPulsingLight: {
    backgroundColor: '#EBF7F0',
    borderColor: '#00874E',
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(0, 135, 78, 0.25), 0 4px 12px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  categoryIconCirclePulsing: {
    backgroundColor: 'rgba(0, 179, 104, 0.3)',
  },
  categoryNamePulsing: {
    color: '#FFF',
    fontWeight: '900',
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#00B368',
    marginLeft: 6,
  },
  comunicadoActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#00874E',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
    marginLeft: 6,
  },
  comunicadoActiveBadgeText: {
    color: '#FFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  categoryCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  categoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  categoryTitleBox: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  categoryName: {
    color: '#FFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  categoryDesc: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    lineHeight: 16,
  },
  enterCategoryArrow: {
    alignSelf: 'center',
    paddingLeft: 4,
  },
  categoryStatsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#0F1812',
    borderRadius: 8,
    marginBottom: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statPillText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  lastPostSnippet: {
    backgroundColor: '#0D1410',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderLeftWidth: 2.5,
    borderLeftColor: COLORS.gold,
  },
  lastPostHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  lastPostLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  lastPostTime: {
    color: COLORS.gold,
    fontSize: 9.5,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  lastPostTitle: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  lastPostAuthor: {
    color: COLORS.textMuted,
    fontSize: 10,
  },

  // Vista da Categoria Específica
  categoryNavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#111A15',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backToCategoriesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.3)',
  },
  backToCategoriesText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '800',
  },
  navBreadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: 200,
  },
  breadcrumbRoot: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  breadcrumbActive: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  feedContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  activeCategoryHero: {
    backgroundColor: '#14201A',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.25)',
    marginBottom: 16,
  },
  activeCategoryHeroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  categoryIconCircleLarge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  activeCategoryTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 3,
  },
  activeCategoryDesc: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    lineHeight: 16,
  },
  activeCategoryHeroBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  categoryCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 179, 104, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  categoryCountBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  heroNewPostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#00874E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00B368',
  },
  heroNewPostBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: '#121C16',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 10,
  },
  emptyStateTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyStateDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  emptyStateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00874E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  emptyStateBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Post Card
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
  postTagPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  postTagText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  postTitle: {
    color: COLORS.white,
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 19,
  },
  postContent: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 17,
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

  // Variantes Modo Claro (Light Theme)
  containerLight: {
    backgroundColor: '#F4F7F5',
  },
  forumHubBannerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.18)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 18px rgba(0, 135, 78, 0.08)',
      },
    }),
  },
  globalStatsRowLight: {
    backgroundColor: '#EDF5F0',
    borderColor: 'rgba(0, 135, 78, 0.12)',
  },
  globalStatNumberLight: {
    color: '#121E17',
  },
  communityNoticeLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.08)',
    borderColor: 'rgba(0, 135, 78, 0.15)',
  },
  communityNoticeTextLight: {
    color: '#00874E',
  },
  categoryBoardCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.15)',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  categoryStatsBarLight: {
    backgroundColor: '#F4F8F6',
  },
  lastPostSnippetLight: {
    backgroundColor: '#F7FAF8',
  },
  categoryNavHeaderLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  backToCategoriesBtnLight: {
    backgroundColor: 'rgba(0, 135, 78, 0.1)',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  backToCategoriesTextLight: {
    color: '#00874E',
  },
  activeCategoryHeroLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  emptyStateBoxLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.12)',
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
