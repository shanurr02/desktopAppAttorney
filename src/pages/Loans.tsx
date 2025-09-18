import React from 'react';
import { LoanList } from '../components';

const Loans: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <LoanList />
    </div>
  );
};

export default Loans;
