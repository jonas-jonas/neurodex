import React, { useEffect, useState } from 'react';

import classNames from 'classnames';

type AbstractModalSize = 'LARGE' | 'NORMAL' | 'SMALL';

type AbstractModalProps = {
  size?: AbstractModalSize;
};

type ModalContextProps = {
  handleClose: () => void;
  rendered: boolean;
};

const ModalContext = React.createContext<ModalContextProps | null>(null);

type ModalProps = {
  onClose?: () => void;
  component: React.ReactNode;
};

export const Modal = ({ onClose, component }: ModalProps) => {
  const [rendered, setRendered] = useState(false);

  const handleClose = () => {
    setRendered(false);
    if (onClose) {
      setTimeout(onClose, 100);
    }
  };

  useEffect(() => setRendered(true), []);
  return <ModalContext.Provider value={{ rendered, handleClose }}>{component}</ModalContext.Provider>;
};

const AbstractModal: React.FC<AbstractModalProps> = ({ children, size }) => {
  const { rendered, handleClose } = useOverlayContext();

  const popupClasses = classNames(
    'bg-white z-50 rounded transform transition duration-200 ease-out shadow flex flex-col',
    {
      '-translate-y-48': !rendered,
      '-translate-y-32': rendered,
      'h-3/4 w-3/4': size === 'LARGE',
      'h-1/2 w-1/2': size === 'NORMAL' || !size,
      'h-1/4 w-1/4': size === 'SMALL',
    }
  );

  const backDropClasses = classNames('bg-gray-500 w-full h-full absolute transition-opacity duration-200', {
    'opacity-0': !rendered,
    'opacity-50': rendered,
  });
  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-50 justify-center flex items-center">
      <div className={popupClasses}>{children}</div>
      <div className={backDropClasses} onClick={handleClose}></div>
    </div>
  );
};

export default AbstractModal;

export const useOverlayContext = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useOverlayContext must be used within a OverlayContextProvider.');
  }
  return context;
};
