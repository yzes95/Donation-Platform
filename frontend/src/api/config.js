/**
 * Ataa Platform API Configuration
 * 
 * Future FastAPI Integration:
 * 1. Set VITE_API_URL in your .env file to your FastAPI backend (e.g. http://localhost:8000/api)
 * 2. Set VITE_USE_MOCK=false to switch from client mock state to live REST calls.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
export const MOCK_LATENCY = 350; // ms simulated network delay for skeleton feedback
