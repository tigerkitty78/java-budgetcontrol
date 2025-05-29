import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GroupSavingsGoalsList = () => {
  const { groupId } = useParams();
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("jwtToken"); // Get token from local storage

        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        console.log("Token being sent:", token); // Debugging
        
        const response = await axios.get(
          `http://localhost	:8080/api/group-savings-goals/group/${groupId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Ensure "Bearer " prefix is added
            },
          }
        );

        setSavingsGoals(response.data); // Store fetched goals in state
      } catch (err) {
        console.error("Error fetching savings goals:", err.response?.data || err.message);
        setError(err.response?.data || "Failed to fetch savings goals");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [groupId]); // Dependency array, re-fetch when groupId changes

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Group Savings Goals</h2>
      {savingsGoals.length === 0 ? (
        <p>No savings goals found for this group.</p>
      ) : (
        <ul className="list-group">
          {savingsGoals.map((goal) => (
            <li
              key={goal.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{goal.goalName}</strong> <br />
                Target: ${goal.targetAmount} | Status: {goal.status}
              </div>
              <small>Deadline: {goal.deadline}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupSavingsGoalsList;

