import React, { useState, useEffect } from 'react';

type PageContextProps = {
  pageTitle: string;
  setPageTitle: (value: string) => void;
};

export const PageContext = React.createContext<PageContextProps | undefined>(undefined);

export const PageContextProvider: React.FC = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    if (pageTitle === '') {
      document.title = 'Neurodex';
    } else {
      document.title = pageTitle + ' · Neurodex';
    }
  }, [pageTitle]);

  return <PageContext.Provider value={{ pageTitle, setPageTitle }}>{children}</PageContext.Provider>;
};

export const usePage = () => {
  const context = React.useContext(PageContext);
  if (!context) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('usePage must be used within a PageContextProvider.');
  }
  return context;
};
