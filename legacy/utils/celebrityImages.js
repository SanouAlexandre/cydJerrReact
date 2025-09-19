// Mapping des images locales des célébrités
const celebrityImages = {
  // Footballeurs
  'Mike Maignan': require('../assets/images/mike.jpg'),
  'Kylian Mbappe': require('../assets/images/kylian-mbappe-4.png'),
  'Kylian Mbappé': require('../assets/images/kylian-mbappe-4.png'),
  'Cristiano Ronaldo': require('../assets/images/cristiano.jpg'),
  'Lionel Messi': require('../assets/images/messi.png'),
};

/**
 * Obtient l'image locale d'une célébrité basée sur son nom
 * @param {string} firstName - Prénom de la célébrité
 * @param {string} lastName - Nom de famille de la célébrité
 * @param {string} stageName - Nom de scène (optionnel)
 * @returns {any} - Image locale ou null si non trouvée
 */
export const getCelebrityImage = (firstName, lastName, stageName = null) => {
  const fullName = `${firstName} ${lastName}`;
  
  // Essayer d'abord avec le nom complet
  if (celebrityImages[fullName]) {
    return celebrityImages[fullName];
  }
  
  // Essayer avec le nom de scène si disponible
  if (stageName && celebrityImages[stageName]) {
    return celebrityImages[stageName];
  }
  
  // Essayer avec des variations du nom
  const nameVariations = [
    fullName,
    `${firstName} ${lastName}`,
    stageName,
    firstName,
    lastName
  ].filter(Boolean);
  
  for (const variation of nameVariations) {
    if (celebrityImages[variation]) {
      return celebrityImages[variation];
    }
  }
  
  return null;
};

/**
 * Vérifie si une célébrité a une image locale disponible
 * @param {string} firstName - Prénom de la célébrité
 * @param {string} lastName - Nom de famille de la célébrité
 * @param {string} stageName - Nom de scène (optionnel)
 * @returns {boolean} - True si une image locale est disponible
 */
export const hasCelebrityImage = (firstName, lastName, stageName = null) => {
  return getCelebrityImage(firstName, lastName, stageName) !== null;
};

export default celebrityImages;