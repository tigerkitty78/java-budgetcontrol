// InvestmentGoalList.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getInvestmentGoals, removeInvestmentGoal } from '../../Redux/InvestmentGoalsSlice';
import { useNavigate } from 'react-router-dom';

const InvestmentGoalList = () => {
    const dispatch = useDispatch();
    const { investmentGoals, loading, error } = useSelector((state) => state.investmentGoalSlice);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getInvestmentGoals());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(removeInvestmentGoal(id));
    };

    const handleEdit = (id) => {
        navigate(`/investment-goal/${id}`); // Navigate to the edit page with the ID
    };

    return (
        <div className="container py-4" style={{ minHeight: "100vh" }}>
            <div className="card" style={{ padding: "30px", marginTop: "60px", borderRadius: "10px", boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                <h5 className="mb-3">Investment Goals</h5>
                <div className="row g-2 align-items-start justify-content-start" style={{ width: "auto" }}>
                    {loading ? (
                        <div className="mt-4">Loading...</div>
                    ) : investmentGoals.length === 0 ? (
                        <div className="mt-4">No investment goals found.</div>
                    ) : (
                        investmentGoals.map((goal) => (
                            <div className="col-md-5" style={{ background: "#ffffff", borderRadius: "10px", padding: "5px", marginRight: "5px" }} key={goal.id}>
                                <div className="card mt-4 p-3" style={{ backgroundColor: "#ffffff", margin: "10px", boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{goal.goalDescription || "No description"}</strong>
                                        </div>
                                        <div className="fw-bold">Target Amount: ${goal.targetAmount}</div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="mb-1">Start Amount: ${goal.startAmount}</p>
                                        <p className="mb-1">Goal Start Date: {new Date(goal.goalStartDate).toLocaleDateString()}</p>
                                        <p className="mb-1">Goal End Date: {new Date(goal.goalEndDate).toLocaleDateString()}</p>
                                        <p className="mb-1">User: {goal.user.fullName}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <button className="btn" style={{ backgroundColor: "#488271", marginLeft: "20px" }} onClick={() => handleDelete(goal.id)}>Delete</button>
                                        <button className="btn" style={{ backgroundColor: "#488271", marginLeft: "20px" }} onClick={() => handleEdit(goal.id)}>Edit</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvestmentGoalList;



