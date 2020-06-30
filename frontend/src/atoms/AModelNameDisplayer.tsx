import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSpinner, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

type AModelNameDisplayerProps = {
  modelName: string;
  onSave: (newValue: string) => Promise<void>;
  onStartEditing?: () => void;
  onReject?: () => Promise<void>;
};

const AModelNameDisplayer = ({ modelName, onSave, onReject, onStartEditing }: AModelNameDisplayerProps) => {
  const [isUpdatingModelName, setUpdatingModelName] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditingModelName, setEditingModelName] = useState(false);

  const handleEditModelClick = () => {
    if (onStartEditing) {
      onStartEditing();
    }
    setEditingModelName(true);
  };

  const saveNewModelName = useCallback(
    async (name: string) => {
      if (name !== modelName) {
        setUpdatingModelName(true);
        await onSave(name);
        setUpdatingModelName(false);
      }
      setEditingModelName(false);
    },
    [modelName, onSave]
  );

  useEffect(() => {
    const keypressEventHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && inputRef.current && e.target === inputRef.current) {
        saveNewModelName(inputRef.current.value);
      }
    };

    document.addEventListener('keypress', keypressEventHandler);
    return () => {
      document.removeEventListener('keypress', keypressEventHandler);
    };
  }, [saveNewModelName]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingModelName]);

  const handleEditModelSaveClick = async () => {
    if (inputRef.current) {
      await saveNewModelName(inputRef.current.value);
    }
  };

  const handleEditModelCancelClick = async () => {
    if (onReject) {
      await onReject();
    }
    setEditingModelName(false);
  };

  return (
    <h1 className="text-xl group flex">
      {!isEditingModelName && (
        <div onClick={handleEditModelClick} className="flex">
          {modelName}
          <button className="group-hover:opacity-100 focus:opacity-100 opacity-0 rounded w-8 h-8 bg-gray-100 focus:outline-none focus:bg-gray-300 shadow-inner ml-1 flex items-center justify-center">
            <FontAwesomeIcon icon={faPencilAlt} size="xs" />
          </button>
        </div>
      )}
      {isEditingModelName && (
        <>
          <input type="text" defaultValue={modelName} ref={inputRef} disabled={isUpdatingModelName} />
          <div className="flex">
            <button
              className="opacity-100 rounded w-8 h-8 bg-gray-100 focus:outline-none focus:bg-gray-300 shadow-inner ml-1 flex items-center justify-center"
              onClick={handleEditModelSaveClick}
              disabled={isUpdatingModelName}
            >
              <FontAwesomeIcon icon={isUpdatingModelName ? faSpinner : faCheck} size="xs" spin={isUpdatingModelName} />
            </button>
            {!isUpdatingModelName && (
              <button
                className="opacity-100 rounded w-8 h-8 bg-gray-100 focus:outline-none focus:bg-gray-300 shadow-inner ml-1 flex items-center justify-center"
                onClick={handleEditModelCancelClick}
              >
                <FontAwesomeIcon icon={faTimes} size="xs" />
              </button>
            )}
          </div>
        </>
      )}
    </h1>
  );
};

export default AModelNameDisplayer;
