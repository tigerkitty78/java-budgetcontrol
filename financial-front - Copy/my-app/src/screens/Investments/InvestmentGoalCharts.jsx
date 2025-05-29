import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInvestmentGoals, removeInvestmentGoal, contributeToInvestmentGoal } from '../../Redux/InvestmentGoalsSlice';
import BloomingFlowers from './flower';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList,
  PieChart, Pie, Cell
} from 'recharts';

function InvestmentGoalsChart() {
  const dispatch = useDispatch();
  const { investmentGoals, loading, error } = useSelector((state) => state.investmentGoalSlice);

  const [showModal, setShowModal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  useEffect(() => {
    dispatch(getInvestmentGoals());
  }, [dispatch]);

  const handleDelete = (_id) => {
    if (window.confirm('Are you sure you want to delete this investment goal?')) {
      dispatch(removeInvestmentGoal(_id));
    }
  };

  const openModal = (goalId) => {
    setSelectedGoalId(goalId);
    setContributionAmount('');
    setShowModal(true);
  };

 const handleContributionSubmit = (e) => {
  e.preventDefault();
  if (!contributionAmount || isNaN(contributionAmount)) {
    return alert('Enter val_id amount');
  }

  dispatch(
    contributeToInvestmentGoal({
      goalId: selectedGoalId,
      amount: parseFloat(contributionAmount),
    })
  )
    .unwrap()
    .then(() => setShowModal(false))
   .catch((err) => {
  console.error('Caught error:', err);
  alert('Error: ' + err);
});

};

  return (
    <div className="container mt-5">
      <h3 className="text-center chart-title mb-4"> Investment Growth Tracker</h3>

      {loading && <div className="text-center py-4">Loading investments...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && investmentGoals.length === 0 && (
        <div className="text-center py-4 text-muted">
          No active investment goals found. Start growing your portfolio! 🌱
        </div>
      )}

      {!loading && investmentGoals.length > 0 && (
        <div className="row gy-4" style={{ height: "500px" }}>
          {investmentGoals.map((goal) => {
            const progress = ((goal.startAmount / goal.targetAmount) * 100);
            const remainingDays = Math.ceil((new Date(goal.goalEndDate) - new Date()) / (1000 * 60 * 60 * 24));
            const pieData = [
              { name: 'Invested', value: goal.startAmount },
              { name: 'Remaining', value: goal.targetAmount - goal.startAmount },
            ];

            return (
              <div key={goal._id} className="col-md-6" style={{ transform: 'none', transition: 'none' }}>
                <div className="card h-100"style={{transform:'none' ,transition:'none'}}>
                  <div className="card-header">
                    <h5 className="mb-1" style={{ color: '#3eb593' }}>{goal.goalDescription}</h5>
                   <div className="d-flex gap-2 mt-2 flex-wrap">
  <span className="badge teal" style={{ color: "black" }}>
    🎯 ${goal.targetAmount.toLocaleString()}
  </span>
  <span className="badge teal" style={{ color: "black" }}>
    📅 {remainingDays}d left
  </span>
  <span className="badge teal" style={{ color: "black" }}>
    📈 ${goal.startAmount.toLocaleString()}
  </span>
  {goal.expectedAnnualReturn && (
    <span className="badge teal" style={{ color: "black" }}>
      💹 {(goal.expectedAnnualReturn * 100).toFixed(2)}% Annual Return
    </span>
  )}
  {goal.contributions?.length > 0 && (
    <span className="badge teal" style={{ color: "black" }}>
      💰 {goal.contributions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()} Contributed
    </span>
  )}
</div>

{/* Button row below badges */}
<div className="d-flex gap-2 mt-3">
  <button
    className="btn btn-sm btn-danger"
    onClick={() => handleDelete(goal.id)}
  >
    🗑️ Delete
  </button>
  <button
    className="btn btn-sm btn-success"
    onClick={() => openModal(goal.id)}
  >
    ➕ Add Contribution
  </button>
</div>

                  </div>

                  <div className="card-body">
                    <div className="row g-3 align-items-center">
                      <div className="col-lg-4 text-center">
                        <BloomingFlowers progress={progress} />
                        <div className="mt-2">
                          <span className="progress-badge">{progress.toFixed(1)}% Bloomed</span>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <h6 className="chart-title text-center">Portfolio Distribution</h6>
                        <ResponsiveContainer w_idth="100%" height={200}>
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? 'url(#progressGradient)' : '#e0f2f1'} />
                              ))}
                            </Pie>
                            <defs>
                              <linearGradient _id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3eb593" />
                                <stop offset="100%" stopColor="#a9f5d3" />
                              </linearGradient>
                            </defs>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="col-lg-4">
                        <h6 className="chart-title text-center">Growth Timeline</h6>
                        <ResponsiveContainer w_idth="100%" height={200}>
                          <BarChart data={[{ days: remainingDays }]}>
                            <XAxis h_ide />
                            <YAxis domain={[0, Math.max(remainingDays + 7, 30)]} tick={{ fill: '#2d5c53' }} />
                            <Bar dataKey="days" fill="#3eb593" radius={[4, 4, 0, 0]} background={{ fill: '#e0f2f1', radius: 4 }}>
                              <LabelList dataKey="days" position="center" fill="#ffffff" formatter={(val) => `${val} Days`} />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={handleContributionSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Contribution</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <label htmlFor="amount" className="form-label">Amount:</label>
                  <input
                    type="number"
                    className="form-control"
                    _id="amount"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    required
                    min="1"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit Contribution</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvestmentGoalsChart;
