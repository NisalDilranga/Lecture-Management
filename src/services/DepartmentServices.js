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
  arrayRemove,
} from "firebase/firestore";
import { db } from "../config/firebase";

const DEPARTMENTS_COLLECTION = "departments";

export const addDepartment = async (departmentName) => {
  try {
    const departmentRef = await addDoc(collection(db, DEPARTMENTS_COLLECTION), {
      name: departmentName,
      subjects: [],
      createdAt: new Date(),
    });

    return departmentRef.id;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

export const getAllDepartments = async () => {
  try {
    const departmentsSnapshot = await getDocs(
      collection(db, DEPARTMENTS_COLLECTION)
    );
    return departmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting departments:", error);
    throw error;
  }
};

export const deleteDepartment = async (departmentId) => {
  try {
    await deleteDoc(doc(db, DEPARTMENTS_COLLECTION, departmentId));
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};

export const addSubjectToDepartment = async (departmentId, subjectName) => {
  try {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, departmentId);
    await updateDoc(departmentRef, {
      subjects: arrayUnion(subjectName),
    });
  } catch (error) {
    console.error("Error adding subject to department:", error);
    throw error;
  }
};

export const removeSubjectFromDepartment = async (
  departmentId,
  subjectName
) => {
  try {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, departmentId);
    await updateDoc(departmentRef, {
      subjects: arrayRemove(subjectName),
    });
  } catch (error) {
    console.error("Error removing subject from department:", error);
    throw error;
  }
};

export const updateDepartmentName = async (departmentId, newName) => {
  try {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, departmentId);
    await updateDoc(departmentRef, {
      name: newName,
    });
  } catch (error) {
    console.error("Error updating department name:", error);
    throw error;
  }
};
