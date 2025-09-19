/**
 * Utility functions for handling JERR currency formatting and pricing
 * Rule: 1 JERR = 0.01 €
 * Display: Always show prices in JERR format (e.g., "12 500 JERR")
 */

/**
 * Formats a number as JERR currency with proper separators
 * @param {number} amount - The amount in JERR
 * @returns {string} Formatted JERR string (e.g., "12 500 JERR")
 */
export const formatJerr = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0 JERR';
  }
  
  // Format with space as thousands separator (French style)
  const formatted = amount.toLocaleString('fr-FR', {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return `${formatted} JERR`;
};

/**
 * Applies promotional pricing logic
 * @param {number} basePrice - Original price in JERR
 * @param {number|null} promoPrice - Promotional price in JERR (optional)
 * @returns {object} Object with original and final prices
 */
export const applyPromo = (basePrice, promoPrice = null) => {
  return {
    original: basePrice,
    final: promoPrice !== null && promoPrice !== undefined ? promoPrice : basePrice,
    hasPromo: promoPrice !== null && promoPrice !== undefined && promoPrice < basePrice,
    discount: promoPrice !== null && promoPrice !== undefined && promoPrice < basePrice 
      ? Math.round(((basePrice - promoPrice) / basePrice) * 100)
      : 0,
  };
};

/**
 * Calculates discount percentage
 * @param {number} originalPrice - Original price in JERR
 * @param {number} discountedPrice - Discounted price in JERR
 * @returns {number} Discount percentage (rounded)
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) {
    return 0;
  }
  
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Converts JERR to EUR for internal calculations (not for display)
 * @param {number} jerrAmount - Amount in JERR
 * @returns {number} Amount in EUR
 */
export const jerrToEur = (jerrAmount) => {
  return jerrAmount * 0.01;
};

/**
 * Converts EUR to JERR for internal calculations
 * @param {number} eurAmount - Amount in EUR
 * @returns {number} Amount in JERR
 */
export const eurToJerr = (eurAmount) => {
  return Math.round(eurAmount * 100);
};

/**
 * Validates if a price is valid
 * @param {number} price - Price to validate
 * @returns {boolean} True if valid
 */
export const isValidPrice = (price) => {
  return typeof price === 'number' && !isNaN(price) && price >= 0;
};

/**
 * Formats price range for display
 * @param {number} minPrice - Minimum price in JERR
 * @param {number} maxPrice - Maximum price in JERR
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice) => {
  if (minPrice === maxPrice) {
    return formatJerr(minPrice);
  }
  
  return `${formatJerr(minPrice)} - ${formatJerr(maxPrice)}`;
};

/**
 * Gets price display with discount badge
 * @param {number} basePrice - Original price in JERR
 * @param {number|null} promoPrice - Promotional price in JERR
 * @returns {object} Price display information
 */
export const getPriceDisplay = (basePrice, promoPrice = null) => {
  const pricing = applyPromo(basePrice, promoPrice);
  
  return {
    originalText: formatJerr(pricing.original),
    finalText: formatJerr(pricing.final),
    discountText: pricing.hasPromo ? `-${pricing.discount}%` : null,
    hasDiscount: pricing.hasPromo,
    savings: pricing.hasPromo ? formatJerr(pricing.original - pricing.final) : null,
  };
};