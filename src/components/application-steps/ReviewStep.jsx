import React, { useEffect } from 'react';

const ReviewStep = ({ formData, setStepValid }) => {
  // Review step is always valid since all previous steps should be validated
  useEffect(() => {
    if (setStepValid) {
      setStepValid(true);
    }
  }, [setStepValid]);
  
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium text-gray-900">Review Your Application</h3>
      
      <div className="bg-yellow-50 border border-yellow-400 p-4 rounded-md mb-6">
        <p className="text-sm text-yellow-800">
          Please review all the information below carefully before submitting your application. You will not be able to edit this information after submission.
        </p>
      </div>
      
      {/* Personal Information */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h4 className="font-medium text-gray-900">Personal Information</h4>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="mt-1">{formData.fullName || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Name with Initials</p>
              <p className="mt-1">{formData.nameWithInitials || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="mt-1">{formData.dateOfBirth || '-'}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm font-medium text-gray-500">Contact Information</p>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Postal Address</p>
                <p className="text-sm">{formData.postalAddress || '-'}</p>
              </div>
              <div>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Official Phone</p>
                    <p className="text-sm">{formData.officialPhone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mobile Phone</p>
                    <p className="text-sm">{formData.mobilePhone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{formData.email || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            {/* Preferred Placements */}
          <div className="pt-2">
            <p className="text-sm font-medium text-gray-500">Preferred Placements</p>
            {formData.preferredPlacements.length > 0 ? (
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preference</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.preferredPlacements.map((placement, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{placement.place || '-'}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{placement.subjects || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic mt-2">No preferred placements specified</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Qualifications */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h4 className="font-medium text-gray-900">Qualifications</h4>
        </div>
        <div className="p-4 space-y-6">
          {/* Academic Qualifications */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Academic Qualifications</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name of the Degree</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name of the University</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.academicQualifications.map((qualification, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-sm text-gray-900">{qualification.degree || '-'}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{qualification.university || '-'}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{qualification.date || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Professional Qualifications */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Professional Qualifications</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name of the Qualification</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name of the Institute</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.professionalQualifications.map((qualification, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-sm text-gray-900">{qualification.qualification || '-'}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{qualification.institute || '-'}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{qualification.date || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Other Qualifications */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Other Qualifications</p>
            <p className="text-sm">{formData.otherQualifications || '-'}</p>
          </div>
        </div>
      </div>
      
      {/* Experience */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h4 className="font-medium text-gray-900">Experience</h4>
        </div>
        <div className="p-4 space-y-6">
          {/* Working Experience */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Working Experience</p>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Present Position</p>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Position</p>
                    <p className="text-sm">{formData.workExperience.present.position || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">From</p>
                    <p className="text-sm">{formData.workExperience.present.from || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">To</p>
                    <p className="text-sm">{formData.workExperience.present.to || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Years</p>
                    <p className="text-sm">{formData.workExperience.present.years || '-'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Past Positions</p>
                <div className="mt-1 space-y-2">
                  {formData.workExperience.past.map((experience, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Position</p>
                        <p className="text-sm">{experience.position || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">From</p>
                        <p className="text-sm">{experience.from || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">To</p>
                        <p className="text-sm">{experience.to || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Years</p>
                        <p className="text-sm">{experience.years || '-'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Teaching Experience */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Teaching Experience</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name of Program</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Years</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.teachingExperience.map((experience, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-sm text-gray-900">{experience.institute || '-'}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{experience.program || '-'}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{experience.subject || '-'}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{experience.years || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* References */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h4 className="font-medium text-gray-900">References</h4>
        </div>
        <div className="p-4 space-y-4">
          {formData.references.map((reference, index) => (
            <div key={index} className="p-3 border rounded bg-white">
              <p className="font-medium text-sm">Referee {index + 1}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm">{reference.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Position</p>
                  <p className="text-sm">{reference.position || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Contact Information</p>
                  <p className="text-sm">{reference.contactInfo || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-500 italic">By clicking "Submit Application", you agree that all the information provided is true and correct to the best of your knowledge.</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
