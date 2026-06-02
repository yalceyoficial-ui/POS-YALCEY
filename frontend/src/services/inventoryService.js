import api from './api'

export const getInventory = () => api.get('/products')
export const adjustStock = (productId, data) => 
  api.patch(`/products/${productId}/stock`, data)