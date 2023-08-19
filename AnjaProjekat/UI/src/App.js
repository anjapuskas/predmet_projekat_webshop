import AppRoutes from 'routes/AppRoutes';
import './App.css';
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AppRoutes/>
      <ToastContainer />
    </LocalizationProvider>
  );
}

export default App;
