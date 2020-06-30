import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import FormField from '../utility/FormField';

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
      <div className="flex items-center justify-between mb-4">
        <Link
          className="inline-block align-baseline font-bold text-sm text-blue-800 hover:text-blue-800 hover:underline"
          to="/"
        >
          Passwort vergessen?
        </Link>
      </div>
      <button
        className="font-bold py-1 px-5 border border-blue-800 rounded focus:outline-none focus:shadow-outline hover:bg-gray-100 w-full disabled:opacity-50"
        disabled={!(formState.dirty && formState.isValid && !formState.isSubmitting)}
        type="submit"
      >
        {formState.isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
