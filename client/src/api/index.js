import axios from 'axios'

const api = axios.create({
  baseURL: '/api' // express
})

export const insertPoll = payload => api.post(`/poll`, payload)
export const getAllPolls = () => api.get(`/polls`)
export const updatePollById = (_id, payload) => api.put(`/poll/${_id}`, payload)
export const deletePollById = _id => api.delete(`/poll/${_id}`)
export const getPollById = _id => api.get(`/poll/${_id}`)

export const insertUser = payload => api.post(`/user`, payload)
export const getAllUsers = () => api.get(`/users`)
export const updateUserById = (_id, payload) => api.put(`/user/id/${_id}`, payload)
export const updateUserByIp = (ip, payload) => api.put(`/user/ip/${ip}`, payload)
export const deleteUserById = _id => api.delete(`/user/id/${_id}`)
export const deleteUserByIp = ip => api.delete(`/user/ip/${ip}`)
export const getUserById = _id => api.get(`/user/id/${_id}`)
export const getUserByIp = ip => api.get(`/user/ip/${ip}`)

export const getAllUsersTwitter = () => api.get(`/userstwitter`)
export const updateUserByTwitterId = (twitterId, payload) => api.put(`/usertwitter/id/${twitterId}`, payload)
export const getUserByTwitterId = twitterId => api.get(`/usertwitter/id/${twitterId}`)

const apis = {
    insertPoll,
    getAllPolls,
    updatePollById,
    deletePollById,
    getPollById,

    insertUser,
    getAllUsers,
    updateUserById,
    updateUserByIp,
    deleteUserById,
    deleteUserByIp,
    getUserById,
    getUserByIp,

    getAllUsersTwitter,
    updateUserByTwitterId,
    getUserByTwitterId,
}

export default apis
