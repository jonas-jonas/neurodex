import ky, { NormalizedOptions } from 'ky';
import { Model } from '../data/models';

const refreshToken = async (request: Request, options: NormalizedOptions, response: Response) => {
  if (response.status === 401) {
    const json = await response.json();
    const message = json['message'];
    if (message === "access token expired") {
      // Access tokens are set as cookies, just wait for the request to
      // finish and every subsequent request has the right tokens.
      await ky.post('/api/auth/refresh-token');
      return ky(request);
    }
  }
}

export const api = ky.extend({
  prefixUrl: '/api',
  hooks: {
    afterResponse: [refreshToken]
  },
});

const addLayer = async (modelId: string, layerTypeId: string) => {
  const data = {
    layerId: layerTypeId
  }
  const response = await api.post('models/' + modelId + '/layers', { json: data });

  const model = await response.json();
  return model;
};

const deleteLayer = async (modelId: string, layerId: number): Promise<Model> => {
  const response = await api.delete('models/' + modelId + '/layers/' + layerId);
  const model = await response.json();
  return model;
};

const updateLayer = async (modelId: string, layerId: number, parameterName: string, newData: string) => {
  const data = {
    value: newData
  }

  const response = await api.put(`models/${modelId}/layers/${layerId}/data/${parameterName}`, { json: data });

  const model = await response.json();

  return model;
};

const updateOrder = async (modelId: string, modelLayerId: number, newIndex: number) => {
  const data = {
    index: newIndex
  }

  const response = await api.put('models/' + modelId + '/layers/' + modelLayerId + '/order', { json: data });
  const model = await response.json();

  return model;
};

const addFunction = async (modelId: string, functionId: number) => {
  const data = {
    functionId
  }

  const response = await api.post('models/' + modelId + '/functions', {
    json: data
  });

  const model = await response.json();

  return model;
};

const deleteFunction = async (modelId: string, modelFunctionId: number) => {
  const response = await api.delete('models/' + modelId + '/functions/' + modelFunctionId);

  const model = await response.json();

  return model;
};

const updateModelFunctionActivator = async (modelId: string, modelFunctionId: number, functionId: number) => {
  const data = {
    functionId
  }

  const response = await api.put('models/' + modelId + '/functions/' + modelFunctionId + '/activator', { json: data });

  const model = await response.json();

  return model;
};

const updateModelFunctionData = async (
  modelId: string,
  modelFunctionId: number,
  parameterName: string,
  newData: any
) => {
  const data = {
    value: newData
  }

  const response = await api.put('models/' + modelId + '/functions/' + modelFunctionId + '/data/' + parameterName, {
    json: data
  });

  const model = await response.json();

  return model;
};

export const dispatchModelApi = async (modelId: string, action: Actions) => {
  switch (action.type) {
    case 'ADD_LAYER':
      return await addLayer(modelId, action.layerTypeId);
    case 'DELETE_LAYER':
      return await actions.deleteLayer(modelId, action.modelLayerId);
    case 'UPDATE_LAYER':
      return await actions.updateLayer(modelId, action.modelLayerId, action.parameterName, action.newValue);
    case 'UPDATE_LAYER_ORDER':
      return await actions.updateOrder(modelId, action.modelLayerId, action.newIndex);
    case 'ADD_MODEL_FUNCTION':
      return await actions.addFunction(modelId, action.activationFunctionId);
    case 'DELETE_MODEL_FUNCTION':
      return await actions.deleteFunction(modelId, action.modelFunctionId);
    case 'UPDATE_MODEL_FUNCTION_ACTIVATOR':
      return await actions.updateModelFunctionActivator(modelId, action.modelFunctionId, action.functionId);
    case 'UPDATE_MODEL_FUNCTION_DATA':
      return await actions.updateModelFunctionData(
        modelId,
        action.modelFunctionId,
        action.parameterName,
        action.newData
      );
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

type UpdateLayer = {
  type: 'UPDATE_LAYER';
  modelLayerId: number;
  parameterName: string;
  newValue: string;
};

type UpdateLayerOrder = {
  type: 'UPDATE_LAYER_ORDER';
  modelLayerId: number;
  newIndex: number;
};

type AddModelFunction = {
  type: 'ADD_MODEL_FUNCTION';
  activationFunctionId: number;
};

type DeleteModelFunction = {
  type: 'DELETE_MODEL_FUNCTION';
  modelFunctionId: number;
};

type UpdateModelFunctionActivator = {
  type: 'UPDATE_MODEL_FUNCTION_ACTIVATOR';
  modelFunctionId: number;
  functionId: number;
};

type UpdateModelFunctionData = {
  type: 'UPDATE_MODEL_FUNCTION_DATA';
  modelFunctionId: number;
  parameterName: string;
  newData: string;
};

export type Actions =
  | AddLayer
  | DeleteLayer
  | UpdateLayer
  | UpdateLayerOrder
  | AddModelFunction
  | DeleteModelFunction
  | UpdateModelFunctionActivator
  | UpdateModelFunctionData;

export const actions = {
  addLayer,
  deleteLayer,
  updateLayer,
  updateOrder,
  addFunction,
  deleteFunction,
  updateModelFunctionActivator,
  updateModelFunctionData
};
