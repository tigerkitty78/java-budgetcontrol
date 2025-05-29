import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Redux/AuthSlice";
import {thunk} from "redux-thunk";
import expenseSlice from "./Redux/ExpenseSlice";
import LocationSlice from "./Redux/LocationSlice";
import incomeSlice from './Redux/IncomeSlice';
import friendSlice from './Redux/FriendSlice';
import groupSlice from './Redux/GroupSlice';
import chatSlice from './Redux/ChatSlice'
import savingSlice from './Redux/SavingsSlice'
import investmentGoalSlice from "./Redux/InvestmentGoalsSlice"
import savingsGoalSlice from "./Redux/SavingsGoalSlice"
import  billsSlice from "./Redux/GmailBillSlice"
import groupSavingsGoalsSlice from "./Redux/GroupSavingGoal"
import investmentReducer from './Redux/InvestmentSlice';

import userSlice from './Redux/UserSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    expenseSlice,
    LocationReducer: LocationSlice,
    IncomeReducer: incomeSlice,
    friendSlice,
    groupSlice,
    chatSlice,
    savingSlice,
    investmentGoalSlice,
    savingsGoalSlice,
    billsSlice,
    groupSavingsGoalsSlice,
    investmentReducer,
    userSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), 
});

export default store;
