import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
axios.defaults.withXSRFToken = true
// axios.defaults.withCredentials = true

// Create an Axios instance
const api = axios.create({
    baseURL: 'https://houseofharmonymusic-api.onrender.com',
});

export default api;
