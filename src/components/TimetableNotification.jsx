import React, { useEffect, useState } from 'react';
import { getUserTimetable } from '../services/TimetableServices';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TimetableNotification = () => {
  const { currentUser } = useAuth();
  const [hasTimetable, setHasTimetable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTimetable = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        const timetable = await getUserTimetable(currentUser.id);
        setHasTimetable(!!timetable);
      } catch (error) {
        console.error("Error checking timetable:", error);
      } finally {
        setLoading(false);
      }
    };

    checkTimetable();
  }, [currentUser]);

  if (loading || !currentUser || currentUser.role !== 'User') {
    return null;
  }

  return (
    <>
      {!hasTimetable && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You don't have a timetable assigned yet. You'll be notified when your timetable is ready.
              </p>
            </div>
          </div>
        </div>
      )}
      {hasTimetable && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex justify-between w-full">
              <p className="text-sm text-green-700">
                Your timetable is available now. You can view and print it.
              </p>
              <Link 
                to="/Dashboard/my-timetable" 
                className="text-sm font-medium text-green-700 hover:text-green-900"
              >
                View Timetable →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TimetableNotification;
