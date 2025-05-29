
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getExpenseById, modifyExpense } from "../../Redux/ExpenseSlice";
import { FaMoneyBillWave, FaClipboard, FaTags, FaCalendarAlt, FaSave } from "react-icons/fa";

function ExpenseByID() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedExpense, isLoading, error } = useSelector((state) => state.expenseSlice);

    const [expenseData, setExpenseData] = useState({
        amount: "",
        description: "",
        category: "",
        date: "",
    });

    useEffect(() => {
        console.log("Expense ID from URL:", id);
        

        if (id) {
            dispatch(getExpenseById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        console.log("Selected Expense from Redux:", selectedExpense);
        if (selectedExpense) {
            setExpenseData({
                amount: selectedExpense.amount || "",
                description: selectedExpense.description || "",
                category: selectedExpense.category || "",
                date: selectedExpense.date ? selectedExpense.date.split("T")[0] : "",
            });
        }
    }, [selectedExpense]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData({ ...expenseData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const expenseId = Number(id);
        
        if (!expenseId) {
            console.error("Expense ID is invalid. Cannot update expense.");
            return;
        }

        dispatch(modifyExpense({ expenseId, expenseData }))
            .then(() => navigate("/expense"))
            .catch((error) => console.error("Update failed:", error));
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: "500px" }}>
                {error}
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ maxWidth: "800px" }}>
            <div className="text-center mb-5">
                {/* <div className="mx-auto mb-4 bg-success bg-opacity-10 p-4 rounded-circle d-inline-flex align-items-center justify-content-center">
                    <FaMoneyBillWave className="text-success" size={40} />
                </div> */}
                <h1 className="fw-bold text-success mb-2">Edit Expense</h1>
                <p className="text-muted">Update your expense details below</p>
            </div>

            <div className="card border-0 shadow-sm"style={{transform:'none' ,transition:'none'}}>
                <div className="card-header bg-success bg-opacity-10 border-0 py-3">
                    <h2 className="fw-bold text-success mb-0">Expense Information</h2>
                </div>

                {selectedExpense && (
                    <form onSubmit={handleSubmit}>
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-muted d-flex align-items-center">
                                    <FaMoneyBillWave className="me-2" /> Amount
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">LKR</span>
                                    <input
                                        type="number"
                                        name="amount"
                                        className="form-control py-2"
                                        style={{ borderLeft: "none" }}
                                        value={expenseData.amount}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-muted d-flex align-items-center">
                                    <FaClipboard className="me-2" /> Description
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    className="form-control py-2"
                                    value={expenseData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-muted d-flex align-items-center">
                                    <FaTags className="me-2" /> Category
                                </label>
                                <select
                                    name="category"
                                    className="form-select py-2"
                                    value={expenseData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    
    <optgroup label="Essentials (50-60% of Income)">
        <option value="Housing">Housing</option>
        <option value="Utilities">Utilities</option>
        <option value="Food (Groceries)">Food (Groceries)</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Transportation (Basic Commute)">Transportation (Basic Commute)</option>
    </optgroup>

    <optgroup label="Financial Stability (20-30% of Income)">
        <option value="Debt Repayment">Debt Repayment</option>
        <option value="Insurance">Insurance</option>
        <option value="Childcare & Family">Childcare & Family</option>
        <option value="Education">Education</option>
    </optgroup>

    <optgroup label="Lifestyle & Discretionary (10-20% of Income)">
        <option value="Entertainment">Entertainment</option>
        <option value="Personal Expenses">Personal Expenses</option>
        <option value="Gifts & Donations">Gifts & Donations</option>
        <option value="Miscellaneous">Miscellaneous</option>
    </optgroup>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-muted d-flex align-items-center">
                                    <FaCalendarAlt className="me-2" /> Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control py-2"
                                    value={expenseData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="card-footer bg-transparent border-0 py-3 d-flex justify-content-end">
                            <button
                                type="submit"
                                className="btn btn-success px-4 py-2 d-flex align-items-center"
                            >
                                <FaSave className="me-2" /> Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ExpenseByID;
