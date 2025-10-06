import React, { useState, useCallback } from "react";
import ReferColleagueForm from "../components/Dashboard/ReferColleagueForm";
import NavbarDashboard from "../components/Dashboard/NavbarDashboard";

interface ReferColleagueFormData {
  colleague_first_name: string;
  colleague_last_name: string;
  colleague_firm_name: string;
  colleague_email: string;
  colleague_firm_size: string;
  colleague_phone: string;
  colleague_message: string;
  your_name: string;
  your_email: string;
}

interface ReferColleagueValidationErrors {
  colleague_first_name?: string;
  colleague_last_name?: string;
  colleague_firm_name?: string;
  colleague_email?: string;
  colleague_firm_size?: string;
  colleague_phone?: string;
  colleague_message?: string;
  your_name?: string;
  your_email?: string;
}

interface ReferColleagueProps {
  onSelect?: (page: string) => void;
}

const ReferColleague: React.FC<ReferColleagueProps> = ({ onSelect }) => {
  // Form state - individual fields
  const [colleague_first_name, setColleague_first_name] = useState("");
  const [colleague_last_name, setColleague_last_name] = useState("");
  const [colleague_firm_name, setColleague_firm_name] = useState("");
  const [colleague_email, setColleague_email] = useState("");
  const [colleague_firm_size, setColleague_firm_size] = useState("");
  const [colleague_phone, setColleague_phone] = useState("");
  const [colleague_message, setColleague_message] = useState("");
  const [your_name, setYour_name] = useState("");
  const [your_email, setYour_email] = useState("");

  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ReferColleagueValidationErrors>({});

  // Handle terms and conditions click
  const handleTermsClick = async () => {
    try {
      // Use Electron API to open external URL in default browser
      if ((window as any).electronAPI) {
        await (window as any).electronAPI.openExternal("https://casefunders.com/referral-terms/");
      } else {
        // Fallback for web version
        window.open("https://casefunders.com/referral-terms/", "_blank");
      }
    } catch (error) {
      console.error("Failed to open referral terms URL:", error);
      // Fallback to window.open
      window.open("https://casefunders.com/referral-terms/", "_blank");
    }
  };

  // Create form data object
  const getFormData = useCallback((): ReferColleagueFormData => ({
    colleague_first_name,
    colleague_last_name,
    colleague_firm_name,
    colleague_email,
    colleague_firm_size,
    colleague_phone,
    colleague_message,
    your_name,
    your_email,
  }), [colleague_first_name, colleague_last_name, colleague_firm_name, colleague_email, colleague_firm_size, colleague_phone, colleague_message, your_name, your_email]);

  // Reset form function
  const resetForm = () => {
    setColleague_first_name("");
    setColleague_last_name("");
    setColleague_firm_name("");
    setColleague_email("");
    setColleague_firm_size("");
    setColleague_phone("");
    setColleague_message("");
    setYour_name("");
    setYour_email("");
    setError("");
    setSuccessMessage("");
    setIsSubmitting(false);
    setValidationErrors({});
  };

  // Handle form submission
  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    // Basic validation
    const formData = getFormData();
    const errors: ReferColleagueValidationErrors = {};

    if (!formData.colleague_first_name.trim()) {
      errors.colleague_first_name = "First name is required";
    }
    if (!formData.colleague_last_name.trim()) {
      errors.colleague_last_name = "Last name is required";
    }
    if (!formData.colleague_firm_name.trim()) {
      errors.colleague_firm_name = "Firm name is required";
    }
    if (!formData.colleague_email.trim()) {
      errors.colleague_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.colleague_email)) {
      errors.colleague_email = "Please enter a valid email";
    }
    if (!formData.colleague_firm_size.trim()) {
      errors.colleague_firm_size = "Firm size is required";
    }
    if (!formData.colleague_phone.trim()) {
      errors.colleague_phone = "Phone number is required";
    }
    if (!formData.colleague_message.trim()) {
      errors.colleague_message = "Message is required";
    }
    if (!formData.your_name.trim()) {
      errors.your_name = "Your name is required";
    }
    if (!formData.your_email.trim()) {
      errors.your_email = "Your email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.your_email)) {
      errors.your_email = "Please enter a valid email";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("Please fix the validation errors below before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting refer colleague data:", formData);
      
      // TODO: Replace with actual API call
      // const result = await referColleagueAPI.sendReferral(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Referral sent successfully");
      setSuccessMessage("Referral sent successfully! You'll receive your $200 gift card once your colleague signs up.");
      resetForm();
    } catch (err: any) {
      console.error("Referral submission error:", err);
      
      // Handle different types of errors
      if (err?.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err?.message) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError("Failed to send referral. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (field: keyof ReferColleagueFormData, value: string) => {
    switch (field) {
      case 'colleague_first_name':
        setColleague_first_name(value);
        break;
      case 'colleague_last_name':
        setColleague_last_name(value);
        break;
      case 'colleague_firm_name':
        setColleague_firm_name(value);
        break;
      case 'colleague_email':
        setColleague_email(value);
        break;
      case 'colleague_firm_size':
        setColleague_firm_size(value);
        break;
      case 'colleague_phone':
        setColleague_phone(value);
        break;
      case 'colleague_message':
        setColleague_message(value);
        break;
      case 'your_name':
        setYour_name(value);
        break;
      case 'your_email':
        setYour_email(value);
        break;
    }
    
    // Clear validation error for this field
    if (validationErrors[field as keyof ReferColleagueValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    setError("");
  };

  return (
    <div className="px-2 h-full py-2">
      <NavbarDashboard onSelect={onSelect || (() => {})} />
      <div className="flex flex-col bg-gray-100 space-y-3">
        {/* Enhanced Header Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
          <div className="flex items-start space-x-4">
            {/* Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Refer a Colleague & Earn a $200 Gift Card
              </h1>
              <p className="text-gray-700 text-base leading-relaxed mb-3">
                Attorneys and paralegals deserve software they can rely on. Recommend LawPay to a friend or colleague, and once they sign up, you'll receive a $200 Visa gift card.
              </p>
              <p className="text-gray-600 text-sm">
                Simply fill out the form below, and our sales team will handle the rest. It's quick and effortless!
              </p>
            </div>
          </div>
          
          {/* Benefits Highlight */}
          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-green-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">No cost to you</span>
                </div>
                <div className="flex items-center space-x-2 text-green-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Quick & easy process</span>
                </div>
                <div className="flex items-center space-x-2 text-green-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Instant reward</span>
                </div>
              </div>
              
              {/* Terms and Conditions Link */}
              <button
                type="button"
                onClick={handleTermsClick}
                className="text-xs text-green-600 hover:text-green-700 font-medium underline"
              >
                Referral Terms and Conditions apply
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto border-gray-200 rounded-md border bg-white text-card-foreground shadow-sm p-4">
          <ReferColleagueForm
            formData={getFormData()}
            validationErrors={validationErrors}
            error={error}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferColleague;
