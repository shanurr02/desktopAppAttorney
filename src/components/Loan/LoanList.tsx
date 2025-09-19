import { LoaderCircle, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useApplications } from '../../hooks';
import DashboardCard from '../Dashboard/DashboardCard';
import { Button } from '../index';
import LoanCard from './LoanCard';

// Extended loan data type for display
interface LoanData {
  id: string;
  application_id: string;
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


const LoanList: React.FC<LoanListProps> = ({ loans }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Fetch applications from API
  const { applications, isLoading, isError, error, refetch } = useApplications();
  
  // Use API data if available, otherwise fall back to prop data
  const loanData = applications.length > 0 ? applications : (loans || []);

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
    // If clicking on the currently expanded card, close it
    // Otherwise, expand the clicked card (closing any previously expanded card)
    setExpandedCard(expandedCard === loanId ? null : loanId);
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
            {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div> */}
            <LoaderCircle  className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" />            
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
            {expandedCard ? '1 expanded' : '0 expanded'}
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
                isExpanded={expandedCard === loan.id}
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
