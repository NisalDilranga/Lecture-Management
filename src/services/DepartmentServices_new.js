import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  setDoc,
  query,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "../config/firebase";

const DEPARTMENTS_COLLECTION = "departments";

/**
 * Adds a new department to the database
 * @param {string} departmentName - The name of the department
 * @returns {Promise<string>} - The ID of the newly created department
 */
export const addDepartment = async (departmentName) => {
  try {
    const departmentRef = await addDoc(collection(db, DEPARTMENTS_COLLECTION), {
      name: departmentName,
      subjects: [],
      createdAt: new Date()
    });
    
    return departmentRef.id;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

/**
 * Gets all departments from the database
 * @returns {Promise<Array>} - Array of department documents
 */
export const getAllDepartments = async () => {
  try {
    const departmentsSnapshot = await getDocs(collection(db, DEPARTMENTS_COLLECTION));
    return departmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting departments:", error);
    throw error;
  }
};

/**
 * Deletes a department from the database
 * @param {string} departmentId - The ID of the department to delete
 * @returns {Promise<void>}
 */
export const deleteDepartment = async (departmentId) => {
  try {
    await deleteDoc(doc(db, DEPARTMENTS_COLLECTION, departmentId));
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};

/**
 * Adds a subject to a department
 * @param {string} departmentId - The ID of the department
 * @param {string} subjectName - The name of the subject
 * @returns {Promise<void>}
 */
export const addSubjectToDepartment = async (departmentId, subjectName) => {
  try {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, departmentId);
    await updateDoc(departmentRef, {
      subjects: arrayUnion(subjectName)
    });
  } catch (error) {
    console.error("Error adding subject to department:", error);
    throw error;
  }
};

/**
 * Removes a subject from a department
 * @param {string} departmentId - The ID of the department
 * @param {string} subjectName - The name of the subject to remove
 * @returns {Promise<void>}
 */
export const removeSubjectFromDepartment = async (departmentId, subjectName) => {
  try {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, departmentId);
    await updateDoc(departmentRef, {
      subjects: arrayRemove(subjectName)
    });
  } catch (error) {
    console.error("Error removing subject from department:", error);
    throw error;
  }
};

/**
 * Updates a department's name
 * @param {string} departmentId - The ID of the department
 * @param {string} newName - The new name for the department
 * @returns {Promise<void>}
 */
export const updateDepartmentName = async (departmentId, newName) => {
  try {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, departmentId);
    await updateDoc(departmentRef, {
      name: newName
    });
  } catch (error) {
    console.error("Error updating department name:", error);
    throw error;
  }
};
