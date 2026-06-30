import apiClient from './apiClient';

export const getAllFoods = async () => {
  const response = await apiClient.get('/foods');
  return response.data;
};

export const getFoodById = async (id) => {
  const response = await apiClient.get(`/foods/${id}`);
  return response.data;
};

export const getFoodsByCategory = async (categoryId) => {
  const response = await apiClient.get(`/foods/category/${categoryId}`);
  return response.data;
};

export const getFoodsByVendor = async (vendorId) => {
  const response = await apiClient.get(`/foods/vendor/${vendorId}`);
  return response.data;
};

export const createFood = async (foodData) => {
  const response = await apiClient.post('/foods', foodData);
  return response.data;
};

export const updateFood = async (id, foodData) => {
  const response = await apiClient.put(`/foods/${id}`, foodData);
  return response.data;
};

export const deleteFood = async (id) => {
  const response = await apiClient.delete(`/foods/${id}`);
  return response.data;
};
