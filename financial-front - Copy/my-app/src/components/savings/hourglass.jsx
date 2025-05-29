import React, { useEffect , useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSavingsbyID } from "../../Redux/SavingsSlice";
import { useParams } from "react-router-dom";

const Hourglass = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const savingId = Number(id);
  
    // Get savings state from Redux
    const { savings, isLoading, error } = useSelector((state) => state.savingSlice);
  
    // 1. Fetch savings data (unconditional useEffect)
    useEffect(() => {
      if (!isNaN(savingId)) {
        dispatch(getSavingsbyID(savingId));
      }
    }, [dispatch, savingId]);
  
    // 2. Calculate sandFlowSpeed safely (memoized)
    // Inside useMemo (updated formula)
const sandFlowSpeed = useMemo(() => {
    if (!savings) return 30; // Fallback duration (30s)
  
    const startDate = new Date(savings.startDate);
    const deadline = new Date(savings.deadline);
    const today = new Date();
  
    // Handle negative remaining time (deadline passed)
    if (today > deadline) return 30; // Fallback
  
    const totalDuration = deadline - startDate;
    const remainingTime = deadline - today;
  
    // New formula: Longer base duration + multiplier
    return Math.max((remainingTime / totalDuration) * 90, 5); // Min 5s, scale up slower
  }, [savings?.startDate, savings?.deadline]);
  
    // 3. Update CSS variable (unconditional useEffect)
    useEffect(() => {
      document.documentElement.style.setProperty("--time", `${sandFlowSpeed}s`);
    }, [sandFlowSpeed]); // Runs only when speed changes
  
    // ⚠️ Conditional returns MUST come AFTER all Hooks
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!savings) return <p>Saving goal not found.</p>;
  

  return (
    <div className="bg-[#e6f0e6] p-6 flex flex-col items-center min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow-md w-[80%] max-w-lg flex items-center">
        <img src="/assets/hourglass.png" alt="Hourglass" className="w-16 h-16" />
        <p className="text-green-700 text-lg font-semibold ml-4">{savings.goalName}</p>
      </div>

      <div className="hourglass">
        <div className="top"></div>
        <div className="bottom"></div>
      </div>

      <div className="bg-white p-6 mt-6 rounded-2xl shadow-md w-[80%] max-w-lg">
        <div className="border p-4 rounded-lg">
          <p className="text-gray-700 text-sm"><strong>Target Amount:</strong> ${savings.targetAmount}</p>
          <p className="text-gray-700 text-sm"><strong>Saved Amount:</strong> ${savings.savedAmount}</p>
          <p className="text-gray-700 text-sm"><strong>Start Date:</strong> {new Date(savings.startDate).toLocaleDateString()}</p>
          <p className="text-gray-700 text-sm"><strong>Deadline:</strong> {new Date(savings.deadline).toLocaleDateString()}</p>
          <p className="text-gray-700 text-sm"><strong>Frequency:</strong> {savings.frequency}</p>
        </div>
      </div>
    </div>
  );
};

export default Hourglass;


