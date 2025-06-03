import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
  findUserByEmail
} from '../services/AuthServices';
import { testFirebaseAuth } from '../config/firebase';

// Create the auth context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial render
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Auth state error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login functionality
  const login = async (email, password) => {
    try {
      const user = await signIn(email, password);
      setCurrentUser(user);
      
      // Navigate based on user role
      if (user.role === 'Admin') {
        navigate('/Dashboard/add-users');
      } else if (user.role === 'User') {
        navigate('/Dashboard/my-timetable');
      } else {
        // Default fallback if role isn't set or is unknown
        navigate('/hello');
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Enhanced register functionality that takes additional user data
  const register = async (email, password, userData) => {
    try {
      const user = await signUp(email, password, userData);
      setCurrentUser(user);
      navigate('/hello');
      return user;
    } catch (error) {
      throw error;
    }
  };
    // Create user functionality for admin to create new users
  const createUser = async (userData) => {
    try {
      const { email, password, ...otherData } = userData;
      console.log("Creating new user with data:", { email, hasPassword: !!password, otherData });
      
      // Ensure we have the required fields
      if (!email || !password) {
        throw new Error("Email and password are required to create a user");
      }
      
      // Use the enhanced signUp function to create both Auth and Firestore records
      const user = await signUp(email, password, otherData);
      console.log("User created successfully:", user);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };
  
  // Logout functionality
  const logout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  // Reset password functionality
  const forgotPassword = async (email) => {
    try {
      await resetPassword(email);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Function to refresh user data from Firestore
  const refreshUserData = async () => {
    if (currentUser?.email) {
      try {
        const userData = await getUserDataFromFirestore(currentUser.email);
        if (userData) {
          setCurrentUser({
            ...currentUser,
            ...userData
          });
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }
    }
  };
  // Test Firebase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test Firestore connection
        const firestoreConnected = await testFirestoreConnection();
        console.log("Firebase Firestore connection test result:", firestoreConnected ? "SUCCESS" : "FAILED");
        
        // Test Auth connection
        const authConnected = await testFirebaseAuth();
        console.log("Firebase Auth connection test result:", authConnected ? "SUCCESS" : "FAILED");
      } catch (error) {
        console.error("Error testing Firebase connection:", error);
      }
    };
    
    testConnection();
  }, []);
  
  // Update user details functionality
  const updateUser = async (userId, userData) => {
    try {
      console.log(`Updating user ${userId} with data:`, userData);
      
      // Call the service function to update the user details
      const updatedUser = await updateUserDetails(userId, userData);
      
      // If the updated user is the current user, update the context state
      if (currentUser && (currentUser.id === userId || currentUser.uid === userId)) {
        console.log("Updating current user state with new details");
        setCurrentUser({
          ...currentUser,
          ...updatedUser
        });
      }
      
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };
    // Update user email in Firebase Authentication
  const updateEmail = async (user, newEmail, currentPassword) => {
    try {
      const result = await updateUserEmail(user, newEmail, currentPassword);
      
      // Check if result is an object with verification information
      if (result && typeof result === 'object' && result.verificationRequired) {
        // Don't update the current user yet, as the email change is pending verification
        console.log("Email verification required before updating user state");
        // Return the result with verification info
        return result;
      }
      
      // If the updated user is the current user, update the context state
      if (currentUser && (currentUser.id === user.id || currentUser.uid === user.uid)) {
        console.log("Updating current user state with new email");
        setCurrentUser({
          ...currentUser,
          email: newEmail
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error updating user email:", error);
      throw error;
    }
  };
  
  // Find user by email
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
    // Add direct Firestore creation for testing
    createUserInFirestoreOnly,
    testFirestoreConnection,
    testAuth, // Add auth testing function
    isAuthenticated: !!currentUser,
    updateUser,
    updateEmail, // Add email update function
    findUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
