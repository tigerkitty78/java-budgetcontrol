import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card, Container, Row, Col, Button, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { getAllInvestments, removeInvestment } from '../../Redux/InvestmentSlice';
 // You'll need to create this

const InvestmentDashboard = () => {
  const dispatch = useDispatch();
  const { investments, isLoading, error } = useSelector((state) => state.investmentReducer);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState('ALL');

  useEffect(() => {
    dispatch(getAllInvestments());
  }, [dispatch]);
  const colorPalette = {
    primary: "#1a7d6b",
    secondary: "#f4fdfa",
    accent: "#e8fcf5",
    text: "#2d3748",
    background: "#f4fdfa"
  };
  const chartColors = [colorPalette.primary, colorPalette.accent, '#a9f5d3', '#3eb593', '#256150'];


  // Process data for visualizations
  const processChartData = () => {
    return investments.map(inv => ({
      name: inv.investmentName,
      amount: inv.amount,
      returns: inv.returns,
      date: new Date(inv.startDate).toLocaleDateString()
    }));
  };

  const processPieData = () => {
    const typeCounts = investments.reduce((acc, inv) => {
      // Assuming investmentType is available in your data
      const type = inv.investmentType || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  };

  if (isLoading) return (
    <div className="text-center mt-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2">Loading Investments...</p>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: '500px' }}>
      Error loading investments: {error.message}
    </div>
  );

  return (
    <Container fluid className="py-4" style={{ backgroundColor: colorPalette.background }}>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center p-4 rounded-3" style={{
            backgroundColor: colorPalette.accent,
            border: `2px solid ${colorPalette.primary}`
          }}>
            <div>
              <h2 className="display-6 mb-3" style={{ color: colorPalette.primary }}>
                Investment Portfolio
              </h2>
              <div className="d-flex gap-3">
                <Badge className="fs-6" style={{ 
                  backgroundColor: colorPalette.primary,
                  color: colorPalette.secondary
                }}>
                  Total: {investments.length}
                </Badge>
                <Badge className="fs-6" style={{ 
                  backgroundColor: colorPalette.primary,
                  color: colorPalette.secondary
                }}>
                  Value: ${investments.reduce((sum, inv) => sum + Number(inv.amount), 0).toLocaleString()}
                </Badge>
              </div>
            </div>
            {/* <Button 
              variant="primary" 
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: colorPalette.primary,
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px'
              }}
            >
              + Add Investment
            </Button> */}
          </div>
        </Col>
      </Row>

      {/* Summary Row */}
      <Row className="mb-4 g-4">
        <Col md={4}>
          <Card className="h-100 shadow border-0" style={{ borderRadius: '16px' }}>
            <Card.Body style={{ backgroundColor: colorPalette.secondary }}>
              <h5 style={{ color: colorPalette.primary }}>Portfolio Metrics</h5>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between" style={{ backgroundColor: 'transparent' }}>
                  <span style={{ color: colorPalette.text }}>Avg Return</span>
                  <strong style={{ color: colorPalette.primary }}>
                    {investments.reduce((sum, inv) => sum + Number(inv.interestRate), 0) / investments.length || 0}%
                  </strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between" style={{ backgroundColor: 'transparent' }}>
                  <span style={{ color: colorPalette.text }}>Total Returns</span>
                  <strong style={{ color: colorPalette.primary }}>
                    +${investments.reduce((sum, inv) => sum + Number(inv.returns), 0).toLocaleString()}
                  </strong>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="h-100 shadow border-0" style={{ borderRadius: '16px' }}>
            <Card.Body style={{ backgroundColor: colorPalette.secondary }}>
              <h5 style={{ color: colorPalette.primary }}>Portfolio Growth</h5>
              <div style={{ height: '300px' }}>
                <LineChart width={800} height={300} data={processChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colorPalette.accent} />
                  <XAxis dataKey="date" stroke={colorPalette.text} />
                  <YAxis stroke={colorPalette.text} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: colorPalette.background,
                      borderColor: colorPalette.primary,
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke={colorPalette.primary} 
                    strokeWidth={2}
                    dot={{ fill: colorPalette.primary }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="returns" 
                    stroke={colorPalette.accent} 
                    strokeWidth={2}
                    dot={{ fill: colorPalette.accent }}
                  />
                </LineChart>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Investments List */}
      <Row className="g-4">
        {investments.map((investment) => (
          <Col key={investment.id} md={6} lg={4}>
            <Card className="h-100 shadow-sm" style={{ 
              border: 'none',
              borderRadius: '16px',
              transition: 'transform 0.3s ease',
              ':hover': { transform: 'translateY(-5px)' }
            }}>
              <Card.Header className="d-flex justify-content-between align-items-center" style={{
                backgroundColor: colorPalette.primary,
                color: colorPalette.secondary,
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px'
              }}>
                <h5 className="mb-0">{investment.investmentName}</h5>
                <Badge style={{ 
                  backgroundColor: investment.riskLevel === 'HIGH' ? '#dc3545' : colorPalette.accent,
                  color: investment.riskLevel === 'HIGH' ? 'white' : colorPalette.text
                }}>
                  {investment.riskLevel}
                </Badge>
              </Card.Header>
              <Card.Body style={{ backgroundColor: colorPalette.secondary }}>
                <ListGroup variant="flush">
                  {[
                    { label: 'Amount', value: `$${investment.amount.toLocaleString()}` },
                    { label: 'Duration', value: `${investment.duration} months` },
                    { label: 'Maturity', value: new Date(investment.maturityDate).toLocaleDateString() },
                    { label: 'Returns', value: `+$${investment.returns?.toLocaleString() || '0'}` }
                  ].map((item, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between" style={{ backgroundColor: 'transparent' }}>
                      <span style={{ color: colorPalette.text }}>{item.label}</span>
                      <strong style={{ color: colorPalette.primary }}>{item.value}</strong>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end gap-2" style={{ 
                backgroundColor: colorPalette.accent,
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px'
              }}>
                {/* <Button 
                  variant="outline" 
                  size="sm"
                  style={{
                    color: colorPalette.primary,
                    borderColor: colorPalette.primary
                  }}
                >
                  Edit
                </Button> */}
                <Button 
                  variant="outline" 
                  size="sm"
                  style={{
                    color: '#dc3545',
                    borderColor: '#dc3545'
                  }}
                  onClick={() => dispatch(removeInvestment(investment.id))}
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Type Distribution Chart */}
      <Row className="mt-4">
        <Col md={6}>
          <Card className="shadow border-0" style={{ borderRadius: '16px' }}>
            <Card.Body style={{ backgroundColor: colorPalette.secondary }}>
              <h5 style={{ color: colorPalette.primary }}>Investment Distribution</h5>
              <div style={{ height: '300px' }}>
                <PieChart width={600} height={300}>
                  <Pie
                    data={processPieData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    label
                  >
                    {processPieData().map((entry, index) => (
                      <Cell key={index} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: colorPalette.background,
                      borderColor: colorPalette.primary,
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InvestmentDashboard;