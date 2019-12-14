import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import { AuthContextProvider } from './contexts/auth';
import { PageContextProvider } from './contexts/pagecontext';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import Modelpage from './pages/Modelpage';

const App: React.FC = () => {
	return (
		<AuthContextProvider>
			<Router>
				<PageContextProvider>
					<Navigation />
					<Switch>
						<Route path="/model/:modelId">
							<Modelpage />
						</Route>
						<Route path="/login">
							<LoginPage />
						</Route>
						<Route path="/">
							<Homepage />
						</Route>
					</Switch>
				</PageContextProvider>
			</Router>
		</AuthContextProvider>
	);
};

export default App;
