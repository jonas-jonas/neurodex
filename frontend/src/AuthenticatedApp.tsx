import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AccountPage from './pages/AccountPage';
import Adminpanel from './pages/Adminpanel';
import Homepage from './pages/Homepage';
import ModelpageWrapper from './pages/Modelpage';

const AuthenticatedApp = () => {
  return (
    <Router>
      <Switch>
        <Route path="/model/:modelId">
          <ModelpageWrapper />
        </Route>
        <Route path="/admin">
          <Adminpanel />
        </Route>
        <Route path="/account">
          <AccountPage />
        </Route>
        <Route path="/">
          <Homepage />
        </Route>
      </Switch>
    </Router>
  );
};

export default AuthenticatedApp;
