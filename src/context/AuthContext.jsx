import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
  resetPassword,
  getUserDataFromFirestore,
  testFirestoreConnection,
  createUserInFirestoreOnly,
  updateUserDetails,
  updateUserEmail,
  findUserByEmail,
} from "../services/AuthServices";
import { testFirebaseAuth } from "../config/firebase";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Auth state error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const user = await signIn(email, password);
      setCurrentUser(user);

      if (user.role === "Admin") {
        toast.success("Login successful! ");
        setTimeout(() => {
          navigate("/Dashboard");
        }, 1000);
      } else if (user.role === "User") {
        toast.success("Login successful! ");
        setTimeout(() => {
          navigate("/Dashboard/my-timetable");
        }, 1000);
      } else {
        // navigate('/hello');
        toast.warn("Login failed! Invalid role.");
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, userData) => {
    try {
      const user = await signUp(email, password, userData);
      setCurrentUser(user);
      navigate("/hello");
      return user;
    } catch (error) {
      throw error;
    }
  };

  const createUser = async (userData) => {
    try {
      const { email, password, ...otherData } = userData;
      console.log("Creating new user with data:", {
        email,
        hasPassword: !!password,
        otherData,
      });

      if (!email || !password) {
        throw new Error("Email and password are required to create a user");
      }

      const user = await signUp(email, password, otherData);
      console.log("User created successfully:", user);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await resetPassword(email);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const refreshUserData = async () => {
    if (currentUser?.email) {
      try {
        const userData = await getUserDataFromFirestore(currentUser.email);
        if (userData) {
          setCurrentUser({
            ...currentUser,
            ...userData,
          });
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }
    }
  };

  useEffect(() => {
    const testConnection = async () => {
      try {
        const firestoreConnected = await testFirestoreConnection();
        console.log(
          "Firebase Firestore connection test result:",
          firestoreConnected ? "SUCCESS" : "FAILED"
        );

        const authConnected = await testFirebaseAuth();
        console.log(
          "Firebase Auth connection test result:",
          authConnected ? "SUCCESS" : "FAILED"
        );
      } catch (error) {
        console.error("Error testing Firebase connection:", error);
      }
    };

    testConnection();
  }, []);

  const updateUser = async (userId, userData) => {
    try {
      console.log(`Updating user ${userId} with data:`, userData);

      const updatedUser = await updateUserDetails(userId, userData);

      if (
        currentUser &&
        (currentUser.id === userId || currentUser.uid === userId)
      ) {
        console.log("Updating current user state with new details");
        setCurrentUser({
          ...currentUser,
          ...updatedUser,
        });
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const updateEmail = async (user, newEmail, currentPassword) => {
    try {
      const result = await updateUserEmail(user, newEmail, currentPassword);

      if (result && typeof result === "object" && result.verificationRequired) {
        console.log("Email verification required before updating user state");

        return result;
      }

      if (
        currentUser &&
        (currentUser.id === user.id || currentUser.uid === user.uid)
      ) {
        console.log("Updating current user state with new email");
        setCurrentUser({
          ...currentUser,
          email: newEmail,
        });
      }

      return result;
    } catch (error) {
      console.error("Error updating user email:", error);
      throw error;
    }
  };

  const findUser = async (email) => {
    try {
      return await findUserByEmail(email);
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  };

  const testAuth = async () => {
    try {
      return await testFirebaseAuth();
    } catch (error) {
      console.error("Error testing auth:", error);
      return false;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    createUser,
    refreshUserData,

    createUserInFirestoreOnly,
    testFirestoreConnection,
    testAuth,
    isAuthenticated: !!currentUser,
    updateUser,
    updateEmail,
    findUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
