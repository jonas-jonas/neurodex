import { api, dispatchModelApi } from '../../util/api';
import { Model } from '../../data/models';
import { mockModel } from '../__mocks__/modelcontext.mock';

const modelId = 'some-model-id';

const buildResponse = (model: Model) => {
  return new Response(JSON.stringify(model));
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('dispatchModelApi', () => {
  it('AddLayer', async () => {
    const mock = jest.spyOn(api, 'post');
    mock.mockResolvedValue(buildResponse(mockModel));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'ADD_LAYER',
      layerTypeId: '3',
    });
    expect(returnedModel).toStrictEqual(mockModel);
    expect(mock.mock.calls[0][0]).toBe('models/some-model-id/layers');
    expect(mock.mock.calls[0][1]?.json).toEqual({ layerId: '3' });
  });

  it('DeleteLayer', async () => {
    const mock = jest.spyOn(api, 'delete');
    mock.mockResolvedValue(buildResponse(mockModel));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'DELETE_LAYER',
      modelLayerId: 3,
    });
    expect(returnedModel).toStrictEqual(mockModel);
    expect(mock.mock.calls[0][0]).toBe('models/some-model-id/layers/3');
  });

  it('UpdateLayer', async () => {
    const mock = jest.spyOn(api, 'put');
    mock.mockResolvedValue(buildResponse(mockModel));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'UPDATE_LAYER',
      modelLayerId: 3,
      parameterName: 'some-parameter-name',
      newValue: '3',
    });
    expect(returnedModel).toStrictEqual(mockModel);
    expect(mock.mock.calls[0][0]).toBe('models/some-model-id/layers/3/data/some-parameter-name');
    expect(mock.mock.calls[0][1]?.json).toEqual({ value: '3' });
  });

  it('UpdateOrder', async () => {
    const mock = jest.spyOn(api, 'put');
    mock.mockResolvedValue(buildResponse(mockModel));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'UPDATE_LAYER_ORDER',
      modelLayerId: 3,
      newIndex: 3,
    });
    expect(returnedModel).toStrictEqual(mockModel);
    expect(mock.mock.calls[0][0]).toBe('models/some-model-id/layers/3/order');
    expect(mock.mock.calls[0][1]?.json).toEqual({ index: 3 });
  });

  it('AddFunction', async () => {
    const mock = jest.spyOn(api, 'post');
    mock.mockResolvedValue(buildResponse(mockModel));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'ADD_MODEL_FUNCTION',
      activationFunctionId: 3,
    });
    expect(returnedModel).toStrictEqual(mockModel);
    expect(mock.mock.calls[0][0]).toBe('models/some-model-id/functions');
    expect(mock.mock.calls[0][1]?.json).toEqual({ functionId: 3 });
  });

  it('DeleteFunction', async () => {
    const mock = jest.spyOn(api, 'delete');
    mock.mockResolvedValue(buildResponse(mockModel));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'DELETE_MODEL_FUNCTION',
      modelFunctionId: 3,
    });
    expect(returnedModel).toStrictEqual(mockModel);
    expect(mock.mock.calls[0][0]).toBe('models/some-model-id/functions/3');
  });

  it('UpdateModelFunctionData', async () => {
    const mock = jest.spyOn(api, 'put');
    mock.mockResolvedValue(buildResponse(mockModel));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'UPDATE_MODEL_FUNCTION_DATA',
      parameters: { 'some-parameter': 'some-data' },
      modelFunctionId: 2,
    });
    expect(returnedModel).toStrictEqual(mockModel);
    expect(mock).toBeCalledWith('models/some-model-id/functions/2/parameters', {
      json: {
        parameters: {
          'some-parameter': 'some-data',
        },
      },
    });
  });
});
