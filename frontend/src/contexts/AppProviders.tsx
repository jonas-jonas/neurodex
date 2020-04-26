import React from 'react';
import { AuthContextProvider } from './AuthProvider';
import { PageContextProvider } from './PageProvider';
import { ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AppProviders: React.FC = ({ children }) => {
  return (
    <AuthContextProvider>
      <PageContextProvider>
        {children}
        <ToastContainer
          position="top-center"
          toastClassName="rounded shadow font-bold min-h-0 py-3"
          hideProgressBar
          closeButton={
            <button className="focus:outline-none">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          }
        />
      </PageContextProvider>
    </AuthContextProvider>
  );
};

export default AppProviders;
