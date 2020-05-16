import classNames from 'classnames';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { useModelContext } from '../../contexts/ModelProvider';
import AbstractModal, { useOverlayContext } from '../utility/AbstractModal';
import { LayerType } from '../../data/models';

type LayersPopupProps = {};

const LayersModal: React.FC<LayersPopupProps> = () => {
  const { handleClose } = useOverlayContext();
  const [filterText, setFilterText] = useState('');
  const { availableLayers, updateModel } = useModelContext();
  const [layerTypes, setLayerTypes] = useState(availableLayers);

  const [activeLayer, setActiveLayer] = useState<LayerType | null>(availableLayers[0]);

  useEffect(() => {
    const filteredLayers = availableLayers.filter((layerType) =>
      layerType.layerTypeId.toLowerCase().includes(filterText.toLowerCase())
    );
    setLayerTypes(filteredLayers);
  }, [availableLayers, filterText]);

  const handleFilterInput = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const addLayer = async (id: string) => {
    await updateModel({
      type: 'ADD_LAYER',
      layerTypeId: id,
    });
    handleClose();
  };

  return (
    <AbstractModal>
      <div className="bg-gray-100 rounded-t p-4 flex-shrink-0 border-b-4 border-blue-700 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl">Verfügbare Layer ({layerTypes.length})</h1>
        </div>
        {activeLayer && (
          <div className="flex">
            <a
              href={'https://pytorch.org/docs/1.4.0/nn.html#' + activeLayer.layerTypeId}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded px-2 py-1 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none transition-colors duration-150 font-bold text-gray-700"
            >
              Dokumentation
            </a>
            <button
              className="rounded px-2 py-1 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none transition-colors duration-150 font-bold text-gray-700"
              onClick={() => addLayer(activeLayer.layerTypeId)}
            >
              Verwenden
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-grow items-stretch overflow-hidden">
        <div className="flex flex-col w-full h-full overflow-y-scroll">
          <input
            type="search"
            placeholder="Filter..."
            className="px-2 py-2 flex-shrink block border-b rounded-t w-full"
            onChange={handleFilterInput}
          />
          {layerTypes.map((element) => {
            const active = activeLayer?.layerTypeId === element.layerTypeId;
            const classes = classNames(
              'px-2 py-4 w-full border-b cursor-pointer flex justify-between items-center group',
              {
                'bg-gray-100': active,
              }
            );
            return (
              <div className={classes} onClick={() => setActiveLayer(element)} key={element.layerTypeId}>
                <h3 className="font-mono text-xl">{element.layerTypeId}</h3>
                <button
                  className="rounded px-2 py-1 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none transition-colors duration-150 font-bold text-gray-700 group-hover:opacity-100 opacity-0"
                  onClick={() => addLayer(element.layerTypeId)}
                >
                  Verwenden
                </button>
              </div>
            );
          })}
        </div>
        <div className="w-full h-full overflow-y-scroll p-3">
          <h1 className="font-serif text-3xl mb-2">{activeLayer?.layerName}</h1>
          <div dangerouslySetInnerHTML={{ __html: activeLayer?.description ?? '' }}></div>
        </div>
      </div>
    </AbstractModal>
  );
};

export default LayersModal;
