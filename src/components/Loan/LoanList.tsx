import React, { useState, useMemo } from 'react';
import { Button } from '../index';
import LoanCard from './LoanCard';
import DashboardCard from '../Dashboard/DashboardCard';
import { LoanFormData } from '../../validation';
import { useApplications } from '../../hooks';
import { Search } from 'lucide-react';

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

interface LoanListProps {
  loans?: LoanData[];
}

// Sample loan data matching the Dashboard design patterns
const sampleLoans: LoanData[] = [
  {
    id: '1',
    firstname: 'Aliah',
    last_name: 'Lane',
    email: 'aliah.lane@email.com',
    phone_number: '(555) 123-4567',
    dob: '03/15/1985',
    ssn: '123-45-6789',
    street_address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    months_at_address: '24',
    monthly_rent: '2500',
    employer_name: 'Tech Solutions Inc',
    months_at_employer: '18',
    income_source: 'Employment',
    pay_frequency: 'Bi-weekly',
    monthly_income: '6500',
    loan_amount: '25000',
    residence_type: 'Rent',
    status: 'approved',
    applicationDate: '2024-01-15',
    attorneyName: 'John Smith',
    caseType: 'Personal Injury',
    priority: 'high'
  },
  {
    id: '2',
    firstname: 'Lana',
    last_name: 'Steiner',
    email: 'lana.steiner@email.com',
    phone_number: '(555) 234-5678',
    dob: '07/22/1990',
    ssn: '234-56-7890',
    street_address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90210',
    months_at_address: '36',
    monthly_rent: '3200',
    employer_name: 'Creative Agency LLC',
    months_at_employer: '24',
    income_source: 'Employment',
    pay_frequency: 'Monthly',
    monthly_income: '7200',
    loan_amount: '18000',
    residence_type: 'Rent',
    status: 'pending',
    applicationDate: '2024-01-14',
    attorneyName: 'Sarah Johnson',
    caseType: 'Medical Malpractice',
    priority: 'medium'
  },
  {
    id: '3',
    firstname: 'Koray',
    last_name: 'Okumus',
    email: 'koray.okumus@email.com',
    phone_number: '(555) 345-6789',
    dob: '11/08/1988',
    ssn: '345-67-8901',
    street_address: '789 Pine Street',
    city: 'Chicago',
    state: 'IL',
    zip_code: '60601',
    months_at_address: '12',
    monthly_rent: '1800',
    employer_name: 'Finance Corp',
    months_at_employer: '30',
    income_source: 'Employment',
    pay_frequency: 'Bi-weekly',
    monthly_income: '5800',
    loan_amount: '32000',
    residence_type: 'Own',
    status: 'approved',
    applicationDate: '2024-01-13',
    attorneyName: 'Michael Brown',
    caseType: 'Employment Law',
    priority: 'high'
  },
  {
    id: '4',
    firstname: 'Joshua',
    last_name: 'Wilson',
    email: 'joshua.wilson@email.com',
    phone_number: '(555) 456-7890',
    dob: '05/12/1982',
    ssn: '456-78-9012',
    street_address: '321 Elm Street',
    city: 'Houston',
    state: 'TX',
    zip_code: '77001',
    months_at_address: '48',
    monthly_rent: '2200',
    employer_name: 'Healthcare Systems',
    months_at_employer: '36',
    income_source: 'Employment',
    pay_frequency: 'Monthly',
    monthly_income: '8500',
    loan_amount: '15000',
    residence_type: 'Rent',
    status: 'funded',
    applicationDate: '2024-01-12',
    attorneyName: 'Emily Davis',
    caseType: 'Workers Compensation',
    priority: 'low'
  },
  {
    id: '5',
    firstname: 'Maria',
    last_name: 'Rodriguez',
    email: 'maria.rodriguez@email.com',
    phone_number: '(555) 567-8901',
    dob: '09/25/1993',
    ssn: '567-89-0123',
    street_address: '654 Maple Drive',
    city: 'Miami',
    state: 'FL',
    zip_code: '33101',
    months_at_address: '18',
    monthly_rent: '2800',
    employer_name: 'Legal Services Inc',
    months_at_employer: '12',
    income_source: 'Employment',
    pay_frequency: 'Bi-weekly',
    monthly_income: '6200',
    loan_amount: '22000',
    residence_type: 'Rent',
    status: 'rejected',
    applicationDate: '2024-01-11',
    attorneyName: 'David Lee',
    caseType: 'Family Law',
    priority: 'medium'
  }
];

