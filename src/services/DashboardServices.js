import { 
  collection, 
  getDocs, 
  query, 
  where, 
  getCountFromServer 
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Get dashboard statistics for admin
 * @returns {Promise<Object>} - Object with counts for users, applications by status
 */
export const getDashboardStats = async () => {
  try {
    // Get users count
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getCountFromServer(usersRef);
    const usersCount = usersSnapshot.data().count;
    
    // Get applications collection reference
    const applicationsRef = collection(db, 'applications');
    
    // Get pending applications count
    const pendingQuery = query(applicationsRef, where('status', '==', 'pending'));
    const pendingSnapshot = await getCountFromServer(pendingQuery);
    const pendingCount = pendingSnapshot.data().count;
    
    // Get interview applications count
    const interviewQuery = query(applicationsRef, where('status', '==', 'interview'));
    const interviewSnapshot = await getCountFromServer(interviewQuery);
    const interviewCount = interviewSnapshot.data().count;
    
    // Get approved applications count
    const approvedQuery = query(applicationsRef, where('status', '==', 'approved'));
    const approvedSnapshot = await getCountFromServer(approvedQuery);
    const approvedCount = approvedSnapshot.data().count;
    
    return {
      usersCount,
      pendingCount,
      interviewCount,
      approvedCount
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values on error
    return {
      usersCount: 0,
      pendingCount: 0,
      interviewCount: 0,
      approvedCount: 0
    };
  }
};
