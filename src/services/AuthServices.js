import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { app, db, auth, testFirebaseAuth } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

// Test Firebase Auth on module load
console.log("AuthServices: Using Firebase Auth instance:", !!auth);
testFirebaseAuth().then(result => {
  console.log("AuthServices: Firebase Auth test result:", result ? "SUCCESS" : "FAILED");
});

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Store auth token in localStorage
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('authToken', token);
    
    // Fetch additional user data from Firestore
    const userData = await getUserDataFromFirestore(email);
    
    // Return combined user object with auth and Firestore data
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      ...userData
    };
  } catch (error) {
    throw error;
  }
};

// Helper function to get user data from Firestore by email
export const getUserDataFromFirestore = async (email) => {
  try {
    if (!email) {
      console.warn("No email provided to getUserDataFromFirestore");
      return null;
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      // Ensure email is included in the returned data
      if (!userData.email) {
        userData.email = email;
      }
      
      return {
        id: userDoc.id,
        ...userData
      };
    }
    
    // If no document found, try to fetch by UID directly (fallback method)
    console.log("No user found with email query, trying direct UID lookup");
    
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

/**
 * Gets all users from Firestore
 * @returns {Promise<Array>} - Array of user documents
 */
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

// Sign up with email and password and create Firestore user entry
export const signUp = async (email, password, userData) => {
  try {
    console.log("Starting user creation process with:", { email, hasUserData: !!userData, passwordLength: password?.length });
    
    if (!email) {
      console.error("No email provided to signUp function");
      throw new Error("Email is required");
    }
    if (!password) {
      console.error("No password provided to signUp function");
      throw new Error("Password is required");
    }
    
    // Add additional validation if needed
    if (password.length < 6) {
      console.error("Password is too short:", password.length);
      throw new Error("Password must be at least 6 characters");
    }
    
    console.log("Attempting to create user in Firebase Authentication...");
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Firebase Auth user created successfully:", userCredential.user.uid);
    
    // Store auth token in localStorage
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('authToken', token);
    
    // Get the user ID from Firebase Auth
    const uid = userCredential.user.uid;
    console.log("User UID:", uid);
    
    // Check if userData is provided, if not, create a basic user object
    const userDataToStore = userData || {
      name: 'New User',
      role: 'User',
    };
    
    // Make sure to include email in the user data
    const firestoreData = {
      ...userDataToStore,
      email: email, 
      uid: uid,
      createdAt: new Date()
    };
    
    console.log("Storing user data in Firestore:", firestoreData);
      try {
      // Process user data to ensure correct format
      let processedData = { ...firestoreData };
      
      // Handle subjects data - ensure it's an array of strings
      if (processedData.role === 'User' && processedData.subjects) {
        if (Array.isArray(processedData.subjects)) {
          // Convert any subject objects to strings
          processedData.subjects = processedData.subjects.map(subject => 
            typeof subject === 'object' && subject.name ? subject.name : subject
          );
        } else if (typeof processedData.subjects === 'string') {
          // Convert single string to array
          processedData.subjects = [processedData.subjects];
        } else {
          // Default to empty array if invalid format
          processedData.subjects = [];
        }
      }
      
      // Ensure hourly rate is a number
      if (processedData.hourlyRate) {
        processedData.hourlyRate = parseFloat(processedData.hourlyRate);
      }
      
      // Create a document in the users collection with the user's data
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, processedData);
      console.log("User data stored in Firestore successfully");
      
      // Verify the data was stored correctly by reading it back
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        console.log("Verified user data in Firestore:", docSnapshot.data());
      } else {
        console.error("Failed to verify user data in Firestore - document doesn't exist");
      }
    } catch (firestoreError) {
      console.error("Error storing user data in Firestore:", firestoreError);
      // Continue execution despite Firestore error - user is already created in Auth
    }
    
    // Return the combined user object with auth and Firestore data
    return {
      uid: uid,
      email: email,
      ...userDataToStore
    };
  } catch (error) {
    console.error("Error in signUp function:", error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    // Remove auth token from localStorage
    localStorage.removeItem('authToken');
    return true;
  } catch (error) {
    throw error;
  }
};

// Check if user is authenticated and get full user data
export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        unsubscribe();
        if (user) {
          try {
            // Get additional user data from Firestore
            let userData = await getUserDataFromFirestore(user.email);
            
            // If no user data found or missing email field, fix the document
            if (!userData || !userData.email) {
              console.log("Fixing user data in Firestore with missing email field");
              
              // Try to get the document directly by UID
              const userDocRef = doc(db, 'users', user.uid);
              const userDocSnap = await getDoc(userDocRef);
              
              if (userDocSnap.exists()) {
                // Document exists but might be missing email field
                const existingData = userDocSnap.data();
                
                // Update with email if missing
                if (!existingData.email) {
                  await updateDoc(userDocRef, {
                    email: user.email
                  });
                }
                
                // Refresh the userData
                userData = {
                  id: user.uid,
                  ...existingData,
                  email: user.email
                };
              } else {
                // No document found, create a new one
                const newUserData = {
                  uid: user.uid,
                  email: user.email,
                  name: user.displayName || 'User',
                  role: 'User',
                  createdAt: new Date()
                };
                
                await setDoc(userDocRef, newUserData);
                userData = {
                  id: user.uid,
                  ...newUserData
                };
              }
            }
            
            // Combine auth user with Firestore data
            resolve({
              uid: user.uid,
              email: user.email,
              ...userData
            });
          } catch (error) {
            console.error("Error getting additional user data:", error);
            // Fallback to basic user data
            resolve({
              uid: user.uid,
              email: user.email
            });
          }
        } else {
          resolve(null);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Check if auth token exists
export const checkAuthToken = () => {
  return localStorage.getItem('authToken') ? true : false;
};

// Send a password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};

// Update user details in Firestore database
export const updateUserDetails = async (userId, updatedData) => {
  try {
    console.log(`Updating user details for user ID: ${userId}`);
    
    // Check if userId is provided
    if (!userId) {
      console.error("No user ID provided for update");
      throw new Error("User ID is required to update details");
    }
    
    // Create reference to the user document
    const userDocRef = doc(db, 'users', userId);
    
    // Check if user document exists
    const docSnapshot = await getDoc(userDocRef);
    if (!docSnapshot.exists()) {
      console.error(`No user found with ID: ${userId}`);
      throw new Error("User not found");
    }
    
    // Get the current user document data
    const currentUserData = docSnapshot.data();
    
    // Remove any sensitive fields that should not be updated
    const { password, uid, createdAt, ...safeData } = updatedData;
    
    // Add last updated timestamp
    const dataToUpdate = {
      ...safeData,
      updatedAt: new Date()
    };
    
    console.log(`Updating user with data:`, dataToUpdate);
    
    // Check if email is being updated
    if (safeData.email && safeData.email !== currentUserData.email) {
      console.log(`Email change detected: ${currentUserData.email} -> ${safeData.email}`);
      
      // Check if this user exists in authentication
      const currentAuthUser = auth.currentUser;
      const userAuthUID = currentUserData.uid;
      
      if (userAuthUID) {
        try {
          // If the user being updated is the current authenticated user
          if (currentAuthUser && currentAuthUser.uid === userAuthUID) {
            console.log("Updating email for currently authenticated user");
            
            // Update the email in Firebase Authentication
            await updateEmail(currentAuthUser, safeData.email);
            console.log("Auth email updated successfully");
          } else {
            // For admin updating other users, we make a note that Auth email couldn't be updated
            console.log("Cannot update Auth email for other users - requires re-authentication");
            dataToUpdate.authEmailUpdateRequired = true;
          }
        } catch (authError) {
          console.error("Error updating auth email:", authError);
          
          // Don't block the Firestore update if Auth update fails
          dataToUpdate.authEmailUpdateFailed = true;
          dataToUpdate.authEmailUpdateError = authError.message;
        }
      }
    }
    
    // Update the user document in Firestore
    await updateDoc(userDocRef, dataToUpdate);
    
    console.log(`User ${userId} updated successfully in Firestore`);
    
    // Get updated user data
    const updatedDocSnapshot = await getDoc(userDocRef);
    
    return {
      id: userId,
      ...updatedDocSnapshot.data()
    };
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

// Update a user's email in Firebase Authentication
export const updateUserEmail = async (user, newEmail, currentPassword) => {
  try {
    console.log(`Attempting to update email for user: ${user.email} -> ${newEmail}`);
    
    if (!user || !newEmail || !currentPassword) {
      throw new Error("User, new email, and current password are required");
    }
    
    // Get the current authenticated user
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }
    
    // Re-authenticate the user first (required for sensitive operations)
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    console.log("User re-authenticated successfully");
    
    try {
      // Try to update the email directly
      await updateEmail(currentUser, newEmail);
      console.log(`Email updated successfully to ${newEmail}`);
      
      // Update the email in Firestore as well
      if (user.id) {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, { 
          email: newEmail,
          updatedAt: new Date(),
          authEmailUpdateRequired: false,
          authEmailUpdateFailed: false
        });
        console.log("Firestore email updated to match Auth email");
      }
      
      return true;
    } catch (updateError) {
      // If we get the "operation-not-allowed" error, it's likely because email verification is required
      if (updateError.code === 'auth/operation-not-allowed' || 
          updateError.message.includes('verify')) {
        
        console.log("Email verification is required before updating. Using verifyBeforeUpdateEmail API if available");
        
        // Check if the verifyBeforeUpdateEmail API is available (it's a newer Firebase method)
        if (typeof currentUser.verifyBeforeUpdateEmail === 'function') {
          await currentUser.verifyBeforeUpdateEmail(newEmail);
          console.log(`Verification email sent to ${newEmail}`);
          
          // Update Firestore to show that verification is pending
          if (user.id) {
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, { 
              pendingEmail: newEmail,
              updatedAt: new Date(),
              emailVerificationPending: true
            });
          }
          
          return {
            success: true,
            verificationRequired: true,
            message: 'Verification email sent. Please check your inbox to complete the email change.'
          };
        } else {
          // If verifyBeforeUpdateEmail is not available, throw the original error
          throw updateError;
        }
      } else {
        // For any other errors, rethrow
        throw updateError;
      }
    }
  } catch (error) {
    console.error("Error updating user email:", error);
    throw error;
  }
};

// Find a user by email in Firestore
export const findUserByEmail = async (email) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }
    
    console.log(`Finding user with email: ${email}`);
    
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`No user found with email: ${email}`);
      return null;
    }
    
    const userDoc = querySnapshot.docs[0];
    console.log(`Found user with ID: ${userDoc.id}`);
    
    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

