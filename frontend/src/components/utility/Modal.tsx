import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

type ModalContextProps = {
  close: () => void;
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
  return (
    <ModalContext.Provider value={{ rendered, close: handleClose }}>
      <AbstractModal>{component}</AbstractModal>
    </ModalContext.Provider>
  );
};

const AbstractModal: React.FC = ({ children }) => {
  const { rendered, close } = useModal();

  const popupClasses = classNames(
    'h-full right-0 top-0 absolute z-50 xl:w-1/4 lg:w-1/2 md:w-3/4 sm:w-full bg-white shadow transform duration-200',
    {
      'translate-x-full': !rendered,
      'translate-x-0': rendered,
    }
  );

  const backDropClasses = classNames('bg-gray-500 w-full h-full absolute transition-opacity duration-200', {
    'opacity-0': !rendered,
    'opacity-50': rendered,
  });
  return (
    <div className="w-screen h-screen fixed top-0 right-0 z-50 justify-center flex items-center">
      <div className={popupClasses}>{children}</div>
      <div className={backDropClasses} onClick={close}></div>
    </div>
  );
};

export default AbstractModal;

export const useModal = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useModal must be used within a Modal.');
  }
  return context;
};

type TitleProps = {
  title: string;
  closeTooltip?: string;
};

const Title = ({ title, closeTooltip }: TitleProps) => {
  const modal = useModal();

  return (
    <div className="flex justify-between w-full bg-white p-4 flex-shrink-0 border-b-4 border-blue-700 items-center">
      <h1 className="font-serif text-2xl uppercase font-bold">{title}</h1>
      <button
        className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-300 focus:bg-gray-400 focus:outline-none transition-colors duration-150"
        onClick={modal.close}
        title={closeTooltip}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

Modal.Title = Title;
