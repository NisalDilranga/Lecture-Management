import { 
  collection, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';

/**
 * Submit a new application to Firestore
 * @param {Object} applicationData - The application form data
 * @returns {Promise<Object>} - The application data with ID
 */
export const submitApplication = async (applicationData) => {
  try {
    // Prepare application data with metadata
    let appData = {
      ...applicationData,
      status: 'pending', // Initial status: pending, approved, rejected
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
      // Add user metadata if authenticated
    if (auth.currentUser) {
      appData = {
        ...appData,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        authenticatedSubmission: true
      };
    } else {
      // For non-authenticated users, ensure we have contact information
      if (!applicationData.email) {
        throw new Error('Email is required to submit an application');
      }
      
      appData = {
        ...appData,
        authenticatedSubmission: false,
        contactEmail: applicationData.email,
        contactPhone: applicationData.mobilePhone || applicationData.officialPhone || 'Not provided'
      };
    }

    // Add document to Firestore
    const applicationsRef = collection(db, 'applications');
    const newAppRef = await addDoc(applicationsRef, appData);
    
    // Get the new document with ID
    const newAppSnapshot = await getDoc(newAppRef);
    
    // Return application with ID
    return {
      id: newAppRef.id,
      ...newAppSnapshot.data()
    };
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

/**
 * Update an existing application
 * @param {string} applicationId - The application document ID
 * @param {Object} updatedData - The updated application form data
 * @param {string} [verificationEmail] - Email for verification (for non-authenticated users)
 * @returns {Promise<void>}
 */
export const updateApplication = async (applicationId, updatedData, verificationEmail) => {
  try {
    // Get application reference
    const appRef = doc(db, 'applications', applicationId);
    
    // Get current application data
    const appSnapshot = await getDoc(appRef);
    
    // Check if application exists
    if (!appSnapshot.exists()) {
      throw new Error('Application not found');
    }
    
    const appData = appSnapshot.data();
    
    // For authenticated users
    if (auth.currentUser) {
      // If the application was submitted by an authenticated user, verify ownership
      if (appData.authenticatedSubmission && appData.userId !== auth.currentUser.uid) {
        throw new Error('You do not have permission to update this application');
      }
    }
    // For non-authenticated users
    else if (appData.authenticatedSubmission || !verificationEmail || appData.contactEmail !== verificationEmail) {
      throw new Error('Email verification required to update this application');
    }
    
    // Update application with new data and timestamp
    await updateDoc(appRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};

/**
 * Get all applications for the current user
 * @param {string} [contactEmail] - Optional email to fetch applications for non-authenticated users
 * @returns {Promise<Array>} - Array of application objects
 */
export const getUserApplications = async (contactEmail) => {
  try {
    let q;
    const applicationsRef = collection(db, 'applications');
    
    // For authenticated users
    if (auth.currentUser) {
      // Get applications by user ID
      q = query(applicationsRef, where('userId', '==', auth.currentUser.uid));
    } 
    // For non-authenticated users with email
    else if (contactEmail) {
      // Get applications by contact email
      q = query(applicationsRef, where('contactEmail', '==', contactEmail));
    }
    // No authentication or email provided
    else {
      throw new Error('User authentication or contact email required to fetch applications');
    }
    
    // Execute query
    const querySnapshot = await getDocs(q);
    
    // Format results
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return applications;
  } catch (error) {
    console.error('Error fetching user applications:', error);
    throw error;
  }
};

/**
 * Get application by ID
 * @param {string} applicationId - The application document ID
 * @param {string} [verificationEmail] - Optional email for non-authenticated users
 * @returns {Promise<Object|null>} - The application object or null if not found
 */
export const getApplicationById = async (applicationId, verificationEmail) => {
  try {
    // Get application reference
    const appRef = doc(db, 'applications', applicationId);
    
    // Get application data
    const appSnapshot = await getDoc(appRef);
    
    // Return null if application doesn't exist
    if (!appSnapshot.exists()) {
      return null;
    }
    
    const appData = appSnapshot.data();    // In this application, we want everyone to have full access to application details
    // We'll just track if the user is the owner or admin for UI purposes
    let isOwner = false;
    
    // Check if the user is authenticated
    if (auth.currentUser) {
      const userEmail = auth.currentUser.email;
      
      // Check if user is an admin
      const isAdmin = userEmail === "admin@gmail.com" || userEmail?.includes("admin");
      
      // Check if user owns this application
      if (appData.userId === auth.currentUser.uid) {
        isOwner = true;
      }
      
      // Set admin flag
      if (isAdmin) {
        isOwner = true; // For simplicity, we treat admins as owners
        console.log("Admin access granted for application:", applicationId);
      }
    } 
    // For non-authenticated users with verification email
    else if (verificationEmail && appData.contactEmail === verificationEmail) {
      isOwner = true;
    }
    
    // Always return full application data - this is for a demo system
    // In a production app, you might want more granular access control
    console.log("Returning full application data for:", applicationId);
    return {
      id: appSnapshot.id,
      ...appData,
      isOwner: isOwner
    };
  } catch (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
};

/**
 * Get all applications (admin only)
 * @param {Object} filters - Optional filters for status, date range, etc.
 * @returns {Promise<Array>} - Array of application objects
 */
export const getAllApplications = async (filters = {}) => {
  try {
    // Verify current user
    if (!auth.currentUser) {
      console.error("No authenticated user found for getAllApplications");
      // For demo purposes, we'll continue anyway
      // But in production, you might want to throw an error here
    } else {
      console.log("Getting all applications as:", auth.currentUser.email);
    }
    
    // Get applications collection
    const applicationsRef = collection(db, 'applications');
    
    // Build query based on filters
    let q = query(applicationsRef);
    
    // Add status filter if provided
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    // Execute query
    const querySnapshot = await getDocs(q);
    
    // Format results
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Found ${applications.length} applications`);
    return applications;
  } catch (error) {
    console.error('Error fetching all applications:', error);
    throw error;
  }
};

/**
 * Update application status (admin only)
 * @param {string} applicationId - The application document ID
 * @param {string} status - New status (pending, approved, rejected, assign marks, interview)
 * @param {string} feedback - Optional feedback message
 * @param {Object} interviewDetails - Optional interview details (date, time, place)
 * @param {Object} marksDetails - Optional marks details (subjects and marks)
 * @param {Object} approvedDetails - Optional approved details (date, time, place)
 * @returns {Promise<void>}
 */
export const updateApplicationStatus = async (applicationId, status, feedback = '', interviewDetails = null, marksDetails = null, approvedDetails = null) => {
  try {
    // Get application reference
    const appRef = doc(db, 'applications', applicationId);
    
    // Update status and add feedback if provided
    const updateData = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (feedback) {
      updateData.feedback = feedback;
    }
    
    // Add interview details if provided (for interview status)
    if (status === 'interview' && interviewDetails) {
      updateData.interviewDetails = {
        ...interviewDetails,
        scheduledAt: serverTimestamp()
      };
    }
    
    // Add approved details if provided (for approved status)
    if (status === 'approved' && approvedDetails) {
      updateData.approvedDetails = {
        ...approvedDetails,
        approvedAt: serverTimestamp()
      };
    }
    
    // Add marks details if provided (for assign marks status)
    if (status === 'assign marks' && marksDetails) {
      updateData.marksDetails = {
        ...marksDetails,
        assignedAt: serverTimestamp()
      };
    }
    
    await updateDoc(appRef, updateData);
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

/**
 * Check application status using application ID and contact email
 * Useful for non-authenticated users to check their application status
 * 
 * @param {string} applicationId - The application document ID
 * @param {string} contactEmail - The email used in the application
 * @returns {Promise<Object>} - Basic application status information
 */
export const checkApplicationStatus = async (applicationId, contactEmail) => {
  try {
    if (!applicationId || !contactEmail) {
      throw new Error('Application ID and contact email are required');
    }
    
    // Get application reference
    const appRef = doc(db, 'applications', applicationId);
    
    // Get application data
    const appSnapshot = await getDoc(appRef);
    
    // Check if application exists
    if (!appSnapshot.exists()) {
      throw new Error('Application not found');
    }
    
    const appData = appSnapshot.data();
    
    // Verify the email matches
    const appEmail = appData.contactEmail || appData.userEmail || '';
    
    if (appEmail.toLowerCase() !== contactEmail.toLowerCase()) {
      throw new Error('Invalid verification information');
    }
    
    // Return application status information
    return {
      id: applicationId,
      fullName: appData.fullName,
      email: appEmail,
      status: appData.status,
      submittedAt: appData.submittedAt,
      updatedAt: appData.updatedAt,
      feedback: appData.feedback || null
    };
  } catch (error) {
    console.error('Error checking application status:', error);
    throw error;
  }
};
