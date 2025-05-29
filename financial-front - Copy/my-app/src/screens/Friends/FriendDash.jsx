import React from "react";
import UserList from "../User/userlist";
import FriendList from "./FriendList";
import PendingRequests from "./PendingReqList";

const FriendsDashboard = () => {
  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Friends & Requests Dashboard</h1>
      <div className="row g-4">
        <div className="col-md-4"style={{transform:'none' ,transition:'none'}}>
          <div className="card shadow-sm h-100" style={{transform:'none' ,transition:'none'}}>
            <div className="card-body"style={{transform:'none' ,transition:'none'}}>
              <h4 className="card-title mb-3 " >All Users</h4>
              <UserList />
            </div>
          </div>
        </div>

        <div className="col-md-4"style={{transform:'none' ,transition:'none'}}>
          <div className="card shadow-sm h-100 " style={{transform:'none' ,transition:'none'}}>
            <div className="card-body"style={{transform:'none' ,transition:'none'}}>
              <h4 className="card-title mb-3">Friends</h4>
              <FriendList />
            </div>
          </div>
        </div>

        <div className="col-md-4"style={{transform:'none' ,transition:'none'}}>
          <div className="card shadow-sm h-100" style={{transform:'none' ,transition:'none'}}>
            <div className="card-body"style={{transform:'none' ,transition:'none'}}>
              <h4 className="card-title mb-3">Pending Requests</h4>
              <PendingRequests />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsDashboard;
