import React from "react";
import { Link } from "react-router-dom";
import { Film } from "lucide-react";

const footerStyles = `
  .light-footer {
    padding: 60px 20px 40px;
    background: white;
    border-top: 1px solid #f1f5f9;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }

  .footer-logo-icon {
    width: 32px;
    height: 32px;
    color: #7c3aed;
  }

  .footer-logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .footer-links {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
  }

  .footer-link {
    font-size: 0.9375rem;
    color: #64748b;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-link:hover {
    color: #7c3aed;
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid #f1f5f9;
    flex-wrap: wrap;
    gap: 16px;
  }

  .footer-copyright {
    font-size: 0.875rem;
    color: #94a3b8;
  }

  .footer-socials {
    display: flex;
    gap: 24px;
  }

  .footer-social {
    font-size: 0.875rem;
    color: #64748b;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-social:hover {
    color: #7c3aed;
  }

  @media (max-width: 640px) {
    .footer-top {
      flex-direction: column;
      text-align: center;
    }

    .footer-links {
      justify-content: center;
    }

    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }
`;

export default function Footer() {
    return (
        <>
            <style>{footerStyles}</style>
            <footer className="light-footer">
                <div className="footer-content">
                    <div className="footer-top">
                        <Link to="/" className="footer-logo">
                            <Film className="footer-logo-icon" />
                            <span className="footer-logo-text">MovieMood</span>
                        </Link>
                        <div className="footer-links">
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                            <Link to="/terms" className="footer-link">Terms of Service</Link>
                            <Link to="/contact" className="footer-link">Contact</Link>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p className="footer-copyright">
                            © {new Date().getFullYear()} MovieMood. All rights reserved.
                        </p>
                        <div className="footer-socials">
                            <a href="https://twitter.com/moviemood" target="_blank" rel="noopener noreferrer" className="footer-social">Twitter</a>
                            <a href="https://instagram.com/moviemood" target="_blank" rel="noopener noreferrer" className="footer-social">Instagram</a>
                            <a href="https://facebook.com/moviemood" target="_blank" rel="noopener noreferrer" className="footer-social">Facebook</a>
                            <a href="https://linkedin.com/company/moviemood" target="_blank" rel="noopener noreferrer" className="footer-social">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
