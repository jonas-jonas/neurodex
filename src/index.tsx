import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'react-toastify/dist/ReactToastify.min.css';
import './styles/tailwind.css';
import AppProviders from './contexts/AppProviders';
import LoadingIndicator from './components/utility/LoadingIndicator';

ReactDOM.render(
  <Suspense fallback={<LoadingIndicator text="Lädt..." />}>
    <AppProviders>
      <App />
    </AppProviders>
  </Suspense>,
  document.getElementById('root')
);
