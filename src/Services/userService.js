import apiClient from './apiClient';

export const getUserProfile = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const updateUserProfile = async (id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};
