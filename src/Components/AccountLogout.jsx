import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

function AccountLogout() 
{
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const logoutResponse = await api.post('/logout/');
                console.log(logoutResponse.data);
                
                localStorage.removeItem("userData");
                localStorage.setItem("isAuthenticated", "false");
                localStorage.setItem("isAuthorized", "false");
                navigate('/');
            } 
            catch(error) {
                console.error(error);
            }
        };

        logout();
    }, [navigate]);

    return null;
}

export default AccountLogout;
