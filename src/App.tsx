import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import { AuthContextProvider } from './contexts/auth';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import Modelpage from './pages/Modelpage';
import { ModelContextProvider } from './contexts/modelcontext';

const App: React.FC = () => {
	return (
		<AuthContextProvider>
			<Router>
				<Navigation />
				<ModelContextProvider>
					<Switch>
						<Route path="/model/:id">
							<Modelpage />
						</Route>
						<Route path="/login">
							<LoginPage />
						</Route>
						<Route path="/">
							<Homepage />
						</Route>
					</Switch>
				</ModelContextProvider>
			</Router>
		</AuthContextProvider>
	);
};

export default App;
