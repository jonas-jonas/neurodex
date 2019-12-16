import classnames from 'classnames';
import React, { useContext } from "react";
import useForm from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import FormField from "./FormField";

const LoginForm: React.FC = () => {
	const { register, handleSubmit, errors, setError, formState } = useForm({ mode: 'onChange' });
	const { authenticate } = useContext(AuthContext);

	/**
	 * Uses the current username and password to authenticate with the server
	 *
	 * @param event The event emitted by the submission of the login form
	 */
	const handleAuthenticate = async (values: Record<string, any>) => {

		const response = await authenticate(values.username, values.password);
		if (response.status !== 200) {
			const json = await response.json();
			setError('password', 'notMatch', json.message);
		}
	};

	// The button should look "disabled" if the button is disabled
	const loginButtonClasses = classnames(
		'bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline',
		{
			'opacity-50 cursor-not-allowed': !formState.isValid
		}
	);
	return (
		<form onSubmit={handleSubmit(handleAuthenticate)}>
			<FormField
				label="Username"
				name="username"
				placeholder="Username"
				validationMessage={errors.username?.message}
				ref={register({ required: true })}
			/>
			<FormField
				label="Password"
				name="password"
				placeholder="*********"
				type="password"
				ref={register({ required: true })}
				validationMessage={errors.password?.message}
				required
			/>
			<div className="flex items-center justify-between">
				<button
					className={loginButtonClasses}
					disabled={!formState.isValid}
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

export default LoginForm;