import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getSavingsbyID, modifySaving } from "../../Redux/SavingsSlice";
import { FaMoneyBillWave, FaCalendarAlt, FaSave } from "react-icons/fa";

const EditSavingGoal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const savingId = Number(id);

  const { savings, isLoading, error } = useSelector((state) => state.savingSlice);
  const [formData, setFormData] = useState({
    currentBalance: "",
  });

  useEffect(() => {
    if (!isNaN(savingId)) {
      dispatch(getSavingsbyID(savingId));
    }
  }, [dispatch, savingId]);

  useEffect(() => {
    if (savings) {
      setFormData({
        currentBalance: savings.currentBalance || "",
      });
    }
  }, [savings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedSaving = {
      currentBalance: parseFloat(formData.currentBalance),
    };
    dispatch(modifySaving({ savingId, savingData: updatedSaving }));
    navigate("/savingslist"); // optional: add redirect after update
  };

  if (isLoading) return <p className="text-center text-muted">Loading...</p>;
  if (error) return <p className="text-center text-danger">Error: {error.message || "Failed to load saving goal."}</p>;
  if (!savings) return <p className="text-center text-danger">Saving goal not found.</p>;

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success mb-2">Edit Saving Goal</h1>
        <p className="text-muted">Update your saving goal details</p>
      </div>

      <div className="card border-0 shadow-sm" style={{transform:'none' ,transition:'none'}}>
        <div className="card-header bg-success bg-opacity-10 border-0 py-3">
          <h2 className="fw-bold text-success mb-0">Goal Information</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body p-4">
            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaMoneyBillWave className="me-2" /> Saved Amount
              </label>
              <input
                type="number"
                name="currentBalance"
                className="form-control py-2"
                value={formData.currentBalance}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted d-flex align-items-center">
                <FaCalendarAlt className="me-2" /> Start Date
              </label>
              <input
                type="text"
                className="form-control py-2"
                value={new Date(savings.startDate).toLocaleDateString()}
                disabled
              />
            </div>
          </div>

          <div className="card-footer bg-transparent border-0 py-3 d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-success px-4 py-2 d-flex align-items-center"
            >
              <FaSave className="me-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSavingGoal;

