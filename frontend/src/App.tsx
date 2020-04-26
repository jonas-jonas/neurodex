import React from 'react';
import { useAuth } from './contexts/AuthProvider';

const AuthenticatedApp = React.lazy(() => import('./AuthenticatedApp'));
const UnauthenticatedApp = React.lazy(() => import('./UnauthenticatedApp'));

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default App;
