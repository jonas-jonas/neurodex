import React, { useState, ChangeEvent } from 'react';
import { FunctionParameter } from '../../data/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type ParameterInputProps = {
  parameter: FunctionParameter;
  parameterData: Record<string, any>;
  onUpdate: (parameterName: string, newValue: any) => Promise<void>;
};
export const ParameterInput = (props: ParameterInputProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  const { parameter, parameterData, onUpdate, ...rest } = props;
  const [isUpdating, setUpdating] = useState(false);

  const handleUpdate = async (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = parameterData[parameter.name]?.value ?? '';
    const newValue = e.target.value;
    if (currentValue === newValue) {
      return;
    }
    setUpdating(true);
    await onUpdate(parameter.name, newValue);
    setUpdating(false);
  };

  return (
    <div className="w-1/2 relative">
      <input
        type="text"
        className="border px-2 py-1 w-full"
        defaultValue={parameterData[parameter.name]?.value}
        placeholder={parameter.defaultValue}
        title={parameter.name}
        onBlur={handleUpdate}
        disabled={isUpdating}
        {...rest}
      />
      {isUpdating && (
        <div className="bg-white opacity-75 flex items-center justify-center w-full h-full absolute top-0 left-0">
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      )}
    </div>
  );
};
