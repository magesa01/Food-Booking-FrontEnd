import apiClient from './apiClient';

export const processPayment = async (paymentData) => {
  const response = await apiClient.post('/payments', paymentData);
  return response.data;
};

export const getPaymentById = async (id) => {
  const response = await apiClient.get(`/payments/${id}`);
  return response.data;
};

export const getPaymentsByOrder = async (orderId) => {
  const response = await apiClient.get(`/payments/order/${orderId}`);
  return response.data;
};

export const refundPayment = async (id) => {
  const response = await apiClient.post(`/payments/${id}/refund`);
  return response.data;
};
