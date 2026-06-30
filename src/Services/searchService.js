import apiClient from './apiClient';

export const searchFoods = async (query) => {
  const response = await apiClient.get('/search/foods', { params: { q: query } });
  return response.data;
};

export const searchByCategory = async (query, categoryId) => {
  const response = await apiClient.get('/search/foods/category', {
    params: { q: query, categoryId },
  });
  return response.data;
};

export const searchVendors = async (query) => {
  const response = await apiClient.get('/search/vendors', { params: { q: query } });
  return response.data;
};

export const globalSearch = async (query) => {
  const response = await apiClient.get('/search', { params: { q: query } });
  return response.data;
};
