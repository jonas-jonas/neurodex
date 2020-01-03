import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ModelLayerCard from '../../../components/modelpage/ModelLayerCard';
import MockModelContextProvider from '../../contexts/modelcontext.mock';
import { act } from 'react-dom/test-utils';

afterEach(cleanup);

const modelLayer =
{
	id: 1,
	layerName: 'some-layer',
	parameterData: {
		'in_features': '128',
		'bias': 'true'
	},
	layerType: {
		id: 'torch.nn.Linear',
		description: '',
		layerName: 'linear',
		parameters: [
			{ name: 'in_features', type: 'number', defaultValue: '3' },
			{ name: 'bias', type: 'boolean', defaultValue: 'true' }
		]
	}
}

it('Renders ModelLayerCard with correct model layer', () => {
	render(<ModelLayerCard modelLayer={modelLayer} index={0} />);

	expect(screen.queryByDisplayValue('some-layer')).toBeDefined()
	expect(screen.queryByText('torch.nn.Linear')).toBeDefined();
	expect(screen.queryByLabelText('in_features')).toBeInstanceOf(HTMLInputElement);
	let inFeaturesInput = screen.getByLabelText('in_features') as HTMLInputElement;
	expect(inFeaturesInput.value).toBe('128');
	// 2 is the number of parameters in the layer
	expect(screen.queryAllByTestId('parameters-1').length).toBe(2);
});

it('Deleting a layer triggers delete call', async () => {

	const deleteLayer = jest.fn();

	render(<MockModelContextProvider deleteLayer={deleteLayer}>
		<ModelLayerCard modelLayer={modelLayer} index={0} />
	</MockModelContextProvider>);

	await act(async () => {
		const deleteButton = await screen.findByTitle('Layer some-layer löschen');
		fireEvent.click(deleteButton);
		expect(screen.getByText('Updating...')).toBeDefined();
	});

	expect(deleteLayer.mock.calls.length).toEqual(1);
	// The parameter with which the deleteLayer function was called should be 
	// the id of the layer
	expect(deleteLayer.mock.calls[0][0]).toEqual(1);
});

it('Updating values triggers updateLayer call', async () => {

	const updateLayer = jest.fn();

	render(<MockModelContextProvider updateLayer={updateLayer}>
		<ModelLayerCard modelLayer={modelLayer} index={0} />
	</MockModelContextProvider>);

	await act(async () => {
		const inFeaturesInput = await screen.findByLabelText('in_features');
		fireEvent.change(inFeaturesInput, { target: { value: '256' } });
		fireEvent.blur(inFeaturesInput);
		expect(screen.getByText('Updating...')).toBeDefined();
	});

	expect(updateLayer.mock.calls.length).toEqual(1);
	// The parameter with which the deleteLayer function was called should be 
	// the id of the layer
	expect(updateLayer.mock.calls[0][0]).toEqual(1);
});
