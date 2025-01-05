import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import api from '../api.js';

const PasswordForgot = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/request_password_reset/', { email });
            console.log(response.data)
        } 
        catch (error) {
            console.error(error)
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4" style={{ borderWidth: '3px', borderColor: 'orange', borderStyle: 'solid'}}>
                <Row className="justify-content-center">
                    <Col >
                        <h3 className="mb-4">Reset Your Password</h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="email">
                                <Form.Label style={{color:'orange'}}>Email Address:</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3">
                                Send Reset Link
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Card>    
        </Container>
    );
};

export default PasswordForgot;
