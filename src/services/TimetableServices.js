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
  setDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

const TIMETABLES_COLLECTION = "timetables";

export const assignTimetable = async (userId, timetableData) => {
  try {
    const timetablesRef = collection(db, TIMETABLES_COLLECTION);
    const q = query(timetablesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const timetableDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, TIMETABLES_COLLECTION, timetableDoc.id), {
        timetableData,
        updatedAt: new Date(),
      });
      return timetableDoc.id;
    } else {
      const timetableRef = await addDoc(collection(db, TIMETABLES_COLLECTION), {
        userId,
        timetableData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return timetableRef.id;
    }
  } catch (error) {
    console.error("Error assigning timetable:", error);
    throw error;
  }
};

export const getUserTimetable = async (userId) => {
  try {
    const timetablesRef = collection(db, TIMETABLES_COLLECTION);
    const q = query(timetablesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const timetableDoc = querySnapshot.docs[0];
      return {
        id: timetableDoc.id,
        ...timetableDoc.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting user timetable:", error);
    throw error;
  }
};

export const getAllTimetables = async () => {
  try {
    const timetablesSnapshot = await getDocs(
      collection(db, TIMETABLES_COLLECTION)
    );
    return timetablesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting all timetables:", error);
    throw error;
  }
};

export const deleteTimetable = async (timetableId) => {
  try {
    await deleteDoc(doc(db, TIMETABLES_COLLECTION, timetableId));
  } catch (error) {
    console.error("Error deleting timetable:", error);
    throw error;
  }
};
