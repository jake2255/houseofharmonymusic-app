import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api.js';
import './AccountLogin.css';

function AccountLogin() 
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const response = await api.get('/csrf/');
                setCsrfToken(response.data.csrfToken);
                console.log(response.data);
            } 
            catch (error) {
                console.error(error);
            }
        };

        getCsrfToken();
    }, []);

    const getCookie = (name) => {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
  
        const loginData = {
            username: username,
            password: password,
        };
  
        try {
            //const response = await api.post("/login/", loginData);
            const response = await fetch(
                'https://api.houseofharmonymusic.net/login/',
                {
                    credentials: 'include',
                    method: 'POST',
                    mode: 'cors', // same-origin maybe?
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify(loginData)

                }
            );
            
            if (response.ok) {
                const responseData = await response.json();
                console.log("Response Data:", responseData);
                
                // Handle successful login
                setMessage("Successful login!");
                setError('');
                
                // Store user data in localStorage
                const { courses, ...accInfoWithoutCourses } = responseData.account_info;
                const objectWithoutCourses = {
                    ...responseData,
                    account_info: accInfoWithoutCourses,
                };
        
                localStorage.setItem("userData", JSON.stringify(objectWithoutCourses));
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("isAuthorized", responseData.user_auth);
        
                setTimeout(() => {
                    navigate('/account', { state: responseData });
                }, 1000);
            } else {
                const errorData = await response.json();
                console.error("Error Response Data:", errorData);
                setError(errorData.non_field_errors || "Invalid login credentials.");
                setMessage('');
            }
        } catch (error) {
            console.error("Connection Error:", error.message);
            setError("Unable to connect to the server. Please check your connection.");
            setMessage('');
        }
    }

    return ( 
        <Container
            className="AccountLogin account-login py-5"
            style={{ maxWidth: '700px', padding: '30px' }}
            fluid
            >
            <Card
                style={{
                padding: '40px',
                borderWidth: '3px',
                borderColor: 'orange',
                borderStyle: 'solid',
                }}
            >
                <Row className="justify-content-center">
                <Col>
                    <h1 className="text-center mb-4" style={{ color: 'orange' }}>
                    Login to Your Account
                    </h1>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername" className="mb-3">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                        />
                    </Form.Group>

                    <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mb-3">
                        Login
                    </Button>
                    </Form>
                    <div className="text-center">
                    <Link to="/forgot-username/" className="d-block mb-2">
                        Forgot Username?
                    </Link>
                    <Link to="/forgot-password/" className="d-block">
                        Forgot Password?
                    </Link>
                    </div>
                </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default AccountLogin;
