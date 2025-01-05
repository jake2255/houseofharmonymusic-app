import { Link } from 'react-router-dom';
import { Tabs, Tab, Container, Row, Col, Card, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import api from '../api.js';
import './AccountHome.css';

function AccountHome() 
{
    const [courses, setCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('courses');
    const [isAuthorized, setIsAuthorized] = useState(
        localStorage.getItem("isAuthorized") === "true"
    );
    
    const userData = localStorage.getItem("userData");
    const user = userData ? JSON.parse(userData) : null;
    console.log(user)

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthorized") === "true";
        setIsAuthorized(authStatus);

        const getCourses = async () => {
            try {
                const response = await api.get('/courses/');
                console.log(response.data);
                setCourses(response.data);
            } 
            catch(error) {
                console.error(error);
            }
        };

        getCourses();
    }, []);

    return (
        <Container className="py-5" fluid>
            <Row className="mb-4">
                <Col>
                    <Card className="p-4 shadow-sm mx-auto" style={{ borderWidth: '3px', borderColor: 'orange', borderStyle: 'solid', maxWidth: '95%'}}>
                        <Card.Body>
                            <Card.Title as="h1" className="d-flex justify-content-center" style={{ color: 'orange' }}>
                                Welcome, {user ? user.user_info.username : "Guest"}
                            </Card.Title>
                            <Card.Text className="d-flex justify-content-center" style={{ width: '100%', margin: '0 auto' }}>
                                Let's get started on your musical journey!
                            </Card.Text>
                        </Card.Body>

                        <Tabs
                            activeKey={activeTab}
                            onSelect={(tabKey) => setActiveTab(tabKey)}
                            className="mb-4"
                        >
                            <Tab eventKey="courses" title="Courses">
                                <Container>
                                    <Row className="g-4" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                                        {courses.length > 0 ? (
                                            courses.map((course, index) => (
                                                <Col md={4} key={index}>
                                                    <Card className="course-card h-100 d-flex flex-column" style={{ borderWidth:'3px', borderColor: 'orange', borderStyle: 'solid'}}>
                                                        <Card.Img
                                                            variant="top"
                                                            src={course.cover_image ? course.cover_image : "https://via.placeholder.com/150"}
                                                            alt="Course"
                                                            className="course-image"
                                                        />
                                                        <Card.Body className="d-flex flex-column">
                                                            <Card.Title style={{ color: 'orange' }}>{course.title}</Card.Title>
                                                            <Card.Text className="flex-grow-1">{course.overview}</Card.Text>
                                                            <Link to={`/account/course/${course.id}`}>
                                                                <Button variant="primary">View Course</Button>
                                                            </Link>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))
                                        ) : (
                                            <Container className="py-5 account-home-tab">
                                                <h3>No courses available.</h3>
                                                <p>Purchase a course to get started!.</p>
                                                <Link to="/course-list">
                                                    <Button variant="success">View Courses</Button>
                                                </Link>
                                            </Container>
                                        )}
                                    </Row>
                                </Container>
                            </Tab>
                                    
                            <Tab eventKey="settings" title="Account Settings" className="account-home-tab">
                                <h3>Manage Your Account</h3>
                                <p>Edit your personal details here.</p>
                                <Link to="/account/settings">
                                    <Button variant="success">Go to Settings</Button>
                                </Link>
                            </Tab>
                                    
                            {isAuthorized && (
                                <Tab eventKey="addCourse" title="Create New Course" className="account-home-tab">
                                    <h3>Create a New Course</h3>
                                    <p>Provide the new course details.</p>
                                    <Link to="/account/create-course">
                                        <Button variant="success">Add Course</Button>
                                    </Link>
                                </Tab>
                            )}
                            {isAuthorized && (
                                <Tab eventKey="emailAll" title="Email Users" className="account-home-tab">
                                    <h3>Email All Users</h3>
                                    <p>Send an email to all registered users.</p>
                                    <Link to="/account/mass-email">
                                        <Button variant="success">Create Email</Button>
                                    </Link>
                                </Tab>                  
                            )}
                        </Tabs>
                    </Card>         
                </Col>
            </Row>
        </Container>
    );
}

export default AccountHome;
