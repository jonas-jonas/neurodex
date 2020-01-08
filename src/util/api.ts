import ky from 'ky';
import { Model } from '../data/models';

export const api = ky.extend({
	prefixUrl: '/api'
});

const deleteLayer = async (
	modelId: string,
	layerId: number
): Promise<Model> => {
	const response = await api.delete('model/' + modelId + '/layer/' + layerId);
	const { model } = await response.json();
	return model;
};

const updateLayer = async (
	modelId: string,
	layerId: number,
	parameterName: string,
	newData: string
) => {
	const data = new FormData();
	data.append('value', newData);

	const response = await api.put(
		`model/${modelId}/layer/${layerId}/data/${parameterName}`,
		{ body: data }
	);

	const { model } = await response.json();

	return model;
};

const updateOrder = async (
	modelId: string,
	modelLayerId: number,
	newIndex: number
) => {
	const data = new FormData();
	data.append('index', String(newIndex));

	const response = await api.put(
		'model/' + modelId + '/layer/' + modelLayerId + '/order',
		{ body: data }
	);
	const { model } = await response.json();

	return model;
};

const addFunction = async (modelId: string, functionId: number) => {
	const data = new FormData();
	data.append('functionId', String(functionId));

	const response = await api.post('model/' + modelId + '/functions', {
		body: data
	});

	const { model } = await response.json();

	return model;
};

const deleteFunction = async (modelId: string, modelFunctionId: number) => {
	const response = await api.delete(
		'model/' + modelId + '/functions/' + modelFunctionId
	);

	const { model } = await response.json();

	return model;
};

const updateModelFunctionActivator = async (
	modelId: string,
	modelFunctionId: number,
	functionId: number
) => {
	const data = new FormData();
	data.append('functionId', String(functionId));

	const response = await api.put(
		'model/' + modelId + '/functions/' + modelFunctionId + '/activator',
		{ body: data }
	);

	const { model } = await response.json();

	return model;
};

const updateModelFunctionData = async (
	modelId: string,
	modelFunctionId: number,
	parameterName: string,
	newData: any
) => {
	const data = new FormData();
	data.append('value', newData);

	const response = await api.put(
		'model/' +
		modelId +
		'/functions/' +
		modelFunctionId +
		'/data/' +
		parameterName,
		{ body: data }
	);

	const { model } = await response.json();

	return model;
};

export const actions = {
	deleteLayer,
	updateLayer,
	updateOrder,
	addFunction,
	deleteFunction,
	updateModelFunctionActivator,
	updateModelFunctionData
};
