import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-dark text-light pt-5 pb-4 mt-5">
            <Container>
                <Row className="mb-4">
                    <Col md={4} className="mb-3">
                        <h4 className="fw-bold">Dialuxe</h4>
                        <p>Luxury watches for those who value timeless craftsmanship and elegance.</p>
                    </Col>
                    <Col md={2} className="mb-3">
                        <h5 className="fw-semibold">Explore</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" className="text-light text-decoration-none">Home</a></li>
                            <li><a href="/products" className="text-light text-decoration-none">Shop</a></li>
                            <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
                        </ul>
                    </Col>
                    <Col md={3} className="mb-3">
                        <h5 className="fw-semibold">Contact Us</h5>
                        <p className="mb-1">support@dialuxe.com</p>
                        <p className="mb-1">+1 (555) 123-4567</p>
                        <p>New York, NY 10001</p>
                    </Col>
                    <Col md={3} className="mb-3">
                        <h5 className="fw-semibold">Follow Us</h5>
                        <div className="d-flex gap-3 fs-5">
                            <a href="#" className="text-light"><FaFacebookF /></a>
                            <a href="#" className="text-light"><FaInstagram /></a>
                            <a href="#" className="text-light"><FaTwitter /></a>
                            <a href="#" className="text-light"><FaLinkedinIn /></a>
                        </div>
                    </Col>
                </Row>
                <hr className="border-secondary" />
                <Row>
                    <Col className="text-center">
                        <p className="mb-0">&copy; {new Date().getFullYear()} Dialuxe. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;