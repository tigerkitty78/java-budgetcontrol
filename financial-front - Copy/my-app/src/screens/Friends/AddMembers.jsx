import React from "react";
import { useParams } from "react-router-dom";
import FriendList from "../Friends/FriendList"; // Reusing FriendList

const AddMembers = () => {
  const { groupId } = useParams();
  return (
    <div>
      <h2>Add Members to Group {groupId}</h2>
      <FriendList groupId={groupId} />
    </div>
  );
};

export default AddMembers;
