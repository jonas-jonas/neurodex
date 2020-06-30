import classNames from 'classnames';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useModelContext } from '../../contexts/ModelProvider';
import { LayerType } from '../../data/models';
import { Modal, useModal } from '../utility/Modal';

type LayersPopupProps = {};

const LayersModal: React.FC<LayersPopupProps> = () => {
  const modal = useModal();
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
    modal.close();
  };

  return (
    <>
      <Modal.Title title="Verfügbare Layer" closeTooltip="Verfügbare Layer schließen" />
      <div className="flex flex-grow items-stretch overflow-hidden flex-col">
        <div className="flex flex-col w-full overflow-y-scroll h-1/2 border-b">
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
                <div className="flex">
                  <a
                    href={'https://pytorch.org/docs/1.4.0/nn.html#' + element.layerTypeId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded px-2 py-1 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none transition-colors duration-150 font-bold text-gray-700"
                  >
                    Dokumentation
                  </a>
                  <button
                    className="rounded px-2 py-1 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none transition-colors duration-150 font-bold text-gray-700"
                    onClick={() => addLayer(element.layerTypeId)}
                  >
                    Verwenden
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full overflow-y-auto p-3">
          <h1 className="font-serif text-3xl mb-2">{activeLayer?.layerName}</h1>
          <div dangerouslySetInnerHTML={{ __html: activeLayer?.description ?? '' }}></div>
        </div>
      </div>
    </>
  );
};

export default LayersModal;
