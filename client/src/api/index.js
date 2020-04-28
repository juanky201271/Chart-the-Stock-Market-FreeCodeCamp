import axios from 'axios'

const api = axios.create({
  baseURL: '/api' // express
})

export const insertStock = table => api.post(`/stock/table/${table}`)
export const getAllStocks = () => api.get(`/stocks`)
export const getAllStocksData = () => api.get(`/stocks/data`)
export const updateStockById = _id => api.put(`/stock/${_id}`)
export const deleteStockById = (_id, table) => api.delete(`/stock/${_id}/${table}`)
export const getStockById = _id => api.get(`/stock/${_id}`)

const apis = {
    insertStock,
    getAllStocks,
    getAllStocksData,
    updateStockById,
    deleteStockById,
    getStockById,
}

export default apis
