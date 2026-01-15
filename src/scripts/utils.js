/**
 * Utility Functions
 * Common helper functions used throughout the application
 * @module utils
 */

/**
 * Format a number as Pakistani currency (PKR)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 * @example formatCurrency(1500) // "1,500"
 */
export const formatCurrency = (amount) => {
  return Number(amount).toLocaleString('en-US');
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Scroll to element smoothly
 * @param {string} elementId - ID of element to scroll to
 * @param {number} offset - Pixel offset from top (default: 0)
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Scroll to top of page smoothly
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Generate a unique order ID
 * @returns {string} Formatted order ID (e.g., "AM-20250115-4523")
 */
export const generateOrderId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `AM-${dateStr}-${randomNum}`;
};

/**
 * Generate WhatsApp message with order details
 * @param {string} orderId - Order ID
 * @param {number} totalAmount - Total order amount
 * @returns {string} Formatted WhatsApp message
 */
export const generateWhatsappMessage = (orderId, totalAmount) => {
  return `Payment Proof for Order ${orderId}\nAmount: PKR ${formatCurrency(totalAmount)}\nPlease attach screenshot of bank transfer.`;
};

/**
 * Generate WhatsApp contact URL
 * @param {string} phoneNumber - Phone number (without +92)
 * @param {string} message - Message to send
 * @returns {string} WhatsApp URL
 */
export const getWhatsappUrl = (phoneNumber, message) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date (e.g., "Jan 15, 2026")
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Get value from localStorage with fallback
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.warn(`Error reading from storage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Save value to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error saving to storage (${key}):`, error);
  }
};

/**
 * Remove value from localStorage
 * @param {string} key - Storage key
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing from storage (${key}):`, error);
  }
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if object is empty
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value or null
 */
export const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

export default {
  formatCurrency,
  validateEmail,
  validatePhone,
  scrollToElement,
  scrollToTop,
  generateOrderId,
  generateWhatsappMessage,
  getWhatsappUrl,
  formatDate,
  deepClone,
  isMobileDevice,
  debounce,
  throttle,
  getFromStorage,
  saveToStorage,
  removeFromStorage,
  isEmpty,
  capitalize,
  getQueryParam
};
