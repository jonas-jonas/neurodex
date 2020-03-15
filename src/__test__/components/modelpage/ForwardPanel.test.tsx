import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ForwardPanel from '../../../components/modelpage/ForwardPanel';
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

it('ForwardPanel renders ForwardCards for functions', async () => {
  const functions: ModelFunction[] = [
    {
      function: activationFunctions[0],
      id: 1,
      parameterData: {}
    }
  ];

  render(
    <MockModelContextProvider functions={functions}>
      <ForwardPanel />
    </MockModelContextProvider>
  );

  const forwardCards = screen.getAllByTestId('model-function-card');
  expect(forwardCards.length).toBe(1);
});

it('ForwardPanel: Add function triggers update', async () => {
  const updateModel = jest.fn();

  render(
    <MockModelContextProvider updateModel={updateModel} activationFunctions={activationFunctions}>
      <ForwardPanel />
    </MockModelContextProvider>
  );

  act(() => {
    const addButton = screen.getByTitle('Funktion hinzufügen');
    fireEvent.click(addButton);
  });

  expect(updateModel.mock.calls.length).toBe(1);
});
