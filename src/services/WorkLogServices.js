import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const workLogsCollection = collection(db, "workLogs");

export const addWorkLog = async (workLogData) => {
  try {
    const docRef = await addDoc(workLogsCollection, {
      ...workLogData,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...workLogData };
  } catch (error) {
    console.error("Error adding work log:", error);
    throw error;
  }
};

export const getUserWorkLogs = async (userId) => {
  try {
    
    const q = query(
      workLogsCollection, 
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate() 
    }));
    
    return logs.sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error("Error getting user work logs:", error);
    throw error;
  }
};

export const getAllWorkLogs = async () => {
  try {
   
    const snapshot = await getDocs(workLogsCollection);
    
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    }));
    
    return logs.sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error("Error getting all work logs:", error);
    throw error;
  }
};

// Update a work log
export const updateWorkLog = async (id, updatedData) => {
  try {
    const workLogRef = doc(db, "workLogs", id);
    await updateDoc(workLogRef, updatedData);
    return { id, ...updatedData };
  } catch (error) {
    console.error("Error updating work log:", error);
    throw error;
  }
};

// Delete a work log
export const deleteWorkLog = async (id) => {
  try {
    const workLogRef = doc(db, "workLogs", id);
    await deleteDoc(workLogRef);
    return id;
  } catch (error) {
    console.error("Error deleting work log:", error);
    throw error;
  }
};
