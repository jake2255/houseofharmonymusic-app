import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";

function AccountLogout() 
{
    const navigate = useNavigate();

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    useEffect(() => {
        const logout = async () => {
            try {
                //const csrftoken = Cookies.get("csrftoken");
                console.log("CSRF token before logout:", getCookie('csrftoken'));
                console.log("CSRF token before logout:", Cookies.get("csrftoken"));

                
                const logoutResponse = await axios.post(
                    'https://houseofharmonymusic-api.onrender.com/logout/', 
                    {},
                    {
                        headers: { 'X-CSRFToken': getCookie('csrftoken') },
                        withCredentials: true,
                    },
                );
                console.log("Logged out:", logoutResponse.data);
                
                localStorage.removeItem("userData");
                localStorage.setItem("isAuthenticated", "false");
                localStorage.setItem("isAuthorized", "false");
                navigate('/');
            } 
            catch(error) {
                console.error("Error logging out:", error);
            }
        };
    
        logout();
    }, [navigate]);

    return null;
}

export default AccountLogout;
