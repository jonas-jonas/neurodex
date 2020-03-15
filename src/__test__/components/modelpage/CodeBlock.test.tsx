import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import CodeBlock from '../../../components/modelpage/CodeBlock';
import { Model } from '../../../data/models';

afterEach(cleanup);

it('CodeBlock renders layers correctly', async () => {
  const model: Model = {
    id: 'some-id',
    name: 'ModelName',
    user: {
      roles: [],
      id: 'user-id',
      email: 'email@test.com'
    },
    createdAt: 'created-at',
    updatedAt: 'updated-at',
    functions: [],
    layers: [
      {
        id: 3,
        layerName: 'linear',
        layerType: {
          description: '',
          id: 'torch.nn.Linear',
          layerName: 'linear',
          parameters: [
            {
              name: 'in_features',
              defaultValue: '3',
              type: 'number'
            }
          ]
        },
        parameterData: {}
      }
    ]
  };

  render(<CodeBlock model={model} />);

  const layerLine = await screen.findAllByText('self.linear = torch.nn.Linear(in_features=');
  expect(layerLine.length).toBe(1);
});

it('CodeBlock renders functions correctly', async () => {
  const model: Model = {
    id: 'some-id',
    name: 'ModelName',
    user: {
      roles: [],
      id: 'user-id',
      email: 'email@test.com'
    },
    createdAt: 'created-at',
    updatedAt: 'updated-at',
    functions: [
      {
        id: 3,
        function: {
          description: '',
          id: 1,
          name: 'F.relu',
          parameters: [
            {
              id: 3,
              name: 'input',
              defaultValue: '',
              type: 'layer'
            }
          ]
        },
        parameterData: {}
      }
    ],
    layers: []
  };

  render(<CodeBlock model={model} />);

  const functionLine = await screen.findAllByText('inputs = F.relu()');
  expect(functionLine.length).toBe(1);
});

it('CodeBlock renders TODO if no layers or functions are configured', async () => {
  const model: Model = {
    id: 'some-id',
    name: 'ModelName',
    user: {
      roles: [],
      id: 'user-id',
      email: 'email@test.com'
    },
    createdAt: 'created-at',
    updatedAt: 'updated-at',
    functions: [],
    layers: []
  };

  render(<CodeBlock model={model} />);

  const todos = await screen.findAllByText('TODO:');
  expect(todos.length).toBe(2);
});
