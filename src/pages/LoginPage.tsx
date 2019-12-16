import classnames from 'classnames';
import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { AuthContext } from '../contexts/auth';

export enum LoginPageState {
	LOGIN,
	REGISTER
}

const LoginPage: React.FC = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const [loginPageState, setLoginPageState] = useState<LoginPageState>(
		LoginPageState.LOGIN
	);

	useEffect(() => {
		console.log(window.location.hash);
		if (window.location.hash && window.location.hash === "#register") {
			setLoginPageState(LoginPageState.REGISTER);
		}
	}, []);

	// If the user is already authenticated, he shouldn't see this page
	if (isAuthenticated) {
		return <Redirect to="/" />;
	}
	return (
		<div className="w-full max-w-xs mx-auto pt-8">
			<div className="bg-white shadow-md rounded mb-4 mx-auto">
				<div className="w-full">
					<LoginPageStateButton
						state={LoginPageState.LOGIN}
						currentState={loginPageState}
						onClick={setLoginPageState}
					>
						LOGIN
					</LoginPageStateButton>
					<LoginPageStateButton
						state={LoginPageState.REGISTER}
						currentState={loginPageState}
						onClick={setLoginPageState}
					>
						REGISTRIEREN
					</LoginPageStateButton>
				</div>
				<div className="px-8 pt-6 pb-8">
					{loginPageState === LoginPageState.LOGIN && <LoginForm />}
					{loginPageState === LoginPageState.REGISTER && (
						<RegisterForm setLoginPageState={setLoginPageState} />
					)}
				</div>
			</div>
		</div>
	);
};

type LoginPageStateButtonProps = {
	state: LoginPageState;
	currentState: LoginPageState;
	onClick: (value: LoginPageState) => any;
};

const LoginPageStateButton: React.FC<LoginPageStateButtonProps> = React.memo(
	({ state, currentState, onClick, children }) => {
		const classes = classnames(
			'w-1/2 py-4 font-bold tracking-tight text-gray-700 focus:outline-none',
			{
				'bg-gray-100 shadow-inner': state !== currentState
			}
		);

		const handleOnClick = () => {
			onClick(state);
		};

		return (
			<button className={classes} onClick={handleOnClick}>
				{children}
			</button>
		);
	}
);



export default LoginPage;
