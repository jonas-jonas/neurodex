import ky, { NormalizedOptions } from 'ky';
import { Model } from '../data/models';

const refreshToken = async (request: Request, options: NormalizedOptions, response: Response) => {
  if (response.status === 401) {
    const json = await response.json();
    const message = json['message'];
    if (message === 'access token expired') {
      // Access tokens are set as cookies, just wait for the request to
      // finish and every subsequent request has the right tokens.
      await ky.post('/api/auth/refresh-token');
      return ky(request);
    }
  }
};

export const api = ky.extend({
  prefixUrl: '/api',
  hooks: {
    afterResponse: [refreshToken],
  },
});

const addLayer = async (modelId: string, layerTypeId: string) => {
  const data = {
    layerId: layerTypeId,
  };
  const response = await api.post('models/' + modelId + '/layers', { json: data });

  const model = await response.json();
  return model;
};

const deleteLayer = async (modelId: string, layerId: number): Promise<Model> => {
  const response = await api.delete('models/' + modelId + '/layers/' + layerId);
  const model = await response.json();
  return model;
};

const updateModelLayerParameterData = async (modelId: string, action: UpdateModelLayerParameterData) => {
  const data = {
    newValue: action.newValue,
  };

  const response = await api.put(`models/${modelId}/layers/${action.modelLayerId}/data/${action.parameterName}`, {
    json: data,
  });

  const model = await response.json();

  return model;
};

const updateModelActivatorOrder = async (modelId: string, action: UpdateModelActivatorOrder) => {
  const data = {
    newIndex: action.newIndex,
  };

  const response = await api.put('models/' + modelId + '/activators/' + action.activatorId + '/order', { json: data });
  const model = await response.json();

  return model;
};

const addModelActivator = async (modelId: string, action: AddModelActivator) => {
  const data = {
    activatorId: action.activatorId,
  };

  const response = await api.post('models/' + modelId + '/activators', {
    json: data,
  });

  const model = await response.json();

  return model;
};

const deleteModelActivator = async (modelId: string, action: DeleteModelActivator) => {
  const response = await api.delete('models/' + modelId + '/activators/' + action.modelActivatorId);

  const model = await response.json();

  return model;
};

// const updateModelFunctionData = async (modelId: string, action: UpdateModelFunctionData) => {
//   const data = {
//     parameters: action.parameters,
//   };

//   const response = await api.put('models/' + modelId + '/functions/' + action.modelFunctionId + '/parameters', {
//     json: data,
//   });

//   const model = await response.json();

//   return model;
// };

const updateModelActivatorParameterData = async (modelId: string, action: UpdateModelActivatorParameterData) => {
  const data = {
    newValue: action.newValue,
  };

  const response = await api.put(
    'models/' + modelId + '/activators/' + action.modelActivatorId + '/data/' + action.parameterName,
    {
      json: data,
    }
  );

  const model = await response.json();

  return model;
};

export const dispatchModelApi = async (modelId: string, action: Actions) => {
  switch (action.type) {
    case 'ADD_LAYER':
      return await addLayer(modelId, action.layerTypeId);
    case 'DELETE_LAYER':
      return await actions.deleteLayer(modelId, action.modelLayerId);
    case 'UPDATE_MODEL_LAYER_PARAMETER_DATA':
      return await actions.updateModelLayerParameterData(modelId, action);
    case 'UPDATE_MODEL_ACTIVATOR_ORDER':
      return await actions.updateModelActivatorOrder(modelId, action);
    case 'ADD_MODEL_ACTIVATOR':
      return await actions.addModelActivator(modelId, action);
    case 'DELETE_MODEL_ACTIVATOR':
      return await actions.deleteModelActivator(modelId, action);
    case 'UPDATE_MODEL_ACTIVATOR_PARAMETER_DATA':
      return await actions.updateModelActivatorParameterData(modelId, action);
  }
};

type AddLayer = {
  type: 'ADD_LAYER';
  layerTypeId: string;
};

type DeleteLayer = {
  type: 'DELETE_LAYER';
  modelLayerId: number;
};

type UpdateModelLayerParameterData = {
  type: 'UPDATE_MODEL_LAYER_PARAMETER_DATA';
  modelLayerId: number;
  parameterName: string;
  newValue: string;
};

type UpdateModelActivatorOrder = {
  type: 'UPDATE_MODEL_ACTIVATOR_ORDER';
  activatorId: number;
  newIndex: number;
};

type AddModelActivator = {
  type: 'ADD_MODEL_ACTIVATOR';
  activatorId: number;
};

type DeleteModelActivator = {
  type: 'DELETE_MODEL_ACTIVATOR';
  modelActivatorId: number;
};

type UpdateModelActivatorParameterData = {
  type: 'UPDATE_MODEL_ACTIVATOR_PARAMETER_DATA';
  modelActivatorId: number;
  parameterName: string;
  newValue: string | number | boolean; // Later: layer
};

export type Actions =
  | AddLayer
  | DeleteLayer
  | UpdateModelLayerParameterData
  | UpdateModelActivatorOrder
  | AddModelActivator
  | DeleteModelActivator
  | UpdateModelActivatorParameterData;

export const actions = {
  addLayer,
  deleteLayer,
  updateModelLayerParameterData,
  updateModelActivatorOrder,
  addModelActivator,
  deleteModelActivator,
  updateModelActivatorParameterData,
};
