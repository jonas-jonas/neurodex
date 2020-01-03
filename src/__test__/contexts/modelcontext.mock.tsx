import React from 'react';
import { LayerType, Model, ModelLayer } from '../../data/models';
import { ModelContext } from '../../contexts/modelcontext';


type ModelContextProps = {
	model?: Model;
	setModel: ((model: Model) => void);
	availableLayers: LayerType[];
	deleteLayer: (layerId: number) => Promise<boolean>;
	updateLayer: (layerId: number, parameterName: string, newValue: string) => Promise<boolean>;
	updateOrder: (modelLayerId: number, newIndex: number) => Promise<boolean>;
}

type MockModelContextProvider = {
	layers?: ModelLayer[];
	deleteLayer?: (layerId: number) => Promise<boolean>;
	updateLayer?: (layerId: number, parameterName: string, newValue: string) => Promise<boolean>;
	updateOrder?: (modelLayerId: number, newIndex: number) => Promise<boolean>;
}

const MockModelContextProvider: React.FC<MockModelContextProvider> = ({ children, layers, deleteLayer, updateLayer, updateOrder }) => {

	return (
		<ModelContext.Provider value={{
			model: {
				id: 'some-id',
				name: 'model-name',
				user: {
					id: 'test-user-id',
					username: 'test-user',
					admin: false
				},
				createdAt: '2019-12-30 18:13:18.889242',
				updatedAt: '2019-12-30 18:13:18.889242',
				layers: layers || []
			},
			setModel: () => { },
			availableLayers: [],
			deleteLayer: deleteLayer || jest.fn(),
			updateLayer: updateLayer || jest.fn(),
			updateOrder: updateOrder || jest.fn()
		}}>
			{children}
		</ModelContext.Provider>
	);
}

export default MockModelContextProvider;
