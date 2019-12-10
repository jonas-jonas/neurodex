import classnames from 'classnames';
import React, {
	ChangeEvent,
	ChangeEventHandler,
	FormEvent,
	useContext,
	useRef,
	useState
} from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

enum LoginPageState {
	LOGIN,
	REGISTER
}

const LoginPage: React.FC = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const [loginPageState, setLoginPageState] = useState<LoginPageState>(
		LoginPageState.REGISTER
	);

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
			'w-1/2 py-4 font-bold tracking-tight text-gray-700',
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

const LoginForm: React.FC = () => {
	const { authenticate } = useContext(AuthContext);
	const [validationMessage, setValidationMessage] = useState<string>();

	/**
	 * Uses the current username and password to authenticate with the server
	 *
	 * @param event The event emitted by the submission of the login form
	 */
	const handleAuthenticate = async (event: FormEvent) => {
		event.preventDefault();
		if (userNameRef.current && passwordRef.current) {
			const username = userNameRef.current.value;
			const password = passwordRef.current.value;

			const response = await authenticate(username, password);
			if (response.status !== 200) {
				const json = await response.json();
				setValidationMessage(json.message);
			}
		}
	};

	/**
	 * Sets the current validation message if the value of the event is not valid
	 *
	 * If the currentTarget's value is not valid, a message is set indicating what's wrong
	 *
	 * @param event The change event to be checked
	 */
	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.currentTarget.validity.valid) {
			setValidationMessage(undefined);
		} else {
			setValidationMessage('Please choose a password');
		}
	};

	/** ref of the username input field */
	const userNameRef = useRef<HTMLInputElement>(null);

	/** ref of the password input field */
	const passwordRef = useRef<HTMLInputElement>(null);
	// The button should look "disabled" if the button is disabled
	const loginButtonClasses = classnames(
		'bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline',
		{
			'opacity-50 cursor-not-allowed': !!validationMessage
		}
	);
	return (
		<form onSubmit={handleAuthenticate}>
			<FormField
				label="Username"
				name="username"
				placeholder="Username"
				ref={userNameRef}
			/>
			<FormField
				label="Password"
				onChange={handlePasswordChange}
				name="password"
				placeholder="*********"
				type="password"
				ref={passwordRef}
				validationMessage={validationMessage}
				required
			/>
			<div className="flex items-center justify-between">
				<button
					className={loginButtonClasses}
					disabled={!!validationMessage}
					type="submit"
				>
					Login
				</button>
				<Link
					className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
					to="/"
				>
					Forgot Password?
				</Link>
			</div>
		</form>
	);
};

type LoginFieldProps = {
	label: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	validationMessage?: string;
	name: string;
	type?: string;
	placeholder?: string;
	required?: boolean;
};

const FormField = React.forwardRef<HTMLInputElement, LoginFieldProps>(
	(props, ref) => {
		const inputClasses = classnames(
			'shadow appearance-none border border-2 border-l-4 rounded-sm w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:border-orange-400',
			{
				'border-error border-0': !!props.validationMessage
			}
		);

		return (
			<div className="mb-4">
				<label className="block text-gray-700 text-sm font-bold mb-2">
					{props.label}
				</label>
				<input
					className={inputClasses}
					name={props.name}
					type={props.type}
					placeholder={props.placeholder}
					ref={ref}
					onChange={props.onChange}
					required={props.required}
				/>
				{props.validationMessage && (
					<p className="text-error text-s italic">{props.validationMessage}</p>
				)}
			</div>
		);
	}
);

type RegisterFormProps = {
	setLoginPageState: (value: LoginPageState) => any;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ setLoginPageState }) => {
	const { authenticate } = useContext(AuthContext);
	const [validationMessage, setValidationMessage] = useState<string>();

	/** ref of the username input field */
	const userNameRef = useRef<HTMLInputElement>(null);

	/** ref of the password input field */
	const passwordRef = useRef<HTMLInputElement>(null);
	// The button should look "disabled" if the button is disabled
	const loginButtonClasses = classnames(
		'bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline',
		{
			'opacity-50 cursor-not-allowed': !!validationMessage
		}
	);
	return (
		<form>
			<FormField
				label="Username"
				name="username"
				placeholder="Username"
				ref={userNameRef}
			/>
			<FormField
				label="Password"
				// onChange={handlePasswordChange}
				name="password"
				placeholder="*********"
				type="password"
				ref={passwordRef}
				validationMessage={validationMessage}
				required
			/>

			<FormField
				label="Password wiederholen"
				// onChange={handlePasswordChange}
				name="password"
				placeholder="*********"
				type="password"
				ref={passwordRef}
				validationMessage={validationMessage}
				required
			/>
			<div className="flex items-center justify-between">
				<button
					className={loginButtonClasses}
					disabled={!!validationMessage}
					type="submit"
				>
					Registieren
				</button>
				<button
					className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
					type="button"
					onClick={() => setLoginPageState(LoginPageState.LOGIN)}
				>
					Lieber einloggen?
				</button>
			</div>
		</form>
	);
};

export default LoginPage;
