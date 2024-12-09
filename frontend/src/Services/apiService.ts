import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '../config';

// Define a generic type for CRUD responses
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Generic function for making API requests
const apiService = async <T>(endpoint: string, method: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axios({
      url: `${BASE_URL}${endpoint}`, // Use BASE_URL from config
      method,
      data,
    });

    // Check if response data exists and return it
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid API response format');
    }

    return response.data;  // Ensure data exists in correct format
  } catch (error: any) {
    // Enhanced error handling
    const message = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
};

export const api = {
  // Create
  create: async <T>(endpoint: string, data: T): Promise<ApiResponse<T>> => {
    return apiService<T>(endpoint, 'POST', data);
  },

  // Read (single item)
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const result = await apiService<T>(endpoint, 'GET');
      return result; // Return the API response
    } catch (error: any) {
      // Handle any errors that occurred during the API request
      throw new Error(error.message || 'Error fetching data');
    }
  },

  // Update
  update: async <T>(endpoint: string, data: T): Promise<ApiResponse<T>> => {
    return apiService<T>(endpoint, 'PUT', data);
  },

  // Delete
  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    return apiService<T>(endpoint, 'DELETE');
  },

  // Read All (list)
  list: async <T>(endpoint: string): Promise<ApiResponse<T[]>> => {
    try {
      const result = await apiService<T[]>(endpoint, 'GET');
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Error fetching list of data');
    }
  },
};
