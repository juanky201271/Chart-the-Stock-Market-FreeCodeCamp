import axios from 'axios'

const api = axios.create({
  baseURL: '/api' // express
})

export const insertStock = payload => api.post(`/stock`, payload)
export const getAllStocks = () => api.get(`/stocks`)
export const updateStockById = (_id, payload) => api.put(`/stock/${_id}`, payload)
export const deleteStockById = _id => api.delete(`/stock/${_id}`)
export const getStockById = _id => api.get(`/stock/${_id}`)

const apis = {
    insertStock,
    getAllStocks,
    updateStockById,
    deleteStockById,
    getStockById,
}

export default apis
