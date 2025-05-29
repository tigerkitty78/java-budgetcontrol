import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../Redux/AuthSlice';

function SignupForm() {
  const dispatch = useDispatch();
  const { error, isLoading, signupSuccess } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    admin:false
     // admin set to false by default
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.fullName || !formData.email || !formData.username || !formData.password) {
      setLocalError('Please fill out all fields');
      return;
    }

    dispatch(signup(formData));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  return (
    <div>
      <br /><br />
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            {localError && <div className="alert alert-danger">{localError}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {signupSuccess && <div className="alert alert-success">{signupSuccess}</div>}
            <div className="card">
              <div className="card-header" style={{ background: "#f0ffff" }}>
                <h2 className="text-center">Signup Form</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="form-horizontal">
                  <div className="form-group mb-3">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Optional: Admin checkbox if needed */}
                  {/* <div className="form-group mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="admin"
                      checked={formData.admin}
                      onChange={handleChange}
                      disabled // always false by default, don't allow user to change
                    />
                    <label className="form-check-label">Admin</label>
                  </div> */}
                  <div className="form-group mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                      style={{ background: "black" }}
                    >
                      {isLoading ? 'Signing up...' : 'Register'}
                    </button>
                    <span> Already have an account?{' '}
                      <a href="/login">Login here</a>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
