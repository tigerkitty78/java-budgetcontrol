import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {createNewGroupGoal } from "../../Redux/GroupSavingGoal"; // make sure this is correctly imported

export default function CreateGroupGoalForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const group = location.state?.group;

  const [goalData, setGoalData] = useState({
    goalName: "",
    targetAmount: "",
    startDate: "",
    deadline: "",
    frequency: "MONTHLY",
  });

  const handleChange = (e) => {
    setGoalData({ ...goalData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const goalPayload = {
      ...goalData,
      currentAmount: 0,
      status: "ACTIVE",
      group: {
        id: group.id,
      },
    };

    try {
      await dispatch(createNewGroupGoal(goalPayload)).unwrap();
      alert("Goal created successfully");
      navigate(`/group/${group.id}`);
    } catch (error) {
      console.error("Error creating goal:", error);
      alert("Failed to create goal. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>
        Create a Saving Goal for Group:{" "}
        <span className="text-primary">{group?.name}</span>
      </h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Goal Name</label>
          <input
            type="text"
            className="form-control"
            name="goalName"
            value={goalData.goalName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Target Amount</label>
          <input
            type="number"
            className="form-control"
            name="targetAmount"
            value={goalData.targetAmount}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={goalData.startDate}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Deadline</label>
          <input
            type="date"
            className="form-control"
            name="deadline"
            value={goalData.deadline}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Frequency</label>
          <select
            className="form-control"
            name="frequency"
            value={goalData.frequency}
            onChange={handleChange}
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Create Goal
        </button>
      </form>
    </div>
  );
}

