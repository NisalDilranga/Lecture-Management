import React, { useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const QualificationsStep = ({ formData, updateFormData, setStepValid }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('academic')) {
      const [_, index, field] = name.split('.');
      const updatedQualifications = [...formData.academicQualifications];
      updatedQualifications[index] = {
        ...updatedQualifications[index],
        [field]: value
      };
      updateFormData({ academicQualifications: updatedQualifications });
    } 
    else if (name.startsWith('professional')) {
      const [_, index, field] = name.split('.');
      const updatedQualifications = [...formData.professionalQualifications];
      updatedQualifications[index] = {
        ...updatedQualifications[index],
        [field]: value
      };
      updateFormData({ professionalQualifications: updatedQualifications });
    }
    else {
      updateFormData({ [name]: value });
    }
  };
  
  // Validate form whenever data changes
  useEffect(() => {
    const isValid = 
      // At least one academic qualification should be filled completely
      formData.academicQualifications.some(q => 
        q.degree.trim() !== '' && 
        q.university.trim() !== '' && 
        q.date.trim() !== ''
      ) &&
      // At least one professional qualification should be filled completely (optional but if started, should be complete)
      (
        formData.professionalQualifications.every(q => 
          (q.qualification.trim() === '' && q.institute.trim() === '' && q.date.trim() === '') || 
          (q.qualification.trim() !== '' && q.institute.trim() !== '' && q.date.trim() !== '')
        )
      );

    // Update parent component with validation status
    if (setStepValid) {
      setStepValid(isValid);
    }
  }, [formData, setStepValid]);
  
  const addAcademicQualification = () => {
    const updatedQualifications = [...formData.academicQualifications, { degree: '', university: '', date: '' }];
    updateFormData({ academicQualifications: updatedQualifications });
  };

  const removeAcademicQualification = (index) => {
    if (formData.academicQualifications.length <= 1) return;
    const updatedQualifications = formData.academicQualifications.filter((_, i) => i !== index);
    updateFormData({ academicQualifications: updatedQualifications });
  };

  const addProfessionalQualification = () => {
    const updatedQualifications = [...formData.professionalQualifications, { qualification: '', institute: '', date: '' }];
    updateFormData({ professionalQualifications: updatedQualifications });
  };

  const removeProfessionalQualification = (index) => {
    if (formData.professionalQualifications.length <= 1) return;
    const updatedQualifications = formData.professionalQualifications.filter((_, i) => i !== index);
    updateFormData({ professionalQualifications: updatedQualifications });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Qualifications</h3>
      
      {/* Academic Qualifications */}
      <div className="border p-4 rounded-md bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">Academic Qualifications</h4>
          <button 
            type="button"
            onClick={addAcademicQualification}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-[#8B0000] hover:bg-[#a52a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000]"
          >
            <FiPlus className="mr-1" /> Add Qualification
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.academicQualifications.map((qualification, index) => (
            <div key={index} className="relative  rounded-md bg-white p-3">
              <div className="absolute top-3 right-3">
                {formData.academicQualifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAcademicQualification(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove this qualification"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name of the Degree
                  </label>
                  <input
                    type="text"
                    name={`academic.${index}.degree`}
                    value={qualification.degree}
                    onChange={handleChange}
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name of the University
                  </label>
                  <input
                    type="text"
                    name={`academic.${index}.university`}
                    value={qualification.university}
                    onChange={handleChange}
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    name={`academic.${index}.date`}
                    value={qualification.date}
                    onChange={handleChange}
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Professional Qualifications */}
      <div className="border p-4 rounded-md bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">Professional Qualifications</h4>
          <button 
            type="button"
            onClick={addProfessionalQualification}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-[#8B0000] hover:bg-[#a52a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000]"
          >
            <FiPlus className="mr-1" /> Add Qualification
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.professionalQualifications.map((qualification, index) => (
            <div key={index} className="relative  rounded-md bg-white p-3">
              <div className="absolute top-3 right-3">
                {formData.professionalQualifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProfessionalQualification(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove this qualification"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name of the Qualification
                  </label>
                  <input
                    type="text"
                    name={`professional.${index}.qualification`}
                    value={qualification.qualification}
                    onChange={handleChange}
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name of the Institute
                  </label>
                  <input
                    type="text"
                    name={`professional.${index}.institute`}
                    value={qualification.institute}
                    onChange={handleChange}
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    name={`professional.${index}.date`}
                    value={qualification.date}
                    onChange={handleChange}
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Other Qualifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Other Qualifications
        </label>
        <textarea
          name="otherQualifications"
          value={formData.otherQualifications}
          onChange={handleChange}
          rows="3"
          className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
        ></textarea>
      </div>
    </div>
  );
};

export default QualificationsStep;
