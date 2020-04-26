import React, { useEffect, useState } from 'react';
import { Function, LayerType, Model } from '../data/models';
import { Actions, api, dispatchModelApi } from '../util/api';
import { toast } from 'react-toastify';

type ModelContextProps = {
  model: Model;
  setModel: (model: Model) => void;
  availableLayers: LayerType[];
  activationFunctions: Function[];
  updateModel: (action: Actions) => Promise<boolean>;
};

export const ModelContext = React.createContext<ModelContextProps | null>(null);

export type ModelContextProviderProps = {
  initialModel: Model;
};

export const ModelContextProvider: React.FC<ModelContextProviderProps> = ({ children, initialModel }) => {
  const [model, setModel] = useState<Model>(initialModel);
  const [availableLayers, setAvailableLayers] = useState<LayerType[]>([]);
  const [activationFunctions, setActivationFunctions] = useState<Function[]>([]);

  const updateModel = async (action: Actions) => {
    try {
      const newModel = await dispatchModelApi(model.id, action);
      setModel(newModel);
    } catch (error) {
      toast.error('Fehler beim Update des Models');
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
        const response = await api.get('layers');
        const layers = await response.json();
        setAvailableLayers(layers);
      } catch (error) {
        toast.error('Fehler beim Laden der Layer');
        setAvailableLayers([]);
      }
    };

    const fetchActivationFunctions = async () => {
      try {
        const response = await api.get('functions');
        const functions = await response.json();
        setActivationFunctions(functions);
      } catch (error) {
        toast.error('Fehler beim Laden der Aktivationsfunktionen');
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
