import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  X,
  Check,
  User,
  Camera,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export const PRESET_AVATARS = [
  {
    id: 'avatar-1',
    name: 'Salvador (Claque)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'avatar-2',
    name: 'Adepto Arcos',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'avatar-3',
    name: 'Ultra G39',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'avatar-4',
    name: 'Vilacondense',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'avatar-5',
    name: 'Sócio Poente',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'avatar-6',
    name: 'Jovem Arcos',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  },
];

export default function EditProfileModal({
  visible,
  onClose,
  user,
  onSaveUser,
  isDark = true,
}) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [customUrlMode, setCustomUrlMode] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [error, setError] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (visible && user) {
      setName(user.name || '');
      setAvatar(user.avatar || PRESET_AVATARS[0].url);
      setCustomUrlInput(user.avatar || '');
      setError('');
      setAvatarError(false);
    }
  }, [visible, user]);

  const handleSelectPreset = (url) => {
    setAvatar(url);
    setCustomUrlInput(url);
    setAvatarError(false);
  };

  const handleApplyCustomUrl = () => {
    const trimmed = customUrlInput.trim();
    if (trimmed) {
      setAvatar(trimmed);
      setAvatarError(false);
      setCustomUrlMode(false);
    }
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Por favor introduz o teu nome.');
      return;
    }
    if (trimmedName.length < 2) {
      setError('O nome deve ter pelo menos 2 caracteres.');
      return;
    }

    onSaveUser({
      name: trimmedName,
      avatar: avatar.trim() || undefined,
    });
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.modalCard, !isDark && styles.modalCardLight]}>
          {/* Cabeçalho */}
          <View style={[styles.modalHeader, !isDark && styles.modalHeaderLight]}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <User size={18} color="#00E676" />
              </View>
              <View>
                <Text style={[styles.modalTitle, !isDark && styles.textDark]}>
                  Editar Perfil de Sócio
                </Text>
                <Text style={[styles.modalSubtitle, !isDark && styles.textMutedDark]}>
                  Atualiza o teu nome e avatar oficial
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={isDark ? COLORS.textMuted : '#7A9184'} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Pré-visualização do Avatar e Nome */}
            <View style={[styles.previewSection, !isDark && styles.previewSectionLight]}>
              <View style={styles.previewAvatarWrapper}>
                {avatar && !avatarError ? (
                  <Image
                    source={{ uri: avatar }}
                    style={styles.previewAvatarImage}
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <View style={styles.previewAvatarFallback}>
                    <Text style={styles.previewAvatarInitial}>
                      {name ? name.charAt(0).toUpperCase() : 'S'}
                    </Text>
                  </View>
                )}
                <View style={styles.previewBadge}>
                  <Camera size={12} color="#FFF" />
                </View>
              </View>
              <Text style={[styles.previewName, !isDark && styles.textDark]} numberOfLines={1}>
                {name || 'Nome do Sócio'}
              </Text>
              <Text style={styles.previewCategory}>
                {user?.memberCategory || 'Membro Oficial Grupo 39'}
              </Text>
            </View>

            {/* Campo de Edição do Nome */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, !isDark && styles.textDark]}>
                Nome Completo / Como queres ser tratado
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  !isDark && styles.inputContainerLight,
                  error ? styles.inputError : null,
                ]}
              >
                <User size={16} color={isDark ? COLORS.textMuted : '#8FA89B'} />
                <TextInput
                  style={[styles.input, !isDark && styles.inputLight]}
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (error) setError('');
                  }}
                  placeholder="Introduz o teu nome..."
                  placeholderTextColor={isDark ? '#6B8577' : '#94A3B8'}
                  maxLength={40}
                  autoCapitalize="words"
                />
              </View>
              {error ? (
                <View style={styles.errorRow}>
                  <AlertCircle size={13} color="#FF5252" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
            </View>

            {/* Seleção de Avatar */}
            <View style={styles.fieldGroup}>
              <View style={styles.avatarHeaderRow}>
                <Text style={[styles.fieldLabel, !isDark && styles.textDark]}>
                  Escolher Avatar Oficial
                </Text>
                <TouchableOpacity
                  onPress={() => setCustomUrlMode(!customUrlMode)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.customUrlToggleText}>
                    {customUrlMode ? 'Ver Avatares' : 'Colar Link URL'}
                  </Text>
                </TouchableOpacity>
              </View>

              {customUrlMode ? (
                <View style={styles.customUrlBox}>
                  <View
                    style={[
                      styles.inputContainer,
                      !isDark && styles.inputContainerLight,
                    ]}
                  >
                    <ImageIcon size={16} color={isDark ? COLORS.textMuted : '#8FA89B'} />
                    <TextInput
                      style={[styles.input, !isDark && styles.inputLight]}
                      value={customUrlInput}
                      onChangeText={setCustomUrlInput}
                      placeholder="https://exemplo.com/avatar.jpg"
                      placeholderTextColor={isDark ? '#6B8577' : '#94A3B8'}
                      autoCapitalize="none"
                      keyboardType="url"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.applyUrlBtn}
                    onPress={handleApplyCustomUrl}
                    activeOpacity={0.8}
                  >
                    <Check size={14} color="#FFF" />
                    <Text style={styles.applyUrlBtnText}>Aplicar Imagem</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.presetGrid}>
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = avatar === preset.url;
                    return (
                      <TouchableOpacity
                        key={preset.id}
                        style={[
                          styles.presetItem,
                          isSelected && styles.presetItemSelected,
                        ]}
                        onPress={() => handleSelectPreset(preset.url)}
                        activeOpacity={0.8}
                      >
                        <Image source={{ uri: preset.url }} style={styles.presetImage} />
                        {isSelected && (
                          <View style={styles.selectedBadge}>
                            <Check size={10} color="#FFF" strokeWidth={3} />
                          </View>
                        )}
                        <Text
                          style={[
                            styles.presetLabel,
                            !isDark && styles.presetLabelLight,
                            isSelected && styles.presetLabelSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {preset.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Rodapé com Ações */}
          <View style={[styles.modalFooter, !isDark && styles.modalFooterLight]}>
            <TouchableOpacity
              style={[styles.cancelBtn, !isDark && styles.cancelBtnLight]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelBtnText, !isDark && styles.textDark]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Sparkles size={16} color="#FFF" />
              <Text style={styles.saveBtnText}>Guardar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: '#0D1612',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 118, 0.25)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 230, 118, 0.15)',
      },
    }),
  },
  modalCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.25)',
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
  modalHeaderLight: {
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: '#8FA89B',
    fontSize: 12,
    marginTop: 1,
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
  modalBody: {
    flexGrow: 0,
  },
  modalBodyContent: {
    padding: 20,
    gap: 18,
  },
  previewSection: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  previewSectionLight: {
    backgroundColor: '#F5F9F6',
    borderColor: 'rgba(0, 135, 78, 0.12)',
  },
  previewAvatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  previewAvatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: '#00E676',
  },
  previewAvatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#00874E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#00E676',
  },
  previewAvatarInitial: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
  },
  previewBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00874E',
    borderWidth: 2,
    borderColor: '#0D1612',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  previewCategory: {
    color: '#00E676',
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 2,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: '#CFE0D8',
    fontSize: 12.5,
    fontWeight: '700',
  },
  avatarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customUrlToggleText: {
    color: '#00E676',
    fontSize: 11.5,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#121F19',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    height: 44,
  },
  inputContainerLight: {
    backgroundColor: '#F8FAF9',
    borderColor: 'rgba(0, 135, 78, 0.2)',
  },
  inputError: {
    borderColor: '#FF5252',
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    paddingVertical: 0,
  },
  inputLight: {
    color: '#0E1712',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 11.5,
    fontWeight: '600',
  },
  customUrlBox: {
    gap: 8,
  },
  applyUrlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00874E',
    paddingVertical: 8,
    borderRadius: 10,
  },
  applyUrlBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  presetItem: {
    width: '30%',
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative',
  },
  presetItemSelected: {
    borderColor: '#00E676',
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  presetImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 6,
  },
  selectedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#00E676',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetLabel: {
    color: '#A0B4AA',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  presetLabelLight: {
    color: '#4B5563',
  },
  presetLabelSelected: {
    color: '#00E676',
    fontWeight: '800',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalFooterLight: {
    borderTopColor: 'rgba(0, 135, 78, 0.12)',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  cancelBtnLight: {},
  cancelBtnText: {
    color: '#A0B4AA',
    fontSize: 13,
    fontWeight: '700',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00874E',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00E676',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 135, 78, 0.4)',
      },
    }),
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#556A5E',
  },
});
