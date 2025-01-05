import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Accordion, Button, Modal } from 'react-bootstrap';
import api from '../api.js';
import './AccountCourse.css';

const AccountCourse = () => {
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [deleteCourse, setDeleteCourse] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(
        localStorage.getItem("isAuthorized") === "true"
    );
    const navigate = useNavigate();


    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthorized") === "true";
        setIsAuthorized(authStatus);

        const getCourse = async () => {
            try {
                const response = await api.get(`/account_course/${courseId}/`);
                console.log(response.data);
                setCourseData(response.data);
            } 
            catch (error) {
                console.error(error);
            }
        };

        getCourse();
    }, [courseId]);

    const handleDeleteCourse = async (e) => {
        e.preventDefault();

        try {
            const deleteResponse = await api.delete(`/account_course/${courseId}/`);
            console.log(deleteResponse.data);
            setDeleteCourse(false);
            navigate("/account");
        } 
        catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = () => {
        setDeleteCourse(true);
    }; 

    if(!courseData) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="py-5">
            <Row className="mb-4">
                <Col>
                    <Card className="p-4 shadow-sm " style={{ borderWidth: '3px', borderColor: 'orange', borderStyle: 'solid', width: '1200px'}}>
                        <Row className="mb-3 align-items-center">
                            <Col className="d-flex justify-content-start">
                                <Link to={'/account'}>
                                    <Button className="mb-0">
                                        Back to Home
                                    </Button>
                                </Link>
                            </Col>

                            {isAuthorized && (
                                <Col className="d-flex justify-content-end">
                                    <Button className="mb-0" variant="danger" onClick={handleDeleteClick}>
                                        Delete Course
                                    </Button>
                                </Col>
                            )}
                        </Row>

                        <Card.Body>
                            <Card.Title as="h1" className="d-flex justify-content-center" style={{ color: 'orange' }}>{courseData.course.title}</Card.Title>
                            <Card.Text>{courseData.course.description}</Card.Text>
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
                                                <Link to={`/account/course/${courseId}/lesson/${lesson.id}`}>
                                                    <Button variant="primary" className="mt-3">Go to Lesson</Button>
                                                </Link>
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

            <Modal show={deleteCourse} onHide={() => setDeleteCourse(true)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this course? All linked lessons will also be deleted. This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteCourse(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteCourse}>
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>      
    );
};

export default AccountCourse;
