import React from 'react';
import { cleanup, fireEvent, render, screen, act } from '@testing-library/react';
import ParameterInput from '../../../components/modelpage/ParameterInput';
import MockModelContextProvider from '../../../__mocks__/modelcontext.mock';
import { ModelLayer } from '../../../data/models';

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
  };

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
  };

  render(<ParameterInput {...props} />);

  const input = screen.getByTitle('some-parameter');

  expect(input).toBeInstanceOf(HTMLInputElement);
  const inputElement = input as HTMLInputElement;

  expect(inputElement.type).toBe('checkbox');
  expect(inputElement.checked).toBe(true);
});

it('Renders layer input element for type layer', () => {
  const props = {
    id: 'random-id',
    parameter: {
      name: 'some-parameter',
      type: 'layer',
      defaultValue: 'false'
    },
    updateData: () => Promise.reject(),
    data: undefined
  };

  const layers: ModelLayer[] = [
    {
      id: 3,
      layerName: 'linear1',
      layerType: {
        description: '',
        id: '',
        layerName: '',
        parameters: []
      },
      parameterData: {}
    }
  ];

  render(
    <MockModelContextProvider layers={layers}>
      <ParameterInput {...props} />
    </MockModelContextProvider>
  );

  const input = screen.getByTitle('some-parameter');

  expect(input).toBeInstanceOf(HTMLSelectElement);
  const inputElement = input as HTMLSelectElement;

  expect(inputElement.options.length).toBe(2);
  expect(inputElement.options[0].text).toBe('');
  expect(inputElement.options[1].text).toBe('linear1');
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
  };

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
  };

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

it('Data change in layer input element triggers update', () => {
  const updateData = jest.fn((name, value) => Promise.resolve());
  const props = {
    id: 'random-id',
    parameter: {
      name: 'some-parameter',
      type: 'layer',
      defaultValue: 'false'
    },
    updateData: updateData,
    data: undefined
  };

  const layers: ModelLayer[] = [
    {
      id: 3,
      layerName: 'linear1',
      layerType: {
        description: '',
        id: '',
        layerName: '',
        parameters: []
      },
      parameterData: {}
    }
  ];

  render(
    <MockModelContextProvider layers={layers}>
      <ParameterInput {...props} />
    </MockModelContextProvider>
  );

  const inputElement = screen.getByTitle('some-parameter') as HTMLSelectElement;

  act(() => {
    inputElement.value = '3';
    fireEvent.change(inputElement);
  });

  expect(updateData.mock.calls.length).toBe(1);
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
  };

  render(<ParameterInput {...props} />);

  const input = screen.getByTitle('some-parameter');
  fireEvent.change(input, { target: { value: '128' } });
  fireEvent.blur(input);

  expect(updateData.mock.calls.length).toEqual(0);
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
  };

  render(<ParameterInput {...props} />);

  const input = screen.getByTitle('some-parameter');
  fireEvent.change(input, { target: { value: '' } });
  fireEvent.blur(input);

  expect(updateData.mock.calls.length).toEqual(1);
  expect(updateData.mock.calls[0][1]).toBe('3');
});

it('Null is returned when non-supported type is passed', () => {
  const updateData = jest.fn((name, value) => Promise.resolve());
  const props = {
    id: 'random-id',
    parameter: {
      name: 'some-parameter',
      type: 'random-type',
      defaultValue: '3'
    },
    updateData: updateData,
    data: '128'
  };

  const { container } = render(<ParameterInput {...props} />);
  expect(container.childNodes.length).toEqual(0);
});

it('Null is returned when non-supported type is passed', () => {
  const updateData = jest.fn((name, value) => Promise.resolve());
  const props = {
    id: 'random-id',
    parameter: {
      name: 'some-parameter',
      type: 'random-type',
      defaultValue: '3'
    },
    updateData: updateData,
    data: '128'
  };

  const { container } = render(<ParameterInput {...props} />);
  expect(container.childNodes.length).toEqual(0);
});
