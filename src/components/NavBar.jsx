import React, { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";

const NavBar = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleOpenLoginModal = () => setLoginModalOpen(true);
  const handleCloseLoginModal = () => setLoginModalOpen(false);

  const utilityLinks = [
    { title: "Vacancy", href: "/vacancy" },
    { title: "Login", onClick: handleOpenLoginModal },
    { title: "Contact Us", href: "#contact-us" },
    { title: "About Us", href: "#about" },
  ];
  return (
    <>
      <div className="hidden md:block bg-[#680000] text-[#cfcfcf] py-1">
        <div className="container mx-auto px-4 flex justify-between items-center pl-5">
          <div className="">
            {" "}
            <img
              src="/src/assets/logo.png"
              alt="SLIATE Logo"
              style={{ width: "400px", height: "70px" }}
            />
          </div>
          <div className="flex items-center space-x-4 pr-5">
            {" "}
            {utilityLinks.map((link, index) => (
              <React.Fragment key={link.title}>
                {link.onClick ? (
                  <motion.button
                    onClick={link.onClick}
                    className="text-[15px] hover:text-accent transition-colors duration-200 bg-transparent border-none cursor-pointer"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {link.title}
                  </motion.button>
                ) : (
                  <motion.a
                    href={link.href}
                    className="text-[14px] hover:text-accent transition-colors duration-200"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {link.title}
                  </motion.a>
                )}

                {index < utilityLinks.length - 1 && (
                  <span className="text-[#cfcfcf]">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-xl max-w-[380px] w-full overflow-hidden"
          >
            <div className="flex justify-between items-center bg-[#680000] text-white p-4">
              <h3 className="font-semibold text-lg">Welcome </h3>
              <button
                onClick={handleCloseLoginModal}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <LoginForm onLoginSuccess={handleCloseLoginModal} />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default NavBar;
