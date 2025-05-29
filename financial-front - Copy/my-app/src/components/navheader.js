import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, useEffect } from 'react';
import { FaBell, FaUser, FaFileInvoiceDollar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Navheader() {
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [billDropdownOpen, setBillDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [bills, setBills] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [loadingBills, setLoadingBills] = useState(false);
const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchBills = async () => {
      if (!token) return;
      setLoadingBills(true);
      try {
        const response = await fetch('http://localhost	:8080/bills', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch bills');
        const data = await response.json();
        setBills(data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      } finally {
        setLoadingBills(false);
      }
    };




    const fetchNotifications = async () => {
      if (!token) return;
      setLoadingNotifs(true);
      try {
        const res = await fetch('http://localhost	:8080/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoadingNotifs(false);
      }
    };

    fetchBills();
    fetchNotifications();

    // Optional polling (every 15s)
    const interval = setInterval(() => {
      fetchNotifications();
      fetchBills();
    }, 15000);

    return () => clearInterval(interval);
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost	:8080/api/notifications/mark-read/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const go = async()=>{
   navigate("/user")
  }
    
const ynavigate = () => {
  navigate('/home');
};

  const handleAddToExpense = (bill) => {
    navigate('/utilAdd', {  // Change to '/expense' if that's your actual expense route
      state: {
        amount: bill.totalDue,
        description: `${bill.name} Bill`,
        date: bill.dueDate,
        category: 'Utilities'
      }
    });
  };
  return (
    <div className="d-flex">
        <button 
    className="btn btn-outline-light" 
    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
  >
    ☰ Menu
  </button>

   {mobileSidebarOpen && (
    <div 
      className="position-absolute bg-white shadow-sm rounded mt-2 p-3"
      style={{ zIndex: 1050, right: 10, width: 220 }}
    >
      <ul className="nav flex-column">
        <li className="nav-item"><a className="nav-link text-dark" href="/">Home</a></li>
        <li className="nav-item"><a className="nav-link text-dark" href="/expland">Expenses</a></li>
        <li className="nav-item"><a className="nav-link text-dark" href="/Inland">Income</a></li>
        <li className="nav-item"><a className="nav-link text-dark" href="/savdash">Savings</a></li>
        <li className="nav-item"><a className="nav-link text-dark" href="/invdash">Investments</a></li>
        <li className="nav-item"><a className="nav-link text-dark" href="/chat">Groups</a></li>
      </ul>
    </div>
  )}

      {/* Sidebar */}
      <div
        className="sidebar p-3 position-fixed vh-100 d-none d-md-block"
        style={{ width: '250px', background: '#368576', color: 'black' }}
      >
 
        <ul className="nav flex-column">
          <li className="nav-item"><a className="nav-link text-white" href="/">Home</a></li>
          <li className="nav-item"><a className="nav-link text-light" href="/expland">Expenses</a></li>
          <li className="nav-item"><a className="nav-link text-light" href="/Inland">Income</a></li>
          <li className="nav-item"><a className="nav-link text-light" href="/savdash">Savings</a></li>
          <li className="nav-item"><a className="nav-link text-light" href="/invdash">Investments</a></li>
          <li className="nav-item"><a className="nav-link text-light" href="/chat">Groups</a></li>
          <li className="nav-item"><a className="nav-link text-light" href="/home">Payments</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content w-100 ms-auto" style={{ marginLeft: '1px' }}>
        <nav className="navbar navbar-expand-lg px-3" style={{ backgroundColor: '#368576' }}>
          <div className="d-flex align-items-center w-100 justify-content-between text-white">
            <h4 className="mb-0"> </h4>

            <div className="d-flex align-items-center gap-4 position-relative">
              {/* Profile */}
              <FaUser size={22} style={{ cursor: 'pointer' }} href="/user" onClick={go}/>

              {/* Bills */}
              <div className="position-relative" onClick={() => {
                setBillDropdownOpen(!billDropdownOpen);
                setNotifDropdownOpen(false);
              }} style={{ cursor: 'pointer' }}>
                <FaFileInvoiceDollar size={22} />
                {bills.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                    {bills.length}
                  </span>
                )}
              </div>

              {/* Notifications */}
              <div className="position-relative" onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                setBillDropdownOpen(false);
              }} style={{ cursor: 'pointer' }}>
                <FaBell size={22} />
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications.length}
                  </span>
                )}
              </div>

              {/* Bills Dropdown */}
              {billDropdownOpen && (
                <div className="dropdown-menu dropdown-menu-end show"
                  style={{ position: 'absolute', top: '100%', right: '50px', minWidth: '300px', maxHeight: '300px', overflowY: 'auto' }}>
                  {loadingBills ? (
                    <div className="dropdown-item text-muted">Loading bills...</div>
                  ) : bills.length === 0 ? (
                    <div className="dropdown-item text-muted">No bills found</div>
                  ) : (
                    bills.map((bill) => (
                      <div className="dropdown-item d-flex justify-content-between align-items-center" key={bill.accountNumber}>
                        <div>
                          <strong>{bill.name}</strong>
                          <div className="text-muted small">Due: {bill.dueDate}</div>
                        </div>
                        <div>
                          <strong>{bill.totalDue}</strong>
                          {/* <div className="text-muted small">Total Due: {bill.dueDate}</div> */}
                        </div>
                        

                        <button className="btn btn-sm btn-outline-primary" onClick={ynavigate}>
  Pay Now
</button>
                        <button className="btn btn-sm btn-outline-primary"  onClick={() => handleAddToExpense(bill)}>Add to expense</button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Notifications Dropdown */}
              {notifDropdownOpen && (
                <div className="dropdown-menu dropdown-menu-end show"
                  style={{ position: 'absolute', top: '100%', right: 0, minWidth: '300px', maxHeight: '300px', overflowY: 'auto' }}>
                  {loadingNotifs ? (
                    <div className="dropdown-item text-muted">Loading notifications...</div>
                  ) : notifications.length === 0 ? (
                    <div className="dropdown-item text-muted">No new notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div className="dropdown-item d-flex justify-content-between align-items-start" key={notif.id}>
                        <div>
                          <strong>{notif.type}</strong>
                          <div className="text-muted small">{notif.message}</div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => markAsRead(notif.id)}
                        >
                          Mark Read
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="p-3">
          {/* Main page content here */}
        </div>
      </div>
    </div>
  );
}

export default Navheader;

