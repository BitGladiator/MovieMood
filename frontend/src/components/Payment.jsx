import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Lock, CreditCard, Check, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activePlan, setActivePlan] = useState({
    name: "Premium",
    price: "19.99",
    period: "month",
  });
  const [paypalReady, setPaypalReady] = useState(false);
  const paypalScriptRef = useRef();

  // Initialize PayPal SDK
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector(`script[src*="paypal.com/sdk/js"]`)) {
      setPaypalReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${
      import.meta.env.VITE_PAYPAL_CLIENT_ID
    }&currency=USD`;
    script.async = true;
    script.onload = () => setPaypalReady(true);
    script.onerror = () => console.error("PayPal SDK failed to load");

    document.body.appendChild(script);
    paypalScriptRef.current = script;

    return () => {
      if (paypalScriptRef.current) {
        document.body.removeChild(paypalScriptRef.current);
      }
    };
  }, []);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: `${activePlan.name} Subscription`,
          amount: {
            value: activePlan.price,
            currency_code: "USD",
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(() => {
      setIsSuccess(true);
    });
  };

  if (isSuccess) {
    return (
      <div className="bg-gray-950 text-gray-100 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/80 border border-gray-800 rounded-2xl p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-400 mb-6">
            Your {activePlan.name} plan has been activated.
          </p>
          <div className="bg-gray-800/50 rounded-lg p-4 mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Plan</span>
              <span className="font-medium">{activePlan.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Amount</span>
              <span className="font-medium">${activePlan.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Billing</span>
              <span className="font-medium">
                {activePlan.period === "month" ? "Monthly" : "Yearly"}
              </span>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-purple-500/30 flex items-center justify-center"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-sans antialiased">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link
              to="/pricing"
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to plans
            </Link>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-gray-400">
                Secure payment
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Payment Form */}
            <div className="lg:w-2/3">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

                {/* Payment Method Tabs */}
                <div className="flex border-b border-gray-800 mb-8">
                  <button
                    className={`px-4 py-3 font-medium flex items-center space-x-2 ${
                      paymentMethod === "card"
                        ? "text-purple-400 border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    className={`px-4 py-3 font-medium flex items-center space-x-2 ${
                      paymentMethod === "paypal"
                        ? "text-blue-400 border-b-2 border-blue-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <img
                      src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                      alt="PayPal"
                      className="w-6 h-6"
                    />
                    <span>PayPal</span>
                  </button>
                </div>

                {/* Card Form */}
                {paymentMethod === "card" && (
                  <form onSubmit={handleCardSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="number"
                            value={cardDetails.number}
                            onChange={handleCardChange}
                            placeholder="4242 4242 4242 4242"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            required
                          />
                          <div className="absolute right-3 top-3 flex space-x-2">
                            <div className="w-8 h-5 bg-gray-700 rounded-sm"></div>
                            <div className="w-8 h-5 bg-gray-700 rounded-sm"></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={cardDetails.name}
                          onChange={handleCardChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            CVC
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="cvc"
                              value={cardDetails.cvc}
                              onChange={handleCardChange}
                              placeholder="123"
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              required
                            />
                            <div className="absolute right-3 top-3">
                              <div className="w-8 h-5 bg-gray-700 rounded-sm"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-purple-500/30 flex items-center justify-center"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            `Pay $${activePlan.price}`
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* PayPal Form */}
                {paymentMethod === "paypal" && (
                  <div className="pt-4">
                    {paypalReady ? (
                      <PayPalScriptProvider
                        options={{
                          "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                          currency: "USD",
                        }}
                      >
                        <div className="rounded-lg overflow-hidden">
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
                    ) : (
                      <div className="flex justify-center items-center h-20 bg-gray-800/50 rounded-lg">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Security Info */}
              <div className="mt-6 flex items-center justify-center text-gray-500 text-sm">
                <Lock className="w-4 h-4 mr-2" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-6">
                <h3 className="text-lg font-bold mb-6">Order Summary</h3>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Plan</span>
                    <span className="font-medium">{activePlan.name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Billing Cycle</span>
                    <span className="font-medium">
                      {activePlan.period === "month" ? "Monthly" : "Yearly"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-xl font-bold">
                      ${activePlan.price}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Tax</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total</span>
                      <span className="text-xl font-bold">
                        ${activePlan.price}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4 mt-6">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-2" />
                      What's included:
                    </h4>
                    <ul className="text-sm text-gray-400 space-y-2">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Unlimited mood-based recommendations
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        4K/HDR streaming quality
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Personalized curator
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        Offline downloads
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Lock className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">
                Secure payment processing
              </span>
            </div>
            <div className="flex space-x-6">
              {["Visa", "Mastercard", "Amex", "Discover", "PayPal"].map(
                (card, i) => (
                  <div
                    key={i}
                    className={`text-gray-400 text-sm font-medium opacity-70 ${
                      card === "PayPal" ? "flex items-center" : ""
                    }`}
                  >
                    {card === "PayPal" && (
                      <img
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                        alt="PayPal"
                        className="w-5 h-5 mr-1"
                      />
                    )}
                    {card}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
