import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../Redux/UserSlice';
import { requestFriend, resetSuccess } from '../../Redux/FriendSlice';

export default function UserList() {
  const dispatch = useDispatch();

  const { userList, isLoading: loadingUsers, error: usersError } = useSelector(state => state.userSlice);
  const { isLoading: loadingFriendReq, error: friendError, success } = useSelector(state => state.friendSlice);

  // To disable button or show loading state per user, keep track of which user requested friend
  const [requestingUserId, setRequestingUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Clear success message after showing briefly
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(resetSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleSendRequest = (username, userId) => {
    setRequestingUserId(userId);
    dispatch(requestFriend(username)).finally(() => setRequestingUserId(null));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">User List</h2>

      {loadingUsers && <p>Loading users...</p>}
      {usersError && <p className="text-red-600">Error: {usersError}</p>}
      {friendError && <p className="text-red-600">Friend Request Error: {friendError}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {!loadingUsers && !usersError && userList.length === 0 && <p>No users found.</p>}

      {!loadingUsers && !usersError && userList.length > 0 && (
        <ul className="list-disc pl-5 space-y-4">
          {userList.map(user => (
            <li key={user.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
              <div>
                <p><strong>Name:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <button
                disabled={loadingFriendReq && requestingUserId === user.id}
                onClick={() => handleSendRequest(user.username, user.id)}
                className="btn btn-sm btn-outline-primary"
              >
                {loadingFriendReq && requestingUserId === user.id ? 'Sending...' : 'Send Friend Request'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
