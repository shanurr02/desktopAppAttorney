import React, { useState } from 'react';
import { Button } from '../index';
import { LoanFormData } from '../../validation';

// Extended loan data type for display
interface LoanData {
  id: string;
  loan_amount: string;
  residence_type: string;
  next_page?: string;
  firstname: string;
  last_name: string;
  email: string;
  dob: string;
  ssn: string;
  street_address: string;
  city: string;
  state: string;
  months_at_address: string;
  monthly_rent: string;
  zip_code: string;
  phone_number: string;
  income_source: string;
  pay_frequency: string;
  monthly_income: string;
  months_at_employer: string;
  employer_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'funded';
  applicationDate: string;
  attorneyName: string;
  caseType: string;
  priority: 'low' | 'medium' | 'high';
}

interface LoanCardProps {
  loan: LoanData;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan, isExpanded, onToggleExpanded }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'funded': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="rounded-md border bg-white text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      {/* Main Card Content */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          {/* Left Section - Basic Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {loan.firstname} {loan.last_name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(loan.priority)}`}>
                {loan.priority.charAt(0).toUpperCase() + loan.priority.slice(1)} Priority
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-500">Loan Amount:</span>
                <div className="text-xl font-bold text-green-600">${loan.loan_amount}</div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Case Type:</span>
                <div className="font-medium">{loan.caseType}</div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Application Date:</span>
                <div className="font-medium">{loan.applicationDate}</div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggleExpanded}
              className="w-full sm:w-auto"
            >
              {isExpanded ? 'Hide Details' : 'View Details'}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {/* Personal Information */}
            <div className="space-y-1">
              <div className="font-semibold text-green-600 border-b border-green-100 pb-1 mb-2">Personal</div>
              <div><span className="text-gray-500">Name:</span> <span className="font-medium">{loan.firstname} {loan.last_name}</span></div>
              <div><span className="text-gray-500">Email:</span> <span>{loan.email}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span>{loan.phone_number}</span></div>
              <div><span className="text-gray-500">DOB:</span> <span>{loan.dob}</span></div>
              <div><span className="text-gray-500">SSN:</span> <span>{loan.ssn}</span></div>
            </div>

            {/* Address Information */}
            <div className="space-y-1">
              <div className="font-semibold text-green-600 border-b border-green-100 pb-1 mb-2">Address</div>
              <div><span className="text-gray-500">Street:</span> <span>{loan.street_address}</span></div>
              <div><span className="text-gray-500">City:</span> <span>{loan.city}</span></div>
              <div><span className="text-gray-500">State:</span> <span>{loan.state}</span></div>
              <div><span className="text-gray-500">ZIP:</span> <span>{loan.zip_code}</span></div>
              <div><span className="text-gray-500">At Addr:</span> <span>{loan.months_at_address} mo</span></div>
              <div><span className="text-gray-500">Rent:</span> <span>${loan.monthly_rent}</span></div>
            </div>

            {/* Employment Information */}
            <div className="space-y-1">
              <div className="font-semibold text-green-600 border-b border-green-100 pb-1 mb-2">Employment</div>
              <div><span className="text-gray-500">Employer:</span> <span>{loan.employer_name}</span></div>
              <div><span className="text-gray-500">Months:</span> <span>{loan.months_at_employer}</span></div>
              <div><span className="text-gray-500">Source:</span> <span>{loan.income_source}</span></div>
              <div><span className="text-gray-500">Pay:</span> <span>{loan.pay_frequency}</span></div>
              <div><span className="text-gray-500">Income:</span> <span>${loan.monthly_income}</span></div>
            </div>

            {/* Loan & Case Information */}
            <div className="space-y-1">
              <div className="font-semibold text-green-600 border-b border-green-100 pb-1 mb-2">Loan & Case</div>
              <div><span className="text-gray-500">Amount:</span> <span className="font-bold text-green-700 text-base">${loan.loan_amount}</span></div>
              <div><span className="text-gray-500">Residence:</span> <span>{loan.residence_type}</span></div>
              <div><span className="text-gray-500">Attorney:</span> <span>{loan.attorneyName}</span></div>
              <div><span className="text-gray-500">Case Type:</span> <span>{loan.caseType}</span></div>
              <div><span className="text-gray-500">Priority:</span> <span className={`px-1 py-0.5 rounded text-xs ${getPriorityColor(loan.priority)}`}>{loan.priority}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCard;