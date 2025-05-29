import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../../Redux/FriendSlice";
import { addMembersToGroup } from "../../Redux/GroupSlice";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const FriendList = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams(); // Get Group ID from URL
  const { friends, isLoading, error } = useSelector((state) => state.friendSlice);

  useEffect(() => {
    dispatch(fetchFriends());
  }, [dispatch]);

  const handleAddToGroup = (friendId) => {
    dispatch(addMembersToGroup({ groupId, userIds: [friendId] }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container py-4" style={{ backgroundColor: "#e6f2e6", minHeight: "100vh" }}>
      <h5>Friends List</h5>
      {friends.length === 0 ? (
        <div>No friends found.</div>
      ) : (
        friends.map((friend) => (
          <div className="card mt-4 p-3 shadow-sm" key={friend.id}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{friend.fullName ? friend.fullName : friend.username}</strong>
                <br />
                <small className="text-muted">{friend.email}</small>
              </div>
              <div>
                <button className="btn btn-primary" onClick={() => handleAddToGroup(friend.id)}>
                  Add to Group
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendList;

