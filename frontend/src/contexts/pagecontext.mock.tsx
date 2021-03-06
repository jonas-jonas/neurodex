import React from 'react';
import { PageContext } from '../../src/contexts/PageProvider';

type PageContextProps = {
  pageTitle?: string;
  setPageTitle?: (value: string) => void;
};

export const MockPageContextProvider: React.FC<PageContextProps> = ({ children, pageTitle, setPageTitle }) => {
  return (
    <PageContext.Provider value={{ pageTitle: pageTitle || '', setPageTitle: setPageTitle || jest.fn() }}>
      {children}
    </PageContext.Provider>
  );
};
