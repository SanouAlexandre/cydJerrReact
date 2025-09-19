// Utilitaires de validation pour les formulaires et données

// Expressions régulières communes
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[1-9]?[0-9]{7,15}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const URL_REGEX = /^(https?:\/\/)?(([\da-z\.-]+)\.([a-z\.]{2,6})|([\da-z\.-]+))([\/:?#][\da-z\.-]*)*\/?$/;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Validation d'email
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  try {
    return EMAIL_REGEX.test(email.trim().toLowerCase());
  } catch (error) {
    return false;
  }
};

// Validation de mot de passe
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 8 && PASSWORD_REGEX.test(password);
};

// Validation de mot de passe simple (pour les cas moins stricts)
export const isValidSimplePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

// Validation de numéro de téléphone
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return PHONE_REGEX.test(phone.replace(/\s/g, ''));
};

// Validation d'URL
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return URL_REGEX.test(url.trim());
};

// Validation de slug (pour les URLs)
export const isValidSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return false;
  try {
    return SLUG_REGEX.test(slug.trim().toLowerCase());
  } catch (error) {
    return false;
  }
};

// Validation de nom/prénom
export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed);
};

// Validation d'âge
export const isValidAge = (age) => {
  const numAge = parseInt(age);
  return !isNaN(numAge) && numAge >= 13 && numAge <= 120;
};

// Validation de date de naissance
export const isValidBirthDate = (date) => {
  if (!date) return false;
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 13 && age <= 120;
};

// Validation de montant (prix, contribution, etc.)
export const isValidAmount = (amount, min = 0, max = 1000000) => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount >= min && numAmount <= max;
};

// Validation de pourcentage
export const isValidPercentage = (percentage) => {
  const numPercentage = parseFloat(percentage);
  return !isNaN(numPercentage) && numPercentage >= 0 && numPercentage <= 100;
};

// Validation de note (rating)
export const isValidRating = (rating) => {
  const numRating = parseFloat(rating);
  return !isNaN(numRating) && numRating >= 1 && numRating <= 5;
};

// Validation de texte (description, commentaire, etc.)
export const isValidText = (text, minLength = 1, maxLength = 1000) => {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

// Validation de titre
export const isValidTitle = (title) => {
  return isValidText(title, 3, 100);
};

// Validation de description
export const isValidDescription = (description) => {
  return isValidText(description, 10, 2000);
};

// Validation de code postal
export const isValidPostalCode = (postalCode, country = 'FR') => {
  if (!postalCode || typeof postalCode !== 'string') return false;
  
  const patterns = {
    FR: /^[0-9]{5}$/,
    US: /^[0-9]{5}(-[0-9]{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
    UK: /^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][ABD-HJLNP-UW-Z]{2}$/i
  };
  
  const pattern = patterns[country.toUpperCase()];
  return pattern ? pattern.test(postalCode.trim()) : true;
};

// Validation de fichier
export const isValidFile = (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  if (!file) return false;
  
  // Vérifier le type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return false;
  }
  
  // Vérifier la taille
  if (file.size > maxSize) {
    return false;
  }
  
  return true;
};

// Validation d'image
export const isValidImage = (file, maxSize = 5 * 1024 * 1024) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return isValidFile(file, allowedTypes, maxSize);
};

// Validation de document
export const isValidDocument = (file, maxSize = 10 * 1024 * 1024) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  return isValidFile(file, allowedTypes, maxSize);
};

// Validation de coordonnées GPS
export const isValidCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  return !isNaN(latitude) && !isNaN(longitude) &&
         latitude >= -90 && latitude <= 90 &&
         longitude >= -180 && longitude <= 180;
};

// Validation de couleur hexadécimale
export const isValidHexColor = (color) => {
  if (!color || typeof color !== 'string') return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Validation de numéro de carte de crédit (algorithme de Luhn)
export const isValidCreditCard = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') return false;
  
  const num = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(num)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Validation de date d'expiration de carte
export const isValidExpiryDate = (month, year) => {
  const numMonth = parseInt(month);
  const numYear = parseInt(year);
  
  if (isNaN(numMonth) || isNaN(numYear)) return false;
  if (numMonth < 1 || numMonth > 12) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  if (numYear < currentYear) return false;
  if (numYear === currentYear && numMonth < currentMonth) return false;
  
  return true;
};

// Validation de CVV
export const isValidCVV = (cvv) => {
  if (!cvv || typeof cvv !== 'string') return false;
  return /^\d{3,4}$/.test(cvv);
};

// Fonction utilitaire pour nettoyer les chaînes
export const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
};

// Fonction utilitaire pour formater le numéro de téléphone
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  return phone;
};

// Fonction utilitaire pour formater le montant
export const formatAmount = (amount, currency = '€') => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '0' + currency;
  
  return numAmount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + currency;
};

// Validation de formulaire générique
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    // Vérifier si le champ est requis
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = rule.requiredMessage || `${field} est requis`;
      return;
    }
    
    // Si le champ n'est pas requis et est vide, passer
    if (!rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return;
    }
    
    // Appliquer les validations
    if (rule.validator && !rule.validator(value)) {
      errors[field] = rule.message || `${field} n'est pas valide`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Messages d'erreur par défaut
export const DEFAULT_ERROR_MESSAGES = {
  required: 'Ce champ est requis',
  email: 'Adresse email invalide',
  password: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
  simplePassword: 'Le mot de passe doit contenir au moins 6 caractères',
  phone: 'Numéro de téléphone invalide',
  url: 'URL invalide',
  name: 'Le nom doit contenir entre 2 et 50 caractères',
  age: 'L\'âge doit être entre 13 et 120 ans',
  amount: 'Montant invalide',
  rating: 'La note doit être entre 1 et 5',
  title: 'Le titre doit contenir entre 3 et 100 caractères',
  description: 'La description doit contenir entre 10 et 2000 caractères',
  file: 'Fichier invalide',
  image: 'Image invalide (formats acceptés: JPEG, PNG, GIF, WebP)',
  document: 'Document invalide (formats acceptés: PDF, DOC, DOCX, TXT)',
  creditCard: 'Numéro de carte de crédit invalide',
  expiryDate: 'Date d\'expiration invalide',
  cvv: 'CVV invalide'
};