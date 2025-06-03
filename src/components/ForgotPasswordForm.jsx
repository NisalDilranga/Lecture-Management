import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      await forgotPassword(email);
      setSuccessMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage = err.code
        ? getErrorMessage(err.code)
        : "Password reset failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert Firebase error codes to user-friendly messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email address format";
      case "auth/user-not-found":
        return "No account found with this email address";
      default:
        return "Password reset failed. Please try again.";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
        >
          {error}
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-2 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="mb-6">
        <button
          onClick={onBackToLogin}
          className="flex items-center text-sm text-[#8B0000] hover:text-[#A52A2A] focus:outline-none"
        >
          <FiArrowLeft className="mr-1" /> Back to login
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Reset Your Password
      </h2>

      <p className="text-gray-600 mb-6">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <FiMail />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B0000] focus:border-[#8B0000] sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B0000] hover:bg-[#A52A2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            ) : null}
            {isLoading ? "Sending..." : "Send Reset Link"}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
