// React & library imports
import { useState, useEffect } from "react";
import { Users, Plus, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

// Redux slices
import { getGroups, createNewGroup 
}  from "../../Redux/GroupSlice";
import { getGoalsByGroup } from "../../Redux/GroupSavingGoal";
import { fetchCurrentUser } from '../../Redux/UserSlice';

export default function GroupManager() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [splitPayables, setSplitPayables] = useState([]);
  const [groupDetails, setGroupDetails] = useState(null);

  // Redux selectors
  const { currentUser } = useSelector((state) => state.userSlice);
  const { groups, isLoading, error } = useSelector((state) => state.groupSlice);
  const goals = useSelector((state) => state.groupSavingsGoalsSlice.goals);

  useEffect(() => { 
    dispatch(fetchCurrentUser());
    if (currentUser?.id) dispatch(getGroups());
  }, [dispatch, currentUser?.id]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    await dispatch(createNewGroup({ name: newGroupName }));
    setNewGroupName("");
    setShowAddGroupForm(false);
    dispatch(getGroups());
  };
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
  const handleGroupSelect = async (group) => {
    if (window.innerWidth < 768) {
      navigate(`/group/${group.id}`);
    } else {
      setSelectedGroup(group);
      dispatch(getGoalsByGroup(group.id));
      fetchSplitPayables(currentUser.id, group.id);
      
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`http://localhost	:8080/api/groups/${group.id}/details`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        setGroupDetails(await response.json());
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    }
  };

  const fetchSplitPayables = async (userId, groupId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://127.0.0.1:8080/api/split-payable", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      const filtered = data.filter(item => 
        Number(item.splitPayment?.group?.id) === Number(groupId) && 
        Number(item.user?.id) === Number(userId)
      );
      setSplitPayables(filtered);
    } catch (error) {
      console.error("Failed to fetch split payables", error);
    }
  };

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100">
        {/* Groups Sidebar */}
        <div className="col-md-4 col-lg-3 bg-white border-end p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="text-dark mb-0">Groups</h5>
            <button 
              onClick={() => setShowAddGroupForm(!showAddGroupForm)}
              className="btn btn-sm btn-outline-dark rounded-circle p-1"
            >
              <Plus size={18} />
            </button>
          </div>

          {showAddGroupForm && (
            <form onSubmit={handleCreateGroup} className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <button 
                  type="submit"
                  className="btn btn-sm btn-dark"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-secondary" role="status" />
            </div>
          ) : error ? (
            <div className="alert alert-danger small mb-0">{error}</div>
          ) : (
            <div className="list-group list-group-flush">
              {groups?.map(group => (
                <div
                  key={group.id}
                  onClick={() => handleGroupSelect(group)}
                  className={`list-group-item list-group-item-action border-0 p-3 ${
                    selectedGroup?.id === group.id ? 'bg-light' : 'bg-transparent'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-light rounded-circle p-2">
                      <Users size={16} className="text-secondary" />
                    </div>
                    <span className="text-dark">{group.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Group Details */}
        <div className="col-md-8 col-lg-9 bg-white p-4">
          {selectedGroup ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="mb-1">{selectedGroup.name}</h4>
                  {groupDetails && (
                    <small className="text-muted">
                      {groupDetails.memberCount} members • Created {new Date(groupDetails.createdAt).toLocaleDateString()}
                    </small>
                  )}
                </div>
                <Dropdown>
                  <Dropdown.Toggle variant="link" className="text-dark p-0">
                    <MoreVertical size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate(`/group/${selectedGroup.id}/friends`)}>
                      Manage Members
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate(`/group/${selectedGroup.id}/add-goal`, { state: { group: selectedGroup } })}>
                      Create Savings Goal
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate(`/group/${selectedGroup.id}/split-expense`)}>
                      Split Expense
                    </Dropdown.Item>

                     <Dropdown.Item onClick={() => navigate(`/group/${selectedGroup.id}/goals`)}>View Saving Goals</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="row g-4">
                {/* Savings Goals */}
                <div className="col-12 col-lg-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Savings Goals</h6>
                      {goals.length > 0 ? (
                        goals.map(goal => (
                          <div key={goal.id} className="mb-3 p-3 bg-light rounded">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{goal.goalName}</strong>
                                <p className="text-muted small mb-0">{goal.description}</p>
                              </div>
                              <span className="badge bg-success">
                                LKR {goal.targetAmount}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted py-4">
                          No savings goals created yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Split Expenses */}
                <div className="col-12 col-lg-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Your Shares</h6>
                      {splitPayables.length > 0 ? (
                        splitPayables.map(item => (
                          <div key={item.id} className="mb-3 p-3 bg-light rounded">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>LKR {item.amountOwed}</strong>
                                <p className="text-muted small mb-0">
                                  {item.splitPayment.description}
                                </p>
                              </div>
                              <button 
                                onClick={() => handlePayShare(item.id)}
                                className="btn btn-sm btn-dark"
                                disabled={item.paid}
                              >
                                {item.paid ? 'Paid' : 'Pay Now'}
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted py-4">
                          No pending payments
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center">
              <div className="text-center text-muted">
                <Users size={40} className="mb-3" />
                <p>Select a group to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
