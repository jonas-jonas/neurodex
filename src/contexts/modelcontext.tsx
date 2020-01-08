import React, { useEffect, useState } from 'react';
import { ActivationFunction, LayerType, Model } from '../data/models';
import { Actions, api, dispatchModelApi } from '../util/api';

type ModelContextProps = {
  model: Model;
  setModel: (model: Model) => void;
  availableLayers: LayerType[];
  activationFunctions: ActivationFunction[];
  updateModel: (action: Actions) => Promise<boolean>;
};

export const ModelContext = React.createContext<ModelContextProps | null>(null);

export type ModelContextProviderProps = {
  initialModel: Model;
};

export const ModelContextProvider: React.FC<ModelContextProviderProps> = ({ children, initialModel }) => {
  const [model, setModel] = useState<Model>(initialModel);
  const [availableLayers, setAvailableLayers] = useState<LayerType[]>([]);
  const [activationFunctions, setActivationFunctions] = useState<ActivationFunction[]>([]);

  const updateModel = async (action: Actions) => {
    try {
      const newModel = await dispatchModelApi(model.id, action);
      setModel(newModel);
    } catch (error) {
      //TODO: Maybe handle error?
      return false;
    }
    return true;
  };

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

  return (
    <ModelContext.Provider
      value={{
        updateModel,
        model,
        setModel,
        availableLayers,
        activationFunctions
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useModelContext = () => {
  const context = React.useContext(ModelContext);
  if (!context) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useModelContext must be used within a ModelContextProvider.');
  }
  return context;
};
