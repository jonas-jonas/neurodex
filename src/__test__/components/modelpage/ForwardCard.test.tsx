import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ForwardCard from '../../../components/modelpage/ForwardCard';
import { Function, ModelFunction } from '../../../data/models';
import MockModelContextProvider from '../../../__mocks__/modelcontext.mock';

afterEach(cleanup);

const activationFunctions: Function[] = [
  {
    description: '',
    id: 1,
    name: 'F.relu',
    parameters: [
      {
        id: 3,
        defaultValue: '',
        name: 'input',
        type: 'number'
      }
    ]
  },
  {
    description: '',
    id: 2,
    name: 'F.softmax',
    parameters: [
      {
        id: 4,
        defaultValue: '',
        name: 'input',
        type: 'number'
      }
    ]
  }
];

it('ForwardCard selects selected activation function', async () => {
  const updateModel = jest.fn();
  const currentFunction: ModelFunction = {
    function: activationFunctions[0],
    id: 3,
    parameterData: {}
  };

  render(
    <MockModelContextProvider updateModel={updateModel} activationFunctions={activationFunctions}>
      <ForwardCard currentFunction={currentFunction} />
    </MockModelContextProvider>
  );

  const activatorSelect = await screen.findByLabelText('Aktivator');
  expect(activatorSelect).toBeInstanceOf(HTMLSelectElement);
  const selectElement = activatorSelect as HTMLSelectElement;
  expect(selectElement.options[selectElement.selectedIndex].text).toBe('F.relu');
});

it('ForwardCard selection of activation function triggers update', async () => {
  const updateModel = jest.fn();
  const currentFunction: ModelFunction = {
    function: activationFunctions[0],
    id: 3,
    parameterData: {}
  };

  render(
    <MockModelContextProvider updateModel={updateModel} activationFunctions={activationFunctions}>
      <ForwardCard currentFunction={currentFunction} />
    </MockModelContextProvider>
  );

  await act(async () => {
    const activatorSelect = await screen.findByLabelText('Aktivator');
    const selectElement = activatorSelect as HTMLSelectElement;
    selectElement.value = '2';
    fireEvent.change(selectElement);
    expect(screen.getByText(/F.softmax/i)).toBeDefined();
  });

  expect(updateModel.mock.calls.length).toEqual(1);
});

it('ForwardCard deletion of activation function triggers delete', async () => {
  const updateModel = jest.fn();
  const currentFunction: ModelFunction = {
    function: activationFunctions[0],
    id: 3,
    parameterData: {}
  };

  render(
    <MockModelContextProvider updateModel={updateModel} activationFunctions={activationFunctions}>
      <ForwardCard currentFunction={currentFunction} />
    </MockModelContextProvider>
  );

  await act(async () => {
    const deleteButton = await screen.findByTitle('Aktivator löschen');
    fireEvent.click(deleteButton);
    expect(screen.getByText('Updating...')).toBeDefined();
  });

  expect(updateModel.mock.calls.length).toEqual(1);
});

it('ForwardCard parameter change triggers data update', async () => {
  const updateModel = jest.fn();
  const currentFunction: ModelFunction = {
    function: activationFunctions[0],
    id: 3,
    parameterData: {
      input: {
        value: '3'
      }
    }
  };

  render(
    <MockModelContextProvider updateModel={updateModel} activationFunctions={activationFunctions}>
      <ForwardCard currentFunction={currentFunction} />
    </MockModelContextProvider>
  );

  expect(screen.getByLabelText('input')).toBeDefined();

  await act(async () => {
    const inputInput = await screen.findByLabelText('input');
    fireEvent.change(inputInput, { target: { value: '284' } });
    fireEvent.blur(inputInput);
    expect(screen.getByText('Updating...')).toBeDefined();
  });

  expect(updateModel.mock.calls.length).toEqual(1);
});
