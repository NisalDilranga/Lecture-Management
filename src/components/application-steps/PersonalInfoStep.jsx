import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { getAllDepartments } from '../../services/DepartmentServices';

const PersonalInfoStep = ({ formData, updateFormData, setStepValid }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Load all departments when component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const departmentsData = await getAllDepartments();
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('preferredPlacements')) {
      const [_, index, field] = name.split('.');
      const updatedPlacements = [...formData.preferredPlacements];
      updatedPlacements[index] = {
        ...updatedPlacements[index],
        [field]: value
      };
      
      // Clear subjects when department changes
      if (field === 'departmentId') {
        updatedPlacements[index].subjects = [];
      }
      
      updateFormData({ preferredPlacements: updatedPlacements });
    } else {
      updateFormData({ [name]: value });
    }
  };
  
  const handleSubjectChange = (placementIndex, subject, isChecked) => {
    const updatedPlacements = [...formData.preferredPlacements];
    const currentSubjects = updatedPlacements[placementIndex].subjects || [];
    
    if (isChecked) {
      // Add subject if it doesn't exist
      if (!currentSubjects.includes(subject)) {
        updatedPlacements[placementIndex].subjects = [...currentSubjects, subject];
      }
    } else {
      // Remove subject
      updatedPlacements[placementIndex].subjects = currentSubjects.filter(s => s !== subject);
    }
    
    updateFormData({ preferredPlacements: updatedPlacements });
  };
  
  const addPlacement = () => {
    const updatedPlacements = [...formData.preferredPlacements, { place: '', departmentId: '', subjects: [] }];
    updateFormData({ preferredPlacements: updatedPlacements });
  };
  
  const removePlacement = (index) => {
    if (formData.preferredPlacements.length <= 1) return; // Keep at least one placement
    
    const updatedPlacements = formData.preferredPlacements.filter((_, i) => i !== index);
    updateFormData({ preferredPlacements: updatedPlacements });
  };
  
  // Get department subjects by department ID
  const getDepartmentSubjects = (departmentId) => {
    if (!departmentId) return [];
    const department = departments.find(dept => dept.id === departmentId);
    return department?.subjects || [];
  };
  
  // Validate form whenever data changes
  useEffect(() => {
    const isValid = 
      formData.fullName.trim() !== '' &&
      formData.nameWithInitials.trim() !== '' &&
      formData.dateOfBirth.trim() !== '' &&
      formData.postalAddress.trim() !== '' &&
      formData.mobilePhone.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.preferredPlacements.every(p => 
        p.place.trim() !== '' && 
        p.departmentId && 
        p.subjects && 
        p.subjects.length > 0
      );

    // Update parent component with validation status
    if (setStepValid) {
      setStepValid(isValid);
    }
  }, [formData, setStepValid]);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
      
      {/* Preferred placements */}
      <div className="border p-4 rounded-md bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">Preferred place (ATI/ATI section) to serve</h4>
          <button 
            type="button"
            onClick={addPlacement}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-[#8B0000] hover:bg-[#a52a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000]"
          >
            <FiPlus className="mr-1" /> Add Place
          </button>
        </div>
        <div className="space-y-4">
          {formData.preferredPlacements.map((placement, index) => (
            <div key={index} className="grid grid-cols-1 gap-4 relative rounded-md p-3 bg-white">
              <div className="absolute top-3 right-3">
                {formData.preferredPlacements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePlacement(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove this placement"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Place {index + 1}
                  </label>
                  <input
                    type="text"
                    name={`preferredPlacements.${index}.place`}
                    value={placement.place}
                    onChange={handleChange}
                    placeholder="Enter place name"
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    name={`preferredPlacements.${index}.departmentId`}
                    value={placement.departmentId || ''}
                    onChange={handleChange}
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {placement.departmentId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {loading ? (
                      <p className="text-sm text-gray-500">Loading subjects...</p>
                    ) : getDepartmentSubjects(placement.departmentId).length === 0 ? (
                      <p className="text-sm text-gray-500">No subjects available for this department</p>
                    ) : (
                      getDepartmentSubjects(placement.departmentId).map((subject, subjectIndex) => (
                        <div key={subjectIndex} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`subject-${index}-${subjectIndex}`}
                            checked={placement.subjects?.includes(subject) || false}
                            onChange={(e) => handleSubjectChange(index, subject, e.target.checked)}
                            className="h-4 w-4 text-[#8B0000] focus:ring-[#8B0000] border-gray-300 rounded"
                          />
                          <label htmlFor={`subject-${index}-${subjectIndex}`} className="ml-2 block text-sm text-gray-900">
                            {subject}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Basic personal information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name in Full (Dr./Mr./Mrs./Miss.)
          </label>          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name with Initials
          </label>
          <input
            type="text"
            name="nameWithInitials"
            value={formData.nameWithInitials}
            onChange={handleChange}
            className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
            required
          />
        </div>
      </div>
      
      {/* Contact information */}
      <div>
        <h4 className="font-medium mb-3">Contact Information</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Postal Address
            </label>
            <textarea
              name="postalAddress"
              value={formData.postalAddress}
              onChange={handleChange}
              rows="3"
              className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Official Phone Number
              </label>
              <input
                type="tel"
                name="officialPhone"
                value={formData.officialPhone}
                onChange={handleChange}
                className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobilePhone"
                value={formData.mobilePhone}
                onChange={handleChange}
                className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
