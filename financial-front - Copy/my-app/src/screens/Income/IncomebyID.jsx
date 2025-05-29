import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchIncomeById, modifyIncome } from "../../Redux/IncomeSlice";
import { FaMoneyBillWave, FaClipboard, FaTags, FaCalendarAlt, FaSave } from "react-icons/fa";

function IncomeByID() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedIncome, isLoading, error } = useSelector((state) => state.IncomeReducer);

    const [incomeData, setIncomeData] = useState({
        amount: "",
        description: "",
        category: "",
        date: "",
    });

    useEffect(() => {
        console.log("Income ID from URL:", id);

        if (id) {
            dispatch(fetchIncomeById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        console.log("Selected Income from Redux:", selectedIncome);
        if (selectedIncome) {
            setIncomeData({
                in_amount: selectedIncome.in_amount || "",
                in_description: selectedIncome.in_description || "",
                in_category: selectedIncome.in_category || "",
                inDate: selectedIncome.inDate ? selectedIncome.inDate.split("T")[0] : "",
            });
        }
    }, [selectedIncome]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIncomeData({ ...incomeData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const incomeId = Number(id);

        if (!incomeId) {
            console.error("Income ID is invalid. Cannot update income.");
            return;
        }

        dispatch(modifyIncome({ incomeId, incomeData }))
            .then(() => navigate("/income"))
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
                <h1 className="fw-bold text-success mb-2">Edit Income</h1>
                <p className="text-muted">Update your income details below</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-success bg-opacity-10 border-0 py-3">
                    <h2 className="fw-bold text-success mb-0">Income Information</h2>
                </div>

                {selectedIncome && (
                    <form onSubmit={handleSubmit}>
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-muted d-flex align-items-center">
                                    <FaMoneyBillWave className="me-2" /> Amount
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">$</span>
                                    <input
                                        type="number"
                                        name="in_amount"
                                        className="form-control py-2"
                                        style={{ borderLeft: "none" }}
                                        value={incomeData.in_amount}
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
                                    name="in_description"
                                    className="form-control py-2"
                                    value={incomeData.in_description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-muted d-flex align-items-center">
                                    <FaTags className="me-2" /> Category
                                </label>
                                <select
                                    name="in_category"
                                    className="form-select py-2"
                                    value={incomeData.in_category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="Salary">Salary</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Investments">Investments</option>
                                    <option value="Gifts">Gifts</option>
                                    <option value="Rental Income">Rental Income</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-muted d-flex align-items-center">
                                    <FaCalendarAlt className="me-2" /> Date
                                </label>
                                <input
                                    type="date"
                                    name="inDate"
                                    className="form-control py-2"
                                    value={incomeData.inDate}
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

export default IncomeByID;
