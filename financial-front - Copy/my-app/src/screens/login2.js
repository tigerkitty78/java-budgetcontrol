import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../Redux/AuthSlice'; // import the login action
import { useNavigate } from 'react-router-dom';
function LoginForm() {
  const dispatch = useDispatch();
  const { error, isLoading, user } = useSelector((state) => state.auth); // Get auth state from redux store
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
  event.preventDefault();

  // Validate input fields
  if (!formData.username || !formData.password) {
    setLocalError('Please fill out all fields');
    return;
  }

  // Dispatch login action and navigate on success
  dispatch(login(formData))
    .unwrap()
    .then(() => {
      navigate('/'); // Navigate only if login is successful
    })
    .catch((error) => {
      setLocalError('Login failed. Please try again.');
      console.error(error);
    });
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      
      <br /><br />
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            {localError && (
              <div className="alert alert-danger">{localError}</div>
            )}
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            {user && (
              <div className="alert alert-success">You are logged in successfully!</div>
            )}
            <div className="card">
              <div className="card-header" style={{background:"#f0ffff"}}>
                <h2 className="text-center">Login Form</h2>
              </div>
              <div className="card-body">
                <form
                  onSubmit={handleSubmit}
                  className="form-horizontal"
                >
                  <div className="form-group mb-3">
                    <label className="control-label">Email</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      placeholder="Enter email address"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="control-label">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                      style={{background:"black"}}
                    >
                      {isLoading ? 'Logging in...' : 'Submit'}
                    </button>
                    <span> Not registered?{' '}
                      <a href="/su">Register/Signup here</a>
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

export default LoginForm;

