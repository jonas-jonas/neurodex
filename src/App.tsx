import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import { AuthContextProvider } from './contexts/auth';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import Modelpage from './pages/Modelpage';

const App: React.FC = () => {
	return (
		<AuthContextProvider>
			<Router>
				<Navigation />
				<Switch>
					<Route path="/model">
						<Modelpage />
					</Route>
					<Route path="/login">
						<LoginPage />
					</Route>
					<Route path="/">
						<Homepage />
					</Route>
				</Switch>
			</Router>
		</AuthContextProvider>
	);
};

export default App;
