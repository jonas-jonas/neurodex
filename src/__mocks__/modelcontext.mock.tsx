import React from 'react';
import { ModelContext } from '../contexts/modelcontext';
import { ModelLayer, ActivationFunction, ModelFunction } from '../data/models';
import { Actions } from '../util/api';

type MockModelContextProvider = {
  layers?: ModelLayer[];
  functions?: ModelFunction[];
  updateModel?: (action: Actions) => Promise<boolean>;
  activationFunctions?: ActivationFunction[];
};

export const mockModel = {
  id: 'some-id',
  name: 'model-name',
  user: {
    id: 'test-user-id',
    username: 'test-user',
    admin: false
  },
  createdAt: '2019-12-30 18:13:18.889242',
  updatedAt: '2019-12-30 18:13:18.889242',
  layers: [],
  functions: []
};

const MockModelContextProvider: React.FC<MockModelContextProvider> = ({
  children,
  layers,
  functions,
  updateModel,
  activationFunctions
}) => {
  return (
    <ModelContext.Provider
      value={{
        model: {
          ...mockModel,
          functions: functions || [],
          layers: layers || []
        },
        updateModel: updateModel || jest.fn(),
        setModel: () => {},
        availableLayers: [],
        activationFunctions: activationFunctions || []
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export default MockModelContextProvider;
