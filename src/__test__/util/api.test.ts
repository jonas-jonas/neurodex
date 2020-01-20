import { api, dispatchModelApi } from '../../util/api';
import { Model } from '../../data/models';
import { mockModel } from '../../__mocks__/modelcontext.mock';

const modelId = 'some-model-id';

const buildResponse = (model: Model) => {
  return new Response(JSON.stringify({ model }));
};

describe('dispatchModelApi', () => {
  it('AddLayer action', async () => {
    const mock = jest.spyOn(api, 'post');
    mock.mockResolvedValue(buildResponse(mockModel));

    const returnedModel: Model = await dispatchModelApi(modelId, {
      type: 'ADD_LAYER',
      layerTypeId: '3'
    });
    expect(returnedModel).toStrictEqual(mockModel);
    expect(mock.mock.calls[0][0]).toBe('model/some-model-id/layer');
  });
});
