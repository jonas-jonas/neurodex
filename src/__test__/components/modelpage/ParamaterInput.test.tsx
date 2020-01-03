import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ParameterInput from '../../../components/modelpage/ParameterInput';

afterEach(cleanup);

it('Renders number input element for type number', () => {
	const props = {
		id: 'random-id',
		parameter: {
			name: 'some-parameter',
			type: 'number',
			defaultValue: '3'
		},
		updateData: () => Promise.reject(),
		data: 10
	}

	render(<ParameterInput {...props} />);

	const input = screen.getByTitle('some-parameter');

	expect(input).toBeInstanceOf(HTMLInputElement);
	const inputElement = input as HTMLInputElement;

	expect(inputElement.type).toBe('number');
	expect(inputElement.value).toBe('10');
});

it('Renders boolean input element for type boolean', () => {
	const props = {
		id: 'random-id',
		parameter: {
			name: 'some-parameter',
			type: 'boolean',
			defaultValue: 'false'
		},
		updateData: () => Promise.reject(),
		data: 'true'
	}

	render(<ParameterInput {...props} />);

	const input = screen.getByTitle('some-parameter');

	expect(input).toBeInstanceOf(HTMLInputElement);
	const inputElement = input as HTMLInputElement;

	expect(inputElement.type).toBe('checkbox');
	expect(inputElement.checked).toBe(true);
});

it('Data update is triggered on click on boolean input', () => {
	const updateData = jest.fn((name, value) => Promise.resolve());
	const props = {
		id: 'random-id',
		parameter: {
			name: 'some-parameter',
			type: 'boolean',
			defaultValue: 'false'
		},
		updateData: updateData,
		data: 'true'
	}

	render(<ParameterInput {...props} />);

	fireEvent.click(screen.getByTitle('some-parameter'));

	expect(updateData.mock.calls.length).toEqual(1);
	// Check if the first parameter to the first (and only) 
	// call was the name of the passed in parameter
	expect(updateData.mock.calls[0][0]).toBe('some-parameter');
	expect(updateData.mock.calls[0][1]).toBe('false');
});

it('Data update is triggered on blur of number input', () => {
	const updateData = jest.fn((name, value) => Promise.resolve());
	const props = {
		id: 'random-id',
		parameter: {
			name: 'some-parameter',
			type: 'number',
			defaultValue: '3'
		},
		updateData: updateData,
		data: '128'
	}

	render(<ParameterInput {...props} />);


	const input = screen.getByTitle('some-parameter');
	fireEvent.change(input, { target: { value: '256' } });
	fireEvent.blur(input);

	expect(updateData.mock.calls.length).toEqual(1);
	// Check if the first parameter to the first (and only) 
	// call was the name of the passed in parameter
	expect(updateData.mock.calls[0][0]).toBe('some-parameter');
	expect(updateData.mock.calls[0][1]).toBe('256');
});

it('Data update is not triggered on blur of number input if data is equal', () => {
	const updateData = jest.fn((name, value) => Promise.resolve());
	const props = {
		id: 'random-id',
		parameter: {
			name: 'some-parameter',
			type: 'number',
			defaultValue: '3'
		},
		updateData: updateData,
		data: '128'
	}

	render(<ParameterInput {...props} />);


	const input = screen.getByTitle('some-parameter');
	fireEvent.change(input, { target: { value: '128' } });
	fireEvent.blur(input);

	expect(updateData.mock.calls.length).toEqual(0);
});
