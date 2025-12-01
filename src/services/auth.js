// src/services/auth.js
const API_BASE_URL = 'http://https://xas-metal.onrender.com/api';

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('Auth request error:', error);
      throw error;
    }
  }

  // Check if admin exists
  async checkAdminExists() {
    return this.request('/auth/check-admin');
  }

  // Register new user
  async register(username, password, email = '') {
    return this.request('/auth/register', {
      method: 'POST',
      body: {
        username,
        password,
        email: email || `${username}@scrapmanagement.com`
      }
    });
  }

  // Login user
  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { username, password }
    });
  }

  // Get current user
  async getCurrentUser(token) {
    return this.request('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Store token in localStorage
  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
}

// Export as default
export default new AuthService();