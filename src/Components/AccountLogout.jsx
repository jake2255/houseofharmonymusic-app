import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";

function AccountLogout() 
{
    const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const response = await axios.get('https://houseofharmonymusic-api.onrender.com/csrf/', { withCredentials: true });
                setCsrfToken(response.data.csrfToken);
            } 
            catch(error) {
                console.error("Error fetching CSRF token:", error);
            }
        };

        const logout = async () => {
            try {
                //const csrftoken = Cookies.get("csrftoken");
                console.log("CSRF token before logout:", csrfToken);
                const logoutResponse = await axios.post(
                    'https://houseofharmonymusic-api.onrender.com/logout/', 
                    {},
                    {
                        headers: { 'X-CSRFToken': csrfToken },
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
    
        const handleLogout = async () => {
            await getCsrfToken();
            await logout();
        };

        handleLogout();
    }, [csrfToken, navigate]);

    return null;
}

export default AccountLogout;
