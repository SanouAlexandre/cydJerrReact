import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mainUniverses: [
    { id: 1, name: 'JoyJerr', icon: 'camera', color: '#FF6B9D', type: 'featured' },
    { id: 2, name: 'SagaJerr', icon: 'account-group', color: '#4ECDC4', type: 'main' },
    { id: 3, name: 'NewsJerr', icon: 'newspaper', color: '#FFB6C1', type: 'main' },
    { id: 4, name: 'SpeakJerr', icon: 'microphone', color: '#96CEB4', type: 'main' },
    { id: 5, name: 'ChabJerr', icon: 'chat', color: '#FFEAA7', type: 'main' },
    { id: 6, name: 'PiolJerr', icon: 'map-marker', color: '#DDA0DD', type: 'main' },
    { id: 7, name: 'EvenJerr', icon: 'calendar-star', color: '#87CEEB', type: 'main' },
    { id: 8, name: 'ShopJerr', icon: 'shopping', color: '#DA70D6', type: 'main' },
    { id: 9, name: 'CapiJerr', icon: 'chart-line', color: '#98FB98', type: 'main' },
    { id: 10, name: 'JobJerr', icon: 'briefcase', color: '#F0E68C', type: 'main' },
    { id: 11, name: 'TeachJerr', icon: 'school', color: '#FFA07A', type: 'main' },
    { id: 12, name: 'FundingJerr', icon: 'bank', color: '#B19CD9', type: 'main' },
    { id: 13, name: 'ONG KidJerr', icon: 'baby-face', color: '#FF69B4', type: 'featured' },
  ],
  additionalUniverses: [
    { id: 14, name: 'StarJerr', icon: 'star', color: '#FFD700' },
    { id: 15, name: 'CloudJerr', icon: 'cloud', color: '#B0E0E6' },
    { id: 16, name: 'DoctoJerr', icon: 'medical-bag', color: '#FFB6C1' },
    { id: 17, name: 'AvoJerr', icon: 'scale-balance', color: '#F0E68C' },
    { id: 18, name: 'AssuJerr', icon: 'shield-check', color: '#98FB98' },
    { id: 19, name: 'ImmoJerr', icon: 'home-city', color: '#DDA0DD' },
    { id: 20, name: 'DomJerr', icon: 'web', color: '#FFB6C1' },
    { id: 21, name: 'VagoJerr', icon: 'car', color: '#87CEEB' },
    { id: 22, name: 'AppJerr', icon: 'cellphone', color: '#90EE90' },
    { id: 23, name: 'SmadJerr', icon: 'home-automation', color: '#FFA07A' },
    { id: 24, name: 'GameJerr', icon: 'gamepad-variant', color: '#DDA0DD' },
    { id: 25, name: 'PicJerr', icon: 'camera', color: '#B0E0E6' },
  ],
  specializedUniverses: [
    { id: 24, name: 'CodJerr', icon: 'code-tags', color: '#4ECDC4' },
    { id: 25, name: 'LeaseJerr', icon: 'truck', color: '#FF6B9D' },
  ],
  selectedUniverse: null,
};

const universesSlice = createSlice({
  name: 'universes',
  initialState,
  reducers: {
    selectUniverse: (state, action) => {
      state.selectedUniverse = action.payload;
    },
    clearSelection: (state) => {
      state.selectedUniverse = null;
    },
  },
});

export const { selectUniverse, clearSelection } = universesSlice.actions;
export default universesSlice.reducer;