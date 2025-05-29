import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import './HomePage.css';
import './ContactPage.css';
import { Mail, Phone, MapPin } from 'lucide-react';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Replace these with your actual EmailJS credentials
  const EMAILJS_SERVICE_ID = 'service_30usc0y'; // Your service ID
  const EMAILJS_TEMPLATE_ID = 'template_tytzys1'; // Your template ID  
  const EMAILJS_PUBLIC_KEY = 'aEO9DhPWkr5Eu1Ucd'; // Your public key

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare template parameters
      const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        message: formData.message,
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('Email sent successfully:', result);
      alert('✅ Thank you for your message! We will get back to you soon.');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });

    } catch (error) {
      console.error('Email sending failed:', error);
      alert('❌ Sorry, there was an error sending your message. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ paddingTop: '5rem' }}></div>

      {/* Contact Us Section */}
<div className="bms-contact-section">
  <div className="bms-contact-container">
    {/* Header Section */}
    <div className="bms-contact-header">
      <h1 className="bms-contact-title">
        THE BIHAR MATHEMATICAL SOCIETY
      </h1>
      <p className="bms-contact-subtitle">
        Founded on - 01/02/1958 in Bhagalpur, Bihar
      </p>
      <p className="bms-contact-description">
        Under the Presidency of Dr. B. N. Prasad (The then HOD Mathematics, Allahabad University).
      </p>
    </div>

    <div className="bms-contact-grid">
      {/* Left Side - Contact Information */}
      <div className="bms-contact-info-section">
        <div className="bms-contact-info-card">
          <h2 className="bms-contact-info-title">Get in touch with us</h2>

          <div className="bms-contact-info-list">
            {/* Email */}
            <div className="bms-contact-info-item">
              <div className="bms-contact-icon">
                <Mail />
              </div>
              <div className="bms-contact-info-content">
                <h3>Email Us</h3>
                <p>biharmathsociety@gmail.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="bms-contact-info-item">
              <div className="bms-contact-icon">
                <Phone />
              </div>
              <div className="bms-contact-info-content">
                <h3>Call Us</h3>
                <p>+91 7004 7340 60</p>
              </div>
            </div>

            {/* Address */}
            <div className="bms-contact-info-item">
              <div className="bms-contact-icon">
                <MapPin />
              </div>
              <div className="bms-contact-info-content">
                <h3>Our Address</h3>
                <p>
                  Tilka Manjhi Bihar University,<br />
                  Bhagalpur (Bihar)<br />
                  Bihar - 812007, India
                </p>
              </div>
            </div>
          </div>
        </div>
      
              {/* Map placeholder */}
              <div className="map-placeholder">
                <div className="map-content">
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
            </div>



            {/* Right Side - Contact Form */}
            <div className="contact-form-card">
              <form onSubmit={handleSubmit} className="form-content">
                {/* Name Fields */}
                <div className="form-row two-columns">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Enter your first name"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Enter your last name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email (privacy policy)*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter your email address"
                    disabled={isLoading}
                  />
                </div>

                {/* Message Field */}
                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="form-input form-textarea"
                    placeholder="I'm interested in learning more about..."
                    disabled={isLoading}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isLoading}
                  style={{
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? '📧 Sending...' : '📤 Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer className='app-footer'>
        @ 2025 BMS. All rights reserved.
      </footer>
    </>
  );
};

export default ContactPage;