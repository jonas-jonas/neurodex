import React, { useState } from 'react';

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

  return <PageContext.Provider value={{ pageTitle, setPageTitle }}>{children}</PageContext.Provider>;
};
