import React from 'react';
import { ModelContext } from '../contexts/modelcontext';
import { ModelLayer, Function, ModelFunction, LayerType } from '../data/models';
import { Actions } from '../util/api';

type MockModelContextProvider = {
  layers?: ModelLayer[];
  functions?: ModelFunction[];
  updateModel?: (action: Actions) => Promise<boolean>;
  activationFunctions?: Function[];
  availableLayers?: LayerType[];
};

export const mockModel = {
  id: 'some-id',
  name: 'model-name',
  user: {
    id: 'test-user-id',
    email: 'test-user',
    roles: []
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
  activationFunctions,
  availableLayers
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
        setModel: () => { },
        availableLayers: availableLayers || [],
        activationFunctions: activationFunctions || []
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export default MockModelContextProvider;
