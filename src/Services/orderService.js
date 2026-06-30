import apiClient from './apiClient';

export const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

export const getOrdersByCustomer = async (customerId) => {
  const response = await apiClient.get(`/orders/customer/${customerId}`);
  return response.data;
};

export const getOrdersByVendor = async (vendorId) => {
  const response = await apiClient.get(`/orders/vendor/${vendorId}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await apiClient.patch(`/orders/${id}/status`, { status });
  return response.data;
};

export const getAllOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data;
};
