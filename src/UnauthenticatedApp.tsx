import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Navigation from './components/navigation/NavigationBar';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import LoginPage from './pages/LoginPage';

const UnauthenticatedApp = () => {
  return (
    <Router>
      <Navigation />
      <div className="pt-16 h-screen">
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/confirm-email/:id">
            <ConfirmEmailPage />
          </Route>
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default UnauthenticatedApp;
