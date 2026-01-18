/**
 * Application Configuration & Constants
 * Centralized configuration for the AlfMart e-commerce platform
 * @module config
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================
export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || window.location.origin,
  ENDPOINTS: {
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders',
    CONFIG: '/api/config',
    TRACK_ORDER: '/api/track-order'
  },
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// ============================================================================
// THEME CONFIGURATION
// ============================================================================
export const THEME_CONFIG = {
  STORAGE_KEY: 'alfmart-theme',
  DARK_CLASS: 'dark',
  MODES: {
    LIGHT: 'light',
    DARK: 'dark'
  },
  DEFAULT: 'light'
};

// ============================================================================
// CART CONFIGURATION
// ============================================================================
export const CART_CONFIG = {
  STORAGE_KEY: 'cart',
  PAGINATION_SIZE: 12,
  MAX_ITEMS_PER_SKU: 99
};

// ============================================================================
// CONTACT CONFIGURATION
// ============================================================================
export const CONTACT_CONFIG = {
  WHATSAPP_NUMBER: '923268502690',
  SUPPORT_EMAIL: 'alfmart.store@gmail.com',
  SUPPORT_PHONE: '03268502690',
  BANK: {
    NAME: 'Meezan Bank',
    ACCOUNT_TITLE: 'MUHAMMAD AHMAD',
    ACCOUNT_NUMBER: '02780113523044',
    IBAN: 'PK98MEZN0002780113523044',
    BRANCH: 'Avian Chowk Br Lahore'
  }
};

// ============================================================================
// COLOR MAPPING (Hex codes for product colors)
// ============================================================================
export const COLOR_MAP = {
  black: '#1A1A1A',
  brown: '#8B4513',
  gray: '#808080',
  lightgray: '#D3D3D3'
};

// ============================================================================
// PRODUCT CATEGORIES
// ============================================================================
export const PRODUCT_CATEGORIES = {
  BIFOLD: 'bifold',
  LONG: 'long'
};

// ============================================================================
// SORTING OPTIONS
// ============================================================================
export const SORT_OPTIONS = {
  NAME: 'name',
  PRICE_LOW: 'price-low',
  PRICE_HIGH: 'price-high',
  NEWEST: 'newest'
};

// ============================================================================
// PAYMENT METHODS
// ============================================================================
export const PAYMENT_METHODS = {
  CASH_ON_DELIVERY: 'cod',
  BANK_TRANSFER: 'bank'
};

// ============================================================================
// FORM VALIDATION PATTERNS
// ============================================================================
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9+\-\s]{10,}$/,
  POSTAL_CODE: /^[0-9]{5}$/
};

// ============================================================================
// PAGINATION DEFAULTS
// ============================================================================
export const PAGINATION = {
  ITEMS_PER_PAGE: 12,
  CURRENT_PAGE: 1
};

// ============================================================================
// ANIMATION DURATIONS (in milliseconds)
// ============================================================================
export const ANIMATIONS = {
  TRANSITION_FAST: 200,
  TRANSITION_NORMAL: 300,
  TRANSITION_SLOW: 500,
  MODAL_OPEN: 300,
  MODAL_CLOSE: 200
};

// ============================================================================
// SCROLL BEHAVIOR
// ============================================================================
export const SCROLL_CONFIG = {
  SCROLL_THRESHOLD: 50,
  SMOOTH_BEHAVIOR: true
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  INVALID_FORM: 'Please fill in all required fields correctly.',
  ORDER_FAILED: 'Failed to process order. Please try again.',
  EMAIL_SEND_FAILED: 'Failed to send email. Please try again.',
  PRODUCT_LOAD_ERROR: 'Failed to load products. Please refresh the page.',
  CONFIG_LOAD_ERROR: 'Failed to load configuration. Please refresh the page.'
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================
export const SUCCESS_MESSAGES = {
  ORDER_PLACED: 'Order placed successfully!',
  EMAIL_SENT: 'Email sent successfully!',
  FORM_SUBMITTED: 'Form submitted successfully!',
  ITEMS_ADDED_TO_CART: 'Items added to cart!'
};

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================
export const STORAGE_KEYS = {
  CART: 'cart',
  THEME: 'alfmart-theme',
  USER_PREFERENCES: 'alfmart-preferences',
  RECENT_ORDERS: 'alfmart-recent-orders'
};

// ============================================================================
// PRODUCT DATA DEFAULTS
// ============================================================================
export const PRODUCT_DEFAULTS = {
  IMAGE_FALLBACK: '/placeholder-image.png',
  MIN_PRICE: 0,
  MAX_PRICE: 100000
};

// ============================================================================
// PRODUCT IMAGE CONFIGURATION
// ============================================================================
export const PRODUCT_IMAGES = {
  BASE_PATH: '/Public',
  PRODUCTS: {
    1: {
      name: 'Genuine Leather Bifold Wallet',
      folder: 'Genuine Leather Bifold Wallet',
      prefix: 'glbw',
      format: 'jpg'
    },
    2: {
      name: 'Pebbled Leather Long Wallet',
      folder: 'Pebbled Leather Long Wallet',
      prefix: 'pllw',
      format: 'jpg'
    },
    3: {
      name: 'Vintage Leather Bifold Wallet',
      folder: 'Vintage Leather Bifold Wallet',
      prefix: 'vlbw',
      format: 'jpg',
      colorOverrides: {
        gray: 'VLBWGray'
      }
    }
  },
  HERO_IMAGE: '/Public/heropageimage.jpg'
};

// ============================================================================
// IMAGE PATH GENERATOR
// ============================================================================
export const getProductImagePath = (productId, color = 'black') => {
  const product = PRODUCT_IMAGES.PRODUCTS[productId];
  if (!product) return PRODUCT_DEFAULTS.IMAGE_FALLBACK;
  
  const colorName = product.colorOverrides?.[color] || `${product.prefix}${color}`;
  return `${PRODUCT_IMAGES.BASE_PATH}/${product.folder}/${colorName}.${product.format}`;
};

export default {
  API_CONFIG,
  THEME_CONFIG,
  CART_CONFIG,
  CONTACT_CONFIG,
  COLOR_MAP,
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
  PAYMENT_METHODS,
  VALIDATION_PATTERNS,
  PAGINATION,
  ANIMATIONS,
  SCROLL_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  PRODUCT_DEFAULTS,
  PRODUCT_IMAGES,
  getProductImagePath
};
