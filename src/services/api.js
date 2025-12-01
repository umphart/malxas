// src/services/api.js// src/services/api.js - Add debugging
const API_BASE_URL = 'https://xas-metal.onrender.com/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage for authenticated requests
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    console.log('=== API REQUEST ===');
    console.log('URL:', url);
    console.log('Method:', config.method || 'GET');
    console.log('Headers:', config.headers);
    console.log('Body:', config.body);

    try {
      const response = await fetch(url, config);
      console.log('=== API RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      
      const data = await response.json();
      console.log('Response Data:', data);

      if (!response.ok) {
        // If unauthorized, clear token and redirect to login
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }


  async getRecords(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/records?${queryParams}` : '/records';
    const response = await this.request(endpoint);
    
    return response;
  }

  async createRecord(recordData) {
    const response = await this.request('/records', {
      method: 'POST',
      body: recordData,
    });
    return response;
  }

  async getRecordById(id) {
    return this.request(`/records/${id}`);
  }

  async updateRecord(id, recordData) {
    return this.request(`/records/${id}`, {
      method: 'PUT',
      body: recordData,
    });
  }

  async deleteRecord(id) {
    return this.request(`/records/${id}`, {
      method: 'DELETE',
    });
  }

  async getDashboardStats(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/records/dashboard/stats?${queryParams}` : '/records/dashboard/stats';
    return this.request(endpoint);
  }

  async getRecentTransactions(limit = 10) {
    return this.request(`/records/recent?limit=${limit}`);
  }

  async getRecordsByDate(date) {
    return this.request(`/records/date/${date}`);
  }
}

// Export as default
export default new ApiService();