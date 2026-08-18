import { API_BASE_URL, USE_MOCK, MOCK_LATENCY } from './config';
import { delay } from '../lib/utils';

class ApiClient {
  async get(endpoint, mockFallbackData) {
    if (USE_MOCK) {
      await delay(MOCK_LATENCY);
      return typeof mockFallbackData === 'function' ? mockFallbackData() : mockFallbackData;
    }

    const token = localStorage.getItem('ataa_auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || err.message || `API Error: ${response.status}`);
    }
    return response.json();
  }

  async post(endpoint, data, mockHandler) {
    if (USE_MOCK) {
      await delay(MOCK_LATENCY + 200);
      return mockHandler ? mockHandler(data) : { success: true, data };
    }

    const token = localStorage.getItem('ataa_auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || err.message || `API Error: ${response.status}`);
    }
    return response.json();
  }

  async put(endpoint, data, mockHandler) {
    if (USE_MOCK) {
      await delay(MOCK_LATENCY);
      return mockHandler ? mockHandler(data) : { success: true, data };
    }

    const token = localStorage.getItem('ataa_auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || err.message || `API Error: ${response.status}`);
    }
    return response.json();
  }

  async delete(endpoint, mockHandler) {
    if (USE_MOCK) {
      await delay(MOCK_LATENCY);
      return mockHandler ? mockHandler() : { success: true };
    }

    const token = localStorage.getItem('ataa_auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || err.message || `API Error: ${response.status}`);
    }
    return response.json();
  }
}

export const apiClient = new ApiClient();
