import axios from 'axios';

// Function to retrieve the CSRF token from cookies
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

// Create Axios instance
const api = axios.create({
    baseURL: 'https://houseofharmonymusic-api.onrender.com',
    withCredentials: true,  // Include credentials like cookies with requests
});

// Make a request with manual CSRF token
export const makeRequest = async (url, method, data = {}) => {
    const csrfToken = getCookie('csrftoken');
    try {
        const response = await api({
            url,
            method,
            data,
            headers: {
                'X-CSRFToken': csrfToken,  // Include CSRF token in the header
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error with Axios request:', error);
    }
};
