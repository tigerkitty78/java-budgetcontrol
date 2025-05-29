import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SplitPaymentPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchSplitPayments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8080/api/split-payable', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Only keep unpaid records
        const unpaidData = response.data.filter(item => !item.paid);
        setData(unpaidData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchSplitPayments();
  }, [token]);

  const handlePayShare = async (splitPaymentId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/split-payment/${splitPaymentId}/pay-share`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Pay Share successful:", result);
        alert("Your share has been paid successfully!");
        // Refresh the data after successful payment
        setData(prevData => prevData.filter(item => item.splitPayment.id !== splitPaymentId));
      } else {
        const errorText = await response.text();
        console.error("Pay Share failed:", errorText);
        alert("Failed to pay your share.");
      }
    } catch (error) {
      console.error("Error during Pay Share:", error);
      alert("Something went wrong!");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-4">
      {data.map((item) => (
        <div key={item.id} className="card mb-4 shadow-sm">
          <div className="card-header">
            <h5>Split Payment ID: {item.splitPayment.id}</h5>
            <p className="mb-0">Amount Owed: ${item.amountOwed}</p>
            <span className={`badge ${item.paid ? 'bg-success' : 'bg-danger'}`}>
              {item.paid ? 'Paid' : 'Unpaid'}
            </span>
          </div>

          <div className="card-body">
            <h6>Group: {item.splitPayment.group.name}</h6>
            <p>{item.splitPayment.group.description}</p>

            <h6 className="mt-3">Savings Goals:</h6>
            {item.splitPayment.group.savingsGoals.map((goal) => (
              <div key={goal.id} className="border p-3 rounded mb-3 bg-light">
                <h6>Goal: {goal.goalName}</h6>
                <p>
                  Target: ${goal.targetAmount} <br />
                  Current: ${goal.currentAmount} <br />
                  Status: <strong>{goal.status}</strong><br />
                  Frequency: {goal.frequency} <br />
                  Deadline: {goal.deadline}
                </p>
                <h6>Contributions:</h6>
                <ul className="list-group">
                  {goal.contributions.map((c) => (
                    <li key={c.id} className="list-group-item">
                      <strong>{c.user.fullName}</strong> contributed ${c.amount} on {c.contributionDate}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <h6 className="mt-4">Group Members:</h6>
            <ul className="list-group">
              {item.splitPayment.group.users.map((user) => (
                <li key={user.id} className="list-group-item">
                  {user.fullName} ({user.email})
                </li>
              ))}
            </ul>

            <button className="btn btn-outline-warning btn-sm" onClick={() => handlePayShare(item.splitPayment.id)}>
              Mark as Paid
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SplitPaymentPage;


