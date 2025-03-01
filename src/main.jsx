import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'

import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true,
      v7_relativeSplatPath: true,
     }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
