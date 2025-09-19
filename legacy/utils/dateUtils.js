/**
 * Utilitaires pour la gestion des dates
 */

/**
 * Formate une date en temps relatif (il y a X minutes, heures, jours, etc.)
 * @param {Date|string} date - La date à formater
 * @returns {string} Le temps formaté (ex: "il y a 2 heures")
 */
export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
  if (diffInSeconds < 60) {
    return 'À l\'instant';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `il y a ${diffInMonths} mois`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
};

/**
 * Formate une date en format lisible
 * @param {Date|string} date - La date à formater
 * @param {Object} options - Options de formatage
 * @returns {string} La date formatée
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const targetDate = new Date(date);
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return targetDate.toLocaleDateString('fr-FR', defaultOptions);
};

/**
 * Formate une date avec l'heure
 * @param {Date|string} date - La date à formater
 * @returns {string} La date et l'heure formatées
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const targetDate = new Date(date);
  return targetDate.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Vérifie si une date est aujourd'hui
 * @param {Date|string} date - La date à vérifier
 * @returns {boolean} True si la date est aujourd'hui
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const today = new Date();
  const targetDate = new Date(date);
  
  return today.toDateString() === targetDate.toDateString();
};

/**
 * Vérifie si une date est hier
 * @param {Date|string} date - La date à vérifier
 * @returns {boolean} True si la date est hier
 */
export const isYesterday = (date) => {
  if (!date) return false;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const targetDate = new Date(date);
  
  return yesterday.toDateString() === targetDate.toDateString();
};

/**
 * Calcule la différence en jours entre deux dates
 * @param {Date|string} date1 - Première date
 * @param {Date|string} date2 - Deuxième date
 * @returns {number} Différence en jours
 */
export const daysDifference = (date1, date2) => {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  const diffTime = Math.abs(secondDate - firstDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default {
  formatTimeAgo,
  formatDate,
  formatDateTime,
  isToday,
  isYesterday,
  daysDifference,
};