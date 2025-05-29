import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ExpenseFilter = () => {
  return (
    <div className="container py-4">
      <div className="card p-3 shadow-sm bg-success bg-opacity-10">
        <h5 className="mb-3">Filter By</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <label className="form-label">Date</label>
            <select className="form-select">
              <option>Select Date</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select className="form-select">
              <option>Select Category</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Month</label>
            <select className="form-select">
              <option>Select Month</option>
            </select>
          </div>
        </div>
        <div className="mt-3 p-2 bg-success text-white rounded">
          <strong>Monthly Total: 5000</strong> <br />
          <strong>Daily Total: 5000</strong>
        </div>
      </div>
      
      <div className="card mt-4 p-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="badge bg-success me-2">●</span>
            <strong>Category Description</strong>
          </div>
          <div className="fw-bold">Amount: 12.03.25</div>
          <div>
            <FontAwesomeIcon icon={faEdit} className="text-primary me-2" />
            <FontAwesomeIcon icon={faTrash} className="text-danger" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilter;
