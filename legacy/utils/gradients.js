// Utilitaires pour les dégradés JobJerr
export const gradients = {
  // Dégradé principal 135° : #1A1A2E → #16213E → #0F3460
  main: ['#1A1A2E', '#16213E', '#0F3460'],
  
  // Dégradé pour les headers et footers
  header: ['rgba(15, 28, 63, 0.98)', 'rgba(15, 28, 63, 0.95)'],
  
  // Dégradé pour les boutons actifs
  button: ['#FFDE59', '#FFD700'],
  
  // Dégradé pour les cartes glassmorphiques
  glass: ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)'],
  
  // Dégradé pour les overlays
  overlay: ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)'],
  
  // Dégradé pour les accents
  accent: ['#FFDE59', '#FFA726'],
  
  // Dégradé pour les réactions
  reaction: {
    like: ['#4285F4', '#1976D2'],
    celebrate: ['#FFDE59', '#FFC107'],
    support: ['#EA4335', '#D32F2F'],
    insightful: ['#34A853', '#388E3C'],
    curious: ['#FF6D01', '#F57C00']
  }
};

// Fonction helper pour créer des dégradés personnalisés
export const createGradient = (colors, angle = 135) => {
  return {
    colors,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations: colors.length === 2 ? [0, 1] : [0, 0.5, 1]
  };
};

// Fonction pour obtenir les coordonnées d'angle
export const getGradientCoordinates = (angle) => {
  const radians = (angle * Math.PI) / 180;
  return {
    start: { x: 0, y: 0 },
    end: {
      x: Math.cos(radians),
      y: Math.sin(radians)
    }
  };
};