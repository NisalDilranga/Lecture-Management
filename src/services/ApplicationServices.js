import {
  collection,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";

export const submitApplication = async (applicationData) => {
  try {
    let appData = {
      ...applicationData,
      status: "pending",
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (auth.currentUser) {
      appData = {
        ...appData,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        authenticatedSubmission: true,
      };
    } else {
      if (!applicationData.email) {
        throw new Error("Email is required to submit an application");
      }

      appData = {
        ...appData,
        authenticatedSubmission: false,
        contactEmail: applicationData.email,
        contactPhone:
          applicationData.mobilePhone ||
          applicationData.officialPhone ||
          "Not provided",
      };
    }

    const applicationsRef = collection(db, "applications");
    const newAppRef = await addDoc(applicationsRef, appData);

    const newAppSnapshot = await getDoc(newAppRef);

    return {
      id: newAppRef.id,
      ...newAppSnapshot.data(),
    };
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

export const updateApplication = async (
  applicationId,
  updatedData,
  verificationEmail
) => {
  try {
    const appRef = doc(db, "applications", applicationId);

    const appSnapshot = await getDoc(appRef);

    if (!appSnapshot.exists()) {
      throw new Error("Application not found");
    }

    const appData = appSnapshot.data();

    if (auth.currentUser) {
      if (
        appData.authenticatedSubmission &&
        appData.userId !== auth.currentUser.uid
      ) {
        throw new Error(
          "You do not have permission to update this application"
        );
      }
    } else if (
      appData.authenticatedSubmission ||
      !verificationEmail ||
      appData.contactEmail !== verificationEmail
    ) {
      throw new Error("Email verification required to update this application");
    }

    await updateDoc(appRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
};

export const getUserApplications = async (contactEmail) => {
  try {
    let q;
    const applicationsRef = collection(db, "applications");

    if (auth.currentUser) {
      q = query(applicationsRef, where("userId", "==", auth.currentUser.uid));
    } else if (contactEmail) {
      q = query(applicationsRef, where("contactEmail", "==", contactEmail));
    } else {
      throw new Error(
        "User authentication or contact email required to fetch applications"
      );
    }

    const querySnapshot = await getDocs(q);

    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return applications;
  } catch (error) {
    console.error("Error fetching user applications:", error);
    throw error;
  }
};

export const getApplicationById = async (applicationId, verificationEmail) => {
  try {
    const appRef = doc(db, "applications", applicationId);

    const appSnapshot = await getDoc(appRef);

    if (!appSnapshot.exists()) {
      return null;
    }

    const appData = appSnapshot.data();
    let isOwner = false;

    if (auth.currentUser) {
      const userEmail = auth.currentUser.email;

      const isAdmin =
        userEmail === "admin@gmail.com" || userEmail?.includes("admin");

      if (appData.userId === auth.currentUser.uid) {
        isOwner = true;
      }

      if (isAdmin) {
        isOwner = true;
        console.log("Admin access granted for application:", applicationId);
      }
    } else if (
      verificationEmail &&
      appData.contactEmail === verificationEmail
    ) {
      isOwner = true;
    }

    console.log("Returning full application data for:", applicationId);
    return {
      id: appSnapshot.id,
      ...appData,
      isOwner: isOwner,
    };
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
};

export const getAllApplications = async (filters = {}) => {
  try {
    if (!auth.currentUser) {
      console.error("No authenticated user found for getAllApplications");
    } else {
      console.log("Getting all applications as:", auth.currentUser.email);
    }

    const applicationsRef = collection(db, "applications");

    let q = query(applicationsRef);

    if (filters.status) {
      q = query(q, where("status", "==", filters.status));
    }

    const querySnapshot = await getDocs(q);

    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`Found ${applications.length} applications`);
    return applications;
  } catch (error) {
    console.error("Error fetching all applications:", error);
    throw error;
  }
};

export const updateApplicationStatus = async (
  applicationId,
  status,
  feedback = "",
  interviewDetails = null,
  marksDetails = null,
  approvedDetails = null
) => {
  try {
    const appRef = doc(db, "applications", applicationId);

    const updateData = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (feedback) {
      updateData.feedback = feedback;
    }

    if (status === "interview" && interviewDetails) {
      updateData.interviewDetails = {
        ...interviewDetails,
        scheduledAt: serverTimestamp(),
      };
    }

    if (status === "approved" && approvedDetails) {
      updateData.approvedDetails = {
        ...approvedDetails,
        approvedAt: serverTimestamp(),
      };
    }

    if (status === "assign marks" && marksDetails) {
      updateData.marksDetails = {
        ...marksDetails,
        assignedAt: serverTimestamp(),
      };
    }

    await updateDoc(appRef, updateData);
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};

export const checkApplicationStatus = async (applicationId, contactEmail) => {
  try {
    if (!applicationId || !contactEmail) {
      throw new Error("Application ID and contact email are required");
    }

    const appRef = doc(db, "applications", applicationId);

    const appSnapshot = await getDoc(appRef);

    if (!appSnapshot.exists()) {
      throw new Error("Application not found");
    }

    const appData = appSnapshot.data();

    const appEmail = appData.contactEmail || appData.userEmail || "";

    if (appEmail.toLowerCase() !== contactEmail.toLowerCase()) {
      throw new Error("Invalid verification information");
    }

    return {
      id: applicationId,
      fullName: appData.fullName,
      email: appEmail,
      status: appData.status,
      submittedAt: appData.submittedAt,
      updatedAt: appData.updatedAt,
      feedback: appData.feedback || null,
    };
  } catch (error) {
    console.error("Error checking application status:", error);
    throw error;
  }
};
