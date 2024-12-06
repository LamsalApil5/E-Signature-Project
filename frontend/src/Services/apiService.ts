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

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
};

export const api = {
  // Create
  create: async <T>(endpoint: string, data: T): Promise<ApiResponse<T>> => {
    return apiService<T>(endpoint, 'POST', data);
  },

  // Read (single item)
  read: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    return apiService<T>(endpoint, 'GET');
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
  readAll: async <T>(endpoint: string): Promise<ApiResponse<T[]>> => {
    return apiService<T[]>(endpoint, 'GET');
  },

};
