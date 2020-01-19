import classnames from 'classnames';
import React from 'react';
import { FieldError } from 'react-hook-form/dist/types';

type FormFieldProps = {
  label: string;
  validationMessage?: string | FieldError;
};

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => {
    const { validationMessage, label, ...rest } = props;

    const inputClasses = classnames(
      'shadow appearance-none border border-l-4 border-blue-800 rounded-sm w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:border-orange-400',
      {
        'border-error border-0': !!props.validationMessage
      }
    );

    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={props.name}>
          {label}
        </label>
        <input className={inputClasses} ref={ref} {...rest} id={props.name} />
        {validationMessage && <p className="text-error text-s italic">{validationMessage}</p>}
      </div>
    );
  }
);

export default FormField;
