import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
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

    return {
      usersCount,
      pendingCount,
      interviewCount,
      approvedCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    return {
      usersCount: 0,
      pendingCount: 0,
      interviewCount: 0,
      approvedCount: 0,
    };
  }
};
