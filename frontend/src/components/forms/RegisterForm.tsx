import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ky from 'ky';
import React, { useState } from 'react';
import useForm from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import FormField from '../utility/FormField';

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, errors, setError, formState } = useForm({ mode: 'onChange' });
  const { registerUser } = useAuth();
  const [isFinished, setFinished] = useState(false);
  const [email, setEmail] = useState('');

  const handleRegister = async (values: Record<string, string>) => {
    try {
      const response = await registerUser(values.name, values.email, values.password, values.repeatPassword);
      if (response.ok) {
        setFinished(true);
        setEmail(values.email);
      }
    } catch (error) {
      if (error instanceof ky.HTTPError) {
        const response = error.response;
        const json = await response.json();
        setError(json.field, 'notMatch', json.message);
      }
    }
  };
  if (isFinished) {
    return (
      <div className="text-center">
        <FontAwesomeIcon icon={faCheckCircle} size="5x" className="mb-6 text-success" />
        <h2 className="text-lg font-bold mb-4 font-serif">Registrierung erfolgreich</h2>
        <p>
          Wir haben dir eine Bestätigungsemail an <b>{email}</b> geschickt.
        </p>
        <p className="mt-4">Du kannst dieses Fenster nun schließen.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <FormField label="Name" name="name" placeholder="Name" ref={register({ required: true })} autoFocus />
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="Email"
        ref={register({ required: true })}
        validationMessage={errors.email?.message}
      />
      <FormField
        label="Passwort"
        name="password"
        placeholder="*********"
        type="password"
        ref={register({ required: true })}
        validationMessage={errors.password?.message}
      />

      <FormField
        label="Passwort wiederholen"
        name="repeatPassword"
        placeholder="*********"
        type="password"
        ref={register({ required: true })}
        validationMessage={errors.repeatPassword?.message}
      />
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/login"
          className="inline-block align-baseline font-bold text-sm text-blue-800 hover:text-blue-800 hover:underline focus:outline-none"
        >
          Lieber einloggen?
        </Link>
      </div>
      <button
        className="font-bold py-1 px-5 border border-blue-800 rounded focus:outline-none font-bold focus:shadow-outline hover:bg-gray-100 w-full disabled:opacity-50"
        disabled={!(formState.dirty && formState.isValid)}
        type="submit"
      >
        {formState.isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Registrieren'}
      </button>
    </form>
  );
};

export default RegisterForm;
