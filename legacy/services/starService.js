import { API_BASE_URL } from '../config/api';

class StarService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Upload d'image de profil pour une star
  async uploadProfileImage(starId, imageUri) {
    try {
      const formData = new FormData();
      formData.append('profileImage', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await fetch(`${this.baseURL}/stars/${starId}/profile-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw error;
    }
  }

  // Créer une nouvelle star avec token
  async createStarToken(starData, imageUri = null) {
    try {
      // D'abord créer la star
      const starResponse = await fetch(`${this.baseURL}/stars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: starData.name.split(' ')[0] || starData.name,
          lastName: starData.name.split(' ').slice(1).join(' ') || '',
          category: 'Personnalité', // Catégorie par défaut
          description: starData.description,
          hasTokens: true,
          tokenInfo: {
            totalTokensIssued: parseInt(starData.totalSupply),
            currentTokenPrice: parseFloat(starData.initialPrice),
            marketCap: parseInt(starData.totalSupply) * parseFloat(starData.initialPrice),
            totalTokensSold: 0,
            totalValueTraded: 0
          },
          currentTokenPrice: parseFloat(starData.initialPrice),
          totalTokensSold: 0,
          totalValueTraded: 0
        }),
      });

      if (!starResponse.ok) {
        throw new Error(`HTTP error! status: ${starResponse.status}`);
      }

      const star = await starResponse.json();

      // Si une image est fournie, l'uploader
      if (imageUri && star.data) {
        try {
          await this.uploadProfileImage(star.data._id, imageUri);
        } catch (uploadError) {
          console.warn('Erreur lors de l\'upload de l\'image, mais la star a été créée:', uploadError);
        }
      }

      return star;
    } catch (error) {
      console.error('Erreur lors de la création de la star:', error);
      throw error;
    }
  }

  // Récupérer toutes les stars
  async getAllStars() {
    try {
      const response = await fetch(`${this.baseURL}/stars`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des stars:', error);
      throw error;
    }
  }

  // Récupérer une star par ID
  async getStarById(starId) {
    try {
      const response = await fetch(`${this.baseURL}/stars/${starId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération de la star:', error);
      throw error;
    }
  }
}

export default new StarService();