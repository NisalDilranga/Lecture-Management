import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { app, db, auth, testFirebaseAuth } from "../config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

console.log("AuthServices: Using Firebase Auth instance:", !!auth);
testFirebaseAuth().then((result) => {
  console.log(
    "AuthServices: Firebase Auth test result:",
    result ? "SUCCESS" : "FAILED"
  );
});

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const token = await userCredential.user.getIdToken();
    localStorage.setItem("authToken", token);

    const userData = await getUserDataFromFirestore(email);

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      ...userData,
    };
  } catch (error) {
    throw error;
  }
};

export const getUserDataFromFirestore = async (email) => {
  try {
    if (!email) {
      console.warn("No email provided to getUserDataFromFirestore");
      return null;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (!userData.email) {
        userData.email = email;
      }

      return {
        id: userDoc.id,
        ...userData,
      };
    }

    console.log("No user found with email query, trying direct UID lookup");

    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

export const signUp = async (email, password, userData) => {
  try {
    console.log("Starting user creation process with:", {
      email,
      hasUserData: !!userData,
      passwordLength: password?.length,
    });

    if (!email) {
      console.error("No email provided to signUp function");
      throw new Error("Email is required");
    }
    if (!password) {
      console.error("No password provided to signUp function");
      throw new Error("Password is required");
    }

    if (password.length < 6) {
      console.error("Password is too short:", password.length);
      throw new Error("Password must be at least 6 characters");
    }

    console.log("Attempting to create user in Firebase Authentication...");

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(
      "Firebase Auth user created successfully:",
      userCredential.user.uid
    );

    const token = await userCredential.user.getIdToken();
    localStorage.setItem("authToken", token);

    const uid = userCredential.user.uid;
    console.log("User UID:", uid);

    const userDataToStore = userData || {
      name: "New User",
      role: "User",
    };

    const firestoreData = {
      ...userDataToStore,
      email: email,
      uid: uid,
      createdAt: new Date(),
    };

    console.log("Storing user data in Firestore:", firestoreData);
    try {
      let processedData = { ...firestoreData };

      if (processedData.role === "User" && processedData.subjects) {
        if (Array.isArray(processedData.subjects)) {
          processedData.subjects = processedData.subjects.map((subject) =>
            typeof subject === "object" && subject.name ? subject.name : subject
          );
        } else if (typeof processedData.subjects === "string") {
          processedData.subjects = [processedData.subjects];
        } else {
          processedData.subjects = [];
        }
      }

      if (processedData.hourlyRate) {
        processedData.hourlyRate = parseFloat(processedData.hourlyRate);
      }

      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, processedData);
      console.log("User data stored in Firestore successfully");

      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        console.log("Verified user data in Firestore:", docSnapshot.data());
      } else {
        console.error(
          "Failed to verify user data in Firestore - document doesn't exist"
        );
      }
    } catch (firestoreError) {
      console.error("Error storing user data in Firestore:", firestoreError);
    }

    return {
      uid: uid,
      email: email,
      ...userDataToStore,
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

    localStorage.removeItem("authToken");
    return true;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        unsubscribe();
        if (user) {
          try {
            let userData = await getUserDataFromFirestore(user.email);

            if (!userData || !userData.email) {
              console.log(
                "Fixing user data in Firestore with missing email field"
              );

              const userDocRef = doc(db, "users", user.uid);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                const existingData = userDocSnap.data();

                if (!existingData.email) {
                  await updateDoc(userDocRef, {
                    email: user.email,
                  });
                }

                userData = {
                  id: user.uid,
                  ...existingData,
                  email: user.email,
                };
              } else {
                const newUserData = {
                  uid: user.uid,
                  email: user.email,
                  name: user.displayName || "User",
                  role: "User",
                  createdAt: new Date(),
                };

                await setDoc(userDocRef, newUserData);
                userData = {
                  id: user.uid,
                  ...newUserData,
                };
              }
            }

            resolve({
              uid: user.uid,
              email: user.email,
              ...userData,
            });
          } catch (error) {
            console.error("Error getting additional user data:", error);

            resolve({
              uid: user.uid,
              email: user.email,
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

export const checkAuthToken = () => {
  return localStorage.getItem("authToken") ? true : false;
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateUserDetails = async (userId, updatedData) => {
  try {
    console.log(`Updating user details for user ID: ${userId}`);

    if (!userId) {
      console.error("No user ID provided for update");
      throw new Error("User ID is required to update details");
    }

    const userDocRef = doc(db, "users", userId);

    const docSnapshot = await getDoc(userDocRef);
    if (!docSnapshot.exists()) {
      console.error(`No user found with ID: ${userId}`);
      throw new Error("User not found");
    }

    const currentUserData = docSnapshot.data();

    const { password, uid, createdAt, ...safeData } = updatedData;

    const dataToUpdate = {
      ...safeData,
      updatedAt: new Date(),
    };

    console.log(`Updating user with data:`, dataToUpdate);

    if (safeData.email && safeData.email !== currentUserData.email) {
      console.log(
        `Email change detected: ${currentUserData.email} -> ${safeData.email}`
      );

      const currentAuthUser = auth.currentUser;
      const userAuthUID = currentUserData.uid;

      if (userAuthUID) {
        try {
          if (currentAuthUser && currentAuthUser.uid === userAuthUID) {
            console.log("Updating email for currently authenticated user");

            await updateEmail(currentAuthUser, safeData.email);
            console.log("Auth email updated successfully");
          } else {
            console.log(
              "Cannot update Auth email for other users - requires re-authentication"
            );
            dataToUpdate.authEmailUpdateRequired = true;
          }
        } catch (authError) {
          console.error("Error updating auth email:", authError);

          dataToUpdate.authEmailUpdateFailed = true;
          dataToUpdate.authEmailUpdateError = authError.message;
        }
      }
    }

    await updateDoc(userDocRef, dataToUpdate);

    console.log(`User ${userId} updated successfully in Firestore`);

    const updatedDocSnapshot = await getDoc(userDocRef);

    return {
      id: userId,
      ...updatedDocSnapshot.data(),
    };
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

export const updateUserEmail = async (user, newEmail, currentPassword) => {
  try {
    console.log(
      `Attempting to update email for user: ${user.email} -> ${newEmail}`
    );

    if (!user || !newEmail || !currentPassword) {
      throw new Error("User, new email, and current password are required");
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(currentUser, credential);
    console.log("User re-authenticated successfully");

    try {
      await updateEmail(currentUser, newEmail);
      console.log(`Email updated successfully to ${newEmail}`);

      if (user.id) {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
          email: newEmail,
          updatedAt: new Date(),
          authEmailUpdateRequired: false,
          authEmailUpdateFailed: false,
        });
        console.log("Firestore email updated to match Auth email");
      }

      return true;
    } catch (updateError) {
      if (
        updateError.code === "auth/operation-not-allowed" ||
        updateError.message.includes("verify")
      ) {
        console.log(
          "Email verification is required before updating. Using verifyBeforeUpdateEmail API if available"
        );

        if (typeof currentUser.verifyBeforeUpdateEmail === "function") {
          await currentUser.verifyBeforeUpdateEmail(newEmail);
          console.log(`Verification email sent to ${newEmail}`);

          if (user.id) {
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, {
              pendingEmail: newEmail,
              updatedAt: new Date(),
              emailVerificationPending: true,
            });
          }

          return {
            success: true,
            verificationRequired: true,
            message:
              "Verification email sent. Please check your inbox to complete the email change.",
          };
        } else {
          throw updateError;
        }
      } else {
        throw updateError;
      }
    }
  } catch (error) {
    console.error("Error updating user email:", error);
    throw error;
  }
};

export const findUserByEmail = async (email) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`Finding user with email: ${email}`);

    const usersRef = collection(db, "users");
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
      ...userDoc.data(),
    };
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

export const testFirestoreConnection = async () => {
  try {
    console.log("Testing Firestore connection...");

    const testDocRef = doc(db, "test_connection", "test_" + Date.now());
    await setDoc(testDocRef, {
      timestamp: new Date(),
      test: "This is a test document",
    });

    const docSnap = await getDoc(testDocRef);
    const success = docSnap.exists();

    await deleteDoc(testDocRef);

    console.log(
      "Firestore connection test " + (success ? "SUCCESSFUL" : "FAILED")
    );
    return success;
  } catch (error) {
    console.error("Firestore connection test FAILED with error:", error);
    return false;
  }
};

export const createUserInFirestoreOnly = async (userData) => {
  try {
    if (!userData.email) {
      throw new Error("Email is required");
    }

    console.log("Creating user directly in Firestore:", userData);

    const userDocRef = doc(collection(db, "users"));

    let processedUserData = { ...userData };

    if (processedUserData.role === "User" && processedUserData.subjects) {
      if (Array.isArray(processedUserData.subjects)) {
        processedUserData.subjects = processedUserData.subjects.map((subject) =>
          typeof subject === "object" && subject.name ? subject.name : subject
        );
      } else if (typeof processedUserData.subjects === "string") {
        processedUserData.subjects = [processedUserData.subjects];
      } else {
        processedUserData.subjects = [];
      }
    }

    if (processedUserData.hourlyRate) {
      processedUserData.hourlyRate = parseFloat(processedUserData.hourlyRate);
    }

    const userDataWithTimestamp = {
      ...processedUserData,
      createdAt: new Date(),
      createdDirectly: true,
    };

    console.log("Processed user data to save:", userDataWithTimestamp);

    await setDoc(userDocRef, userDataWithTimestamp);
    console.log("User created successfully with ID:", userDocRef.id);

    return {
      id: userDocRef.id,
      ...userDataWithTimestamp,
    };
  } catch (error) {
    console.error("Error creating user in Firestore:", error);
    throw error;
  }
};
