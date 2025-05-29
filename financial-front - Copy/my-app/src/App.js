import logo from './logo.svg';
import './App.css';
import Navbar from './components/navbar';
import React, { useState } from "react";
import Card from './components/card';
import DoughnutChart from './components/donutchart';
import StoreLocator from './components/storelocator';
import StorLocator from './components/getlocation';
import Navheader from './components/navheader';
import  Carousel  from './components/carousel';
import { BrowserRouter as Router, Routes, Route,useLocation  } from 'react-router-dom';
import Home from './screens/home';
import Payment from './screens/payment ';
import Expense from './screens/addexpense';
import SavingPlan from './screens/createsavingplan';
import AIpage from './screens/aipage';
import Com from './components/combankscrape';
import Income from './screens/addincome';
import LoginForm from './screens/login2';
import ExpensesList from './components/EXpenses/expenseList'
import StoreLocatorr from './components/Location/NearestStore'
import  ExpenseGraphs from './components/expenseLineGraph'
import CardGrid from './screens/Expense/ExpenseLanding'
import CardGridIn from './screens/Income/IncomeLanding'
import IncomeList from './components/Income/IncomeList'
import SignupForm from './screens/signup'
import ExpenseFilter from './screens/display'
import OverviewPredictions from './screens/Expense/ExpensePredictions'
import FriendList from './screens/Friends/FriendList'
import ExpenseTotalsDisplay from './screens/Expense/CategoryTotals'
import PendingRequests from './screens/Friends/PendingReqList'
import BudgetForm from './screens/onboarding/page1'
import AnimatedCat from './components/animations/cat'
import GroupList from './screens/Groups/DisplayGroups';
import CreateGroupForm from './screens/Groups/createGroup';
import ChatUI from './screens/Chat/chatpage'
import ChatComponent from './screens/Chat/chat';
import ChatComponent2 from './screens/Chat/chat2';
import WebSocketComponent from './screens/Chat/ws';
import ExpenseByID from './screens/Expense/ExpenseByID'
import SavingsList from './screens/savings/diaplaysavings'
import SavingsForm from './screens/savings/inputsavings'
import SavingGoalCard from './screens/savings/savingsbyID'
import SavingProgress from './components/savings/progressbar'
import Hourglass from './components/savings/hourglass'
import HeatmapTracker from './components/heatmap/heatmap'
import HeatmapViewer from './components/heatmap/heatmapviewer' 
import CseData from './components/CSE/CSEtrade-summary'
import GroupPage from "./screens/Groups/GroupPage";
import AddMembers from "./screens/Friends/AddMembers";
import GroupSavingsGoalsList from "./screens/Groups/DisplayGroupSavings";
import GroupSavingsGoal from "./screens/Groups/GroupSavingGraph"
import IncomeForm from "./screens/Income/InputIncome"
import InvestmentGoalForm from "./screens/Investments/InputInvGoal"
import InvestmentGoalList from "./screens/Investments/InvGoalDisplay"
import  CardGridInv from "./screens/Investments/InvDash"
import InvestmentGoalsChart from "./screens/Investments/InvestmentGoalCharts"
import OverviewForecast from "./components/EXpenses/expForecastChart"
import GoogleAuthButton from "./components/GmailAuth/Gmailauth"
import NotificationListener from "./components/Notifications/nofifs"
import SavingGoalList  from "./screens/savings/SavingGoalsDisplay"
import OCRExpense from "./screens/Expense/ExpenseOCR"
import CreateGroupGoalForm from "./screens/GroupSaving.jsx/GroupSavingForm"
import NotificationPanel from "./components/Notifications/notifpanel"
import LimitForm from "./screens/Expense/LimitForm"
import InvestmentForm from "./screens/Investments/InvestmentInput"
import InvestmentDashboard from "./screens/Investments/InvestmentDisplay"
import Profile from "./screens/User/UserProfile"
import SavingCardGrid from "./screens/savings/savingDash"
import StockPredictionsDashboard from "./screens/Investments/Investment Oppotunity/StockMarketChart"
import UtilitySelection from "./screens/pages/Util"
import SplitPayment from "./screens/pages/Split"
import PaymentPortal from "./screens/pages/Payment"
import HomePage from "./screens/pages/Home"
import  SplitPaymentPage from "./screens/pages/splitpay"
import PredictionForm from "./screens/Investments/InvestmentAI"
import UpdateSavingsGoalForm from "./screens/savings/savingGoalBYID"
import SavingsGoalForm from "./screens/savings/SavingsGaolForm"
import  IncomeByID from "./screens/Income/IncomebyID"
import StripeOnboardingForm from "./screens/stripe/stripeOnboard"
import StripeChargeForm from "./screens/stripe/stripeCharge"
import UtilAddForm from "./screens/Expense/UtilityBillAdd"
import  FriendsDashboard from "./screens/Friends/FriendDash"
import BloomingFlowers from "./screens/Investments/flower"

