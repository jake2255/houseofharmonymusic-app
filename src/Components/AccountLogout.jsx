import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";

function AccountLogout() 
{
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const csrftoken = Cookies.get("csrftoken");

                console.log("CSRF token before logout:", csrftoken);
                
                const logoutResponse = await axios.post(
                    'https://houseofharmonymusic-api.onrender.com/logout/', 
                    {},
                    {
                        headers: { 'X-CSRFToken': csrftoken },
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
