import React, { useState } from "react";
import { login } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import Footer from "../components/Footer";

const loginStyles = `
  * {
    box-sizing: border-box;
  }

  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: linear-gradient(135deg, #e3e8ef 0%, #d1dae5 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .login-card {
    width: 100%;
    max-width: 850px;
    height: 500px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
    display: flex;
  }

  /* Left Section - Form */
  .form-section {
    flex: 1;
    padding: 60px 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

  .form-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 8px;
    text-align: left;
  }

  .form-subtitle {
    font-size: 0.95rem;
    color: #6b7280;
    margin-bottom: 35px;
    text-align: left;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
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

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    margin-top: 2px;
  }

  .remember-label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6b7280;
    cursor: pointer;
  }

  .remember-label input {
    width: 15px;
    height: 15px;
    accent-color: #7c3aed;
    cursor: pointer;
  }

  .forgot-link {
    color: #7c3aed;
    text-decoration: none;
    font-weight: 500;
  }

  .forgot-link:hover {
    text-decoration: underline;
  }

  .submit-button {
    margin: 20px auto 0;
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
    margin-top: 22px;
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

  /* Right Section - Visual with Cloud Wave */
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
    left: -1px;
    top: 0;
    bottom: 0;
    width: 100px;
    z-index: 10;
    overflow: visible;
  }

  .cloud-wave-container svg {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100px;
  }

  .visual-content {
    text-align: center;
    color: white;
    padding: 40px;
    padding-left: 80px;
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

  @media (max-width: 768px) {
    .login-card {
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{loginStyles}</style>
      <div className="login-page">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left - Form */}
          <div className="form-section">
            <h1 className="form-title">Hello!</h1>
            <p className="form-subtitle">Sign in to your account</p>

            {error && <div className="error-message">{error}</div>}

            <form className="login-form" onSubmit={handleSubmit}>
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

              <div className="form-options">
                <label className="remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="form-footer">
              Don't have an account? <Link to="/register">Create</Link>
            </p>
          </div>

          {/* Right - Visual with Cloud Wave */}
          <div className="visual-section">
            {/* Cloud Wave SVG */}
            <div className="cloud-wave-container">
              <svg viewBox="0 0 100 520" preserveAspectRatio="none" fill="white">
                <path d="
                  M0,0 
                  L0,520 
                  L40,520
                  C30,485 60,450 45,420
                  C25,385 65,350 45,320
                  C20,285 70,250 45,220
                  C15,185 65,150 45,120
                  C20,85 60,50 45,25
                  C35,5 20,0 0,0
                  Z
                " />
              </svg>
            </div>
            <div className="visual-content">
              <h2 className="visual-title">Welcome Back!</h2>
              <p className="visual-description">
                Discover movies that match your mood. Access personalized recommendations and your movie diary.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        {/* <Footer /> */}
      </div>
    </>
  );
}
