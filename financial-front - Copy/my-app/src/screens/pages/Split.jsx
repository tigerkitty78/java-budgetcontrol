import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, CreditCard } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function SplitPayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [previousData, setPreviousData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [apiError, setApiError] = useState('');
  const { groupId } = useParams();
  console.log("group isssssssssssss", groupId)
  
  const [formData, setFormData] = useState({
    groupName: '',
    numberOfUsers: '',
    description: '',
    totalAmount: '',
    walletId: ''
  });
  const [error, setError] = useState({
    groupName: '',
    numberOfUsers: '',
    description: '',
    totalAmount: '',
    walletId: '',
    api: ''
  });

  // Fetch previous split payments on component mount
 useEffect(() => {
  const fetchData = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    
    if (!jwtToken) {
      setApiError('No token found. Please log in again.');
      return;
    }

    try {
      // Fetch group details first
      const groupResponse = await fetch(`http://localhost	:8080/api/groups/${groupId}/details`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      
      if (!groupResponse.ok) throw new Error('Failed to fetch group details');
      const groupData = await groupResponse.json();

      // Auto-fill form data from group details
      setFormData(prev => ({
        ...prev,
        groupName: groupData.name,
        description: groupData.description,
        numberOfUsers: groupData.users.length.toString(),
      }));

      // Then fetch split payments
      const paymentsResponse = await fetch('http://localhost	:8080/api/split-payment', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      
      if (!paymentsResponse.ok) throw new Error('Failed to fetch split payments');
      const paymentsData = await paymentsResponse.json();
      
      setPreviousData(paymentsData);
      setApiError('');

    } catch (err) {
      console.error('Fetch error:', err);
      setApiError(err.message.includes('group details') 
        ? 'Failed to load group information' 
        : 'Failed to load payment history');
    }
  };

  fetchData();
}, [groupId]);
  
  

  const handlePayShare = async (id) => {
    const token = localStorage.getItem("jwtToken");
  
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/split-payment/${id}/pay-share`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Pay Share successful:", result);
        alert("Your share has been paid successfully!");
        // optionally refresh data
        
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
  



  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });

    if (error[field]) {
      setError({
        ...error,
        [field]: ''
      });
    }
  };

  const handleNumberInput = (e, field) => {
    const value = e.target.value;
    if (field === 'totalAmount') {
      // Allow decimal numbers with up to 2 decimal places for totalAmount
      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
        handleChange(field, value);
      }
    } else {
      // For other fields (numberOfUsers, walletId), allow only integers
      const numericValue = value.replace(/[^\d]/g, '');
      handleChange(field, numericValue);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.groupName.trim()) {
      newErrors.groupName = 'Please enter a group name';
      isValid = false;
    }

    if (!formData.numberOfUsers || parseInt(formData.numberOfUsers) < 2) {
      newErrors.numberOfUsers = 'Please enter at least 2 users';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description for this payment';
      isValid = false;
    }

    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = 'Please enter a valid amount greater than 0';
      isValid = false;
    }

    if (!formData.walletId) {
      newErrors.walletId = 'Please enter your wallet ID';
      isValid = false;
    }

    setError(prev => ({ ...prev, ...newErrors, api: '' }));
    return isValid;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form submit triggered");

  const jwtToken = localStorage.getItem('jwtToken');

  try {
    const payload = {
      totalAmount: parseFloat(formData.totalAmount),
     group: {
  id: parseInt(groupId)  // ✅ this comes from the URL and works
},

      status: 'PENDING'
    };

    console.log("sending post", payload);

    const response = await fetch('http://localhost	:8080/api/split-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to save split payment');
    }

    // Optionally reset form and refresh data
    // setFormData({...});
    // setShowForm(false);
    // const newData = await fetch(...); setPreviousData(newData);

  } catch (error) {
    console.error('Save failed:', error);
    setError(prev => ({ ...prev, api: 'Failed to save split payment. Please try again.' }));
  } finally {
    setLoading(false);
  }
};


  const handlePayNow = async (id, amountType) => {
    const payment = previousData.find(p => p.id === id);
    if (payment) {
      const amountToSend = amountType === 'total' ? payment.totalAmount : payment.splitAmount;
      const state = {
        utilityType: 'split-payment',
        totalAmount: amountToSend,
        id: payment.id
      };

      if (amountType === 'total') {
        state.initialWalletId = payment.initialWalletId;
      }

      if (amountType === 'split') {
        try {
          const response = await fetch(`http://localhost	:8080/api/wallet/${payment.initialWalletId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payment.splitAmount)
          });

          if (!response.ok) {
            throw new Error('Failed to update wallet');
          }
        } catch (error) {
          console.error('PATCH request failed:', error);
          setError(prev => ({ ...prev, api: 'Failed to update wallet. Please try again.' }));
          return;
        }
      }

      navigate('/payment', { state });
    }
  };

  const formattedAmount = () => {
    if (!formData.totalAmount) return '0.00';
    return parseFloat(formData.totalAmount).toFixed(2);
  };

  const calculateSplitAmount = () => {
    if (!formData.totalAmount || !formData.numberOfUsers) return '0.00';
    const numAmount = parseFloat(formData.totalAmount);
    const memberCount = parseInt(formData.numberOfUsers, 10);
    return (numAmount / memberCount).toFixed(2);
  };
  return (
    <div className="container my-4">
      <div className="d-flex align-items-center mb-4">
        <ArrowLeft className="me-2" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <h3 className="mb-0">Split Payment</h3>
      </div>

      {apiError && <div className="alert alert-danger">{apiError}</div>}

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Hide Form' : 'Create New Split Payment'}
      </button>

      {showForm && (
  <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm"style={{transform:'none' ,transition:'none'}}>
    <div className="mb-3">
      <label className="form-label">Group Name</label>
      <input
        type="text"
        className="form-control"
        value={formData.groupName}
        readOnly
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Number of Users</label>
      <input
        type="text"
        className="form-control"
        value={formData.numberOfUsers}
        readOnly
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Description</label>
      <input
        type="text"
        className="form-control"
        value={formData.description}
        readOnly
      />
    </div>

    {/* Keep the remaining inputs for totalAmount and walletId */}
    <div className="mb-3">
      <label className="form-label">Total Amount</label>
      <input
        type="text"
        className={`form-control ${error.totalAmount ? 'is-invalid' : ''}`}
        value={formData.totalAmount}
        onChange={(e) => handleNumberInput(e, 'totalAmount')}
      />
      <div className="invalid-feedback">{error.totalAmount}</div>
    </div>

    <div className="mb-3">
      <label className="form-label">Wallet ID</label>
      <input
        type="text"
        className={`form-control ${error.walletId ? 'is-invalid' : ''}`}
        value={formData.walletId}
        onChange={(e) => handleNumberInput(e, 'walletId')}
      />
      <div className="invalid-feedback">{error.walletId}</div>
    </div>

          {error.api && <div className="alert alert-danger">{error.api}</div>}

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </form>
      )}
{/* <h5>Previous Split Payments</h5>
      <div className="row">
        {previousData.map((item, idx) => {
          const isPayer = currentUserId === item?.user?.id;
          
          return (
            <div className="col-md-6 mb-3" key={idx}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">{item.group?.name || 'Unnamed Group'}</h6>
                  <p className="card-text">{item.description || 'No description'}</p>
                  <p><Users size={16} className="me-2" />{item.group?.users?.length || 0} users</p>
                  <p><DollarSign size={16} className="me-2" />Total: ₹{item.totalAmount?.toFixed(2)}</p>
                  <p><CreditCard size={16} className="me-2" />Split: ₹{item.splitAmount?.toFixed(2)}</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handlePayNow(item.id, 'total')}>
                      Pay Total
                    </button>
                    <button className="btn btn-outline-success btn-sm" onClick={() => handlePayNow(item.id, 'split')}>
                      Pay My Share
                    </button>
                    {!isPayer && (
                      <button className="btn btn-outline-warning btn-sm" onClick={() => handlePayShare(item.id)}>
                        Mark as Paid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div> */}
    </div>)
}