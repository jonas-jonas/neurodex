import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/navigation/NavigationBar';
import AccountPage from './pages/AccountPage';
import Adminpanel from './pages/Adminpanel';
import Homepage from './pages/Homepage';
import ModelpageWrapper from './pages/Modelpage';

const AuthenticatedApp = () => {
  return (
    <Router>
      <Navigation />
      <div className="pt-16 h-screen">
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
      </div>
    </Router>
  );
};

export default AuthenticatedApp;
