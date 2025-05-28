import React from 'react';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';
import './LandingFooter.css';

const Footer = () => {
  const handleSocialClick = (platform) => {
    // You can add actual social media links here
    console.log(`Opening ${platform}`);
  };

  return (
    <footer className="footer">
      <div className="footer-section">
        {/* Header Section */}
        <div className="footer-header">
          <div className="footer-subtitle">THE BIHAR MATHEMATICAL SOCIETY</div>
          <div className="footer-registration">Founded on - 01/02/1958 in Bhagalpur, Bihar  <br />
            Under the Presidentship of Dr. B. N. Prasad (The then HOD Mathematics, Allahabad University).</div>
        </div>

        {/* Main Content Layout */}
        <div className="main-content">
          {/* Contact Information Left Side */}
          <div className="contact-section">
            <div className="contact-item">
              <div className="icon-container">
                <MapPin size={24} />
              </div>
              <h3 className="contact-title">Our Address</h3>
              <div className="contact-detail">
               Tilka Manjhi Bihar University, Bhagalpur (Bihar)<br />
                Bihar - 812007 , India
              </div>
            </div>

            <div className="contact-item">
              <div className="icon-container">
                <Mail size={24} />
              </div>
              <h3 className="contact-title">Email Us</h3>
              <div className="contact-detail">
                biharmathsociety@gmail.com
              </div>
            </div>

            <div className="contact-item">
              <div className="icon-container">
                <Phone size={24} />
              </div>
              <h3 className="contact-title">Call Us</h3>
              <div className="contact-detail">
                +91 7004 7340 60
              </div>
            </div>
          </div>

          {/* Map Right Side */}
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.645206117374!2d86.9595622!3d25.2488723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f04a742f137b4f%3A0xf7ae40a61d2c0a46!2sTilka%20Manjhi%20Bhagalpur%20University!5e0!3m2!1sen!2sin!4v1748337043721!5m2!1sen!2sin" 
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Savitribai Phule Pune University Location"
            ></iframe>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="social-section">
          <h3 className="contact-title">Follow Us</h3>
          <div className="social-links">
            <div 
              className="social-link"
              onClick={() => handleSocialClick('Facebook')}
            >
              <Facebook size={20} />
            </div>
            <div 
              className="social-link"
              onClick={() => handleSocialClick('Twitter')}
            >
              <Twitter size={20} />
            </div>
            <div 
              className="social-link"
              onClick={() => handleSocialClick('Instagram')}
            >
              <Instagram size={20} />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="copyright">
            © 2025 Copyright BMS
          </div>
          <div className="developer">
            Design and Developed by Campcoder Solutions
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;