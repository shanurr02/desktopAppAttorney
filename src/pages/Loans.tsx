import React from 'react';
import { LoanList } from '../components';

interface LoansProps {
  onSelect?: (page: string) => void;
}

const Loans: React.FC<LoansProps> = ({ onSelect }) => {
  return (
    <div className="h-full bg-gray-100">
      <LoanList />
    </div>
  );
};

export default Loans;
