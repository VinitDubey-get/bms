import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  User, Building, MapPin, Phone, Mail, CreditCard, Calendar,
  FileText, Upload, Camera, Check, AlertCircle
} from 'lucide-react';
import './MembershipForm.css';

const MembershipForm = () => {
  const query = new URLSearchParams(useLocation().search);
  const selectedMembership = query.get('type') || 'Regular Member';

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    organization: '',
    subject: '',
    address: '',
    mobile: '',
    whatsapp: '',
    email: '',
    transactionId: '',
    paymentDate: '',
    donorAmount: '',
    declaration: false,
    paymentScreenshot: null,
    photo: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjects = [
    'Mathematics',
    'Mathematical Statistics',
    'Computational Mathematics & Applications',
    'Industrial Mathematics',
    'Mathematical Biology',
    'Mathematical Chemistry',
    'Mathematical Economics',
    'Mathematical Physics',
    'Mathematical Psychology',
    'Mathematical Sociology',
    'Mathematical Philosophy',
    'Financial Mathematics'
  ];

  const handleInputChange = (e) => {
    const { name, type, value, files, checked } = e.target;
    const val = type === 'checkbox' ? checked : files ? files[0] : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'name', 'designation', 'organization', 'subject',
      'address', 'mobile', 'whatsapp', 'email',
      'transactionId', 'paymentDate'
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This field is required';
    });

    if (!formData.paymentScreenshot) newErrors.paymentScreenshot = 'Payment screenshot is required';
    if (!formData.photo) newErrors.photo = 'Photo is required';
    if (selectedMembership === 'Donor Member' && !formData.donorAmount) {
      newErrors.donorAmount = 'Paid amount is required for donor members';
    }
    if (!formData.declaration) newErrors.declaration = 'You must accept the declaration';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Form submitted successfully!');
    }, 2000);
  };

  return (
    <div className="container">
      <div className="form-header">
        <h1>Bihar Mathematical Society</h1>
        <h2>Membership Application Form</h2>
        <div className="header-line"></div>
      </div>

      <form className="membership-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label"><User size={16} /> Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Enter your full name" />
              {errors.name && <div className="error-message"><AlertCircle size={14} />{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label"><Building size={16} /> Designation *</label>
              <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} className={`form-input ${errors.designation ? 'error' : ''}`} placeholder="Your designation" />
              {errors.designation && <div className="error-message"><AlertCircle size={14} />{errors.designation}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label"><Building size={16} /> Organisation / Institute *</label>
            <input type="text" name="organization" value={formData.organization} onChange={handleInputChange} className={`form-input ${errors.organization ? 'error' : ''}`} />
            {errors.organization && <div className="error-message"><AlertCircle size={14} />{errors.organization}</div>}
          </div>

          <div className="form-group">
            <label className="form-label"><FileText size={16} /> Interdisciplinary Mathematics Subject *</label>
            <select name="subject" value={formData.subject} onChange={handleInputChange} className={`form-select ${errors.subject ? 'error' : ''}`}>
              <option value="">Select Subject</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
            {errors.subject && <div className="error-message"><AlertCircle size={14} />{errors.subject}</div>}
          </div>

          <div className="form-group">
            <label className="form-label"><MapPin size={16} /> Address *</label>
            <textarea name="address" value={formData.address} onChange={handleInputChange} className={`form-textarea ${errors.address ? 'error' : ''}`} rows="3" />
            {errors.address && <div className="error-message"><AlertCircle size={14} />{errors.address}</div>}
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label"><Phone size={16} /> Mobile Number *</label>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className={`form-input ${errors.mobile ? 'error' : ''}`} placeholder="+91 XXXXXXXXXX" />
              {errors.mobile && <div className="error-message"><AlertCircle size={14} />{errors.mobile}</div>}
            </div>

            <div className="form-group">
              <label className="form-label"><Phone size={16} /> WhatsApp Number *</label>
              <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className={`form-input ${errors.whatsapp ? 'error' : ''}`} placeholder="+91 XXXXXXXXXX" />
              {errors.whatsapp && <div className="error-message"><AlertCircle size={14} />{errors.whatsapp}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label"><Mail size={16} /> Email Id *</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`form-input ${errors.email ? 'error' : ''}`} />
            {errors.email && <div className="error-message"><AlertCircle size={14} />{errors.email}</div>}
          </div>
        </div>

        <div className="payment-instructions">
          <label className="qr-label">
            Pay your membership charges upto Rs 2000 through the below QR Code:
          </label>
          <div className="qr-container">
            <img
              src="https://lh5.googleusercontent.com/GHcAMf0a4283Nok_uTqSCrEuUcttE44KCSScD8hAyzVIJeBFa7Q56q5ukulAtOyrVpUUawvRGWIfk92iCUSv02PJq0Wn43siExIRQUOza6BkyLZc4cv3DutT-vyVyE1tQwN4pg6-Zo7R0g6mrXvfcOEFk6Ll5dlft3bxJlO1ffa9p9LIHw=w267?key=spZ9Po5b2E7g8miA10_aaQ"
              alt="QR"
              className="qr-code"
            />
          </div>
          <label className="upi-label">
            For any amount, you can directly pay to the UPI ID mentioned below:<br />
            <strong>9128934249@ybl (Pushkar)</strong>
          </label>
        </div>

        <div className="form-section">
          <h3>Payment Information</h3>
          <div className="form-group">
            <label className="form-label"><CreditCard size={16} /> Membership Type *</label>
            <input type="text" value={selectedMembership} readOnly className="form-input" />
          </div>

          {selectedMembership === 'Donor Member' && (
            <div className="form-group">
              <label className="form-label"><CreditCard size={16} /> Paid Amount (For Donor Member Only) *</label>
              <input
                type="number"
                name="donorAmount"
                value={formData.donorAmount}
                onChange={handleInputChange}
                className={`form-input ${errors.donorAmount ? 'error' : ''}`}
                placeholder="Enter amount paid"
              />
              {errors.donorAmount && <div className="error-message"><AlertCircle size={14} />{errors.donorAmount}</div>}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label"><CreditCard size={16} /> Payment Transaction ID *</label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                className={`form-input ${errors.transactionId ? 'error' : ''}`}
              />
              {errors.transactionId && <div className="error-message"><AlertCircle size={14} />{errors.transactionId}</div>}
            </div>

            <div className="form-group">
              <label className="form-label"><Calendar size={16} /> Payment Date *</label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleInputChange}
                className={`form-input ${errors.paymentDate ? 'error' : ''}`}
              />
              {errors.paymentDate && <div className="error-message"><AlertCircle size={14} />{errors.paymentDate}</div>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Uploads</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label"><Upload size={16} /> Payment Screenshot *</label>
              <input type="file" name="paymentScreenshot" accept="image/*,application/pdf" onChange={handleInputChange} />
              {errors.paymentScreenshot && <div className="error-message"><AlertCircle size={14} />{errors.paymentScreenshot}</div>}
            </div>
            <div className="form-group">
              <label className="form-label"><Camera size={16} /> Passport Size Photo *</label>
              <input type="file" name="photo" accept="image/*" onChange={handleInputChange} />
              {errors.photo && <div className="error-message"><AlertCircle size={14} />{errors.photo}</div>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group checkbox-group">
            <label className="form-label checkbox-label">
              <input
                type="checkbox"
                name="declaration"
                checked={formData.declaration}
                onChange={handleInputChange}
              />
              <span> I hereby declare that the information provided is true and accurate.</span>
            </label>
            {errors.declaration && <div className="error-message"><AlertCircle size={14} />{errors.declaration}</div>}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="spinner"></div> Submitting...
            </>
          ) : (
            <>
              <Check size={20} /> Submit Application
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default MembershipForm;
