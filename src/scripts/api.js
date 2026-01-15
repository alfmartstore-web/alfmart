/**
 * API Service Layer
 * Centralized API communication for the AlfMart platform
 * Handles all HTTP requests with error handling and retry logic
 * @module apiService
 */

import { API_CONFIG, ERROR_MESSAGES } from './config.js';

// ============================================================================
// API SERVICE CLASS
// ============================================================================
class APIService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  /**
   * Fetch products from the API
   * @async
   * @returns {Promise<Array>} Array of product objects
   * @throws {Error} If fetch fails after retries
   */
  async fetchProducts() {
    return this._fetchWithRetry(API_CONFIG.ENDPOINTS.PRODUCTS);
  }

  /**
   * Fetch application configuration
   * @async
   * @returns {Promise<Object>} Configuration object
   * @throws {Error} If fetch fails after retries
   */
  async fetchConfig() {
    return this._fetchWithRetry(API_CONFIG.ENDPOINTS.CONFIG);
  }

  /**
   * Submit a new order
   * @async
   * @param {Object} orderData - Order details
   * @param {string} orderData.customerName - Customer name
   * @param {string} orderData.email - Customer email
   * @param {string} orderData.phone - Customer phone
   * @param {string} orderData.address - Delivery address
   * @param {string} orderData.city - Delivery city
   * @param {Array} orderData.items - Cart items
   * @param {string} orderData.paymentMethod - Payment method (cod|bank)
   * @returns {Promise<Object>} Order response with order ID
   * @throws {Error} If submission fails
   */
  async submitOrder(orderData) {
    return this._postWithRetry(API_CONFIG.ENDPOINTS.ORDERS, orderData);
  }

  /**
   * Track an order by order ID
   * @async
   * @param {string} orderId - Order ID to track
   * @returns {Promise<Object>} Order status and details
   * @throws {Error} If tracking fails
   */
  async trackOrder(orderId) {
    return this._fetchWithRetry(`${API_CONFIG.ENDPOINTS.TRACK_ORDER}/${orderId}`);
  }

  /**
   * Internal fetch method with retry logic and error handling
   * @private
   * @async
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>} Parsed JSON response
   * @throws {Error} If all retries fail
   */
  async _fetchWithRetry(endpoint) {
    let lastError;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await Promise.race([
          fetch(`${this.baseURL}${endpoint}`),
          this._timeout(this.timeout)
        ]);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error;
        console.warn(`Fetch attempt ${attempt}/${this.retryAttempts} failed:`, error.message);

        // Wait before retrying (exponential backoff)
        if (attempt < this.retryAttempts) {
          await this._delay(Math.pow(2, attempt - 1) * 1000);
        }
      }
    }

    console.error(`Failed to fetch ${endpoint} after ${this.retryAttempts} attempts`);
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }

  /**
   * Internal POST method with retry logic
   * @private
   * @async
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Data to send
   * @returns {Promise<Object>} Parsed JSON response
   * @throws {Error} If all retries fail
   */
  async _postWithRetry(endpoint, data) {
    let lastError;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await Promise.race([
          fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }),
          this._timeout(this.timeout)
        ]);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        lastError = error;
        console.warn(`POST attempt ${attempt}/${this.retryAttempts} failed:`, error.message);

        if (attempt < this.retryAttempts) {
          await this._delay(Math.pow(2, attempt - 1) * 1000);
        }
      }
    }

    console.error(`Failed to POST ${endpoint} after ${this.retryAttempts} attempts`);
    throw lastError || new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }

  /**
   * Create a timeout promise that rejects after specified ms
   * @private
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Promise that rejects after timeout
   */
  _timeout(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), ms)
    );
  }

  /**
   * Utility delay function for exponential backoff
   * @private
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Resolves after delay
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================
const apiService = new APIService();

export default apiService;
