import axios from 'axios';

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

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true
axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken');

// Create an Axios instance
const api = axios.create({
    baseURL: 'https://houseofharmonymusic-api.onrender.com',
});

export default api;



// import axios from 'axios';

// // Fetch CSRF token from cookies
// const getCsrfToken = () => {
//     const cookies = document.cookie.split('; ');
//     const csrfCookie = cookies.find(cookie => cookie.startsWith('csrftoken='));
//     return csrfCookie ? csrfCookie.split('=')[1] : null;
// };

// // Create Axios instance
// const api = axios.create({
//     baseURL: 'https://houseofharmonymusic-api.onrender.com',
//     withCredentials: true, // Ensures cookies are sent with requests
// });

// // Add a request interceptor to include the X-CSRFToken header
// api.interceptors.request.use((config) => {
//     const csrfToken = getCsrfToken();
//     if (csrfToken) {
//         config.headers['X-CSRFToken'] = csrfToken;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

// export default api;
