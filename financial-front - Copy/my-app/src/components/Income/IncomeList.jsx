import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIncomes } from '../../Redux/IncomeSlice';

const IncomeList = () => {
  const dispatch = useDispatch();
  const { incomes, isLoading, error } = useSelector((state) => state.IncomeReducer);

  useEffect(() => {
    dispatch(getIncomes());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ marginTop: '30px' }}>
      {incomes.length === 0 ? (
        <div>No income found.</div>
      ) : (
        incomes.map((income) => (
          <div className="card" style={{ marginTop: '30px', maxWidth: '30rem' }} key={income.id}>
            <h5 className="card-header" style={{ background: '#FDFFFE' }}>
              {income.in_category} {/* Category field */}
            </h5>
            <div className="card-body" style={{ background: '#DDF0E4' }}>
              <p className="card-text">Amount: ${income.in_amount}</p> {/* Amount field */}
              <p className="card-text">Date: {new Date(income.in_date).toLocaleDateString()}</p> {/* Date field */}
              <p className="card-text">Description: {income.in_description}</p> {/* Description field */}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default IncomeList;
