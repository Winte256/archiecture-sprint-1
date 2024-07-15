import React from 'react';
import ReactDOM from 'react-dom';
import Shell from './Shell';
import './index.css';
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'));