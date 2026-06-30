import apiClient from './apiClient';

export const getAllVendors = async () => {
  const response = await apiClient.get('/vendors');
  return response.data;
};

export const getVendorById = async (id) => {
  const response = await apiClient.get(`/vendors/${id}`);
  return response.data;
};

export const getVendorProfile = async () => {
  const response = await apiClient.get('/vendors/profile');
  return response.data;
};

export const updateVendorProfile = async (vendorData) => {
  const response = await apiClient.put('/vendors/profile', vendorData);
  return response.data;
};

export const createVendor = async (vendorData) => {
  const response = await apiClient.post('/vendors', vendorData);
  return response.data;
};

export const deleteVendor = async (id) => {
  const response = await apiClient.delete(`/vendors/${id}`);
  return response.data;
};
