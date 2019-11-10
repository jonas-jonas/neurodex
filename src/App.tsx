import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import Homepage from './pages/Homepage';
import Modelpage from './pages/Modelpage';

const App: React.FC = () => {
	return (
		<Router>
			<Navigation />
			<Switch>
				<Route path="/model">
					<Modelpage />
				</Route>
				<Route path="/">
					<Homepage />
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
