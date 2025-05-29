import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    Age: '',
    'What is your personal income?': '',
    'How much do you save monthly?': '',
    'Do you live alone and cover your own expenses?': 1,
    'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly': '',
    'If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly': '',
    'If you live alone, How much do you spend on basic needs monthly?': '',
    'If you live with family How much do you spend on basic needs monthly?': '',
    'What is your job?': '',
    Debt: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Do you live alone and cover your own expenses?' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Prepare data to match backend format and convert to number if necessary
    const preparedData = {
      ...formData,
      Age: Number(formData.Age),
      'What is your personal income?': Number(formData['What is your personal income?']),
      'How much do you save monthly?': Number(formData['How much do you save monthly?']),
      'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly': Number(formData['If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly']),
      'If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly': Number(formData['If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly']),
      'If you live alone, How much do you spend on basic needs monthly?': Number(formData['If you live alone, How much do you spend on basic needs monthly?']),
      'If you live with family How much do you spend on basic needs monthly?': Number(formData['If you live with family How much do you spend on basic needs monthly?']),
      Debt: Number(formData.Debt)
    };

    try {
      const response = await axios.post('http://localhost	:5000/predict', preparedData);
      setResult(response.data);
    } catch (error) {
      console.error('Prediction failed:', error);
      setResult({ error: 'Failed to get prediction' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Financial Advice Predictor</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <div className="mb-3" key={key}>
            <label className="form-label">{key}</label>
            {key === 'Do you live alone and cover your own expenses?' ? (
              <select className="form-select" name={key} value={value} onChange={handleChange}>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            ) : (
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                className="form-control"
                name={key}
                value={value}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}

        <button type="submit" className="btn btn-primary">
          {loading ? 'Predicting...' : 'Get Prediction'}
        </button>
      </form>

      {result && (
        <div className="card mt-4">
          <div className="card-header">Prediction Results</div>
          <div className="card-body">
            {result.error ? (
              <div className="text-danger">{result.error}</div>
            ) : (
              <>
                {Object.entries(result).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}
                  </p>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
