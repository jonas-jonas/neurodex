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

const LoginPage: React.FC = () => {
	const { isAuthenticated, authenticate } = useContext(AuthContext);
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

	// If the user is already authenticated, he shouldn't see this page
	if (isAuthenticated) {
		return <Redirect to="/" />;
	}
	return (
		<div className="w-full max-w-xs mx-auto pt-8">
			<form
				className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mx-auto"
				onSubmit={handleAuthenticate}
			>
				<h2 className="text-gray-700 text-xl font-bold mb-4">Login</h2>
				<LoginField
					label="Username"
					name="username"
					placeholder="Username"
					ref={userNameRef}
				/>
				<LoginField
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
					<LoginButton disabled={!!validationMessage} />
					<Link
						className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
						to="/"
					>
						Forgot Password?
					</Link>
				</div>
			</form>
		</div>
	);
};

type SignInProps = {
	disabled: boolean;
};

/**
 * The login button on the login page
 *
 * @param props The props passed to the button
 */
const LoginButton: React.FC<SignInProps> = props => {
	// The button should look "disabled" if the button is disabled
	const classes = classnames(
		'bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline',
		{
			'opacity-50 cursor-not-allowed': props.disabled
		}
	);

	return (
		<button className={classes} {...props} type="submit">
			Login
		</button>
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

const LoginField = React.forwardRef<HTMLInputElement, LoginFieldProps>(
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
					<p className="text-error text-s italic">
						{props.validationMessage}
					</p>
				)}
			</div>
		);
	}
);

export default LoginPage;
