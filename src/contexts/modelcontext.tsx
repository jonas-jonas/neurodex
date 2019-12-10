import React from 'react';
import { User } from './auth';

/**
 * Data used in the ModelContext
 */
type ModelContextData = {
	createNewModel: () => Promise<string>;
};

/**
 * Datamodel of the Model class
 *
 * The data for a model returned from the API
 */
export type Model = {
	name: string;
	id: string;
	user?: User;
	created: Date;
	updated: Date;
};

export const ModelContext = React.createContext<ModelContextData>({
	createNewModel: () => Promise.reject()
});

export const ModelContextProvider: React.FC = ({ children }) => {
	/**
	 * Fetches the model corresponding to the given id from the API
	 */
	const fetchModel = async (id: String) => {
		//TODO: Add API logic
	};

	/**
	 * Creates a new model and returns its id
	 *
	 * The API is asked to create a new model and return its id.
	 *
	 */
	const createNewModel = async (): Promise<string> => {
		//TODO: Add API logic
		return new Promise((resolve, reject) => {
			setTimeout(resolve, 2000);
		});
	};

	return (
		<ModelContext.Provider value={{ createNewModel }}>
			{children}
		</ModelContext.Provider>
	);
};
