import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  CreditCard,
  Building2,
  ChevronDown,
  Lock,
} from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentType, setPaymentType] = useState("credit");

  const plans = {
    monthly: {
      name: "Monthly Plan",
      desc: "Ideal for short-term sprints & trials.",
      price: 12,
      period: "Month",
    },
    annual: {
      name: "Annual Plan",
      desc: "Commit for a year with 20% savings.",
      price: 10,
      period: "Month",
      savings: "20%",
    },
  };

  // PayPal payment handlers
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: `MovieMood ${plans[selectedPlan].name}`,
          amount: {
            value: plans[selectedPlan].price,
            currency_code: "USD",
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(() => {
      alert("Payment successful! Your subscription is now active.");
    });
  };

  const features = [
    "All tools, unlocked with no limits",
    "Work together in real-time",
    "Sync your workflow across any device",
    "Faster help with priority support",
  ];

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Left Column - Plan Selection */}
        <div className="payment-left">
          <div className="payment-header">
            <h1 className="payment-title">
              Activate Your <span className="brand-text">MovieMood</span> Pro
            </h1>
            <p className="payment-subtitle">
              Get unlimited access to all productivity tools in seconds.
            </p>
          </div>

          {/* Plan Selector */}
          <div className="plan-section">
            <h3 className="section-title">Starter Plan</h3>

            <div className="plan-options">
              <div
                className={`plan-option ${selectedPlan === "monthly" ? "selected" : ""}`}
                onClick={() => setSelectedPlan("monthly")}
              >
                <div className="plan-radio">
                  <div className="radio-outer">
                    {selectedPlan === "monthly" && <div className="radio-inner" />}
                  </div>
                </div>
                <div className="plan-info">
                  <div className="plan-header-row">
                    <h4 className="plan-name">Monthly Plan</h4>
                    <div className="plan-price">
                      <span className="price-amount">${plans.monthly.price}</span>
                      <span className="price-period">/ {plans.monthly.period}</span>
                    </div>
                  </div>
                  <p className="plan-description">{plans.monthly.desc}</p>
                </div>
              </div>

              <div
                className={`plan-option ${selectedPlan === "annual" ? "selected" : ""}`}
                onClick={() => setSelectedPlan("annual")}
              >
                <div className="plan-radio">
                  <div className="radio-outer">
                    {selectedPlan === "annual" && <div className="radio-inner" />}
                  </div>
                </div>
                <div className="plan-info">
                  <div className="plan-header-row">
                    <h4 className="plan-name">Annual Plan</h4>
                    <div className="plan-price">
                      <span className="price-amount">${plans.annual.price}</span>
                      <span className="price-period">/ {plans.annual.period}</span>
                    </div>
                  </div>
                  <p className="plan-description">
                    {plans.annual.desc} <span className="savings-badge">-{plans.annual.savings} savings</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="features-section">
            <h3 className="section-title">What you'll unlock →</h3>
            <ul className="features-list">
              {features.map((feature, i) => (
                <li key={i} className="feature-item">
                  <Check className="feature-icon" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Promo Text */}
          <p className="promo-text">
            Everything unlocked, synced, and built for speed. Collaborate in real time,
            scale your workflow smoothly, and get help fast with priority support.
          </p>
        </div>

        {/* Right Column - Payment Form */}
        <div className="payment-right">
          {/* Payment Method Tabs */}
          <div className="payment-tabs">
            <button
              className={`payment-tab ${paymentMethod === "card" ? "active" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              Pay by Card
            </button>
            <button
              className={`payment-tab ${paymentMethod === "paypal" ? "active" : ""}`}
              onClick={() => setPaymentMethod("paypal")}
            >
              Pay with Paypal
            </button>
          </div>

          {/* Form */}
          <form className="payment-form">
            {/* Billed To */}
            <div className="form-group">
              <label className="form-label">Billed To</label>
              <input
                type="text"
                className="form-input"
                placeholder="Bob Snow"
              />
            </div>

            {/* Conditional: Show PayPal or Card Payment */}
            {paymentMethod === "paypal" ? (
              /* PayPal Payment Section */
              <div className="paypal-section">
                <div className="paypal-info">
                  <div className="paypal-logo">
                    <svg width="80" height="24" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="32" rx="4" fill="#0070BA" />
                      <text x="50" y="21" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">PayPal</text>
                    </svg>
                  </div>
                  <p className="paypal-desc">
                    Click the button below to securely connect your PayPal account and complete your subscription.
                  </p>
                </div>

                <PayPalScriptProvider
                  options={{
                    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
                    currency: "USD",
                  }}
                >
                  <div className="paypal-buttons-container">
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        shape: "pill",
                        color: "gold",
                        height: 45,
                      }}
                      createOrder={createOrder}
                      onApprove={onApprove}
                    />
                  </div>
                </PayPalScriptProvider>

                <div className="paypal-benefits">
                  <div className="benefit-item">
                    <Check size={16} className="benefit-icon" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="benefit-item">
                    <Check size={16} className="benefit-icon" />
                    <span>Buyer protection included</span>
                  </div>
                  <div className="benefit-item">
                    <Check size={16} className="benefit-icon" />
                    <span>Link your bank or card</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Card Payment Section */
              <div className="payment-detail-section">
                <h3 className="section-title">Payment Detail</h3>

                {/* Payment Type Toggle */}
                <div className="payment-type-toggle">
                  <button
                    type="button"
                    className={`type-button ${paymentType === "bank" ? "active" : ""}`}
                    onClick={() => setPaymentType("bank")}
                  >
                    <Building2 size={20} />
                    Bank Transfer
                  </button>
                  <button
                    type="button"
                    className={`type-button ${paymentType === "credit" ? "active" : ""}`}
                    onClick={() => setPaymentType("credit")}
                  >
                    <CreditCard size={20} />
                    Credit Card
                  </button>
                </div>

                {/* Card Number */}
                <div className="form-group">
                  <div className="card-input-wrapper">
                    <input
                      type="text"
                      className="form-input card-input"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    <div className="card-brands">
                      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect width='32' height='20' rx='3' fill='%23EB001B'/%3E%3Crect x='12' width='8' height='20' fill='%23F79E1B'/%3E%3C/svg%3E" alt="Mastercard" />
                      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20'%3E%3Crect width='32' height='20' rx='3' fill='%231A1F71'/%3E%3Ctext x='16' y='14' font-family='Arial' font-size='10' font-weight='bold' fill='white' text-anchor='middle'%3EVISA%3C/text%3E%3C/svg%3E" alt="Visa" />
                    </div>
                  </div>
                </div>

                {/* MM/YY and CVV */}
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="MM / YY"
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="CVV"
                      maxLength="3"
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="form-group">
                  <div className="select-wrapper">
                    <select className="form-select">
                      <option>Choose country</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>India</option>
                    </select>
                    <ChevronDown className="select-icon" size={16} />
                  </div>
                </div>

                {/* City, State, ZIP */}
                <div className="form-row triple">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="payment-total">
              <span className="total-label">Total</span>
              <span className="total-amount">
                ${plans[selectedPlan].price} / Month
              </span>
            </div>

            {/* Subscribe Button */}
            <button type="submit" className="subscribe-button">
              Subscribe
            </button>

            {/* Security Note */}
            <div className="security-note">
              <Lock size={14} />
              <span>
                Your payment data is fully encrypted and handled with the highest
                security standards.
              </span>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .payment-page {
          min-height: 100vh;
          background: #fafafa;
          padding: 120px 20px 60px;
        }

        .payment-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 45% 55%;
          gap: 3rem;
          align-items: start;
        }

        /* Left Column */
        .payment-left {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .payment-header {
          margin-bottom: 1rem;
        }

        .payment-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }

        .brand-text {
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .payment-subtitle {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.6;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.25rem;
        }

        /* Plan Options */
        .plan-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .plan-option {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .plan-option:hover {
          border-color: #d1d5db;
        }

        .plan-option.selected {
          border-color: #7c3aed;
          background: #faf5ff;
        }

        .plan-radio {
          flex-shrink: 0;
          padding-top: 0.125rem;
        }

        .radio-outer {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .plan-option.selected .radio-outer {
          border-color: #7c3aed;
        }

        .radio-inner {
          width: 10px;
          height: 10px;
          background: #7c3aed;
          border-radius: 50%;
        }

        .plan-info {
          flex: 1;
        }

        .plan-header-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.5rem;
        }

        .plan-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .price-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .price-period {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .plan-description {
          font-size: 0.9375rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .savings-badge {
          color: #7c3aed;
          font-weight: 600;
        }

        /* Features */
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9375rem;
          color: #374151;
          line-height: 1.5;
        }

        .feature-icon {
          width: 18px;
          height: 18px;
          color: #7c3aed;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .promo-text {
          font-size: 0.9375rem;
          color: #6b7280;
          line-height: 1.7;
        }

        /* Right Column */
        .payment-right {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        .payment-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .payment-tab {
          flex: 1;
          padding: 0.75rem 1rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-tab:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .payment-tab.active {
          background: #7c3aed;
          color: white;
          border-color: #7c3aed;
        }

        /* Form */
        .payment-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .form-input,
        .form-select {
          padding: 0.875rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9375rem;
          color: #1f2937;
          transition: all 0.2s ease;
          background: white;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .payment-detail-section {
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .payment-type-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .type-button {
          padding: 0.875rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .type-button:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .type-button.active {
          border-color: #7c3aed;
          background: #faf5ff;
          color: #7c3aed;
        }

        .card-input-wrapper {
          position: relative;
        }

        .card-input {
          padding-right: 80px;
        }

        .card-brands {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 6px;
        }

        .card-brands img {
          height: 18px;
          width: auto;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .form-row.triple {
          grid-template-columns: 1fr 1fr 1fr;
        }

        .select-wrapper {
          position: relative;
        }

        .form-select {
          appearance: none;
          width: 100%;
          padding-right: 2.5rem;
        }

        .select-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }

        .payment-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .total-label {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .total-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .subscribe-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .subscribe-button:hover {
          background: linear-gradient(135deg, #6d28d9, #9333ea);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
        }

        .security-note {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .security-note svg {
          flex-shrink: 0;
          margin-top: 0.125rem;
          color: #9ca3af;
        }

        /* PayPal Section */
        .paypal-section {
          padding: 2rem 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
          text-align: center;
        }

        .paypal-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .paypal-logo {
          margin-bottom: 0.5rem;
        }

        .paypal-desc {
          font-size: 0.9375rem;
          color: #6b7280;
          line-height: 1.6;
          max-width: 400px;
        }

        .paypal-buttons-container {
          width: 100%;
          max-width: 400px;
        }

        .paypal-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-center;
          gap: 1rem;
          padding: 2rem;
          background: #f9fafb;
          border-radius: 8px;
          width: 100%;
          max-width: 400px;
        }

        .paypal-spinner {
          width: 32px;
          height: 32px;
          color: #0070BA;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .paypal-loading p {
          font-size: 0.9375rem;
          color: #6b7280;
        }

        .paypal-connect-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: #0070BA;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          max-width: 350px;
        }

        .paypal-connect-button:hover {
          background: #005a95;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0, 112, 186, 0.35);
        }

        .paypal-benefits {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          max-width: 350px;
          text-align: left;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: #374151;
        }

        .benefit-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        /* Dark Mode Support */
        [data-theme="dark"] .payment-page {
          background: #0f172a;
        }

        [data-theme="dark"] .payment-title,
        [data-theme="dark"] .section-title,
        [data-theme="dark"] .plan-name,
        [data-theme="dark"] .price-amount,
        [data-theme="dark"] .total-label,
        [data-theme="dark"] .total-amount {
          color: #f1f5f9;
        }

        [data-theme="dark"] .payment-subtitle,
        [data-theme="dark"] .plan-description,
        [data-theme="dark"] .promo-text,
        [data-theme="dark"] .price-period,
        [data-theme="dark"] .security-note {
          color: #94a3b8;
        }

        [data-theme="dark"] .plan-option,
        [data-theme="dark"] .payment-right,
        [data-theme="dark"] .form-input,
        [data-theme="dark"] .form-select,
        [data-theme="dark"] .type-button {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }

        [data-theme="dark"] .plan-option.selected {
          background: rgba(124, 58, 237, 0.1);
        }

        [data-theme="dark"] .payment-tab {
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
        }

        [data-theme="dark"] .payment-tab:hover {
          background: #334155;
        }

        [data-theme="dark"] .type-button.active {
          background: rgba(124, 58, 237, 0.15);
        }

        /* Responsive */
        @media (max-width: 968px) {
          .payment-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .payment-title {
            font-size: 1.875rem;
          }

          .form-row.triple {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .payment-page {
            padding: 100px 16px 40px;
          }

          .payment-right {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .payment-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Payment;
