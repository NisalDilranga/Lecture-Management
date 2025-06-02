import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { assignTimetable, getAllTimetables } from '../services/TimetableServices';
import { findUserByEmail, getAllUsers } from '../services/AuthServices';
import { getAllDepartments } from '../services/DepartmentServices';

const TimetableManagement = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [timetableData, setTimetableData] = useState([
    { day: 'Monday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
    { day: 'Tuesday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
    { day: 'Wednesday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
    { day: 'Thursday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
    { day: 'Friday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [existingTimetables, setExistingTimetables] = useState([]);
  const [newTimeSlot, setNewTimeSlot] = useState({ day: 'Monday', time: '', subject: '', room: '' });
  const [showCustomTimeForm, setShowCustomTimeForm] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Load users and existing timetables
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch existing timetables
        const timetables = await getAllTimetables();
        setExistingTimetables(timetables);
        
        // Fetch all users and filter to only show users with role "User" (case insensitive)
        const allUsersFetched = await getAllUsers();
        const filteredUsers = allUsersFetched.filter(user => 
          user.role && user.role.toLowerCase() === "user"
        );
        setAllUsers(allUsersFetched); // Keep all users in state for reference
        setUsers(filteredUsers); // Set the filtered users to display

        // Fetch departments
        const departmentsData = await getAllDepartments();
        console.log("Fetched departments:", departmentsData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search term and selected department
  useEffect(() => {
    // Start with all users who have role "User"
    let filteredUsers = allUsers.filter(user => 
      user.role && user.role.toLowerCase() === "user"
    );
    
    // Apply search filter if there is a search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        (user.name && user.name.toLowerCase().includes(searchLower)) || 
        (user.email && user.email.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply department filter if a department is selected
    if (selectedDepartment) {
      console.log("Filtering by department:", selectedDepartment);
      console.log("Users before filter:", filteredUsers.length);
      filteredUsers = filteredUsers.filter(user => {
        console.log("User department:", user.department);
        return user.department === selectedDepartment;
      });
      console.log("Users after filter:", filteredUsers.length);
    }
    
    setUsers(filteredUsers);
  }, [allUsers, searchTerm, selectedDepartment]);
  const handleSearchUser = () => {
    // The filtering is now done in the useEffect
    // This function just triggers the search (needed for button click)
    // The actual filtering happens in the useEffect that watches searchTerm and selectedDepartment
  };
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    
    // Check if user already has a timetable
    const existingTimetable = existingTimetables.find(t => t.userId === user.id);
    if (existingTimetable) {
      setTimetableData(existingTimetable.timetableData);
      // If there are already items in the timetable, determine if it's a custom or default timetable
      const hasCustomItems = existingTimetable.timetableData.some(day => 
        day.periods.some(period => period.subject || period.room)
      );
      setCustomMode(hasCustomItems);
    } else {
      if (customMode) {
        // Start with empty days but no periods in custom mode
        setTimetableData([
          { day: 'Monday', periods: [] },
          { day: 'Tuesday', periods: [] },
          { day: 'Wednesday', periods: [] },
          { day: 'Thursday', periods: [] },
          { day: 'Friday', periods: [] }
        ]);
      } else {
        // Reset to default empty timetable
        setTimetableData([
          { day: 'Monday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
          { day: 'Tuesday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
          { day: 'Wednesday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
          { day: 'Thursday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
          { day: 'Friday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] }
        ]);
      }
    }
  };

  const handleTimetableChange = (dayIndex, periodIndex, field, value) => {
    const updatedTimetable = [...timetableData];
    updatedTimetable[dayIndex].periods[periodIndex][field] = value;
    setTimetableData(updatedTimetable);
  };

  const handleSaveTimetable = async () => {
    if (!selectedUser) {
      toast.warn("Please select a user first");
      return;
    }

    try {
      setLoading(true);
      await assignTimetable(selectedUser.id, timetableData);
      toast.success("Timetable saved successfully");
      
      // Update the existing timetables list
      const updatedTimetables = await getAllTimetables();
      setExistingTimetables(updatedTimetables);
    } catch (error) {
      console.error("Error saving timetable:", error);
      toast.error("Failed to save timetable");
    } finally {
      setLoading(false);
    }
  };

  const handleNewTimeSlotChange = (field, value) => {
    setNewTimeSlot({
      ...newTimeSlot,
      [field]: value
    });
  };
  const addCustomTimeSlot = () => {
    // Validate the new time slot
    if (!newTimeSlot.time || !newTimeSlot.day) {
      toast.warn("Day and Time are required");
      return;
    }

    // Find the day index
    const dayIndex = timetableData.findIndex(day => day.day === newTimeSlot.day);
    if (dayIndex === -1) {
      toast.error("Invalid day selected");
      return;
    }

    // Create a copy of timetable data to modify
    const updatedTimetable = [...timetableData];
    
    // Enable custom mode if it's not already enabled
    if (!customMode) {
      setCustomMode(true);
      
      // If switching to custom mode, clear all default periods
      updatedTimetable.forEach(day => {
        day.periods = [];
      });
    }
    
    // Add the new period
    updatedTimetable[dayIndex].periods.push({
      time: newTimeSlot.time,
      subject: newTimeSlot.subject || '',
      room: newTimeSlot.room || ''
    });
    
    // Sort periods by time
    updatedTimetable[dayIndex].periods.sort((a, b) => {
      const timeA = a.time.split('-')[0]; // Start time
      const timeB = b.time.split('-')[0]; // Start time
      return timeA.localeCompare(timeB);
    });
    
    // Update timetable state
    setTimetableData(updatedTimetable);
    
    // Reset the form and hide it
    setNewTimeSlot({ day: newTimeSlot.day, time: '', subject: '', room: '' });
    setShowCustomTimeForm(false);
    toast.success("Time slot added successfully");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Timetable Management</h1>        <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">User Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="col-span-1 md:col-span-2">
           
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
          
            <select
              className="w-full p-2 border rounded"
              value={selectedDepartment}
              onChange={(e) => {
                console.log("Selected department:", e.target.value);
                setSelectedDepartment(e.target.value);
              }}
            >
              <option value="">All Departments</option>              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">User List</h3>
            <span className="text-sm text-gray-600">{users.length} users found</span>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Role</th>
                  <th className="py-2 px-4 border-b text-left">Department</th>
                  <th className="py-2 px-4 border-b text-left">Subjects</th>
                  <th className="py-2 px-4 border-b text-left">Action</th>
                </tr>
              </thead><tbody>
                  {/* Always show from filtered users array which contains only role==="user" */}
                  {users.map((user) => (
                    <tr key={user.id} className={selectedUser?.id === user.id ? "bg-blue-50" : ""}>
                      <td className="py-2 px-4 border-b">{user.name}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">{user.role}</td>
                      <td className="py-2 px-4 border-b">{user.departmentName}</td>
                      <td className="py-2 px-4 border-b">{user.subjects.join(", ")}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          onClick={() => handleSelectUser(user)}
                        >
                          Assign Timetable
                        </button>
                      </td>
                    </tr>
                  ))}                </tbody>
              </table>
            </div>
          </div>
      </div>

      {selectedUser && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Assign Timetable for {selectedUser.name}
          </h2>
            <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-md font-medium">Timetable Entries</h3>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    if (customMode) {
                      // Switch to default template mode
                      setCustomMode(false);
                      setTimetableData([
                        { day: 'Monday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
                        { day: 'Tuesday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
                        { day: 'Wednesday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
                        { day: 'Thursday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] },
                        { day: 'Friday', periods: [{ time: '09:00-10:00', subject: '', room: '' }, { time: '10:00-11:00', subject: '', room: '' }, { time: '11:00-12:00', subject: '', room: '' }, { time: '13:00-14:00', subject: '', room: '' }, { time: '14:00-15:00', subject: '', room: '' }] }
                      ]);
                    }
                  }}
                  className={`py-1 px-3 text-sm rounded-lg ${!customMode ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                >
                  Default Template
                </button>
                <button
                  onClick={() => {
                    if (!customMode) {
                      // Switch to custom mode
                      setCustomMode(true);
                      setTimetableData([
                        { day: 'Monday', periods: [] },
                        { day: 'Tuesday', periods: [] },
                        { day: 'Wednesday', periods: [] },
                        { day: 'Thursday', periods: [] },
                        { day: 'Friday', periods: [] }
                      ]);
                    }
                  }}
                  className={`py-1 px-3 text-sm rounded-lg ${customMode ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                >
                  Custom Only
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowCustomTimeForm(!showCustomTimeForm)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Custom Time Slot
            </button>
          </div>

          {showCustomTimeForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded border">
              <h4 className="text-sm font-medium mb-2">Add New Time Slot</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Day</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={newTimeSlot.day}
                    onChange={(e) => handleNewTimeSlotChange('day', e.target.value)}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Time (e.g. 14:00-15:00)</label>
                  <input 
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="e.g. 15:00-16:00"
                    value={newTimeSlot.time}
                    onChange={(e) => handleNewTimeSlotChange('time', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Subject</label>
                  <input 
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Subject name"
                    value={newTimeSlot.subject}
                    onChange={(e) => handleNewTimeSlotChange('subject', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Room</label>
                  <input 
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Room number"
                    value={newTimeSlot.room}
                    onChange={(e) => handleNewTimeSlotChange('room', e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 mr-2"
                  onClick={() => setShowCustomTimeForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={addCustomTimeSlot}
                >
                  Add Time Slot
                </button>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Day</th>
                  <th className="py-2 px-4 border-b text-left">Time</th>
                  <th className="py-2 px-4 border-b text-left">Subject</th>
                  <th className="py-2 px-4 border-b text-left">Room</th>
                </tr>
              </thead>              <tbody>
                {timetableData
                  .filter(day => day.periods.length > 0) // Filter out days with no periods
                  .map((day, dayIndex) => {
                    // Get the actual index in the original array
                    const originalDayIndex = timetableData.findIndex(d => d.day === day.day);
                    return (
                      <React.Fragment key={day.day}>
                        {day.periods.map((period, periodIndex) => (
                          <tr key={`${day.day}-${period.time}`}>
                            {periodIndex === 0 && (
                              <td rowSpan={day.periods.length} className="py-2 px-4 border-b font-medium">
                                {day.day}
                              </td>
                            )}
                            <td className="py-2 px-4 border-b">{period.time}</td>
                            <td className="py-2 px-4 border-b">
                              <input
                                type="text"
                                className="w-full p-1 border rounded"
                                value={period.subject}
                                onChange={(e) => handleTimetableChange(originalDayIndex, periodIndex, 'subject', e.target.value)}
                                placeholder="Subject name"
                              />
                            </td>
                            <td className="py-2 px-4 border-b">
                              <input
                                type="text"
                                className="w-full p-1 border rounded"
                                value={period.room}
                                onChange={(e) => handleTimetableChange(originalDayIndex, periodIndex, 'room', e.target.value)}
                                placeholder="Room number"
                              />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                {timetableData.filter(day => day.periods.length > 0).length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">
                      {customMode ? 
                        "No time slots added yet. Click 'Add Custom Time Slot' to create a schedule." : 
                        "No schedule entries found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSaveTimetable}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Timetable"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableManagement;
