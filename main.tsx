import React from 'react';
import ReactDOM from 'react-dom/client';
import { IDEApp } from './components/Layout/IDEApp';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IDEApp />
  </React.StrictMode>
);