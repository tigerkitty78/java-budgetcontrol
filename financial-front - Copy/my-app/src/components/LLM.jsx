import React, { useState } from 'react';
import { Card, Form, Button, Stack } from 'react-bootstrap';

const primaryColor = '#1a7d6b';
const accentColor = '#94f7d7';

const FinancialAdviceForm = () => {
  const [formData, setFormData] = useState({
    isEmployed: false,
    job: '',
    hasVehicle: false,
    livesAlone: false,
    householdSize: 1
  });
const [loading, setLoading] = useState(false);

  const [advice, setAdvice] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: !formData[field],
      ...(field === 'livesAlone' && { householdSize: 1 })
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('jwtToken');
  setLoading(true); // Start spinner

  try {
    const res = await fetch('http://localhost	:8080/generateLLM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        are_you_employed: formData.isEmployed ? 'yes' : 'no',
        job: formData.job,
        have_vehicle: formData.hasVehicle ? 'yes' : 'no',
        live_alone: formData.livesAlone ? 'yes' : 'no',
        people_in_house: formData.householdSize
      })
    });

    const data = await res.json();
    setAdvice(data);
    console.log("advice isssssssss", data)
    setShowDetails(true);
  } catch (err) {
    console.error('Error:', err);
    setAdvice({ error: "Failed to get advice" });
  } finally {
    setLoading(false); // Stop spinner
  }
};


  return (
    <Card className="border-0 shadow-sm" style={{ 
      borderRadius: '12px',
      borderTop: `3px solid ${primaryColor}`
    }}>
      <Card.Body className="p-3">
        <Stack gap={3}>
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: `${primaryColor}20`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: primaryColor }}>🤖</span>
            </div>
            <h6 className="mb-0" style={{ color: primaryColor }}>Quick Financial Check</h6>
          </div>

          <Form onSubmit={handleSubmit}>
            <Stack gap={3}>
              <div className="d-flex gap-3 flex-wrap">
                <Form.Check 
                  type="switch"
                  id="employed-switch"
                  label="Employed"
                  checked={formData.isEmployed}
                  onChange={handleToggle('isEmployed')}
                />

                <Form.Check 
                  type="switch"
                  id="vehicle-switch"
                  label="Has Vehicle"
                  checked={formData.hasVehicle}
                  onChange={handleToggle('hasVehicle')}
                />

                <Form.Check 
                  type="switch"
                  id="alone-switch"
                  label="Lives Alone"
                  checked={formData.livesAlone}
                  onChange={handleToggle('livesAlone')}
                />
              </div>

              {formData.isEmployed && (
                <Form.Control
                  placeholder="Job title"
                  value={formData.job}
                  onChange={(e) => setFormData({...formData, job: e.target.value})}
                  size="sm"
                />
              )}

              {!formData.livesAlone && (
                <div className="d-flex align-items-center gap-2">
                  <Form.Label className="mb-0">Household:</Form.Label>
                  <Form.Select 
                    value={formData.householdSize}
                    onChange={(e) => setFormData({...formData, householdSize: e.target.value})}
                    size="sm"
                    style={{ width: '80px' }}
                  >
                    {[2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} people</option>
                    ))}
                  </Form.Select>
                </div>
              )}

           <Button 
  variant="outline-primary"
  type="submit"
  size="sm"
  style={{ 
    borderColor: primaryColor,
    color: primaryColor,
    width: 'fit-content'
  }}
  disabled={loading}
>
  {loading ? (
    <>
      <span 
        className="spinner-border spinner-border-sm me-2" 
        role="status" 
        aria-hidden="true"
      ></span>
      Generating...
    </>
  ) : 'Generate Advice'}
</Button>

            </Stack>
          </Form>

          {showDetails && advice?.strategies && (
            <div className="mt-2 p-2 rounded" style={{ 
              backgroundColor: '#f8f9fa',
              fontSize: '0.9em'
            }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Recommendations:</span>
                <Button 
                  variant="link"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  style={{ color: primaryColor }}
                >
                  Hide
                </Button>
              </div>
              
              {advice.strategies.map((item, index) => (
                <div key={index} className="mb-2 p-2 border rounded">
                  <div className="fw-bold text-primary">{item.cause}</div>
                  <div className="text-muted">{item.effect}</div>
                </div>
              ))}
            </div>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default FinancialAdviceForm;