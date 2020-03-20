import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';
import useForm from 'react-hook-form';
import { toast } from 'react-toastify';
import FormField from '../../components/utility/FormField';
import { useUserContext } from '../../contexts/auth';

const AccountSettingsPage = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
  return (
    <div className="block pt-16" ref={ref} id="account">
      <h1 className="text-4xl font-serif font-bold">Account</h1>
      <UserDataChangeForm />
      <PasswordChangeForm />
    </div>
  );
});

const UserDataChangeForm = () => {
  const { user, updateData } = useUserContext();
  const { register, handleSubmit, errors, formState, reset } = useForm({ mode: 'onBlur' });

  const handleDataUpdate = async (values: Record<string, any>) => {
    await updateData(values['email'], values['name']);
    // TODO: If something goes wrong, show validation errors?
    reset();
    toast.info('Account Daten erfolgreich geändert.');
  };

  const loginButtonClasses = classnames(
    'font-bold py-1 px-5 rounded focus:outline-none border border-blue-800 text-blue-800 font-bold focus:shadow-outline hover:bg-gray-100 mr-2',
    {
      'opacity-50 cursor-not-allowed': !formState.isValid || !formState.dirty
    }
  );

  return (
    <form onSubmit={handleSubmit(handleDataUpdate)}>
      <FormField
        label="Name"
        name="name"
        placeholder="Dein Name"
        ref={register({ required: true })}
        defaultValue={user?.name}
        validationMessage={errors.name?.message}
        wide
        disabled={formState.isSubmitting}
      />
      <FormField
        label="Email"
        name="email"
        placeholder="Deine Email Adresse"
        ref={register({ required: true })}
        defaultValue={user?.email}
        validationMessage={errors.email?.message}
        wide
        disabled={formState.isSubmitting}
      />
      <div className="flex justify-start">
        <button className={loginButtonClasses} type="submit" disabled={!formState.isValid || !formState.dirty}>
          {formState.isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Ändern'}
        </button>
        <button className={loginButtonClasses} type="submit">
          Zurücksetzen
        </button>
      </div>
    </form>
  );
};

const PasswordChangeForm = () => {
  const { updatePassword } = useUserContext();
  const { register, handleSubmit, errors, reset, formState, setError } = useForm({ mode: 'onChange' });

  const handleDataUpdate = async (values: Record<string, any>) => {
    const response = await updatePassword(values['oldPassword'], values['password'], values['repeatPassword']);
    reset();
    if (response.ok) {
      toast.info('Passwort wurde erfolgreich geändert');
    } else {
      const json = await response.json();
      setError(json.field, 'required', json.message);
    }
  };

  const loginButtonClasses = classnames(
    'font-bold py-1 px-5 rounded focus:outline-none border border-blue-800 text-blue-800 font-bold focus:shadow-outline hover:bg-gray-100 mr-2',
    {
      'opacity-50 cursor-not-allowed': !formState.isValid || !formState.dirty
    }
  );
  return (
    <form onSubmit={handleSubmit(handleDataUpdate)} className="mt-6">
      <FormField
        label="Altes Passwort"
        name="oldPassword"
        placeholder="********"
        ref={register({ required: true })}
        type="password"
        validationMessage={errors.oldPassword?.message}
      />
      <FormField
        label="Neues Passwort"
        name="password"
        placeholder="********"
        ref={register({ required: true, minLength: 8 })}
        type="password"
        validationMessage={errors.password?.message}
      />
      <FormField
        label="Neues Passwort wiederholen"
        name="repeatPassword"
        placeholder="********"
        ref={register({ required: true, minLength: 8 })}
        type="password"
        validationMessage={errors.repeatPassword?.message}
      />
      <span className="text-sm text-gray-700 font-bold -mt-3 block">
        Stelle sicher, dass dein Passwort mindestens 8 Zeichen lang ist
      </span>
      <div className="flex justify-start mt-4">
        <button className={loginButtonClasses} type="submit" disabled={!formState.isValid || !formState.dirty}>
          {formState.isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Passwort Ändern'}
        </button>
        <button className={loginButtonClasses} type="reset">
          Zurücksetzen
        </button>
      </div>
    </form>
  );
};

export default AccountSettingsPage;
