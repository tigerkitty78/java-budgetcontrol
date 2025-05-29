import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewGroup } from "../../Redux/GroupSlice";
import { useNavigate } from "react-router-dom";

const CreateGroupForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.groupSlice);
  
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createNewGroup(formData));
    setFormData({ name: "", description: "" });
    if (onClose) onClose();  // Reset form
  };
  const goBack = () =>{
    navigate(`/chat`);
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create a New Group</h2>
      {success && <p className="text-green-600">{success}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Group Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={isLoading}
          
        >
          {isLoading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
};

export default CreateGroupForm;
