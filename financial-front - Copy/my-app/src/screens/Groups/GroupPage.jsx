import { useState } from "react";
import { useParams } from "react-router-dom";

const GroupPage = () => {
  const { groupId } = useParams();
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }
  
    const requestBody = {
      goalName,
      targetAmount: parseFloat(targetAmount),
      deadline,
      status: "ACTIVE",
      frequency,
      group: {
        id: parseInt(groupId),
      },
    };
  
    try {
      const response = await fetch("http://localhost	:8080/api/group-savings-goals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        alert("Group Savings Goal Created Successfully");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to create savings goal"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the savings goal.");
    }
  };
  

  return (
    <div>
      <h2>Group {groupId}</h2>
      
      {/* Section 1: Group Details */}
      <section>
        <h3>Group Details</h3>
        <p>Details about the group...</p>
      </section>

      {/* Section 2: Group Members */}
      <section>
        <h3>Group Members</h3>
        <p>List of members...</p>
      </section>

      {/* Section 3: Create Group Savings Goal */}
      <section>
        <h3>Create Group Savings Goal</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Goal Name:</label>
            <input type="text" value={goalName} onChange={(e) => setGoalName(e.target.value)} required />
          </div>
          <div>
            <label>Target Amount:</label>
            <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
          </div>
          <div>
            <label>Deadline:</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
          </div>
          <div>
            <label>Frequency:</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              <option value="MONTHLY">Monthly</option>
              <option value="WEEKLY">Weekly</option>
              <option value="DAILY">Daily</option>
            </select>
          </div>
          <button type="submit">Create Goal</button>
        </form>
      </section>
    </div>
  );
};

export default GroupPage;
