import { useSelector } from 'react-redux';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import React, { useEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Carousel from "../components/carousel";

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch} from "react-redux";
import { getIncomes } from "../Redux/IncomeSlice";
import { getSavings } from '../Redux/SavingsSlice';
import { getAllInvestments } from '../Redux/InvestmentSlice';
import WeatherCard from '../components/animations/weathercard'
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import FinancialAdviceForm from '../components/LLM'
import SentimentPredictions from "../components/AI/sentiment"
const localizer = momentLocalizer(moment);
const primaryColor = '#1a7d6b';
const accentColor = '#94f7d7';
const lightAccent = '#c8fcec';
const contrastColor = '#ff6b6b';
const accentColor2 ='#fac77f';
function Home() {
 const { incomes, isLoading, error } = useSelector((state) => state.IncomeReducer);
  const { expenses } = useSelector((state) => state.expenseSlice);
  const { savings } = useSelector((state) => state.savingSlice);
  const { investments} = useSelector((state) => state.investmentReducer);
  const dispatch = useDispatch();
const navigate = useNavigate();
useEffect(() => {
  dispatch(getIncomes()); // Ensure this fetch action is triggered
}, []);
useEffect(() => {
  dispatch(getAllInvestments()); // Ensure this fetch action is triggered
}, []);
useEffect(() => {
  dispatch(getSavings()); // Ensure this fetch action is triggered
}, []);
const [formData, setFormData] = useState({
  are_you_employed: '',
  job: '',
  have_vehicle: '',
  live_alone: '',
  people_in_house: ''
});

const [advice, setAdvice] = useState('');
 const token = localStorage.getItem('jwtToken'); 
const handleChange = (field) => (e) => {
  setFormData({ ...formData, [field]: e.target.value });
};

const ynavigate = async (e) =>{
    navigate('/payment');
}
const handleAdviceSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('jwtToken');

  try {
    const res = await fetch('http://localhost	:8080/generateLLM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch advice');
    }

    setAdvice(data); // ✅ Store the advice
  } catch (err) {
    console.error('Error fetching advice:', err);
    setAdvice(null);
  }
};


  const calendarEvents = [
    ...expenses.map(expense => ({
      title: 'Expense',
      start: new Date(expense.date),
      end: new Date(expense.date),
      type: 'expense'
    })),
      ...investments.map(investment => ({
      title: 'Investment',
      start: new Date(investment.startDate),
      end: new Date(investment.startDate),
      type: 'investment'
    })),
    ...incomes.map(income => ({
      title: 'Income',
      start: new Date(income.inDate),
      end: new Date(income.inDate),
      type: 'income'
    })),
    ...savings.map(saving => ({
      title: 'Saving',
      start: new Date(saving.createdAt),
      end: new Date(saving.createdAt),
      type: 'saving'
    }))
  ];

  const DayComponent = ({ children, date }) => {
    const dayEvents = calendarEvents.filter(event =>
      moment(event.start).isSame(date, 'day')
    );
    return (
      <div className="h-100 position-relative" style={{backgroundColor:"green"}}>
        {children}
        <div className="d-flex justify-content-center gap-1 position-absolute bottom-0 start-0 end-0"style={{backgroundColor:"green"}}>
          {dayEvents.map((event, index) => (
            <div 
              key={index}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 
            
  event.type === 'expense' ? '#dc3545' :
  event.type === 'income' ? '#0d6efd' :
  event.type === 'saving' ? '#198754' : 
event.type === 'investment' ? '#198754':'#FFC107'
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const metrics = [
    { title: 'Total Income', value: incomes.reduce((a, b) => a + b.in_amount, 0), color: primaryColor, icon: '💰' },
    { title: 'Total Expenses', value: expenses.reduce((a, b) => a + b.amount, 0), color: contrastColor, icon: '💸' },
    { title: 'Total Savings', value: savings.reduce((a, b) => a + b.currentBalance, 0), color: accentColor, icon: '🏦' },
 { title: 'Total Investments', value: investments.reduce((a, b) => a + b.amount, 0), color: accentColor2, icon: '📈' }

    
  ];
  console.log("Total Income:", incomes.reduce((a, b) => a + b.in_amount, 0));
  console.log("Total Savings:", savings.reduce((a, b) => a + b.savedAmount, 0));
  console.log("Incomes:", incomes);
console.log("Savings:", savings);

  return (
    <div className="App bg-light" style={{ minHeight: '100vh',backgroundColor:"green" }}>
      <style>
        {`
          .rbc-month-view {
            border: 0 !important;
            background: white;
          }

          .rbc-header {
            color: ${primaryColor};
            padding: 12px 0 !important;
            border-bottom: 2px solid ${lightAccent} !important;
            font-weight: 500;
          }

          .rbc-day-bg + .rbc-day-bg {
            border-left: 1px solid ${lightAccent} !important;
          }

          .rbc-month-row {
            border-bottom: 1px solid ${lightAccent} !important;
          }

          .rbc-today {
            background-color: ${lightAccent} !important;
          }

          @media (max-width: 768px) {
            .metric-card {
              margin-bottom: 1rem;
            }
            .rbc-toolbar {
              flex-direction: column;
              gap: 1rem;
            }
          }
        `}
      </style>

      <Container fluid className="px-md-4 px-2 pt-4"style={{ backgroundColor:"#ebfaf4" }} >
        {/* Financial Overview */}
        <Row className="g-4 mb-4">

          <Col md={4}>
            <Row className="g-4 h-100">
            <Col xs={12} className="mb-3">
      <WeatherCard />
    </Col>
              {metrics.map((metric, index) => (
  <Col key={index} xs={6} sm={6}> {/* Takes half width on small+ screens */}
    <Card className="border-0 shadow-sm metric-card" style={{ borderRadius: '12px' }}>
      <Card.Body className="p-3">
        <div className="d-flex align-items-center">
          <div 
            className="rounded-circle p-2 me-3"
            style={{ 
              backgroundColor: `${metric.color}20`,
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
                          <span style={{ fontSize: '1.5rem' }}>{metric.icon}</span>
                        </div>
                        <div>
                          <h9 className="text-muted mb-1">{metric.title}</h9>
                          <b><h6 className="mb-0" style={{ color: metric.color }}>
                            LKR{metric.value.toLocaleString()}
                          </h6></b>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col md={8}>
            <Card className="h-90 border-0 shadow-sm" style={{ 
  borderRadius: '16px',
  borderTop: `3px solid ${primaryColor}`,transform:'none' ,transition:'none'
}}>
  <Card.Body className="p-3"style={{transform:'none' ,transition:'none'}}>
    <div className="d-flex justify-content-between align-items-center mb-3"style={{transform:'none' ,transition:'none'}}>
      <h6 className="mb-0" style={{ color: primaryColor ,transform:'none' ,transition:'none'}}>
        Financial Calendar
      </h6>
      <div className="d-flex gap-2">
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: contrastColor }} />
          <small className="text-muted">Expenses</small>
        </div>
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: primaryColor }} />
          <small className="text-muted">Income</small>
        </div>
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: accentColor }} />
          <small className="text-muted">Savings</small>
        </div>
      </div>
    </div>

   <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '16px' ,transform:'none' ,transition:'none'}}>

    <Calendar
      localizer={localizer}
      events={calendarEvents}
      components={{ 
        dateCellWrapper: ({ children, value }) => (
          <div className="h-100 position-relative">
            {children}
            <div className="d-flex justify-content-center gap-1 position-absolute bottom-0 start-0 end-0 pb-1">
              {calendarEvents
                .filter(event => moment(event.start).isSame(value, 'day'))
                .map((event, index) => (
                  <div 
                    key={index}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 
                        event.type === 'expense' ? contrastColor :
                        event.type === 'income' ? primaryColor :
                        event.type === 'investment' ? primaryColor :
                        event.type === 'saving' ? accentColor : lightAccent,
                    }}
                    className="calendar-dot"
                    title={`${event.type.charAt(0).toUpperCase() + event.type.slice(1)} on ${moment(event.start).format('MMM D')}`}
                  />
                ))}
            </div>
          </div>
        )
      }}
      view="month"
      views={['month']}
      style={{ 
        height: 400,
        // Add these style overrides
        '--rbc-today-color': `${primaryColor}20`, // Custom today background
        '--rbc-active-color': primaryColor, // Custom selection color
      }}
      className="border-0 custom-calendar"
    />

</Card>


  </Card.Body>
</Card>
          </Col>

          

          
        </Row>

        {/* Financial Advice Generator */}




   <Row className="mb-4">
    {/* Sentiment Predictions */}
    <Col md={6}>
      <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
        <SentimentPredictions />
        
      </Card>
    </Col>

    {/* Financial Advice Form */}
    <Col md={6}>
      <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', transform: 'none', transition: 'none' }}>
        <Card.Body className="p-4">
          <FinancialAdviceForm />
        </Card.Body>
      </Card>
    </Col>
  </Row>

        {/* Financial Trends */}
        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '16px',transform:'none' ,transition:'none' }}>
          <Card.Body className="p-4">
            <h5 className="mb-4" style={{ color: primaryColor }}>📈 Financial Trends</h5>
            <Carousel />
          </Card.Body>
        </Card>

    
        {/* <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
         <SentimentPredictions/>
        </Card>  */}
      </Container>
    </div>
  );
}

export default Home;

