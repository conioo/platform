import React from 'react';
import ReactDOM from 'react-dom/client';
import Hub from './components/Hub';
import './css/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.Fragment>
    <Hub />
  </React.Fragment>
);