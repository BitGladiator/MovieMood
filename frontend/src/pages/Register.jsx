import React, { useState } from "react";
import { signup } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, User } from "lucide-react";
import Footer from "../components/Footer";

const registerStyles = `
  * {
    box-sizing: border-box;
  }

  .register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: linear-gradient(135deg, #e3e8ef 0%, #d1dae5 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .register-card {
    width: 100%;
    max-width: 850px;
    height: 520px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
    display: flex;
  }

  /* Left Section - Visual with Cloud Wave */
  .visual-section {
    flex: 1;
    position: relative;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #9333ea 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
  }

  .cloud-wave-container {
    position: absolute;
    right: -1px;
    top: 0;
    bottom: 0;
    width: 100px;
    z-index: 10;
    overflow: visible;
  }

  .cloud-wave-container svg {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 100px;
  }

  .visual-content {
    text-align: center;
    color: white;
    padding: 40px;
    padding-right: 80px;
    position: relative;
    z-index: 3;
  }

  .visual-title {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .visual-description {
    font-size: 0.95rem;
    line-height: 1.6;
    opacity: 0.95;
    max-width: 300px;
  }
  /* Right Section - Form */
  .form-section {
    flex: 1;
    padding: 50px 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

  .form-title {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 8px;
    text-align: left;
  }

  .form-subtitle {
    font-size: 0.95rem;
    color: #6b7280;
    margin-bottom: 30px;
    text-align: left;
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .input-group {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #7c3aed;
    z-index: 1;
  }

  .form-input {
    width: 100%;
    padding: 14px 50px 14px 50px;
    border: 2px solid #e5e7eb;
    border-radius: 25px;
    font-size: 0.9rem;
    color: #1f2937;
    background: white;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #7c3aed;
  }

  .form-input::placeholder {
    color: #9ca3af;
  }

  .password-toggle {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 4px;
    display: flex;
    align-items: center;
  }

  .password-toggle:hover {
    color: #7c3aed;
  }

  .terms-text {
    font-size: 0.75rem;
    color: #6b7280;
    text-align: center;
    line-height: 1.5;
    margin-top: 4px;
  }

  .terms-text a {
    color: #7c3aed;
    text-decoration: none;
  }

  .terms-text a:hover {
    text-decoration: underline;
  }

  .submit-button {
    margin: 16px auto 0;
    padding: 13px 55px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    font-weight: 600;
    font-size: 0.85rem;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }

  .submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .form-footer {
    text-align: center;
    margin-top: 18px;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .form-footer a {
    color: #7c3aed;
    font-weight: 600;
    text-decoration: none;
  }

  .form-footer a:hover {
    text-decoration: underline;
  }

  .error-message {
    background: #fef2f2;
    color: #dc2626;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 0.8rem;
    text-align: center;
    margin-bottom: 12px;
  }

  @media (max-width: 768px) {
    .register-card {
      flex-direction: column;
      height: auto;
      max-width: 420px;
    }

    /* Hide the purple visual section completely on mobile */
    .visual-section {
      display: none;
    }

    .form-section {
      padding: 40px 30px;
    }

    .form-title {
      font-size: 2rem;
    }

    .form-subtitle {
      font-size: 0.875rem;
    }

    .submit-button {
      width: 100%;
      padding: 14px 20px;
    }
  }
`;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(email, password, name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{registerStyles}</style>
      <div className="register-page">
        <motion.div
          className="register-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left - Visual with Cloud Wave */}
          <div className="visual-section">
            <div className="visual-content">
              <h2 className="visual-title">Welcome!</h2>
              <p className="visual-description">
                Create your account to discover movies that match your mood and start your journey.
              </p>
            </div>
            {/* Cloud Wave SVG */}
            <div className="cloud-wave-container">
              <svg viewBox="0 0 100 520" preserveAspectRatio="none" fill="white">
                <path d="
                  M100,0 
                  L100,520 
                  L60,520
                  C70,485 40,450 55,420
                  C75,385 35,350 55,320
                  C80,285 30,250 55,220
                  C85,185 35,150 55,120
                  C80,85 40,50 55,25
                  C65,5 80,0 100,0
                  Z
                " />
              </svg>
            </div>
          </div>

          {/* Right - Form */}
          <div className="form-section">
            <h1 className="form-title">Create Account</h1>
            <p className="form-subtitle">Start your movie journey today</p>

            {error && <div className="error-message">{error}</div>}

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <User className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <Mail className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="terms-text">
                By creating an account, you agree to our{" "}
                <Link to="/terms">Terms</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>
              </p>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>

            <p className="form-footer">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        {/* <Footer /> */}
      </div>
    </>
  );
}