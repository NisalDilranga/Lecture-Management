import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query,
  where,
  getDoc,
  setDoc
} from "firebase/firestore";
import { db } from "../config/firebase";

const TIMETABLES_COLLECTION = "timetables";

/**
 * Creates or updates a timetable for a user
 * @param {string} userId - The ID of the user
 * @param {Array} timetableData - Array of timetable entries
 * @returns {Promise<string>} - The ID of the timetable document
 */
export const assignTimetable = async (userId, timetableData) => {
  try {
    // Check if the user already has a timetable
    const timetablesRef = collection(db, TIMETABLES_COLLECTION);
    const q = query(timetablesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update existing timetable
      const timetableDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, TIMETABLES_COLLECTION, timetableDoc.id), {
        timetableData,
        updatedAt: new Date()
      });
      return timetableDoc.id;
    } else {
      // Create new timetable
      const timetableRef = await addDoc(collection(db, TIMETABLES_COLLECTION), {
        userId,
        timetableData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return timetableRef.id;
    }
  } catch (error) {
    console.error("Error assigning timetable:", error);
    throw error;
  }
};

/**
 * Gets the timetable for a specific user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object|null>} - The user's timetable or null if not found
 */
export const getUserTimetable = async (userId) => {
  try {
    const timetablesRef = collection(db, TIMETABLES_COLLECTION);
    const q = query(timetablesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const timetableDoc = querySnapshot.docs[0];
      return {
        id: timetableDoc.id,
        ...timetableDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting user timetable:", error);
    throw error;
  }
};

/**
 * Gets all timetables from the database
 * @returns {Promise<Array>} - Array of timetable documents
 */
export const getAllTimetables = async () => {
  try {
    const timetablesSnapshot = await getDocs(collection(db, TIMETABLES_COLLECTION));
    return timetablesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all timetables:", error);
    throw error;
  }
};

/**
 * Deletes a timetable from the database
 * @param {string} timetableId - The ID of the timetable to delete
 * @returns {Promise<void>}
 */
export const deleteTimetable = async (timetableId) => {
  try {
    await deleteDoc(doc(db, TIMETABLES_COLLECTION, timetableId));
  } catch (error) {
    console.error("Error deleting timetable:", error);
    throw error;
  }
};
