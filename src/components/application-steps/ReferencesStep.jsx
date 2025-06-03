import React, { useEffect, useState } from "react";

const ReferencesStep = ({ formData, updateFormData, setStepValid }) => {
  const [declarationChecked, setDeclarationChecked] = useState(false);

  useEffect(() => {
    if (formData.references && formData.references.length > 0) {
      const needsMigration = formData.references.some(
        (ref) => ref.contactInfo !== undefined
      );

      if (needsMigration) {
        const migratedReferences = formData.references.map((ref) => ({
          name: ref.name || "",
          position: ref.position || "",
          email: ref.email || "",
          phone: ref.phone || "",
          address: ref.address || "",
        }));
        updateFormData({ references: migratedReferences });
      }
    }
  }, []);

  const handleReferenceChange = (index, field, value) => {
    const updatedReferences = [...formData.references];
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value,
    };
    updateFormData({ references: updatedReferences });
  };

  useEffect(() => {
    const isValid =
      formData.references.every(
        (ref) =>
          ref.name?.trim() !== "" &&
          ref.position?.trim() !== "" &&
          ref.email?.trim() !== "" &&
          ref.phone?.trim() !== "" &&
          ref.address?.trim() !== ""
      ) && declarationChecked;

    if (setStepValid) {
      setStepValid(isValid);
    }
  }, [formData.references, declarationChecked, setStepValid]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">References</h3>

      <div className=" p-4 rounded-md bg-gray-50">
        <h4 className="font-medium mb-3">
          Name, Position and Contact Information of two Non-related Referees
        </h4>

        <div className="space-y-6">
          {formData.references.map((reference, index) => (
            <div key={index} className="p-4 border rounded-md bg-white">
              <h5 className="font-medium mb-3">Referee {index + 1}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={reference.name}
                    onChange={(e) =>
                      handleReferenceChange(index, "name", e.target.value)
                    }
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    value={reference.position}
                    onChange={(e) =>
                      handleReferenceChange(index, "position", e.target.value)
                    }
                    className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Information
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={reference.email || ""}
                        onChange={(e) =>
                          handleReferenceChange(index, "email", e.target.value)
                        }
                        className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={reference.phone || ""}
                        onChange={(e) =>
                          handleReferenceChange(index, "phone", e.target.value)
                        }
                        className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000] h-10"
                        placeholder="+123-456-7890"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        value={reference.address || ""}
                        onChange={(e) =>
                          handleReferenceChange(
                            index,
                            "address",
                            e.target.value
                          )
                        }
                        rows="2"
                        className="mt-1 pl-2 block w-full rounded-md border border-gray-600 shadow-sm focus:border-[#8B0000] focus:ring-[#8B0000]"
                        placeholder="123 Street Name, City, Country"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-400 p-4 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Applicants who are attached to Government and
          Statutory Bodies should forward their applications through their Head
          of the Department.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center">
          <input
            id="declaration"
            name="declaration"
            type="checkbox"
            checked={declarationChecked}
            onChange={(e) => setDeclarationChecked(e.target.checked)}
            className="h-4 w-4 text-[#8B0000] focus:ring-[#8B0000] border-gray-300 rounded"
          />
          <label
            htmlFor="declaration"
            className="ml-2 block text-sm text-gray-900"
          >
            I hereby certify that all the above information is true and correct
            for the best of my knowledge.
          </label>
        </div>
      </div>
    </div>
  );
};

export default ReferencesStep;
