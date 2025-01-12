// import axios from 'axios';

// axios.defaults.xsrfCookieName = 'csrftoken'
// axios.defaults.xsrfHeaderName = "X-CSRFToken"
// axios.defaults.withCredentials = true
// axios.defaults.withXSRFToken = true

// // Create an Axios instance
// const api = axios.create({
//     baseURL: 'https://houseofharmonymusic-api.onrender.com',
// });

// export default api;



import axios from 'axios';

// Fetch CSRF token from cookies
const getCsrfToken = () => {
    const cookies = document.cookie.split('; ');
    const csrfCookie = cookies.find(cookie => cookie.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
};

// Create Axios instance
const api = axios.create({
    baseURL: 'https://houseofharmonymusic-api.onrender.com',
    withCredentials: true, // Ensures cookies are sent with requests
});

// Add a request interceptor to include the X-CSRFToken header
api.interceptors.request.use((config) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
