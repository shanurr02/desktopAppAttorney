import React, { useState, useCallback } from "react";
import {
    LoanRequestStep,
    PersonalDetailsStep,
    EmploymentDetailsStep,
    SubmitOffersStep,
    ThankYouStep,
    StepperNav
} from "../components";
import { useLoanForm, useFormValidation } from "../hooks";
import { 
    LoanRequestData, 
    PersonalDetailsData, 
    EmploymentDetailsData, 
    CompleteLoanData,
    LoanRequestValidationErrors,
    PersonalDetailsValidationErrors,
    EmploymentDetailsValidationErrors,
    CompleteLoanValidationErrors,
    validateLoanRequest,
    validatePersonalDetails,
    validateEmploymentDetails,
    validateCompleteLoan,
    completeLoanSchema
} from "../validation";
import { extractZodErrors } from "../utils";
import NavbarDashboard from "../components/Dashboard/NavbarDashboard";

const LoanApplication: React.FC = () => {
    const { submitApplication, isSubmitting } = useLoanForm();

    // Use form validation hook for complete loan validation
    const {
        errors: validationErrors,
        validate,
        clearFieldError,
        clearAllErrors,
        setFieldError,
    } = useFormValidation<CompleteLoanValidationErrors>(completeLoanSchema);

    // Step management
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    // Form state - individual fields like Login.tsx
    const [loan_amount, setLoan_amount] = useState("");
    const [residence_type, setResidence_type] = useState("");
    const [firstname, setFirstname] = useState("");
    const [last_name, setLast_name] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [ssn, setSsn] = useState("");
    const [street_address, setStreet_address] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [months_at_address, setMonths_at_address] = useState("");
    const [monthly_rent, setMonthly_rent] = useState("");
    const [zip_code, setZip_code] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [income_source, setIncome_source] = useState("");
    const [pay_frequency, setPay_frequency] = useState("");
    const [monthly_income, setMonthly_income] = useState("");
    const [months_at_employer, setMonths_at_employer] = useState("");
    const [employer_name, setEmployer_name] = useState("");

    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [showThankYou, setShowThankYou] = useState<boolean>(false);

    // Formatting functions
    const formatSSN = (value: string) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        // Format as XXX-XX-XXXX
        if (digits.length <= 3) return digits;
        if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
    };

    const formatPhoneNumber = (value: string) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        // Format as (XXX) XXX-XXXX
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    };

    const formatLoanAmount = (value: string) => {
        const digits = value.replace(/\D/g, '');
        let num = parseInt(digits, 10);
        if (isNaN(num)) return '';
        if (num > 50000) num = 50000;
        return num.toString();
    };

    // Create form data objects for each step
    const getLoanRequestData = useCallback((): LoanRequestData => ({
        loan_amount,
        residence_type,
        next_page: "loan_request_summary",
    }), [loan_amount, residence_type]);

    const getPersonalDetailsData = useCallback((): PersonalDetailsData => ({
        firstname,
        last_name,
        email,
        dob,
        ssn,
        street_address,
        city,
        state,
        months_at_address,
        monthly_rent,
        zip_code,
        phone_number,
    }), [firstname, last_name, email, dob, ssn, street_address, city, state, months_at_address, monthly_rent, zip_code, phone_number]);

    const getEmploymentDetailsData = useCallback((): EmploymentDetailsData => ({
        employer_name,
        months_at_employer,
        income_source,
        pay_frequency,
        monthly_income,
    }), [employer_name, months_at_employer, income_source, pay_frequency, monthly_income]);

    const getCompleteFormData = useCallback((): CompleteLoanData => ({
        loan_amount,
        residence_type,
        next_page: "loan_request_summary",
        firstname,
        last_name,
        email,
        dob,
        ssn,
        street_address,
        city,
        state,
        months_at_address,
        monthly_rent,
        zip_code,
        phone_number,
        income_source,
        pay_frequency,
        monthly_income,
        months_at_employer,
        employer_name,
    }), [loan_amount, residence_type, firstname, last_name, email, dob, ssn, street_address, city, state, months_at_address, monthly_rent, zip_code, phone_number, income_source, pay_frequency, monthly_income, months_at_employer, employer_name]);

    // Step validation using the new validation functions
    const validateStep = useCallback((step: number) => {
        console.log(`Validating step ${step}`);
        try {
            switch (step) {
                case 0: // Loan Request
                    const loanRequestData = getLoanRequestData();
                    const loanRequestResult = validateLoanRequest(loanRequestData);
                    if (!loanRequestResult.isValid) {
                        Object.entries(loanRequestResult.errors).forEach(([field, message]) => {
                            setFieldError(field as keyof CompleteLoanValidationErrors, message);
                        });
                        return false;
                    }
                    break;
                case 1: // Personal Details
                    const personalDetailsData = getPersonalDetailsData();
                    const personalDetailsResult = validatePersonalDetails(personalDetailsData);
                    if (!personalDetailsResult.isValid) {
                        Object.entries(personalDetailsResult.errors).forEach(([field, message]) => {
                            setFieldError(field as keyof CompleteLoanValidationErrors, message);
                        });
                        return false;
                    }
                    break;
                case 2: // Employment Details
                    const employmentDetailsData = getEmploymentDetailsData();
                    const employmentDetailsResult = validateEmploymentDetails(employmentDetailsData);
                    if (!employmentDetailsResult.isValid) {
                        Object.entries(employmentDetailsResult.errors).forEach(([field, message]) => {
                            setFieldError(field as keyof CompleteLoanValidationErrors, message);
                        });
                        return false;
                    }
                    break;
                case 3: // Submit Offers - validate all fields using complete schema
                    const completeFormData = getCompleteFormData();
                    const completeResult = validateCompleteLoan(completeFormData);
                    if (!completeResult.isValid) {
                        Object.entries(completeResult.errors).forEach(([field, message]) => {
                            setFieldError(field as keyof CompleteLoanValidationErrors, message);
                        });
                        return false;
                    }
                    break;
            }
            return true;
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    }, [getLoanRequestData, getPersonalDetailsData, getEmploymentDetailsData, getCompleteFormData, setFieldError]);

    // Stepper configuration
    const steps = [
        {
            id: "loan-request",
            title: "Loan Request",
            description: "Enter the purpose and details of your loan request."
        },
        {
            id: "personal-details",
            title: "Personal Details",
            description: "Enter your personal information and address details."
        },
        {
            id: "employment-details",
            title: "Employment Details",
            description: "Enter your employment and financial information."
        },
        {
            id: "submit-offers",
            title: "Submit for Offers",
            description: "Review and submit your application for loan offers."
        }
    ];

    // Step navigation
    const goToNextStep = () => {
        setError("");

        // Validate current step before proceeding
        const isValid = validateStep(currentStep);

        if (isValid) {
            // Clear errors only if validation passes
            clearAllErrors();
            if (currentStep < steps.length - 1) {
                setCompletedSteps(prev => [...prev, currentStep]);
                setCurrentStep(prev => prev + 1);
            }
        } else {
            setError("Please fix the validation errors below before continuing.");
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setError("");
            clearAllErrors();
        }
    };

    // Reset form function
    const resetForm = () => {
        setLoan_amount("");
        setResidence_type("");
        setFirstname("");
        setLast_name("");
        setEmail("");
        setDob("");
        setSsn("");
        setStreet_address("");
        setCity("");
        setState("");
        setMonths_at_address("");
        setMonthly_rent("");
        setZip_code("");
        setPhone_number("");
        setIncome_source("");
        setPay_frequency("");
        setMonthly_income("");
        setMonths_at_employer("");
        setEmployer_name("");
        setError("");
        setSuccessMessage("");
        setShowThankYou(false);
        setCurrentStep(0);
        setCompletedSteps([]);
        clearAllErrors();
    };

    // Handle form submission
    const handleSubmit = async () => {
        setError("");
        setSuccessMessage("");

        // Validate the complete form before submission
        const isValid = validateStep(3); // Step 3 = Submit Offers (full validation)

        if (!isValid) {
            setError("Please fix all validation errors before submitting.");
            return;
        }

        try {
            const formData = getCompleteFormData();
            console.log("Submitting form data:", formData);
            console.log("Form data keys:", Object.keys(formData));
            console.log("Form data values:", Object.values(formData));
            const result = await submitApplication(formData);
            if (result) {
                console.log("Application submitted successfully:", result);
                setCompletedSteps(prev => [...prev, currentStep]);
                
                // Check if response indicates success
                if (result.status === "Email Sent Successfully") {
                    setShowThankYou(true);
                }
            }
        } catch (err: any) {
            console.error("Submission error:", err);
            
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
                setError("Application submission failed. Please try again.");
            }
        }
    };

    // Handle start new application
    const handleStartNewApplication = () => {
        resetForm();
    };

    // ===== STEP HANDLERS =====

    // Loan Request Step Handlers
    const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatLoanAmount(e.target.value);
        setLoan_amount(formattedValue);
        clearFieldError('loan_amount');
        setError("");
    };

    const handleResidenceTypeClick = (value: string) => {
        setResidence_type(value);
        clearFieldError('residence_type');
        setError("");
    };

    // Personal Details Step Handlers
    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstname(e.target.value);
        clearFieldError('firstname');
        setError("");
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLast_name(e.target.value);
        clearFieldError('last_name');
        setError("");
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        clearFieldError('email');
        setError("");
    };

    const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDob(e.target.value);
        clearFieldError('dob');
        setError("");
    };

    const handleDobDateSelect = (startDate: Date | null, endDate: Date | null) => {
        if (startDate) {
            // Format date as MM/DD/YYYY
            const formattedDate = startDate.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            });
            setDob(formattedDate);
            clearFieldError('dob');
            setError("");
        } else {
            setDob("");
            clearFieldError('dob');
            setError("");
        }
    };

    const handleSsnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatSSN(e.target.value);
        setSsn(formattedValue);
        clearFieldError('ssn');
        setError("");
    };

    const handleStreetAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStreet_address(e.target.value);
        clearFieldError('street_address');
        setError("");
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
        clearFieldError('city');
        setError("");
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setState(e.target.value);
        clearFieldError('state');
        setError("");
    };

    const handleMonthsAtAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMonths_at_address(e.target.value);
        clearFieldError('months_at_address');
        setError("");
    };

    const handleMonthlyRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMonthly_rent(e.target.value);
        clearFieldError('monthly_rent');
        setError("");
    };

    const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setZip_code(e.target.value);
        clearFieldError('zip_code');
        setError("");
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        setPhone_number(formattedValue);
        clearFieldError('phone_number');
        setError("");
    };

    // Employment Details Step Handlers
    const handleEmployerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmployer_name(e.target.value);
        clearFieldError('employer_name');
        setError("");
    };

    const handleMonthsAtEmployerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMonths_at_employer(e.target.value);
        clearFieldError('months_at_employer');
        setError("");
    };

    const handleIncomeSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIncome_source(e.target.value);
        clearFieldError('income_source');
        setError("");
    };

    const handlePayFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPay_frequency(e.target.value);
        clearFieldError('pay_frequency');
        setError("");
    };

    const handleMonthlyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMonthly_income(e.target.value);
        clearFieldError('monthly_income');
        setError("");
    };


    // Render current step
    const renderCurrentStep = () => {
        // Show Thank You page if submission was successful
        if (showThankYou) {
            return (
                <ThankYouStep
                    onStartNewApplication={handleStartNewApplication}
                />
            );
        }

        switch (currentStep) {
            case 0:
                return (
                    <LoanRequestStep
                        formData={getLoanRequestData()}
                        validationErrors={validationErrors}
                        error={error}
                        onLoanAmountChange={handleLoanAmountChange}
                        onResidenceTypeClick={handleResidenceTypeClick}
                        onNext={goToNextStep}
                    />
                );
            case 1:
                return (
                    <PersonalDetailsStep
                        formData={getPersonalDetailsData()}
                        validationErrors={validationErrors}
                        error={error}
                        onFirstNameChange={handleFirstNameChange}
                        onLastNameChange={handleLastNameChange}
                        onEmailChange={handleEmailChange}
                        onDobChange={handleDobChange}
                        onDobDateSelect={handleDobDateSelect}
                        onSsnChange={handleSsnChange}
                        onStreetAddressChange={handleStreetAddressChange}
                        onCityChange={handleCityChange}
                        onStateChange={handleStateChange}
                        onMonthsAtAddressChange={handleMonthsAtAddressChange}
                        onMonthlyRentChange={handleMonthlyRentChange}
                        onZipCodeChange={handleZipCodeChange}
                        onPhoneNumberChange={handlePhoneNumberChange}
                        onPrevious={goToPreviousStep}
                        onNext={goToNextStep}
                        clearFieldError={clearFieldError}
                    />
                );
            case 2:
                return (
                    <EmploymentDetailsStep
                        formData={getEmploymentDetailsData()}
                        validationErrors={validationErrors}
                        error={error}
                        onEmployerNameChange={handleEmployerNameChange}
                        onMonthsAtEmployerChange={handleMonthsAtEmployerChange}
                        onIncomeSourceChange={handleIncomeSourceChange}
                        onPayFrequencyChange={handlePayFrequencyChange}
                        onMonthlyIncomeChange={handleMonthlyIncomeChange}
                        onPrevious={goToPreviousStep}
                        onNext={goToNextStep}
                    />
                );
            case 3:
                return (
                    <SubmitOffersStep
                        formData={getCompleteFormData()}
                        validationErrors={validationErrors}
                        error={error}
                        isSubmitting={isSubmitting}
                        onPrevious={goToPreviousStep}
                        onSubmit={handleSubmit}
                        successMessage={successMessage}
                    />
                );
            default:
                return null;
        }
    };


    return (
        <div className="px-2 h-full py-2">
            <NavbarDashboard />
            <div className="flex flex-col bg-gray-100 space-y-3">
                <div className="overflow-y-auto mt-2">
                    <h2 className="text-gray-900 text-lg font-medium">
                        Get Funding in 4 easy steps
                    </h2>
                    <div className="text-gray-600 text-sm font-normal">
                        Secure the financial support you need with our simple 4 steps
                        process. We've simplified access to the funds disbursement.
                    </div>
                </div>
                {/* Top Stepper - Hide when showing Thank You page */}
                {!showThankYou && (
                    <div className=" py-2 ">
                        <StepperNav
                            currentStep={currentStep}
                            completedSteps={completedSteps}
                            steps={steps}
                        />
                    </div>
                )}


                {/* Main Content */}
                <div className="flex-1 overflow-y-auto border-gray-200 rounded-md border bg-white text-card-foreground shadow-sm p-4">
                    {renderCurrentStep()}
                </div>
            </div>
        </div>
    );
};

export default LoanApplication;