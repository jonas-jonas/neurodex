import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navigation from './components/navigation/NavigationBar';
import LoadingIndicator from './components/utility/LoadingIndicator';
import { AuthContext, AuthContextProvider } from './contexts/auth';
import { PageContextProvider } from './contexts/pagecontext';
import Adminpanel from './pages/Adminpanel';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import ModelpageWrapper from './pages/Modelpage';

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <Router>
        <PageContextProvider>
          <Navigation />
          <div className="pt-16 h-screen">
            <AuthContext.Consumer>
              {value => {
                if (value.isLoadingUser) {
                  return <LoadingIndicator text="Loading..." />;
                }

                return (
                  <Switch>
                    <Route path="/model/:modelId">
                      <ModelpageWrapper />
                    </Route>
                    <Route path="/admin">
                      <Adminpanel />
                    </Route>
                    <Route path="/login">
                      <LoginPage />
                    </Route>
                    <Route path="/">
                      <Homepage />
                    </Route>
                  </Switch>
                );
              }}
            </AuthContext.Consumer>
          </div>
          <ToastContainer
            position="bottom-left"
            toastClassName="rounded shadow font-bold min-h-0 py-3"
            hideProgressBar
            closeButton={
              <button className="focus:outline-none">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            }
          />
        </PageContextProvider>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
