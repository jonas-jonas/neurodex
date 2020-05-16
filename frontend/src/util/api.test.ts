import { api, dispatchModelApi } from './api';
import { Model } from '../data/models';
import generate from './generate';

const modelId = 'some-model-id';

const buildResponse = (model: Model) => {
  return new Response(JSON.stringify(model));
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('dispatchModelApi', () => {
  let model: Model;

  beforeEach(() => {
    model = generate.model({ modelId: 'some-model-id' });
  });

  it('AddLayer', async () => {
    const apiMock = jest.spyOn(api, 'post');
    apiMock.mockResolvedValue(buildResponse(model));

    const returnedModel: Model = await dispatchModelApi(model.modelId, {
      type: 'ADD_LAYER',
      layerTypeId: '3',
    });
    expect(returnedModel).toStrictEqual(model);
    expect(apiMock).toBeCalledWith('models/some-model-id/layers', { json: { layerId: '3' } });
  });

  it('DeleteLayer', async () => {
    const mock = jest.spyOn(api, 'delete');
    mock.mockResolvedValue(buildResponse(model));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'DELETE_LAYER',
      modelLayerId: 3,
    });
    expect(returnedModel).toStrictEqual(model);
    expect(mock.mock.calls[0][0]).toBe('models/some-model-id/layers/3');
  });

  it('UpdateLayer', async () => {
    const mock = jest.spyOn(api, 'put');
    mock.mockResolvedValue(buildResponse(model));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'UPDATE_MODEL_LAYER_PARAMETER_DATA',
      modelLayerId: 3,
      parameterName: 'some-parameter-name',
      newValue: '3',
    });
    expect(returnedModel).toStrictEqual(model);
    expect(mock).toBeCalledWith('models/some-model-id/layers/3/data/some-parameter-name', { json: { newValue: '3' } });
  });

  it('UpdateActivatorOrder', async () => {
    const mock = jest.spyOn(api, 'put');
    mock.mockResolvedValue(buildResponse(model));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'UPDATE_MODEL_ACTIVATOR_ORDER',
      activatorId: 3,
      newIndex: 3,
    });
    expect(returnedModel).toStrictEqual(model);
    expect(mock).toBeCalledWith('models/some-model-id/activators/3/order', { json: { newIndex: 3 } });
  });

  it('AddModelActivator', async () => {
    const mock = jest.spyOn(api, 'post');
    mock.mockResolvedValue(buildResponse(model));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'ADD_MODEL_ACTIVATOR',
      activatorId: 3,
    });
    expect(returnedModel).toStrictEqual(model);
    expect(mock).toBeCalledWith('models/some-model-id/activators', { json: { activatorId: 3 } });
  });

  it('DeleteActivator', async () => {
    const mock = jest.spyOn(api, 'delete');
    mock.mockResolvedValue(buildResponse(model));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'DELETE_MODEL_ACTIVATOR',
      modelActivatorId: 3,
    });
    expect(returnedModel).toStrictEqual(model);
    expect(mock).toBeCalledWith('models/some-model-id/activators/3');
  });
});
