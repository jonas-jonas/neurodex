import { faLayerGroup, faPlus, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useModelContext } from '../../contexts/modelcontext';
import { ModelLayer } from '../../data/models';
import { OverlayContextProvider } from '../utility/AbstractModal';
import LayersModal from './LayersModal';

type ModelLayerPanelItemProps = {
  modelLayer: ModelLayer;
  deleteModelLayer: (modelLayerId: number) => Promise<void>;
};

const ModelLayerPanelItem: React.FC<ModelLayerPanelItemProps> = ({ modelLayer, deleteModelLayer }) => {
  const [isDeleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    setDeleting(true);
    await deleteModelLayer(modelLayer.id);
    setDeleting(false);
  };

  return (
    <div className="px-4 py-3 group flex items-center justify-between border-b cursor-pointer">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faLayerGroup} className="mr-4" />
        <h2>
          <p className="text-lg font-bold tracking-wider">{modelLayer.layerName}</p>
          <p className="text-gray-700 ">{modelLayer.layerType.id}</p>
        </h2>
      </div>
      <button
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 px-2"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <FontAwesomeIcon icon={isDeleting ? faSpinner : faTimes} spin={isDeleting} />
      </button>
    </div>
  );
};

const ModelLayerPanel = () => {
  const { model, updateModel } = useModelContext();
  const [isAdding, setAdding] = useState(false);

  const showPopup = () => {
    setAdding(true);
  };

  const deleteModelLayer = async (modelLayerId: number) => {
    await updateModel({
      type: 'DELETE_LAYER',
      modelLayerId: modelLayerId,
    });
  };

  return (
    <div className="h-full flex flex-col relative w-1/6">
      <div className="flex justify-between items-center">
        <span className="font-bold tracking-wide">LAYERS</span>
        <button className="p-2" onClick={showPopup} title="Layer hinzufügen">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="rounded bg-white h-full shadow">
        <input
          type="search"
          placeholder="Filter..."
          className="px-2 py-2 flex-shrink-0 block border-b rounded-t w-full"
        />
        {model.layers.map((layer) => (
          <ModelLayerPanelItem modelLayer={layer} deleteModelLayer={deleteModelLayer} key={layer.id} />
        ))}
      </div>

      {isAdding && (
        <OverlayContextProvider onClose={() => setAdding(false)}>
          <LayersModal />
        </OverlayContextProvider>
      )}
    </div>
  );
};

export default ModelLayerPanel;
