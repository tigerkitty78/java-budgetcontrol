import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";

const colors = ["#00C49F", "#00796B", "#004D40", "#FFBB28", "#FF8042"]; // Add more colors for more users


const GroupSavingsGoal = () => {
  const { groupId } = useParams();
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchGoalData = async () => {
      try {
        const response = await axios.get(
          `http://localhost	:8080/api/group-savings-goals/${groupId}/details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const processedGoals = response.data.map(goal => {
          const startDate = new Date(goal.startDate);
          const today = new Date();
          const daysPassed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));

          const totalContributed = goal.contributors.reduce((sum, user) => sum + user.totalContribution, 0);
          const goalFulfilledPercentage = ((totalContributed / goal.targetAmount) * 100).toFixed(2);

          const chartData = {
            name: goal.goalName,
            ...goal.contributors.reduce((acc, user, index) => ({
              ...acc,
              [user.username]: ((user.totalContribution / goal.targetAmount) * 100).toFixed(2)
            }), {})
          };

          return {
            ...goal,
            daysPassed,
            goalFulfilledPercentage,
            chartData,
            status: totalContributed >= goal.targetAmount ? "ACHIEVED" : "IN PROGRESS",
            totalContributed
          };
        });

        setGoals(processedGoals);
      } catch (error) {
        console.error("Error fetching goal data:", error);
      }
    };

    fetchGoalData();
  }, [groupId, token]);

  const handleContribution = (goal) => {
    setSelectedGoal(goal);
    setShowPopup(true);
  };

  const submitContribution = async () => {
    if (!contributionAmount || isNaN(contributionAmount) || contributionAmount <= 0) {
      alert("Please enter a valid contribution amount.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost	:8080/api/group-savings-contributions",
        {
          goalId: selectedGoal.goalId,
          amount: parseFloat(contributionAmount)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Contribution added successfully!");
        setShowPopup(false);
        setContributionAmount("");
        const updatedGoals = goals.map(goal =>
          goal.goalId === selectedGoal.goalId
            ? { ...goal, totalContributed: goal.totalContributed + parseFloat(contributionAmount) }
            : goal
        );
        setGoals(updatedGoals);
      }
    } catch (error) {
      console.error("Contribution error:", error);
      alert(error.response?.data?.message || "Failed to add contribution");
    }
  };

  if (goals.length === 0) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center text-muted">
        <h4>No savings goals found for this group</h4>
        <p>Start by creating a new savings goal!</p>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <h1 className="mb-5 fw-bold">Group Savings Goals</h1>
      <div className="row g-4">
        {goals.map((goal, index) => (
          <div key={goal.goalId} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title text-truncate">{goal.goalName}</h5>
                  <span className={`badge ${goal.status === "ACHIEVED" ? "bg-success" : "bg-primary"}`}>
                    {goal.status}
                  </span>
                </div>

                <div className="mb-4">
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={[goal.chartData]} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" hide />
                      <Tooltip formatter={(value) => [`${value}%`, "Contribution"]} />
                      <Legend />
                      {Object.keys(goal.chartData)
                        .filter(key => key !== "name")
                        .map((key, i) => (
                          <Bar key={key} dataKey={key} stackId="a">
                            <Cell fill={colors[i % colors.length]} />
                          </Bar>
                        ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <ul className="list-unstyled mb-3">
                  <li className="d-flex justify-content-between">
                    <span className="text-muted">Days Passed:</span>
                    <span>{goal.daysPassed}</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span className="text-muted">Progress:</span>
                    <span className="text-primary">{goal.goalFulfilledPercentage}%</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span className="text-muted">Total Saved:</span>
                    <span>${goal.totalContributed.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleContribution(goal)}
                  className="btn btn-primary w-100"
                  style={{background:"#1c4a3b"}}
                >
                  Add Contribution
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contribute to {selectedGoal?.goalName}</h5>
                <button type="button" className="btn-close" onClick={() => setShowPopup(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={submitContribution}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSavingsGoal;



