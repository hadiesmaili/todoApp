import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import 'reset-css';
import 'normalize.css';
import './index.css';

const App = lazy(() => import('./pages/App'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