const LoanList: React.FC<LoanListProps> = ({ loans }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Fetch applications from API
  const { applications, isLoading, isError, error, refetch } = useApplications();
  
  // Use API data if available, otherwise fall back to sample data or prop
  const loanData = applications.length > 0 ? applications : (loans || sampleLoans);

  // Filter and sort loans
  const filteredAndSortedLoans = useMemo(() => {
    let filtered = loanData.filter(loan => {
      const matchesSearch = 
        loan.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.attorneyName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || loan.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort loans
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return parseInt(b.loan_amount) - parseInt(a.loan_amount);
        case 'name':
          return `${a.firstname} ${a.last_name}`.localeCompare(`${b.firstname} ${b.last_name}`);
        case 'date':
        default:
          return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
      }
    });

    return filtered;
  }, [loanData, searchTerm, statusFilter, priorityFilter, sortBy]);

  const toggleCardExpansion = (loanId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(loanId)) {
      newExpanded.delete(loanId);
    } else {
      newExpanded.add(loanId);
    }
    setExpandedCards(newExpanded);
  };

  const getStatusCounts = () => {
    const counts = loanData.reduce((acc, loan) => {
      acc[loan.status] = (acc[loan.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 px-2 py-2">
          <div className="bg-gray-100 border-b mb-6">
            <div className="flex flex-col md:flex-row max-md:gap-2 md:items-center md:justify-between py-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
                <p className="text-gray-600">Manage and review client loan applications</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="primary" size="sm" onClick={() => refetch()} disabled>
                  Refresh Data
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Export Data
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Add New Application
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading applications...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex flex-col h-full">
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 px-2 py-2">
          <div className="bg-gray-100 border-b mb-6">
            <div className="flex flex-col md:flex-row max-md:gap-2 md:items-center md:justify-between py-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
                <p className="text-gray-600">Manage and review client loan applications</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="primary" size="sm" onClick={() => refetch()}>
                  Refresh Data
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Export Data
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Add New Application
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-2">Failed to load applications</p>
            <p className="text-gray-400 text-sm mb-6">There was an error fetching your data</p>
            <Button variant="primary" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 px-2 py-2">
        <div className="bg-gray-100 border-b mb-6">
          {/* Inner container with border under content */}
          <div className="flex flex-col md:flex-row max-md:gap-2 md:items-center md:justify-between py-3">
            {/* Left */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
              <p className="text-gray-600">Manage and review client loan applications</p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <Button variant="primary" size="sm" onClick={() => refetch()}>
                Refresh Data
              </Button>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                Add New Application
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <DashboardCard
            title="Approved"
            amount={`${statusCounts.approved || 0}`}
          />
          <DashboardCard
            title="Pending"
            amount={`${statusCounts.pending || 0}`}
          />
          <DashboardCard
            title="Funded"
            amount={`${statusCounts.funded || 0}`}
          />
          <DashboardCard
            title="Rejected"
            amount={`${statusCounts.rejected || 0}`}
          />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-100 rounded-md py-2 mb-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="flex items-center border rounded-md px-3 py-3 bg-white max-h-[40px]">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search by name, email, case type, or attorney..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="outline-none flex-1 text-sm text-gray-700 focus:ring-0 focus-within:ring-0"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 bg-white text-gray-500 border-gray-300"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="funded">Funded</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 bg-white text-gray-500 border-gray-300"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'name')}
                className="w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 bg-white text-gray-500 border-gray-300"
              >
                <option value="date">Application Date</option>
                <option value="amount">Loan Amount</option>
                <option value="name">Client Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedLoans.length} of {loanData.length} applications
          </div>
          <div className="text-sm text-gray-500">
            {expandedCards.size} expanded
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {/* Loan Cards */}
        <div className="space-y-4">
          {filteredAndSortedLoans.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
              <div className="text-gray-500 text-lg mb-2">No applications found</div>
              <div className="text-gray-400 text-sm">Try adjusting your search or filter criteria</div>
            </div>
          ) : (
            filteredAndSortedLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                isExpanded={expandedCards.has(loan.id)}
                onToggleExpanded={() => toggleCardExpansion(loan.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanList;
