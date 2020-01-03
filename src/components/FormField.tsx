import React, { ChangeEventHandler } from "react";
import { FieldError } from "react-hook-form/dist/types";
import classnames from 'classnames';

type FormFieldProps = {
	label: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	validationMessage?: string | FieldError;
	name: string;
	type?: string;
	placeholder?: string;
	required?: boolean;
};

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
	(props, ref) => {
		const inputClasses = classnames(
			'shadow appearance-none border border-l-4 border-blue-800 rounded-sm w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:border-orange-400',
			{
				'border-error border-0': !!props.validationMessage
			}
		);

		return (
			<div className="mb-4">
				<label className="block text-gray-700 text-sm font-bold mb-2">
					{props.label}
				</label>
				<input
					className={inputClasses}
					name={props.name}
					type={props.type}
					placeholder={props.placeholder}
					ref={ref}
					onChange={props.onChange}
					required={props.required}
				/>
				{props.validationMessage && (
					<p className="text-error text-s italic">{props.validationMessage}</p>
				)}
			</div>
		);
	}
);

export default FormField;