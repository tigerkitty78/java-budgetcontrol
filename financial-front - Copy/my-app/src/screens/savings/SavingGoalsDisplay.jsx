import React, { useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserSavingsGoals, removeSavingsGoalById } from '../../Redux/SavingsGoalSlice';
import { useNavigate } from 'react-router-dom';
import ProgressBar from 'react-bootstrap/ProgressBar';
// import TreeIcon from './YourExternalTreeComponent'; // You'll import your external component here
import TreeAnimation from './Tree'
const SavingGoalList = () => {
    const dispatch = useDispatch();
    const { savingsGoals, loading, error } = useSelector((state) => state.savingsGoalSlice);
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
useEffect(() => {
    let val = 0;
    const interval = setInterval(() => {
      val += 2;
      if (val > 100) val = 100;
      setProgress(val);
      if (val === 100) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);
    useEffect(() => {
        dispatch(fetchUserSavingsGoals());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(removeSavingsGoalById(id));
    };

    const handleEdit = (id) => {
        navigate(`/savingGoalByID/${id}`);
    };

    return (
        <div className="container py-4" style={{ 
            minHeight: "100vh",
            background: "linear-gradient(135deg,rgb(253, 255, 255) 0%,rgb(240, 244, 243) 100%)"
        }}>
            <div className="card" style={{ 
                padding: "30px", 
                marginTop: "60px", 
                borderRadius: "15px", 
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                border: "none"
            }}>
                <h3 className="mb-4" style={{ color: "#00695c", fontWeight: "600" }}>
                    My Savings Goals 🌱
                </h3>
                
                <div className="row g-4">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-teal" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : savingsGoals.length === 0 ? (
                        <div className="text-center py-5" style={{ color: "#00695c" }}>
                            <h5>No savings goals found. Start growing your financial forest! 🌳</h5>
                        </div>
                    ) : (
                        savingsGoals.map((goal) => {
                            const progress = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100);
                            
                            return (
                                <div className="col-md-6" key={goal.id}>
                                    <div className="card h-160" style={{ 
                                        borderRadius: "12px",
                                        height : "260px",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        transition: "transform 0.2s",
                                        cursor: "pointer",
                                        ':hover': {
                                            transform: "translateY(-4px)"
                                        }
                                    }}>
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-4">
                                                {/* Use your external component here and pass `progress` as prop */}
                                                {/* <TreeIcon progress={progress} /> */}
 <p>Progress: {goal.progress}%</p>
          {/* Show the animated tree with size based on progress */}
          <TreeAnimation progress={progress} />
                                                <div className="ms-4">
                                                    <h5 className="mb-1" style={{ color: "#00695c" }}>
                                                        {goal.goalName || "New Goal"}
                                                    </h5>
                                                    <div className="d-flex align-items-center">
                                                        <span className="badge bg-teal me-2">
                                                            {progress}% Complete
                                                        </span>
                                                        <small className="text-muted">
                                                            Target: ${goal.targetAmount}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>

                                            <ProgressBar 
                                                now={progress} 
                                                variant="success" 
                                                style={{ height: "8px", borderRadius: "4px" }}
                                                className="mb-3"
                                            />

                                            <div className="row text-muted small mb-3">
                                                <div className="col-6">
                                                    Saved: ${goal.savedAmount}
                                                </div>
                                                <div className="col-6 text-end">
                                                    Remaining: ${goal.targetAmount - goal.savedAmount}
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <button 
                                                        className="btn btn-sm btn-outline-teal"
                                                        onClick={() => handleEdit(goal.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger ms-2"
                                                        onClick={() => handleDelete(goal.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                                <small className="text-muted">
                                                    {new Date(goal.goalEndDate).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <style>{`
                .bg-teal {
                    background-color: #00695c !important;
                }
                .btn-outline-teal {
                    border-color: #00695c;
                    color: #00695c;
                }
                .btn-outline-teal:hover {
                    background-color: #00695c;
                    color: white;
                }
                .text-teal {
                    color: #00695c !important;
                }
                .card:hover {
                    transform: translateY(-4px);
                }
            `}</style>
        </div>
    );
};

export default SavingGoalList;
