import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitApplication } from "../services/ApplicationServices";

import PersonalInfoStep from "./application-steps/PersonalInfoStep";
import QualificationsStep from "./application-steps/QualificationsStep";
import ExperienceStep from "./application-steps/ExperienceStep";
import ReferencesStep from "./application-steps/ReferencesStep";
import ReviewStep from "./application-steps/ReviewStep";
import { toast } from "react-toastify";

const ApplicationModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepValid, setStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    nameWithInitials: "",
    dateOfBirth: "",
    postalAddress: "",
    officialPhone: "",
    mobilePhone: "",
    email: "",

    preferredPlacements: [{ place: "", departmentId: "", subjects: [] }],

    academicQualifications: [{ degree: "", university: "", date: "" }],

    professionalQualifications: [
      { qualification: "", institute: "", date: "" },
    ],

    otherQualifications: "",

    workExperience: {
      present: { position: "", from: "", to: "", years: "" },
      past: [
        { position: "", from: "", to: "", years: "" },
        { position: "", from: "", to: "", years: "" },
      ],
    },

    teachingExperience: [
      { institute: "", program: "", subject: "", years: "" },
    ],

    references: [
      { name: "", position: "", contactInfo: "" },
      { name: "", position: "", contactInfo: "" },
    ],
  });

  const steps = [
    {
      id: "personal",
      title: "Personal Information",
      component: PersonalInfoStep,
    },
    {
      id: "qualifications",
      title: "Qualifications",
      component: QualificationsStep,
    },
    {
      id: "experience",
      title: "Experience",
      component: ExperienceStep,
    },
    {
      id: "references",
      title: "References",
      component: ReferencesStep,
    },
    {
      id: "review",
      title: "Review & Submit",
      component: ReviewStep,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setStepValid(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setStepValid(true);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    submitApplication(formData)
      .then((response) => {
        console.log("Form submitted:", response);
      
        toast.success("Application submitted successfully!");
        onClose();
      })
      .catch((error) => {
        console.error("Submission error:", error);
        toast.warn(`Error submitting application: ${error.message}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const updateFormData = (stepData) => {
    setFormData({ ...formData, ...stepData });
  };

  const CurrentStepComponent = steps[currentStep].component;

  React.useEffect(() => {
    if (currentStep === steps.length - 1) {
      setStepValid(true);
    }
  }, [currentStep]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl w-11/12 max-w-5xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 bg-[#8B0000] text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Application Form for Visiting Lecturer
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-6 py-2 bg-gray-50">
            <div className="flex justify-between items-center w-full mb-2">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  {/* Step circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        index < currentStep
                          ? "bg-green-500 text-white"
                          : index === currentStep
                          ? "bg-[#8B0000] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index < currentStep ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className="text-xs mt-1 text-gray-600">
                      {step.title}
                    </span>
                  </div>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-2">
                      <div
                        className={`h-1 ${
                          index < currentStep ? "bg-green-500" : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form content */}
          <div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
              setStepValid={setStepValid}
            />
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between mb-5">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded ${
                currentStep === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!stepValid}
                className={`px-4 py-2 rounded ${
                  !stepValid
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#8B0000] text-white hover:bg-[#a52a2a]"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!stepValid || isSubmitting}
                className={`px-4 py-2 rounded ${
                  !stepValid || isSubmitting
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#8B0000] text-white hover:bg-[#a52a2a]"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApplicationModal;
