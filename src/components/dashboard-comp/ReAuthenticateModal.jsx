import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiAlertCircle, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";

const ReAuthenticateModal = ({ onClose, onSuccess, userEmail }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSuccess(password);
      // Close modal is handled by the parent component
    } catch (error) {
      console.error("Re-authentication failed:", error);
      setError(error.message || "Failed to re-authenticate. Please try again.");
      toast.error("Re-authentication failed");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Security Verification
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600">
              <FiLock className="w-6 h-6" />
            </div>
            <p className="text-center text-gray-700">
              For security reasons, please enter your password to confirm
              changes to your account.
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              You are updating email for: <strong>{userEmail}</strong>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center">
              <FiAlertCircle className="mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your current password"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? (
                <span className="flex justify-center items-center">
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
                  Verifying...
                </span>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ReAuthenticateModal;