const App = () => {
  const location = useLocation();
  const hideNavbarOnRoutes = ["/1",]; // Add any other paths where navbar should be hidden
  const [isHeatmapVisible, setHeatmapVisible] = useState(false);

  const toggleHeatmap = () => {
    setHeatmapVisible((prev) => !prev); // Toggle heatmap visibility
  };
  return (
    
      <div >
        {!hideNavbarOnRoutes.includes(location.pathname) && <Navheader />}
        {/* Heatmap Tracker always active */}
        
        <div className="desktop-margin-left">
        <Routes>
          <Route path="/su" element={<SignupForm />} />
          <Route path="/" element={<Home />} />
          <Route path="/pay" element={<Payment />} />

          <Route path="/ex" element={<Expense />} />
          <Route path="/expense/:id" element={<ExpenseByID/>} />

          <Route path="/sav" element={<SavingPlan />} />
          <Route path="/ai" element={<AIpage />} />
          <Route path="/com" element={<Com />} />
          <Route path="/income" element={<Income />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/expense" element={<ExpensesList />} />
          <Route path="/loc" element={<StoreLocator />} />
          <Route path="/loca" element={<StorLocator />} />
          <Route path="/loci" element={<StoreLocatorr />} />
          <Route path="/line" element={<ExpenseGraphs />} />
          <Route path="/expland" element={<CardGrid />} />
          <Route path="/Inland" element={<CardGridIn />} />
          <Route path="/incomelist" element={<IncomeList />} />
          <Route path="/dis" element={<ExpenseFilter />} />
          <Route path="/pred" element={<OverviewPredictions />} />
          <Route path="/tot" element={<ExpenseTotalsDisplay />} />
          <Route path="/group/:groupId/friends" element={<FriendList />} />
          <Route path="/pfriends" element={<PendingRequests />} />
          <Route path="/1" element={<BudgetForm />} />
          <Route path="/cat" element={<AnimatedCat/>}/>
          <Route path="/groups" element={<GroupList/>}/>
          <Route path='/groupForm' element={<CreateGroupForm/>}/>
          <Route path='/chat' element={<ChatUI/>}/>
          <Route path='/chatw' element={<ChatComponent2/>}/>
          <Route path='/savingslist' element={<SavingsList/>}/>
          <Route path='/savingsin' element={<SavingsForm/>}/>
          <Route path='/savingsprog' element={<SavingProgress/>}/>
          <Route path='/w' element={<WebSocketComponent/>}/>
          <Route path='/savingbyid/:id' element={<SavingGoalCard/>}/>
          <Route path='/hg/:id' element={<Hourglass/>}/>
          <Route path='/heatmap' element={<HeatmapViewer/>}/>
          <Route path="/cha/:senderId" element={<ChatComponent isGroup={false} />} />
          <Route path='/CSE-tradesummary' element={<CseData/>}/>
          <Route path="/group/:groupId" element={<GroupPage />} />
          <Route path="/add-members/:groupId" element={<AddMembers />} />
        
          <Route path="/invgoalList" element={< InvestmentGoalList />} />
          <Route path="/invgoalInput" element={< InvestmentGoalForm />} />
          <Route path="/inputList" element={< IncomeList />} />
          <Route path="/inputIncome" element={< IncomeForm />} />
          <Route path="/groupgraph" element={< GroupSavingsGoal />} />
          <Route path="/group/:groupId/goals" element={<GroupSavingsGoal />} />
          <Route path="/invdash" element={<  CardGridInv />} />
        
          <Route path="/invgoalcharts" element={<  InvestmentGoalsChart/>} />
          <Route path="/gmailauth" element={<  GoogleAuthButton/>} />
          <Route path="/notifs" element={<  NotificationPanel/>} />
          <Route path="/invform" element={< InvestmentForm/>} />
        
          <Route path="/invdisplay" element={<   InvestmentDashboard/>} />
          <Route path="/limit" element={< LimitForm/>} />
          <Route path="/expForecast" element={<   OverviewForecast/>} />
          <Route path="/websocket" element={<NotificationListener/>}/>
          <Route path="/group/:groupId/add-goal" element={<CreateGroupGoalForm />} />
          <Route path="/ocrform" element={< OCRExpense/>}/>
          <Route path="/savingGoalList" element={<SavingGoalList />}/>
   
          <Route path="/savdash" element={<        SavingCardGrid/>}/>
          <Route path="/user" element={< Profile />}/>
          
          <Route path="/stchart" element={< StockPredictionsDashboard />}/>

          <Route path="/util" element={<UtilitySelection />} />
        <Route path="/group/:groupId/split-expense" element={<SplitPayment />} />
        <Route path="/payment" element={<PaymentPortal />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/invAI" element={<PredictionForm />} />
       
          <Route path="/income/:id" element={< IncomeByID />} />
        <Route path="/sginput" element={< SavingsGoalForm />} />
        <Route path='/savingGoalByID/:id' element={< UpdateSavingsGoalForm/>}/>
        <Route path="/sp" element={<SplitPaymentPage/>} />
        <Route path="/stripe" element={<StripeOnboardingForm />} />
        <Route path="/stripep" element={< StripeChargeForm />} />
         <Route path="/friendDash" element={<  FriendsDashboard />} />
         <Route path="/flower" element={< BloomingFlowers />} />
      
        <Route path="/utilAdd" element={<  UtilAddForm />} />
        </Routes>
        </div>
      </div>
   
  );
};

export default App;
