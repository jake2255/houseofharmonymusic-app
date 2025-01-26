// import axios from 'axios';

// // Function to retrieve csrf token
// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }

// axios.defaults.xsrfCookieName = 'csrftoken'
// axios.defaults.xsrfHeaderName = "X-CSRFToken"
// axios.defaults.withCredentials = true
// axios.defaults.withXSRFToken = true
// axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken');

// // Create an Axios instance
// const api = axios.create({
//     baseURL: 'https://api.houseofharmonymusic.net',
// });

// export default api;


import axios from 'axios';

// Function to retrieve the CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie matches the name
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Axios default settings
axios.defaults.xsrfCookieName = 'csrftoken';  // The name of the CSRF cookie
axios.defaults.xsrfHeaderName = 'X-CSRFToken'; // The header to send the CSRF token
axios.defaults.withCredentials = true;        // Include credentials (e.g., cookies) in requests

// Create an Axios instance
const api = axios.create({
    baseURL: 'https://api.houseofharmonymusic.net', // Your API base URL
});

// Add a request interceptor to include CSRF token dynamically
api.interceptors.request.use((config) => {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
        config.headers['X-CSRFToken'] = csrftoken; // Set CSRF token header
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
