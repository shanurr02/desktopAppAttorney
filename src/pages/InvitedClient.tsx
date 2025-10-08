
import React, { useState, useCallback } from "react";
import InviteClientApplication from "../components/InviteClient/InviteClientApplication";
import { useFormValidation } from "../hooks";
import { 
    InviteClientFormData, 
    InviteClientValidationErrors,
    validateInviteClient,
    inviteClientSchema
} from "../validation";
import { inviteClientAPI } from "../api/inviteClient";
import NavbarDashboard from "../components/Dashboard/NavbarDashboard";

interface InvitedClientProps {
  onSelect?: (page: string) => void;
}

const InvitedClient: React.FC<InvitedClientProps> = ({ onSelect }) => {
    // Use form validation hook
    const {
        errors: validationErrors,
        validate,
        clearFieldError,
        clearAllErrors,
        setFieldError,
    } = useFormValidation<InviteClientValidationErrors>(inviteClientSchema);

    // Form state - individual fields like LoanApplication.tsx
    const [client_email, setClient_email] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [loan_amount, setLoan_amount] = useState("");
    const [reference, setReference] = useState("");
    const [subject_line, setSubject_line] = useState("");
    const [custom_email_text, setCustom_email_text] = useState("");
    const [selected_file, setSelected_file] = useState<File | string>("");

    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Create form data object
    const getFormData = useCallback((): InviteClientFormData => ({
        client_email,
        first_name,
        last_name,
        loan_amount,
        reference,
        subject_line,
        custom_email_text,
        selected_file,
    }), [client_email, first_name, last_name, loan_amount, reference, subject_line, custom_email_text, selected_file]);

    // Reset form function
    const resetForm = () => {
        setClient_email("");
        setFirst_name("");
        setLast_name("");
        setLoan_amount("");
        setReference("");
        setSubject_line("");
        setCustom_email_text("");
        setSelected_file("");
        setError("");
        setSuccessMessage("");
        setIsSubmitting(false);
        clearAllErrors();
    };

    // Reset form fields only (without clearing success message)
    const resetFormFields = () => {
        setClient_email("");
        setFirst_name("");
        setLast_name("");
        setLoan_amount("");
        setReference("");
        setSubject_line("");
        setCustom_email_text("");
        setSelected_file("");
        setError("");
        setIsSubmitting(false);
        clearAllErrors();
    };

    // Handle form submission
    const handleSubmit = async () => {
        setError("");
        setSuccessMessage("");
        setIsSubmitting(true);

        // Validate the form before submission
        const formData = getFormData();
        const validationResult = validateInviteClient(formData);

        if (!validationResult.isValid) {
            Object.entries(validationResult.errors).forEach(([field, message]) => {
                setFieldError(field as keyof InviteClientValidationErrors, message);
            });
            setError("Please fix the validation errors below before submitting.");
            setIsSubmitting(false);
            return;
        }

        try {
            console.log("Submitting invite client data:", formData);
            
            const result = await inviteClientAPI.sendInvite(formData);
            
            console.log("Invite sent successfully:", result);
            setSuccessMessage(`Client invite sent successfully! ${result.payment_link ? 'Payment link generated.' : ''}`);
            // Clear form fields immediately after successful submission (but keep success message)
            resetFormFields();
            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 5000);
        } catch (err: any) {
            console.error("Invite submission error:", err);
            
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
                setError("Failed to send invite. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===== SINGLE FIELD HANDLER =====

    const handleFieldChange = (field: keyof InviteClientFormData, value: string | File) => {
        switch (field) {
            case 'client_email':
                setClient_email(value as string);
                break;
            case 'first_name':
                setFirst_name(value as string);
                break;
            case 'last_name':
                setLast_name(value as string);
                break;
            case 'loan_amount':
                setLoan_amount(value as string);
                break;
            case 'reference':
                setReference(value as string);
                break;
            case 'subject_line':
                setSubject_line(value as string);
                break;
            case 'custom_email_text':
                setCustom_email_text(value as string);
                break;
            case 'selected_file':
                setSelected_file(value);
                break;
        }
        clearFieldError(field as keyof InviteClientValidationErrors);
        setError("");
    };

    return (
        <div className="px-2 h-full py-2">
            <NavbarDashboard onSelect={onSelect || (() => {})} />
            <div className="flex flex-col bg-gray-100 space-y-3">
                <div className="overflow-y-auto mt-2">
                    <h2 className="text-gray-900 text-lg font-medium">
                        Invite Client for Payment
                    </h2>
                    <div className="text-gray-600 text-sm font-normal">
                        Send a secure payment invitation to your client. They will receive a custom email with a secure payment link.
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
                    <InviteClientApplication
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

export default InvitedClient;