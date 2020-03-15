import classNames from 'classnames';
import { HTTPError } from 'ky';
import React, { useContext } from 'react';
import useForm from 'react-hook-form';
import { AuthContext } from '../contexts/auth';
import { LoginPageState } from '../pages/LoginPage';
import FormField from './utility/FormField';

type RegisterFormProps = {
  setLoginPageState: (value: LoginPageState) => any;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ setLoginPageState }) => {
  const { register, handleSubmit, errors, setError, formState } = useForm({ mode: 'onChange' });
  const { authenticate, registerUser } = useContext(AuthContext);

  // The button should look "disabled" if the button is disabled
  const loginButtonClasses = classNames(
    'font-bold py-1 px-3 rounded focus:outline-none border border-blue-800 text-blue-800 font-bold focus:shadow-outline hover:bg-gray-100',
    {
      'opacity-50 cursor-not-allowed': !(formState.dirty && formState.isValid)
    }
  );

  const handleRegister = async (values: Record<string, string>) => {
    try {
      const response = await registerUser(values.email, values.password, values.repeatPassword);
      if (response.status === 200) {
        await authenticate(values.email, values.password);
      }
    } catch (error) {
      if (error instanceof HTTPError) {
        const response = error.response;
        const json = await response.json();
        setError(json.field, 'notMatch', json.message);
      }
    }
  };

  return (
    <form>
      <FormField
        label="Email"
        name="email"
        placeholder="Email"
        ref={register({ required: true })}
        validationMessage={errors.email?.message}
        autoFocus
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
      <div className="flex items-center justify-between">
        <button
          className={loginButtonClasses}
          disabled={!(formState.dirty && formState.isValid)}
          type="submit"
          onClick={handleSubmit(handleRegister)}
        >
          Registrieren
        </button>
        <button
          className="inline-block align-baseline font-bold text-sm text-blue-800 hover:text-blue-800 hover:underline focus:outline-none"
          type="button"
          onClick={() => setLoginPageState(LoginPageState.LOGIN)}
        >
          Lieber einloggen?
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
