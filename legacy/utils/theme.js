/**
 * Theme configuration for TeachJerr mini-OS design
 * Includes colors, shadows, and style presets for neomorphic and glassmorphic effects
 */

export const theme = {
  colors: {
    // Background gradient colors
    bgStart: '#1a1a2e',
    bgMid: '#16213e', 
    bgEnd: '#0f3460',
    
    // Accent colors
    gold: '#FFDE59',
    goldDark: '#E6C850',
    
    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#C9D1D9',
    textTertiary: '#8B949E',
    textDark: '#1a1a2e',
    
    // Glass and card colors
    card: 'rgba(255, 255, 255, 0.06)',
    cardHover: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(255, 255, 255, 0.2)',
    
    // Status colors
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    
    // Badge colors
    bestSeller: '#FF6B6B',
    newBadge: '#4ECDC4',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    
    // Glass effect colors
    glassLight: 'rgba(255, 255, 255, 0.1)',
    glassMedium: 'rgba(255, 255, 255, 0.15)',
    glassDark: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Neomorphic shadow presets
  shadows: {
    softUp: {
      shadowColor: '#000',
      shadowOffset: {
        width: -2,
        height: -2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 3,
    },
    softDown: {
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    strong: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    inner: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 1,
    },
  },
  
  // Border radius presets
  radius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    round: 50,
  },
  
  // Spacing presets
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Typography
  typography: {
    fontFamily: 'Poppins-Regular',
    fontFamilyBold: 'Poppins-Bold',
    
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      title: 32,
    },
    
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  
  // Opacity presets
  opacity: {
    disabled: 0.4,
    secondary: 0.7,
    overlay: 0.8,
    glass: 0.1,
    glassMedium: 0.15,
    glassStrong: 0.2,
  },
  
  // Animation durations
  animation: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },
};

/**
 * Creates a neomorphic shadow effect
 * @param {string} type - 'up', 'down', 'inset'
 * @param {number} intensity - Shadow intensity (0-1)
 * @returns {object} Shadow style object
 */
export const createNeomorphicShadow = (type = 'down', intensity = 1) => {
  const baseOpacity = 0.3 * intensity;
  const baseRadius = 6 * intensity;
  
  switch (type) {
    case 'up':
      return {
        shadowColor: '#000',
        shadowOffset: {
          width: -2 * intensity,
          height: -2 * intensity,
        },
        shadowOpacity: baseOpacity,
        shadowRadius: baseRadius,
        elevation: 3 * intensity,
      };
    case 'inset':
      return {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1 * intensity,
        },
        shadowOpacity: baseOpacity * 0.7,
        shadowRadius: baseRadius * 0.5,
        elevation: 1,
      };
    default: // 'down'
      return {
        shadowColor: '#000',
        shadowOffset: {
          width: 2 * intensity,
          height: 2 * intensity,
        },
        shadowOpacity: baseOpacity,
        shadowRadius: baseRadius,
        elevation: 3 * intensity,
      };
  }
};

/**
 * Creates a glass effect style
 * @param {number} opacity - Glass opacity (0-1)
 * @param {number} blur - Blur intensity (0-1)
 * @returns {object} Glass style object
 */
export const createGlassEffect = (opacity = 0.1, blur = 0.5) => {
  return {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, ${opacity * 2})`,
    // Note: React Native doesn't support backdrop-filter
    // We simulate blur with overlays and gradients
  };
};

/**
 * Gets gradient colors for different contexts
 * @param {string} type - 'background', 'card', 'button', 'promo'
 * @returns {array} Array of gradient colors
 */
export const getGradientColors = (type = 'background') => {
  switch (type) {
    case 'card':
      return ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'];
    case 'button':
      return [theme.colors.gold, theme.colors.goldDark];
    case 'promo':
      return [theme.colors.gold, theme.colors.bgEnd];
    case 'header':
      return ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)'];
    default: // 'background'
      return [theme.colors.bgStart, theme.colors.bgMid, theme.colors.bgEnd];
  }
};

/**
 * Creates hover/press state styles
 * @param {object} baseStyle - Base style object
 * @param {number} scaleAmount - Scale factor for press state
 * @returns {object} Interactive style object
 */
export const createInteractiveStyle = (baseStyle, scaleAmount = 0.95) => {
  return {
    ...baseStyle,
    transform: [{ scale: scaleAmount }],
    opacity: 0.8,
  };
};

export default theme;