import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';
import RegisterForm from '../../components/forms/RegisterForm';

type LoginPageProps = {
  pageState: 'REGISTER' | 'LOGIN';
};

const LoginPage: React.FC<LoginPageProps> = ({ pageState }) => {
  return (
    <div className="w-full">
      <div className="mb-4 mx-auto max-w-sm text-lg pt-6">
        <div className="w-full border-b border-gray-400 flex justify-evenly mt-8 rounded-t bg-white shadow">
          <LoginPageButton to="/login" active={pageState === 'LOGIN'} title="Zum Login wechseln">
            Login
          </LoginPageButton>
          <LoginPageButton to="/register" active={pageState === 'REGISTER'} title="Zur Registrierung wechseln">
            Registrieren
          </LoginPageButton>
        </div>
        <div className="px-8 pt-8 pb-8 bg-white shadow rounded-b">
          {pageState === 'LOGIN' && <LoginForm />}
          {pageState === 'REGISTER' && <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

type LoginPageButtonProps = {
  active: boolean;
  to: string;
  title: string;
};

const LoginPageButton: React.FC<LoginPageButtonProps> = ({ active, to, title, children }) => {
  const classes = classNames(
    'font-bold text-gray-800 w-1/2 text-center block py-3 border-b-2 border-transparent transition-colors duration-150',
    {
      'border-orange-400': active,
    }
  );
  return (
    <Link to={to} className={classes} title={title}>
      {children}
    </Link>
  );
};

export default LoginPage;
