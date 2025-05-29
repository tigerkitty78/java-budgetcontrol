import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../Redux/GroupSlice";
import { useNavigate } from "react-router-dom";

const GroupList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groups, isLoading, error } = useSelector((state) => state.groupSlice);

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Ensure groups is an array
  if (!Array.isArray(groups)) {
    return <p>No groups available</p>;
  }

  return (
    <div>
      <h2>Your Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.id} onClick={() => navigate(`/group/${group.id}`)} style={{ cursor: "pointer", color: "blue" }}>
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
