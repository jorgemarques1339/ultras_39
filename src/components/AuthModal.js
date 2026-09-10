import React, { useState, memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Phone,
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

function AuthModal({ visible, onClose, isDark = true, initialTab = 'login' }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 650;
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFillDemo = () => {
    setEmail('exemplo@gmail.com');
    setPassword('1234567');
    setErrorMsg('');
  };

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Por favor preenche o email e a palavra-passe.');
      return;
    }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Credenciais inválidas.');
    } else {
      if (onClose) onClose();
    }
  };

  const handleRegister = async () => {
    setErrorMsg('');
    if (!name || !email || !password) {
      setErrorMsg('Por favor preenche todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    const res = await register(name, email, password, phone || '912 345 678');
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao criar conta.');
    } else {
      if (onClose) onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            isTablet && styles.containerTablet,
            !isDark && styles.containerLight,
          ]}
        >
          {/* Header do Modal */}
          <View style={[styles.header, !isDark && styles.headerLight]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.headerIconBox, !isDark && styles.headerIconBoxLight]}>
                <ShieldCheck size={18} color={isDark ? COLORS.primaryLight : '#00874E'} />
              </View>
              <View>
                <Text style={[styles.headerTitle, !isDark && styles.textDark]}>
                  Perfil do Adepto
                </Text>
                <Text style={[styles.headerSubtitle, !isDark && styles.headerSubtitleLight]}>
                  Grupo 39 · Rio Ave FC
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, !isDark && styles.closeBtnLight]}
              activeOpacity={0.7}
              accessibilityLabel="Fechar"
            >
              <X size={18} color={isDark ? COLORS.textSecondary : '#5A6E63'} />
            </TouchableOpacity>
          </View>

          {/* Seletor de Abas (Login / Registar) */}
          <View style={[styles.tabBar, !isDark && styles.tabBarLight]}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'login' && styles.tabBtnActive,
                !isDark && activeTab === 'login' && styles.tabBtnActiveLight,
              ]}
              onPress={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
              activeOpacity={0.8}
            >
              <LogIn size={14} color={activeTab === 'login' ? '#FFF' : (isDark ? '#8A9E93' : '#5A6E63')} />
              <Text
                style={[
                  styles.tabBtnText,
                  !isDark && styles.textMutedDark,
                  activeTab === 'login' && styles.tabBtnTextActive,
                ]}
              >
                Iniciar Sessão
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'register' && styles.tabBtnActive,
                !isDark && activeTab === 'register' && styles.tabBtnActiveLight,
              ]}
              onPress={() => {
                setActiveTab('register');
                setErrorMsg('');
              }}
              activeOpacity={0.8}
            >
              <UserPlus size={14} color={activeTab === 'register' ? '#FFF' : (isDark ? '#8A9E93' : '#5A6E63')} />
              <Text
                style={[
                  styles.tabBtnText,
                  !isDark && styles.textMutedDark,
                  activeTab === 'register' && styles.tabBtnTextActive,
                ]}
              >
                Criar Conta
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollBody}
          >
            {/* Mensagem de Erro se houver */}
            {!!errorMsg && (
              <View style={styles.errorBox}>
                <AlertCircle size={15} color="#FF5252" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {activeTab === 'login' ? (
              <>
                {/* Banner de Demonstração Rápida */}
                <TouchableOpacity
                  style={[styles.demoBanner, !isDark && styles.demoBannerLight]}
                  onPress={handleFillDemo}
                  activeOpacity={0.85}
                >
                  <View style={styles.demoIconBox}>
                    <Sparkles size={14} color="#F2B600" />
                  </View>
                  <View style={styles.demoTextCol}>
                    <Text style={[styles.demoTitle, !isDark && styles.textDark]}>
                      Conta Demo Pré-configurada
                    </Text>
                    <Text style={[styles.demoDesc, !isDark && styles.demoDescLight]}>
                      exemplo@gmail.com · Palavra-passe: 1234567
                    </Text>
                  </View>
                  <View style={styles.demoFillBadge}>
                    <Text style={styles.demoFillBadgeText}>Preencher</Text>
                  </View>
                </TouchableOpacity>

                {/* Campo Email */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, !isDark && styles.inputLabelLight]}>
                    Email do Adepto / Sócio
                  </Text>
                  <View style={[styles.inputWrapper, !isDark && styles.inputWrapperLight]}>
                    <Mail size={16} color={isDark ? '#7E9187' : '#5A6E63'} />
                    <TextInput
                      style={[styles.textInput, !isDark && styles.textInputLight]}
                      placeholder="exemplo@gmail.com"
                      placeholderTextColor={isDark ? '#55685F' : '#94A39B'}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                {/* Campo Senha */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, !isDark && styles.inputLabelLight]}>
                    Palavra-passe
                  </Text>
                  <View style={[styles.inputWrapper, !isDark && styles.inputWrapperLight]}>
                    <Lock size={16} color={isDark ? '#7E9187' : '#5A6E63'} />
                    <TextInput
                      style={[styles.textInput, !isDark && styles.textInputLight]}
                      placeholder="••••••••"
                      placeholderTextColor={isDark ? '#55685F' : '#94A39B'}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((p) => !p)}
                      activeOpacity={0.7}
                    >
                      {showPassword ? (
                        <EyeOff size={16} color={isDark ? '#7E9187' : '#5A6E63'} />
                      ) : (
                        <Eye size={16} color={isDark ? '#7E9187' : '#5A6E63'} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Botão de Submissão Login */}
                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <LogIn size={16} color="#FFF" />
                      <Text style={styles.submitBtnText}>Entrar no Grupo 39</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Formulário de Registo */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, !isDark && styles.inputLabelLight]}>
                    Nome Completo
                  </Text>
                  <View style={[styles.inputWrapper, !isDark && styles.inputWrapperLight]}>
                    <User size={16} color={isDark ? '#7E9187' : '#5A6E63'} />
                    <TextInput
                      style={[styles.textInput, !isDark && styles.textInputLight]}
                      placeholder="Salvador Vilacondense"
                      placeholderTextColor={isDark ? '#55685F' : '#94A39B'}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, !isDark && styles.inputLabelLight]}>
                    Email
                  </Text>
                  <View style={[styles.inputWrapper, !isDark && styles.inputWrapperLight]}>
                    <Mail size={16} color={isDark ? '#7E9187' : '#5A6E63'} />
                    <TextInput
                      style={[styles.textInput, !isDark && styles.textInputLight]}
                      placeholder="teu.email@dominio.pt"
                      placeholderTextColor={isDark ? '#55685F' : '#94A39B'}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, !isDark && styles.inputLabelLight]}>
                    Telemóvel (para MB WAY)
                  </Text>
                  <View style={[styles.inputWrapper, !isDark && styles.inputWrapperLight]}>
                    <Phone size={16} color={isDark ? '#7E9187' : '#5A6E63'} />
                    <TextInput
                      style={[styles.textInput, !isDark && styles.textInputLight]}
                      placeholder="912 345 678"
                      placeholderTextColor={isDark ? '#55685F' : '#94A39B'}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, !isDark && styles.inputLabelLight]}>
                    Palavra-passe
                  </Text>
                  <View style={[styles.inputWrapper, !isDark && styles.inputWrapperLight]}>
                    <Lock size={16} color={isDark ? '#7E9187' : '#5A6E63'} />
                    <TextInput
                      style={[styles.textInput, !isDark && styles.textInputLight]}
                      placeholder="Mínimo 4 caracteres"
                      placeholderTextColor={isDark ? '#55685F' : '#94A39B'}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((p) => !p)}
                      activeOpacity={0.7}
                    >
                      {showPassword ? (
                        <EyeOff size={16} color={isDark ? '#7E9187' : '#5A6E63'} />
                      ) : (
                        <Eye size={16} color={isDark ? '#7E9187' : '#5A6E63'} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <UserPlus size={16} color="#FFF" />
                      <Text style={styles.submitBtnText}>Criar Conta de Adepto</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}

            <View style={styles.infoFooter}>
              <Text style={[styles.infoFooterText, !isDark && styles.textMutedDark]}>
                Acesso livre sem login às páginas Início e Loja. O Fórum, Perfil e Deslocações antecipadas com preço de sócio (7,50 €) requerem sessão iniciada.
              </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  container: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#0C1510',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.85)',
      },
    }),
  },
  containerTablet: {
    maxWidth: 480,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 135, 78, 0.22)',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#101C14',
  },
  headerLight: {
    backgroundColor: '#F8FAF9',
    borderBottomColor: 'rgba(0, 135, 78, 0.12)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 179, 104, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 104, 0.35)',
  },
  headerIconBoxLight: {
    backgroundColor: '#EDF6F1',
    borderColor: 'rgba(0, 135, 78, 0.25)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#8A9E93',
  },
  headerSubtitleLight: {
    color: '#5A6E63',
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
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0A110D',
    padding: 6,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabBarLight: {
    backgroundColor: '#F0F4F2',
    borderBottomColor: 'rgba(0, 135, 78, 0.08)',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 9,
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: '#00B368',
  },
  tabBtnActiveLight: {
    backgroundColor: '#00874E',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A9E93',
  },
  tabBtnTextActive: {
    color: '#FFF',
  },
  scrollBody: {
    padding: 20,
    gap: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.35)',
    padding: 10,
    borderRadius: 10,
  },
  errorText: {
    color: '#FF7070',
    fontSize: 12,
    flex: 1,
    fontWeight: '600',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(242, 182, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(242, 182, 0, 0.3)',
    borderRadius: 12,
    padding: 12,
  },
  demoBannerLight: {
    backgroundColor: '#FFFDF2',
    borderColor: 'rgba(242, 182, 0, 0.35)',
  },
  demoIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(242, 182, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoTextCol: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  demoDesc: {
    fontSize: 11,
    color: '#C4B584',
    marginTop: 2,
  },
  demoDescLight: {
    color: '#827344',
  },
  demoFillBadge: {
    backgroundColor: '#F2B600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  demoFillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0A110D',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CAEA4',
  },
  inputLabelLight: {
    color: '#4B5E54',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131F17',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
  },
  inputWrapperLight: {
    backgroundColor: '#F4F7F5',
    borderColor: 'rgba(0, 135, 78, 0.18)',
  },
  textInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
    paddingVertical: 0,
  },
  textInputLight: {
    color: '#0E1712',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00B368',
    height: 48,
    borderRadius: 12,
    marginTop: 6,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 179, 104, 0.4)',
      },
    }),
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  infoFooter: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  infoFooterText: {
    fontSize: 11,
    color: '#708277',
    textAlign: 'center',
    lineHeight: 16,
  },
  textDark: {
    color: '#0E1712',
  },
  textMutedDark: {
    color: '#5A6E63',
  },
});

export default memo(AuthModal);
