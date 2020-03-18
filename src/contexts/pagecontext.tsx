import React, { useState, useEffect } from 'react';

type PageContextProps = {
  pageTitle: string;
  setPageTitle: (value: string) => void;
};

export const PageContext = React.createContext<PageContextProps>({
  setPageTitle: (value: string) => {},
  pageTitle: ''
});

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
