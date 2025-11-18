"use strict";

import axios from 'axios';
// Import the publicAxios instance for making unauthenticated requests
import { sanitizeData } from '../security/sanitize.ts';

// Base URL for the API, imported from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance for protected routes
const protectedAxiosInstance = axios.create({
  baseURL: API_BASE_URL, // Set the base URL for the API
  withCredentials: true, // Ensure cookies are sent with the request
});

// Create an Axios instance for checking user
const protectedAxiosInstanceForCheckUser = axios.create({
  baseURL: API_BASE_URL, // Set the base URL for the API
  withCredentials: true, // Ensure cookies are sent with the request
});

// Interceptor to add the access token to the headers of each request
protectedAxiosInstance.interceptors.request.use(
  async (config) => {

    // Sanitize request data if it exists
    if (config.data) {
      config.data = sanitizeData(config.data);
    }

    // Retrieve the access token from local storage
    const token = sessionStorage.getItem('user-token');
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Return the modified config
  },
  (error) => {
    return Promise.reject(error); // Reject the promise with the error
  },
);




// Export the protectedAxios instance for use in protected API calls
export {
  protectedAxiosInstance as protectedAxios,
  protectedAxiosInstanceForCheckUser as checkUserAxios,
};
