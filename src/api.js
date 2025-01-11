import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
axios.defaults.withXSRFToken = true
axios.defaults.withCredentials = true

// Function to retrieve csrf token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Create an Axios instance
const api = axios.create({
    baseURL: 'https://houseofharmonymusic-api.onrender.com',
});


// Add CSRF token interceptor
// api.interceptors.request.use((config) => {
//     const csrfToken = getCookie('csrftoken');
//     if (csrfToken) {
//         config.headers['X-CSRFToken'] = csrfToken;
//         console.log('CSRF Token Added to Headers:', csrfToken);
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });


export default api;
