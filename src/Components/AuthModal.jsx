import React, { useState } from 'react';
import './AuthModal.css'; // Import the CSS file
import {auth} from '../firebase';
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut} from 'firebase/auth';


// Mock Firebase functions for demo (replace with actual Firebase imports)
const firebaseAuth = {
  signInWithEmailAndPassword: (email, password) => 
    signInWithEmailAndPassword(auth, email, password),
  createUserWithEmailAndPassword: (email, password) =>
    createUserWithEmailAndPassword(auth, email, password),
  signOut: () => signOut(auth)
};

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  // Handle authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        if (formData.password.length < 6) {
          throw new Error("Password should be at least 6 characters");
        }
        const result = await firebaseAuth.createUserWithEmailAndPassword(
          formData.email, 
          formData.password
        );
        onAuthSuccess(result.user);
      } else {
        const result = await firebaseAuth.signInWithEmailAndPassword(
          formData.email, 
          formData.password
        );
        onAuthSuccess(result.user);
      }
      
      // Reset form
      setFormData({ email: '', password: '', confirmPassword: '' });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Close modal when clicking outside
  const handleModalClick = (e) => {
    if (e.target.classList.contains('auth-modal-overlay')) {
      onClose();
    }
  };

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({ email: '', password: '', confirmPassword: '' });
      setError('');
      setAuthMode('signin');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleModalClick}>
      <div className="auth-modal">
        <div className="auth-header">
          <h2 className="auth-title">
            {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <button 
            className="auth-close-btn"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="auth-form">
          {error && (
            <div className="auth-error-message">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}
          
          <div className="auth-input-group">
            <label htmlFor="email" className="auth-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              className="auth-input"
              disabled={loading}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              className="auth-input"
              disabled={loading}
              minLength={6}
            />
          </div>

          {authMode === 'signup' && (
            <div className="auth-input-group">
              <label htmlFor="confirmPassword" className="auth-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your password"
                className="auth-input"
                disabled={loading}
                minLength={6}
              />
            </div>
          )}

          <button 
            onClick={handleAuth}
            className={`auth-submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Loading...
              </span>
            ) : (
              authMode === 'signin' ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </div>

        <div className="auth-divider">
          <span className="divider-text">or</span>
        </div>

        <div className="auth-switch">
          <p className="switch-text">
            {authMode === 'signin' 
              ? "Don't have an account? " 
              : "Already have an account? "
            }
            <button 
              type="button"
              className="auth-switch-btn"
              onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              disabled={loading}
            >
              {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {authMode === 'signin' && (
          <div className="auth-demo-credentials">
            <div className="demo-title">
              <span className="demo-icon">🔑</span>
              Demo Credentials
            </div>
            <div className="demo-info">
              <p><strong>Email:</strong> admin@bms.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
        )}

        {authMode === 'signup' && (
          <div className="auth-info">
            <span className="info-icon">ℹ</span>
            Password must be at least 6 characters long
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;