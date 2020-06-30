import { faLayerGroup, faPlus, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useModelContext } from '../../contexts/ModelProvider';
import { ModelLayer } from '../../data/models';
import { ParameterInput } from '../utility/ParameterInput';

type ModelLayerPanelItemProps = {
  modelLayer: ModelLayer;
  deleteModelLayer: (modelLayerId: number) => Promise<void>;
};

const ModelLayerPanelItem = ({ modelLayer, deleteModelLayer }: ModelLayerPanelItemProps) => {
  const [isDeleting, setDeleting] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  const { updateModel } = useModelContext();

  const handleDelete = async () => {
    if (isDeleting) return;
    setDeleting(true);
    await deleteModelLayer(modelLayer.activatorTargetId);
    setDeleting(false);
  };

  const handleExpandClick = async () => {
    setCollapsed(!isCollapsed);
  };

  const handleUpdate = async (parameterName: string, newValue: any) => {
    await updateModel({
      type: 'UPDATE_MODEL_LAYER_PARAMETER_DATA',
      modelLayerId: modelLayer.activatorTargetId,
      newValue,
      parameterName,
    });
  };

  return (
    <div className="px-4 py-3 group flex items-center justify-between border-b select-none">
      <div className="w-full">
        <div className="flex items-center cursor-pointer justify-between mb-2" onClick={handleExpandClick}>
          <div className="flex flex-grow items-center">
            <FontAwesomeIcon icon={faLayerGroup} className="mr-4" />
            <h2>
              <p className="text-lg font-bold tracking-wider">{modelLayer.displayName}</p>
              <p className="text-gray-700 ">{modelLayer.layerType.layerTypeId}</p>
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

        {!isCollapsed &&
          modelLayer.layerType.parameters.map((parameter) => {
            return (
              <div className="flex mb-1 items-center" key={parameter.name}>
                <label className="w-1/2 block" htmlFor={modelLayer.activatorTargetId + '.' + parameter.name}>
                  <span>{parameter.name}</span>
                </label>
                <ParameterInput
                  id={modelLayer.activatorTargetId + '.' + parameter.name}
                  parameter={parameter}
                  onUpdate={handleUpdate}
                  parameterData={modelLayer.parameterData}
                  disabled={isDeleting}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

type ModelLayerPanelProps = {
  showAddLayerModal: () => void;
};

const ModelLayerPanel = ({ showAddLayerModal }: ModelLayerPanelProps) => {
  const { model, updateModel } = useModelContext();
  const [layers, setLayers] = useState(model.layers);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const filteredLayers = model.layers.filter((layer) => layer.displayName.includes(filterText));
    setLayers(filteredLayers);
  }, [model.layers, filterText]);

  const handleFilterInput = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const deleteModelLayer = async (modelLayerId: number) => {
    await updateModel({
      type: 'DELETE_LAYER',
      modelLayerId: modelLayerId,
    });
  };

  return (
    <div className="h-full flex flex-col relative w-1/6">
      <div className="flex justify-between items-center flex-shrink-0">
        <span className="font-bold tracking-wide">LAYERS</span>
        <button className="p-2" onClick={showAddLayerModal} title="Layer hinzufügen">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="rounded bg-white flex flex-col shadow h-full overflow-hidden">
        <input
          type="search"
          placeholder="Filter..."
          className="px-2 py-2 flex-shrink block border-b rounded-t w-full"
          onChange={handleFilterInput}
        />
        <div className="flex-grow overflow-y-scroll h-0">
          {layers.map((layer) => {
            return (
              <ModelLayerPanelItem
                modelLayer={layer}
                deleteModelLayer={deleteModelLayer}
                key={layer.activatorTargetId}
              />
            );
          })}
          {layers.length === 0 && <p className="text-center italic py-3">Keine Layer gefunden</p>}
          {layers.length > 0 && layers.length !== model.layers.length && (
            <p className="text-center italic py-3">
              {layers.length} / {model.layers.length} Layer
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelLayerPanel;
