import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSavings, removeSaving, modifySaving } from '../../Redux/SavingsSlice'; // Assume these actions exist
import { useNavigate } from "react-router-dom";

const SavingsList = () => {
    const dispatch = useDispatch();
    const { savings, isLoading, error } = useSelector((state) => state.savingSlice);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getSavings());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this savings goal?')) {
            dispatch(removeSaving(id));
        }
    };

    const handleUpdate = (id) => {
        if (window.confirm('Are you sure you want to edit this savings goal?')) {
            navigate(`/savingbyid/${id}`);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-teal" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger mt-4 mx-3">{error}</div>;
    }

    return (
        <div className="container mt-4" style={{ maxWidth: '800px' }}>
            <h2 className="mb-4 text-teal-800" style={{ color: '#234E52' }}>
                <i className="fas fa-piggy-bank me-2"></i>
                Your Savings 
            </h2>

            {savings.length === 0 ? (
                <div className="alert alert-info mx-3" style={{ backgroundColor: '#E6FFFA', borderColor: '#81E6D9' }}>
                    No savings goals found.
                </div>
            ) : (
                <div className="row">
                    {savings.map((saving) => (
                        <div className="col-md-12 mb-4" key={saving.id}>
                            <div className="card shadow-sm" style={{ borderColor: '#81E6D9',transform:'none' ,transition:'none' }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h3 className="card-title mb-3" style={{ color: '#285E61' }}>
                                            <i className="fa-solid fa-piggy-bank me-3" style={{ fontSize: '2rem', color: '#319795' }}></i>

                                                {saving.goalName}
                                            </h3>
                                            <div className="d-flex flex-wrap gap-4">
                                                <div>
                                                    <p className="mb-1 text-muted">Current Balance</p>
                                                    <h4 style={{ color: '#2C7A7B' }}>
                                                        LKR{parseFloat(saving.currentBalance).toFixed(2)}
                                                    </h4>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-muted">Start Date</p>
                                                    <p className="mb-0" style={{ color: '#4FD1C5' }}>
                                                        {new Date(saving.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-primary px-4 py-2 d-flex align-items-center"
                                                onClick={() => handleUpdate(saving.id)}
                                            >
                                                update <i className="fas fa-edit ms-2"></i>
                                            </button>
                                            <button
                                                className="btn btn-primary px-4 py-2 d-flex align-items-center"
                                                onClick={() => handleDelete(saving.id)}
                                            >
                                                delete <i className="fas fa-trash ms-2"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Piggy bank progress indicator */}
                                    <div className="d-flex align-items-center mt-3">
                                        <i className="fas fa-piggy-bank me-3" style={{ fontSize: '2rem', color: '#319795' }}></i>
                                        <div className="flex-grow-1">
                                            <div className="progress" style={{ height: '8px', backgroundColor: '#E6FFFA' }}>
                                                <div
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    style={{
                                                        width: `${(saving.currentBalance / saving.targetAmount) * 100}%`,
                                                        backgroundColor: '#319795'
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="d-flex justify-content-between mt-2">
                                                <small className="text-muted">Saved: ${parseFloat(saving.currentBalance).toFixed(2)}</small>
                                                {/* <small className="text-muted">Target: ${parseFloat(saving.targetAmount).toFixed(2)}</small> */}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavingsList;
