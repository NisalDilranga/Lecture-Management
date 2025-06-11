import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const getDashboardStats = async () => {
  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getCountFromServer(usersRef);
    const usersCount = usersSnapshot.data().count;

    const applicationsRef = collection(db, "applications");

    const pendingQuery = query(
      applicationsRef,
      where("status", "==", "pending")
    );
    const pendingSnapshot = await getCountFromServer(pendingQuery);
    const pendingCount = pendingSnapshot.data().count;

    const interviewQuery = query(
      applicationsRef,
      where("status", "==", "interview")
    );
    const interviewSnapshot = await getCountFromServer(interviewQuery);
    const interviewCount = interviewSnapshot.data().count;

    const approvedQuery = query(
      applicationsRef,
      where("status", "==", "approved")
    );
    const approvedSnapshot = await getCountFromServer(approvedQuery);
    const approvedCount = approvedSnapshot.data().count;

    // Get work logs count
    const workLogsRef = collection(db, "workLogs");
    const workLogsSnapshot = await getCountFromServer(workLogsRef);
    const workLogsCount = workLogsSnapshot.data().count;

    return {
      usersCount,
      pendingCount,
      interviewCount,
      approvedCount,
      workLogsCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    return {
      usersCount: 0,
      pendingCount: 0,
      interviewCount: 0,
      approvedCount: 0,
      workLogsCount: 0,
    };
  }
};

export const getRecentWorkLogs = async (limit = 5) => {
  try {
    const workLogsRef = collection(db, "workLogs");
    // Using query without ordering to avoid index requirement
    const snapshot = await getDocs(workLogsRef);

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
    }));
    
    // Sort by createdAt in descending order and limit in JavaScript
    return logs
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching recent work logs:", error);
    return [];
  }
};
