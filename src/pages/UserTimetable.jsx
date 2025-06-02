import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getUserTimetable } from '../services/TimetableServices';
import { useAuth } from '../context/AuthContext';

const UserTimetable = () => {
  const { currentUser } = useAuth();
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!currentUser?.id) {
        return;
      }

      try {
        setLoading(true);
        const userTimetable = await getUserTimetable(currentUser.id);
        if (userTimetable) {
          setTimetable(userTimetable);
        } else {
          setTimetable(null);
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
        toast.error("Failed to load timetable");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [currentUser]);

  // Function to filter timetable data to only show entries with actual data
  const getFilteredTimetableData = () => {
    if (!timetable) return [];
    
    return timetable.timetableData
      // Filter days to only include those with at least one period that has data
      .map(day => ({
        ...day,
        periods: day.periods.filter(period => period.subject || period.room)
      }))
      // Only keep days that have at least one period with data
      .filter(day => day.periods.length > 0);
  };

  const handlePrintTimetable = () => {
    const originalContents = document.body.innerHTML;
    const printContents = printRef.current.innerHTML;
    
    // Create a new window with just the timetable content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>My Timetable</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h2 { text-align: center; }
            .print-header { text-align: center; margin-bottom: 20px; }
            @media print {
              .no-print { display: none; }
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>Lecture Management System - Timetable</h2>
            <p>Name: ${currentUser?.name}</p>
            <p>Email: ${currentUser?.email}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          ${printContents}
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print();">Print</button>
            <button onclick="window.close();">Close</button>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Get filtered timetable data
  const filteredTimetableData = timetable ? getFilteredTimetableData() : [];
  const hasData = filteredTimetableData.length > 0;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Timetable</h1>
        {timetable && hasData && (
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            onClick={handlePrintTimetable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Timetable
          </button>
        )}
      </div>

      {!timetable ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No timetable has been assigned to you yet. Please contact an administrator.
              </p>
            </div>
          </div>
        </div>
      ) : !hasData ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your timetable is empty. No subjects or rooms have been assigned yet.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow" ref={printRef}>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Day</th>
                  <th className="py-2 px-4 border-b text-left">Time</th>
                  <th className="py-2 px-4 border-b text-left">Subject</th>
                  <th className="py-2 px-4 border-b text-left">Room</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimetableData.map((day, dayIndex) => (
                  <React.Fragment key={day.day}>
                    {day.periods.map((period, periodIndex) => (
                      <tr key={`${day.day}-${period.time}`}>
                        {periodIndex === 0 && (
                          <td rowSpan={day.periods.length} className="py-2 px-4 border-b font-medium">
                            {day.day}
                          </td>
                        )}
                        <td className="py-2 px-4 border-b">{period.time}</td>
                        <td className="py-2 px-4 border-b">{period.subject}</td>
                        <td className="py-2 px-4 border-b">{period.room}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTimetable;
