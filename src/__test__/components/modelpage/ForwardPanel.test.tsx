import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ForwardCard from '../../../components/modelpage/ForwardCard';
import { ActivationFunction, ModelFunction } from '../../../data/models';
import MockModelContextProvider from '../../contexts/modelcontext.mock';
import ForwardPanel from '../../../components/modelpage/ForwardPanel';

afterEach(cleanup);

const activationFunctions: ActivationFunction[] = [
  {
    description: '',
    id: 1,
    name: 'F.relu',
    parameters: [
      {
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
