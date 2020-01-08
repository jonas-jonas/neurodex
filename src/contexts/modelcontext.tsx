import React, { useContext, useEffect, useState } from 'react';
import { ActivationFunction, LayerType, Model } from '../data/models';
import { actions, api } from '../util/api';
import { PageContext } from './pagecontext';

type ModelContextProps = {
	model?: Model;
	setModel: (model: Model) => void;
	availableLayers: LayerType[];
	activationFunctions: ActivationFunction[];
	deleteLayer: (layerId: number) => Promise<boolean>;
	updateLayer: (
		layerId: number,
		parameterName: string,
		newValue: string
	) => Promise<boolean>;
	updateOrder: (modelLayerId: number, newIndex: number) => Promise<boolean>;
	addModelFunction: (functionId: number) => Promise<boolean>;
	deleteModelFunction: (modelFunctionId: number) => Promise<boolean>;
	updateModelFunctionActivator: (
		modelFunctionId: number,
		functionId: number
	) => Promise<boolean>;
	updateModelFunctionData: (
		modelFunctionId: number,
		parameterName: string,
		newData: string
	) => Promise<boolean>;
};

export const ModelContext = React.createContext<ModelContextProps>({
	setModel: () => { },
	availableLayers: [],
	activationFunctions: [],
	deleteLayer: () => Promise.reject(false),
	updateLayer: () => Promise.reject(false),
	updateOrder: () => Promise.reject(false),
	addModelFunction: () => Promise.reject(false),
	deleteModelFunction: () => Promise.reject(false),
	updateModelFunctionActivator: () => Promise.reject(false),
	updateModelFunctionData: () => Promise.reject(false)
});

export type ModelContextProviderProps = {
	modelId: string | undefined;
};

export const ModelContextProvider: React.FC<ModelContextProviderProps> = ({
	children,
	modelId
}) => {
	const { setPageTitle } = useContext(PageContext);
	const [model, setModel] = useState<Model>();
	const [availableLayers, setAvailableLayers] = useState<LayerType[]>([]);
	const [activationFunctions, setActivationFunctions] = useState<
		ActivationFunction[]
	>([]);

	useEffect(() => {
		/**
		 * Fetches all available layers into the state
		 */
		const fetchLayers = async () => {
			try {
				const response = await api.get('layer');
				const { layers } = await response.json();
				setAvailableLayers(layers);
			} catch (error) {
				//TODO: Handle error
				setAvailableLayers([]);
			}
		};

		const fetchActivationFunctions = async () => {
			try {
				const response = await api.get('functions');
				const { functions } = await response.json();
				setActivationFunctions(functions);
			} catch (error) {
				//TODO: Handle error
				setActivationFunctions([]);
			}
		};

		fetchLayers();
		fetchActivationFunctions();
	}, []);

	/**
	 * Deletes a layer with a given id
	 *
	 * @param layerId the id of the deleted layer
	 * @returns {Promise<boolean>} true if the layer was deleted, false otherwise
	 */
	const deleteLayer = async (layerId: number): Promise<boolean> => {
		if (model) {
			try {
				const newModel = await actions.deleteLayer(model.id, layerId);
				setModel(newModel);
				return true;
			} catch (e) {
				return false;
			}
		}
		return false;
	};

	/**
	 * Updates data of a parameter in a layer
	 *
	 * @param layerId the id of the updated layer
	 * @param parameterName the name of the updated parameter
	 * @param newData the updated data
	 * @returns {Promise<boolean>} true if the layer was updated, false otherwise
	 */
	const updateLayer = async (
		layerId: number,
		parameterName: string,
		newData: string
	): Promise<boolean> => {
		if (model) {
			try {
				const newModel = await actions.updateLayer(
					model.id,
					layerId,
					parameterName,
					newData
				);
				setModel(newModel);
				return true;
			} catch (e) {
				return false;
			}
		}
		return false;
	};

	const updateOrder = async (modelLayerId: number, newIndex: number) => {
		if (model) {
			try {
				const newModel = await actions.updateOrder(
					model.id,
					modelLayerId,
					newIndex
				);
				setModel(newModel);
				return true;
			} catch (e) {
				return false;
			}
		}
		return false;
	};

	const addModelFunction = async (functionId: number) => {
		if (model) {
			try {
				const newModel = await actions.addFunction(model.id, functionId);
				setModel(newModel);
				return true;
			} catch (e) {
				return false;
			}
		}
		return false;
	};

	const deleteModelFunction = async (modelFunctionId: number) => {
		if (model) {
			try {
				const newModel = await actions.deleteFunction(
					model.id,
					modelFunctionId
				);
				setModel(newModel);
				return true;
			} catch (e) {
				return false;
			}
		}
		return false;
	};

	const updateModelFunctionActivator = async (
		modelFunctionId: number,
		functionId: number
	) => {
		if (model) {
			try {
				const newModel = await actions.updateModelFunctionActivator(
					model.id,
					modelFunctionId,
					functionId
				);
				setModel(newModel);
				return true;
			} catch (e) {
				return false;
			}
		}
		return false;
	};

	const updateModelFunctionData = async (
		modelFunctionId: number,
		parameterName: string,
		newData: string
	) => {
		if (model) {
			try {
				const newModel = await actions.updateModelFunctionData(
					model.id,
					modelFunctionId,
					parameterName,
					newData
				);
				setModel(newModel);
				return true;
			} catch (error) {
				return false;
			}
		}
		return false;
	};

	useEffect(() => {
		/**
		 * Fetches the current model object
		 */
		const fetchModel = async () => {
			const response = await api.get('model/' + modelId);
			if (response.status === 200) {
				const { model }: { model: Model } = await response.json();
				setPageTitle(model.name);
				setModel(model);
			}
		};
		fetchModel();

		return () => {
			setPageTitle('');
		};
	}, [modelId, setPageTitle]);

	return (
		<ModelContext.Provider
			value={{
				model,
				setModel,
				availableLayers,
				deleteLayer,
				updateLayer,
				updateOrder,
				activationFunctions,
				addModelFunction,
				deleteModelFunction,
				updateModelFunctionActivator,
				updateModelFunctionData
			}}
		>
			{children}
		</ModelContext.Provider>
	);
};
