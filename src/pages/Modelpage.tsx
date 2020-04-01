import { faPassport, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import CodeBlock from '../components/modelpage/CodeBlock';
import ForwardPanel from '../components/modelpage/ForwardPanel';
import ModelLayerPanel from '../components/modelpage/ModelLayerPanel';
import LoadingIndicator from '../components/utility/LoadingIndicator';
import { Panel } from '../components/utility/Panel';
import { ModelContextProvider, useModelContext } from '../contexts/modelcontext';
import { PageContext } from '../contexts/pagecontext';
import { LayerType } from '../data/models';
import { api } from '../util/api';

export const Modelpage: React.FC = () => {
  const { model, availableLayers, updateModel } = useModelContext();

  const [expandedLayer, setExpandedLayer] = useState<String>();
  const [addingLayer, setAddingLayer] = useState(false);

  const handleLayerAdd = async (id: string) => {
    setAddingLayer(true);
    await updateModel({
      type: 'ADD_LAYER',
      layerTypeId: id
    });
    setAddingLayer(false);
  };

  const handleExpandCard = (id: string) => {
    if (expandedLayer === id) {
      setExpandedLayer(undefined);
    } else {
      setExpandedLayer(id);
    }
  };

  return (
    <div className="flex h-full flex-auto pb-2">
      <div className="w-7/12 flex">
        <Panel>
          <div className="px-3 py-2 rounded-t bg-gray-100 border-b border-gray-700 flex justify-between items-center shadow">
            <h2 className="text-lg font-bold">Layers</h2>
            <span className="text-sm italic text-gray-800 font-semibold">{availableLayers.length} Layer verfügbar</span>
          </div>
          <div className="p-2 flex-grow overflow-y-auto">
            {availableLayers.map(layerType => {
              return (
                <LayerCard
                  layerType={layerType}
                  key={layerType.id}
                  onAdd={handleLayerAdd}
                  expandCard={handleExpandCard}
                  isExpanded={expandedLayer === layerType.id}
                />
              );
            })}
            {addingLayer && (
              <div className="w-full bg-white opacity-75 absolute inset-0">
                <LoadingIndicator text="Updating..." />
              </div>
            )}
          </div>
        </Panel>
        <ModelLayerPanel />

        <ForwardPanel />
      </div>
      <CodeBlock model={model} />
    </div>
  );
};

type LayerCardProps = {
  layerType: LayerType;
  onAdd: (id: string) => void;
  expandCard: (id: string) => void;
  isExpanded: boolean;
};

export const LayerCard: React.FC<LayerCardProps> = ({ layerType, onAdd, expandCard, isExpanded }) => {
  const addRef = useRef<HTMLButtonElement>(null);
  const toggle = (e: MouseEvent<HTMLElement>) => {
    if (e.target !== addRef.current && !addRef.current?.contains(e.target as HTMLElement)) {
      expandCard(layerType.id);
    }
  };

  const handleAdd = () => {
    onAdd(layerType.id);
  };

  return (
    <div className="shadow mb-2">
      <div
        onClick={toggle}
        className="bg-blue-800 text-white p-3 rounded select-none border-b-2 border-transparent focus:border-gray-100 flex justify-between items-center relative group pr-10 w-full focus:outline-none cursor-pointer"
      >
        <h2 className="font-mono mr-1 truncate">{layerType.id}</h2>
        <button
          className="px-2 hover:bg-blue-700 focus:outline-none absolute right-0 mr-3 group-hover:opacity-100 opacity-0"
          onClick={handleAdd}
          title="Zum Modell hinzufügen"
          ref={addRef}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      {isExpanded && (
        <>
          <div className="flex justify-evenly rounded-b-sm">
            <button onClick={handleAdd} className="p-4 hover:bg-blue-200 w-full flex flex-col items-center">
              <FontAwesomeIcon icon={faPlus} />
              <span>Benutzen</span>
            </button>
            <a
              href={'https://pytorch.org/docs/stable/nn.html#' + layerType.id}
              className="p-4 hover:bg-blue-200 w-full flex flex-col items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faPassport} />
              <span>Dokumentation</span>
            </a>
          </div>
        </>
      )}
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
      const response = await api.get('models/' + modelId);
      if (response.status === 200) {
        const model = await response.json();
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
