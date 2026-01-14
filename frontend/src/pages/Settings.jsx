import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiSettings, FiArrowLeft, FiSun, FiMoon, FiBell, FiUser, FiLock, FiMail, FiSmartphone, FiLogOut } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const settingsStyles = `
  .settings-page {
    min-height: 100vh;
    padding-top: 100px;
    padding-bottom: 60px;
    transition: background 0.3s ease;
  }

  .settings-page.light {
    background: linear-gradient(180deg, #fdfbf9 0%, #fef5f0 50%, #faf5ff 100%);
  }

  .settings-page.dark {
    background: radial-gradient(ellipse at top, #1e1b4b 0%, #0a0118 50%, #000000 100%);
  }

  .settings-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* Header */
  .settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .settings-page.light .header-icon {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    color: #7c3aed;
  }

  .settings-page.dark .header-icon {
    background: rgba(124, 58, 237, 0.2);
    color: #a78bfa;
  }

  .header-title {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .settings-page.light .header-title {
    color: #1a1a2e;
  }

  .settings-page.dark .header-title {
    color: #f8f9ff;
  }

  .header-subtitle {
    font-size: 0.875rem;
  }

  .settings-page.light .header-subtitle {
    color: #64748b;
  }

  .settings-page.dark .header-subtitle {
    color: #a5b4fc;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .settings-page.light .back-btn {
    color: #7c3aed;
    background: transparent;
  }

  .settings-page.light .back-btn:hover {
    background: #faf5ff;
  }

  .settings-page.dark .back-btn {
    color: #a78bfa;
    background: transparent;
  }

  .settings-page.dark .back-btn:hover {
    background: rgba(124, 58, 237, 0.15);
  }

  /* Settings Grid */
  .settings-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  @media (min-width: 768px) {
    .settings-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Settings Card */
  .settings-card {
    padding: 1.5rem;
    border-radius: 16px;
    transition: all 0.3s ease;
  }

  .settings-page.light .settings-card {
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .settings-page.dark .settings-card {
    background: rgba(30, 27, 75, 0.5);
    border: 1px solid rgba(167, 139, 250, 0.2);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 1.25rem;
  }

  .card-icon {
    color: #7c3aed;
  }

  .settings-page.dark .card-icon {
    color: #a78bfa;
  }

  .card-title {
    font-size: 1rem;
    font-weight: 600;
  }

  .settings-page.light .card-title {
    color: #1a1a2e;
  }

  .settings-page.dark .card-title {
    color: #f8f9ff;
  }

  /* Setting Item */
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 0;
  }

  .setting-item:not(:last-child) {
    border-bottom: 1px solid;
  }

  .settings-page.light .setting-item:not(:last-child) {
    border-color: #f3f4f6;
  }

  .settings-page.dark .setting-item:not(:last-child) {
    border-color: rgba(167, 139, 250, 0.1);
  }

  .setting-info {
    flex: 1;
  }

  .setting-label {
    font-size: 0.9375rem;
    font-weight: 500;
    margin-bottom: 0.125rem;
  }

  .settings-page.light .setting-label {
    color: #1a1a2e;
  }

  .settings-page.dark .setting-label {
    color: #f8f9ff;
  }

  .setting-desc {
    font-size: 0.8125rem;
  }

  .settings-page.light .setting-desc {
    color: #64748b;
  }

  .settings-page.dark .setting-desc {
    color: #a5b4fc;
  }

  /* Toggle Switch */
  .toggle-switch {
    position: relative;
    width: 48px;
    height: 26px;
    border-radius: 13px;
    cursor: pointer;
    transition: background 0.3s ease;
    flex-shrink: 0;
  }

  .toggle-switch.off {
    background: #e5e7eb;
  }

  .settings-page.dark .toggle-switch.off {
    background: rgba(88, 28, 135, 0.4);
  }

  .toggle-switch.on {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  }

  .toggle-knob {
    position: absolute;
    top: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
  }

  .toggle-switch.off .toggle-knob {
    transform: translateX(3px);
  }

  .toggle-switch.on .toggle-knob {
    transform: translateX(25px);
  }

  /* Theme Toggle */
  .theme-toggle {
    display: flex;
    border-radius: 12px;
    overflow: hidden;
  }

  .settings-page.light .theme-toggle {
    background: #f3f4f6;
  }

  .settings-page.dark .theme-toggle {
    background: rgba(88, 28, 135, 0.3);
  }

  .theme-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .theme-btn.inactive {
    background: transparent;
  }

  .settings-page.light .theme-btn.inactive {
    color: #64748b;
  }

  .settings-page.dark .theme-btn.inactive {
    color: #a5b4fc;
  }

  .theme-btn.active {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
    border-radius: 10px;
  }

  /* Account Links */
  .account-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: 10px;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    width: 100%;
    text-align: left;
  }

  .settings-page.light .account-link {
    background: #f9fafb;
    color: #374151;
  }

  .settings-page.light .account-link:hover {
    background: #f3f4f6;
  }

  .settings-page.dark .account-link {
    background: rgba(88, 28, 135, 0.2);
    color: #e0e7ff;
  }

  .settings-page.dark .account-link:hover {
    background: rgba(124, 58, 237, 0.3);
  }

  .account-link.danger {
    margin-top: 0.5rem;
  }

  .settings-page.light .account-link.danger {
    background: #fef2f2;
    color: #dc2626;
  }

  .settings-page.light .account-link.danger:hover {
    background: #fee2e2;
  }

  .settings-page.dark .account-link.danger {
    background: rgba(220, 38, 38, 0.15);
    color: #fca5a5;
  }

  .settings-page.dark .account-link.danger:hover {
    background: rgba(220, 38, 38, 0.25);
  }

  /* Checkbox */
  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    cursor: pointer;
  }

  .checkbox {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .checkbox.unchecked {
    border: 2px solid;
  }

  .settings-page.light .checkbox.unchecked {
    border-color: #d1d5db;
    background: white;
  }

  .settings-page.dark .checkbox.unchecked {
    border-color: rgba(167, 139, 250, 0.3);
    background: rgba(30, 27, 75, 0.5);
  }

  .checkbox.checked {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
  }

  .checkbox-label {
    font-size: 0.9375rem;
  }

  .settings-page.light .checkbox-label {
    color: #374151;
  }

  .settings-page.dark .checkbox-label {
    color: #e0e7ff;
  }

  /* Save Button */
  .save-section {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
  }

  .save-btn {
    padding: 0.875rem 2rem;
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  }

  .save-btn:hover {
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }
`;

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [notificationTypes, setNotificationTypes] = useState({
    newReleases: true,
    watchlistUpdates: true,
    promotionalOffers: false
  });

  const handleNotificationToggle = (type) => {
    setNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSave = () => {
    const settings = {
      theme,
      notifications,
      notificationTypes,
      autoPlay,
    };
    localStorage.setItem('movieMoodSettings', JSON.stringify(settings));
    toast.success("Settings saved!");
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('movieMoodSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setNotifications(parsed.notifications ?? true);
      setAutoPlay(parsed.autoPlay ?? false);
      setNotificationTypes(parsed.notificationTypes ?? {
        newReleases: true,
        watchlistUpdates: true,
        promotionalOffers: false
      });
    }
  }, []);

  return (
    <>
      <style>{settingsStyles}</style>
      <div className={`settings-page ${theme}`}>
        <div className="settings-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="settings-header"
          >
            <div className="header-left">
              <div className="header-icon">
                <FiSettings size={24} />
              </div>
              <div>
                <h1 className="header-title">Settings</h1>
                <p className="header-subtitle">Customize your experience</p>
              </div>
            </div>
            <Link to="/dashboard" className="back-btn">
              <FiArrowLeft size={18} />
              Back
            </Link>
          </motion.div>

          {/* Settings Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="settings-grid"
          >
            {/* Appearance */}
            <div className="settings-card">
              <div className="card-header">
                <FiSun className="card-icon" size={20} />
                <h2 className="card-title">Appearance</h2>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Theme</div>
                  <div className="setting-desc">Choose your preferred theme</div>
                </div>
                <div className="theme-toggle">
                  <button
                    className={`theme-btn ${theme === 'light' ? 'active' : 'inactive'}`}
                    onClick={() => theme === 'dark' && toggleTheme()}
                  >
                    <FiSun size={14} />
                    Light
                  </button>
                  <button
                    className={`theme-btn ${theme === 'dark' ? 'active' : 'inactive'}`}
                    onClick={() => theme === 'light' && toggleTheme()}
                  >
                    <FiMoon size={14} />
                    Dark
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Autoplay Previews</div>
                  <div className="setting-desc">Auto-play movie trailers</div>
                </div>
                <div
                  className={`toggle-switch ${autoPlay ? 'on' : 'off'}`}
                  onClick={() => setAutoPlay(!autoPlay)}
                >
                  <div className="toggle-knob"></div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="settings-card">
              <div className="card-header">
                <FiBell className="card-icon" size={20} />
                <h2 className="card-title">Notifications</h2>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Push Notifications</div>
                  <div className="setting-desc">Receive important updates</div>
                </div>
                <div
                  className={`toggle-switch ${notifications ? 'on' : 'off'}`}
                  onClick={() => setNotifications(!notifications)}
                >
                  <div className="toggle-knob"></div>
                </div>
              </div>

              {notifications && (
                <div style={{ paddingTop: '0.5rem' }}>
                  <div
                    className="checkbox-item"
                    onClick={() => handleNotificationToggle('newReleases')}
                  >
                    <div className={`checkbox ${notificationTypes.newReleases ? 'checked' : 'unchecked'}`}>
                      {notificationTypes.newReleases && <span>✓</span>}
                    </div>
                    <span className="checkbox-label">New Releases</span>
                  </div>
                  <div
                    className="checkbox-item"
                    onClick={() => handleNotificationToggle('watchlistUpdates')}
                  >
                    <div className={`checkbox ${notificationTypes.watchlistUpdates ? 'checked' : 'unchecked'}`}>
                      {notificationTypes.watchlistUpdates && <span>✓</span>}
                    </div>
                    <span className="checkbox-label">Watchlist Updates</span>
                  </div>
                  <div
                    className="checkbox-item"
                    onClick={() => handleNotificationToggle('promotionalOffers')}
                  >
                    <div className={`checkbox ${notificationTypes.promotionalOffers ? 'checked' : 'unchecked'}`}>
                      {notificationTypes.promotionalOffers && <span>✓</span>}
                    </div>
                    <span className="checkbox-label">Promotional Offers</span>
                  </div>
                </div>
              )}
            </div>

            {/* Account */}
            <div className="settings-card" style={{ gridColumn: 'span 1' }}>
              <div className="card-header">
                <FiUser className="card-icon" size={20} />
                <h2 className="card-title">Account</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button className="account-link">
                  <FiLock size={18} />
                  Change Password
                </button>
                <button className="account-link">
                  <FiMail size={18} />
                  Update Email
                </button>
                <button className="account-link">
                  <FiSmartphone size={18} />
                  Connected Devices
                </button>
                <button className="account-link danger">
                  <FiLogOut size={18} />
                  Logout All Devices
                </button>
              </div>
            </div>

            {/* Privacy */}
            <div className="settings-card">
              <div className="card-header">
                <FiLock className="card-icon" size={20} />
                <h2 className="card-title">Privacy</h2>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Profile Visibility</div>
                  <div className="setting-desc">Make your profile public</div>
                </div>
                <div className="toggle-switch off">
                  <div className="toggle-knob"></div>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Activity Status</div>
                  <div className="setting-desc">Show when you're online</div>
                </div>
                <div className="toggle-switch on">
                  <div className="toggle-knob"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="save-section"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="save-btn"
            >
              Save Changes
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
}