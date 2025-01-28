import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Accordion, Button, Alert } from 'react-bootstrap';
import './ServicesCourse.css';
import api from '../api.js';

const ServicesCourse = () => {
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [message, setMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [csrftoken, setCsrfToken] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getCourse = async () => {
            try {
                const response = await api.get(`/services_course/${courseId}/`);
                console.log(response.data);
                setCourseData(response.data);
            } 
            catch (error) {
                console.error(error);
            }
        };

        getCourse();
    }, [courseId]);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const success = query.get("success");
        const canceled = query.get("canceled");

        if (success) {
            setMessage("Payment successful! Thank you for your purchase.");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }

        if (canceled) {
            setMessage("Payment was canceled. Feel free to try again.");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
    }, []);

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
    

    const handlePayment = async () => {
        //const csrftoken = getCookie('csrftoken');
        setCsrfToken(getCookie('csrftoken'));
        console.log('CSRF Token:', csrftoken);
        console.log('Document cookies: ', document.cookie);
        
        try {
            const authResponse = await api.get('/check_auth/');
            if (!authResponse.data.authenticated) {
                navigate('/login');
                return;
            }

            const response = await api.post("/create_checkout_session/", {course_id: courseId});
            // const response = await fetch(
            //     "https://api.houseofharmonymusic.net/create_checkout_session/",
            //     {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //             "X-CSRFToken": csrftoken,
            //         },
            //         credentials: "include",
            //         body: JSON.stringify({ course_id: courseId }),

            //     }
            // );

            // if (!response.ok) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }

            //const data = await response.json();
            console.log(response.data);

            if (data.checkout_url) {
                // Redirect user to Stripe Checkout
                window.location.href = data.checkout_url;
            } 
            else if (data.redirect_url) {
                window.location.href = response.data.redirect_url;
            }
            else {
                console.error("Failed to get checkout URL");
            }
        } 
        catch (error) {
            console.error(error);
        }
    };

    if(!courseData) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="py-5" fluid>
            {showAlert && message && (
                <Alert variant={message.includes("successful") ? "success" : "danger"}>
                    {message}
                </Alert>
            )}
            <Row className="mb-4">
                <Col>
                    <Card className="p-4 shadow-sm" style={{ borderWidth: '3px', borderColor: 'orange', borderStyle: 'solid', maxWidth: '95%'}}>
                        <Card.Body>
                            <Card.Title as="h1" className="d-flex justify-content-center" style={{ color: 'orange' }}>{courseData.course.title}</Card.Title>
                            <Card.Text>{courseData.course.description}</Card.Text>
                            <Button variant="primary" className="mt-3" onClick={handlePayment} disabled={courseData.course_owned}>
                                {courseData.course_owned ? "Owned" : `$ ${courseData.course.price}`}
                            </Button>
                        </Card.Body>

                        {courseData.lessons_preview && courseData.lessons_preview.length > 0 ? (
                            courseData.lessons_preview.map((lesson, index) => (
                                <Card.Body>
                                    <Card.Title as="h5" style={{ color: 'orange' }}>{lesson.title}</Card.Title>
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Lesson Details</Accordion.Header>
                                            <Accordion.Body>{lesson.overview}</Accordion.Body>
                                            <Accordion.Body>
                                                <Button variant="secondary" className="mt-3" disabled='true'>Purchase to view</Button>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Card.Body>
                            ))
                        ) : (
                            <Card className="p-4 shadow-sm">
                                <Card.Body>
                                    <Card.Text>No lessons available</Card.Text>
                                </Card.Body>
                            </Card>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ServicesCourse;
