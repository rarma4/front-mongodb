import axios from 'axios';

const api = axios.create({
    baseURL: 'https://node-mongodb-esth.onrender.com',
})

export default api;