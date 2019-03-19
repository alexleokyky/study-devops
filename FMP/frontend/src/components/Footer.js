import React, { Component } from 'react';
import { Col } from 'react-materialize';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

class AppFooter extends Component {

    render() {
        return (
             <div className="footer-container">
                <div className="footer">
                    <Col>
                        <p><Link to="/">About Us</Link></p>
                        <p><Link to="/">Terms of Service</Link></p>
                    </Col>
                    <Col>
                        <p><Link to="/">Privacy Policy</Link></p>
                        <p><Link to="/">Customer Support</Link></p>
                    </Col>
                    <Col>
                        <p><Link to="/contact-us">Contact Us</Link></p>
                    </Col>
                    <Col>
                        <p>Social:</p>
                        <Link id="social-fb" className="social-icon" to="/"></Link>
                        <Link id="social-twitter" className="social-icon" to="/"></Link>
                        <Link id="social-instagram" className="social-icon" to="/"></Link>
                    </Col>
                   <div className="copyright">© 2018 Find Me Place</div>
                </div>
             </div>
        );
    }

}

export default AppFooter;