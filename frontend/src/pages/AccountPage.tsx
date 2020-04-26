import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { usePage } from '../contexts/PageProvider';
import AccountSettingsPage from './account/AccountSettingsPage';

const AccountPage: React.FC = () => {
  const accountRef = useRef<HTMLDivElement>(null);
  const { setPageTitle } = usePage();

  useEffect(() => {
    setPageTitle('Einstellungen');
    return () => setPageTitle('');
  }, [setPageTitle]);

  const scrollTo = (ref: React.RefObject<HTMLElement>) => {
    return () => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
  };

  const menuEntryClasses = classNames(
    'block hover:bg-gray-200 hover:underline pl-10 pr-3 py-2 relative flex items-center w-full focus:outline-none'
  );

  return (
    <div className="container flex">
      <div>
        <div className="w-56 block bg-white rounded shadow border-b-4 border-orange-500 fixed">
          <span className="pl-4 font-bold uppercase text-gray-700 py-3 block">Einstellungen</span>
          <button className={menuEntryClasses} onClick={scrollTo(accountRef)}>
            <FontAwesomeIcon icon={faUser} className="absolute left-0 ml-4" />
            Account
          </button>
        </div>
      </div>
      <div className="ml-56 pl-8 -mt-16 w-1/2">
        <AccountSettingsPage ref={accountRef} />
      </div>
    </div>
  );
};

export default AccountPage;
