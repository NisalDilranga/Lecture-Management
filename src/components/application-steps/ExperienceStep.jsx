import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const ExperienceStep = ({ formData, updateFormData, setStepValid }) => {
  // Add state to track the "no teaching experience" checkbox
  const [noTeachingExperience, setNoTeachingExperience] = useState(false);

  const handleWorkExperienceChange = (type, field, value, index = null) => {
    if (type === 'present') {
      const updatedWorkExperience = {
        ...formData.workExperience,
        present: {
          ...formData.workExperience.present,
          [field]: value
        }
      };
      updateFormData({ workExperience: updatedWorkExperience });
    } else if (type === 'past') {
      const updatedPastExperiences = [...formData.workExperience.past];
      updatedPastExperiences[index] = {
        ...updatedPastExperiences[index],
        [field]: value
      };
      
      const updatedWorkExperience = {
        ...formData.workExperience,
        past: updatedPastExperiences
      };
      
      updateFormData({ workExperience: updatedWorkExperience });
    }
  };
  
  const handleTeachingExperienceChange = (index, field, value) => {
    const updatedTeachingExperience = [...formData.teachingExperience];
    updatedTeachingExperience[index] = {
      ...updatedTeachingExperience[index],
      [field]: value
    };
    updateFormData({ teachingExperience: updatedTeachingExperience });
  };
  // Validate form whenever data changes
  useEffect(() => {
    // Validate present work experience and at least one teaching experience
    const isPresentWorkValid = (
      formData.workExperience.present.position.trim() !== '' &&
      formData.workExperience.present.from.trim() !== '' &&
      formData.workExperience.present.to.trim() !== '' &&
      formData.workExperience.present.years.trim() !== ''
    );
    
    // Check if user has marked "No Teaching Experience" or has valid teaching experience
    const isTeachingExperienceValid = noTeachingExperience || formData.teachingExperience.some(exp => 
      exp.institute.trim() !== '' && 
      exp.program.trim() !== '' && 
      exp.subject.trim() !== '' && 
      exp.years.trim() !== ''
    );
    
    // Past work experiences are optional, but if started should be complete
    const isPastWorkValid = formData.workExperience.past.every(exp => 
      (exp.position.trim() === '' && exp.from.trim() === '' && exp.to.trim() === '' && exp.years.trim() === '') ||
      (exp.position.trim() !== '' && exp.from.trim() !== '' && exp.to.trim() !== '' && exp.years.trim() !== '')
    );
    
    const isValid = isPresentWorkValid && isTeachingExperienceValid && isPastWorkValid;
      // Update parent component with validation status
    if (setStepValid) {
      setStepValid(isValid);
    }
  }, [formData, setStepValid, noTeachingExperience]);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Experience</h3>
      
      {/* Working Experience */}
      <div className="border p-4 rounded-md bg-gray-50">
        <h4 className="font-medium mb-3">Working Experience</h4>
        
        {/* Present Position */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Present Position</h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500">Position</label>
              <input
                type="text"
                value={formData.workExperience.present.position}
                onChange={(e) => handleWorkExperienceChange('present', 'position', e.target.value)}
                className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">From</label>
              <input
                type="date"
                value={formData.workExperience.present.from}
                onChange={(e) => handleWorkExperienceChange('present', 'from', e.target.value)}
                className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">To</label>
              <input
                type="date"
                value={formData.workExperience.present.to}
                onChange={(e) => handleWorkExperienceChange('present', 'to', e.target.value)}
                className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Years</label>
              <input
                type="number"
                value={formData.workExperience.present.years}
                onChange={(e) => handleWorkExperienceChange('present', 'years', e.target.value)}
                className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
              />
            </div>
          </div>
        </div>
        
        {/* Past Positions */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Past Positions</h5>
          {formData.workExperience.past.map((experience, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500">Position</label>
                <input
                  type="text"
                  value={experience.position}
                  onChange={(e) => handleWorkExperienceChange('past', 'position', e.target.value, index)}
                  className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">From</label>
                <input
                  type="date"
                  value={experience.from}
                  onChange={(e) => handleWorkExperienceChange('past', 'from', e.target.value, index)}
                  className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">To</label>
                <input
                  type="date"
                  value={experience.to}
                  onChange={(e) => handleWorkExperienceChange('past', 'to', e.target.value, index)}
                  className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Years</label>
                <input
                  type="number"
                  value={experience.years}
                  onChange={(e) => handleWorkExperienceChange('past', 'years', e.target.value, index)}
                  className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                />
              </div>
            </div>
          ))}
        </div>
      </div>      {/* Teaching Experience */}
      <div className="border p-4 rounded-md bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <h4 className="font-medium">Teaching Experience</h4>
            <div className="ml-4 flex items-center">
              <input
                id="no-teaching-experience"
                name="no-teaching-experience"
                type="checkbox"
                checked={noTeachingExperience}
                onChange={(e) => setNoTeachingExperience(e.target.checked)}
                className="h-4 w-4 text-[#8B0000] focus:ring-[#8B0000] border-gray-300 rounded"
              />
              <label htmlFor="no-teaching-experience" className="ml-2 block text-sm text-gray-700">
                I don't have teaching experience
              </label>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => {
              const updatedExperience = [...formData.teachingExperience, { institute: '', program: '', subject: '', years: '' }];
              updateFormData({ teachingExperience: updatedExperience });
            }}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-[#8B0000] hover:bg-[#a52a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000]"
            disabled={noTeachingExperience}
          >
            <FiPlus className="mr-1" /> Add Experience
          </button>
        </div>
          <div className="space-y-4" style={{ opacity: noTeachingExperience ? '0.5' : '1' }}>
          {formData.teachingExperience.map((experience, index) => (
            <div key={index} className="relative rounded-md bg-white p-3">
              <div className="absolute top-3 right-3">
                {formData.teachingExperience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedExperience = formData.teachingExperience.filter((_, i) => i !== index);
                      updateFormData({ teachingExperience: updatedExperience });
                    }}
                    className="text-red-500 hover:text-red-700"
                    title="Remove this experience"
                    disabled={noTeachingExperience}
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Institute</label>                  <input
                    type="text"
                    value={experience.institute}
                    onChange={(e) => handleTeachingExperienceChange(index, 'institute', e.target.value)}
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                    disabled={noTeachingExperience}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name of Program</label>                  <input
                    type="text"
                    value={experience.program}
                    onChange={(e) => handleTeachingExperienceChange(index, 'program', e.target.value)}
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                    disabled={noTeachingExperience}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>                  <input
                    type="text"
                    value={experience.subject}
                    onChange={(e) => handleTeachingExperienceChange(index, 'subject', e.target.value)}
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                    disabled={noTeachingExperience}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Years</label>                  <input
                    type="number"
                    value={experience.years}
                    onChange={(e) => handleTeachingExperienceChange(index, 'years', e.target.value)}
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                    disabled={noTeachingExperience}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceStep;
