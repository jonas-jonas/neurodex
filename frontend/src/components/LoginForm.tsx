import classnames from 'classnames';
import React from 'react';
import useForm from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import FormField from './utility/FormField';

const LoginForm: React.FC = () => {
  const { register, handleSubmit, errors, setError, formState } = useForm({ mode: 'onChange' });
  const { authenticate } = useAuth();

  /**
   * Uses the current email and password to authenticate with the server
   *
   * @param event The event emitted by the submission of the login form
   */
  const handleAuthenticate = async (values: Record<string, any>) => {
    const response = await authenticate(values.email, values.password);
    if (response.status !== 200) {
      const json = await response.json();
      setError('password', 'notMatch', json.message);
    }
  };

  // The button should look "disabled" if the button is disabled
  const loginButtonClasses = classnames(
    'font-bold py-1 px-5 rounded focus:outline-none border border-blue-800 text-blue-800 font-bold focus:shadow-outline hover:bg-gray-100',
    {
      'opacity-50 cursor-not-allowed': !formState.isValid,
    }
  );
  return (
    <form onSubmit={handleSubmit(handleAuthenticate)}>
      <FormField
        label="Email"
        name="email"
        placeholder="Email"
        validationMessage={errors.email?.message}
        ref={register({ required: true })}
        autoFocus
      />
      <FormField
        label="Passwort"
        name="password"
        placeholder="*********"
        type="password"
        ref={register({ required: true })}
        validationMessage={errors.password?.message}
        required
      />
      <div className="flex items-center justify-between">
        <button className={loginButtonClasses} disabled={!formState.isValid} type="submit">
          Login
        </button>
        <Link
          className="inline-block align-baseline font-bold text-sm text-blue-800 hover:text-blue-800 hover:underline"
          to="/"
        >
          Passwort vergessen?
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
