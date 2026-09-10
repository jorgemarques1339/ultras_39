export const COLORS = {
  // Cores Oficiais Rio Ave FC & Grupo 39 (Verde & Branco)
  primary: '#00874E',          // Verde Rio Ave Oficial
  primaryDark: '#005D35',      // Verde Escuro Profundo
  primaryLight: '#00B368',     // Verde Vibrante de Destaque
  primaryGlow: 'rgba(0, 179, 104, 0.45)',
  
  white: '#FFFFFF',            // Branco puro
  gold: '#00B368',             // Verde de destaque Rio Ave FC (substitui amarelo)
  goldGlow: 'rgba(0, 179, 104, 0.35)',
  
  // Backgrounds escuros (Dark Verde / Slate)
  bgDark: '#0D1310',           // Fundo principal ultra dark verde
  bgCard: '#131D18',           // Cards principais
  bgCardElevated: '#1A2721',   // Cards elevados
  bgInput: '#18241E',          // Inputs e campos
  
  // MB WAY cores oficiais (específico SIBS)
  mbwayBlue: '#004B87',        // Azul institucional SIBS / MB WAY
  mbwayTeal: '#00A3E0',        // Ciano / Azul vibrante
  mbwayRed: '#E31B23',         // Vermelho ponto MB WAY
  
  // Estados
  success: '#00C853',
  warning: '#00B368',
  error: '#FF5252',
  info: '#00B368',
  
  // Texto e contrastes
  textPrimary: '#FFFFFF',
  textSecondary: '#A0B4AA',
  textMuted: '#677E73',
  textGold: '#00B368',
  
  // Glassmorphism & Bordas
  glassBg: 'rgba(19, 29, 24, 0.78)',
  glassBgHeavy: 'rgba(13, 19, 16, 0.92)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassBorderActive: 'rgba(0, 179, 104, 0.6)',
  glassHighlight: 'rgba(255, 255, 255, 0.2)',
};

export const SHADOWS = {
  glass: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  glowGreen: {
    shadowColor: '#00B368',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  glowGold: {
    shadowColor: '#00B368',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
};
