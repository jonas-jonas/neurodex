import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import CodeBlock from '../components/modelpage/CodeBlock';
import ForwardPanel from '../components/modelpage/ForwardPanel';
import ModelLayerPanel from '../components/modelpage/ModelLayerPanel';
import LoadingIndicator from '../components/utility/LoadingIndicator';
import { Panel } from '../components/utility/Panel';
import { ModelContextProvider, useModelContext } from '../contexts/modelcontext';
import { LayerType } from '../data/models';
import { api } from '../util/api';
import { PageContext } from '../contexts/pagecontext';

const Modelpage: React.FC = () => {
  const { model, availableLayers, updateModel } = useModelContext();

  const handleLayerAdd = async (id: string) => {
    await updateModel({
      type: 'ADD_LAYER',
      layerTypeId: id
    });
  };

  return (
    <div className="flex h-full flex-auto pb-2">
      <div className="w-7/12 flex">
        <Panel>
          <div className="px-3 py-2 rounded-t">
            <h2 className="text-lg font-bold">Layers</h2>
          </div>
          <div className="p-2 flex-grow overflow-y-auto">
            {availableLayers.map(layerType => {
              return <LayerCard layerType={layerType} key={layerType.id} onAdd={handleLayerAdd} />;
            })}
          </div>
        </Panel>
        <ModelLayerPanel />

        <ForwardPanel />
      </div>
      <div className="flex-grow h-full rounded px-1 overflow-y-auto">
        <CodeBlock model={model} />
      </div>
    </div>
  );
};

type LayerCardProps = {
  layerType: LayerType;
  onAdd: (id: string) => void;
};

const LayerCard: React.FC<LayerCardProps> = ({ layerType, onAdd }) => {
  const handleAdd = () => {
    onAdd(layerType.id);
  };

  return (
    <div className="shadow bg-blue-800 text-white mb-2 p-3 rounded cursor-pointer select-none border-b-2 border-transparent focus:border-gray-100 flex justify-between items-center">
      <h2 className="font-mono mr-1">{layerType.id}</h2>
      <button className="px-2 hover:bg-blue-700 focus:outline-none" onClick={handleAdd}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

const ModelpageWrapper = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState();
  const { setPageTitle } = useContext(PageContext);

  useEffect(() => {
    /**
     * Fetches the current model object
     */
    const fetchModel = async () => {
      const response = await api.get('model/' + modelId);
      if (response.status === 200) {
        const { model } = await response.json();
        setPageTitle(model.name);
        setModel(model);
      }
    };
    fetchModel();

    return () => {
      setPageTitle('');
    };
  }, [modelId, setPageTitle]);

  if (!model) {
    return (
      <div className="container">
        <LoadingIndicator text="Loading model..." />
      </div>
    );
  } else {
    return (
      <ModelContextProvider initialModel={model}>
        <Modelpage />
      </ModelContextProvider>
    );
  }
};

export default ModelpageWrapper;