// Additional debug utility functions

// Test if Firestore connection is working 
export const testFirestoreConnection = async () => {
  try {
    console.log("Testing Firestore connection...");
    
    // Try to write a test document
    const testDocRef = doc(db, 'test_connection', 'test_' + Date.now());
    await setDoc(testDocRef, {
      timestamp: new Date(),
      test: 'This is a test document'
    });
    
    // Verify we can read it back
    const docSnap = await getDoc(testDocRef);
    const success = docSnap.exists();
    
    // Clean up - delete the test document
    await deleteDoc(testDocRef);
    
    console.log("Firestore connection test " + (success ? "SUCCESSFUL" : "FAILED"));
    return success;
  } catch (error) {
    console.error("Firestore connection test FAILED with error:", error);
    return false;
  }
};

// Function to directly create a user in Firestore (bypassing authentication)
export const createUserInFirestoreOnly = async (userData) => {
  try {
    if (!userData.email) {
      throw new Error("Email is required");
    }
    
    console.log("Creating user directly in Firestore:", userData);
    
    // Generate a document ID
    const userDocRef = doc(collection(db, 'users'));
    
    // Process user data to ensure correct format
    let processedUserData = { ...userData };
    
    // Handle subjects data - ensure it's an array of strings
    if (processedUserData.role === 'User' && processedUserData.subjects) {
      if (Array.isArray(processedUserData.subjects)) {
        // Convert any subject objects to strings
        processedUserData.subjects = processedUserData.subjects.map(subject => 
          typeof subject === 'object' && subject.name ? subject.name : subject
        );
      } else if (typeof processedUserData.subjects === 'string') {
        // Convert single string to array
        processedUserData.subjects = [processedUserData.subjects];
      } else {
        // Default to empty array if invalid format
        processedUserData.subjects = [];
      }
    }
    
    // Ensure hourly rate is a number
    if (processedUserData.hourlyRate) {
      processedUserData.hourlyRate = parseFloat(processedUserData.hourlyRate);
    }
    
    // Add timestamp
    const userDataWithTimestamp = {
      ...processedUserData,
      createdAt: new Date(),
      createdDirectly: true
    };
    
    console.log("Processed user data to save:", userDataWithTimestamp);
    
    // Write to Firestore
    await setDoc(userDocRef, userDataWithTimestamp);
    console.log("User created successfully with ID:", userDocRef.id);
    
    return {
      id: userDocRef.id,
      ...userDataWithTimestamp
    };
  } catch (error) {
    console.error("Error creating user in Firestore:", error);
    throw error;
  }
};
