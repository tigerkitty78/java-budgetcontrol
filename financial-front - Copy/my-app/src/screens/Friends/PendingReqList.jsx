import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingRequests,
  approveFriendRequest,
  declineFriendRequest,
} from "../../Redux/FriendSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const PendingRequests = () => {
  const dispatch = useDispatch();
  const { pendingRequests, isLoading, error } = useSelector((state) => state.friendSlice);

  useEffect(() => {
    dispatch(fetchPendingRequests());
  }, [dispatch]);

  const handleAccept = (requestId) => {
    dispatch(approveFriendRequest(requestId));
  };

  const handleDecline = (requestId) => {
    dispatch(declineFriendRequest(requestId));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container py-4" style={{ backgroundColor: "#f8d7da", minHeight: "100vh" }}>
      <h5>Pending Friend Requests</h5>
      {pendingRequests.length === 0 ? (
        <div>No pending requests.</div>
      ) : (
        pendingRequests.map((request) => (
          <div className="card mt-4 p-3 shadow-sm" key={request.id}>
            <div className="d-flex justify-content-between align-items-center">
              <strong>{request.username}</strong>
              <div>
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-success me-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAccept(request.id)}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDecline(request.id)}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingRequests;
