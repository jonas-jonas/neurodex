import classNames from 'classnames';
import React, { useState } from 'react';
import { useModelContext } from '../../contexts/ModelProvider';
import AbstractModal, { useOverlayContext } from '../utility/AbstractModal';

type LayersPopupProps = {};

const LayersModal: React.FC<LayersPopupProps> = () => {
  const { handleClose } = useOverlayContext();
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const { availableLayers, updateModel } = useModelContext();

  const addLayer = async (id: string) => {
    await updateModel({
      type: 'ADD_LAYER',
      layerTypeId: id,
    });
    handleClose();
  };

  return (
    <AbstractModal>
      <div className="bg-gray-100 rounded-t p-4 flex-shrink-0 border-b-4 border-blue-700 flex-shrink-0">
        <h1 className="font-serif text-3xl">Verfügbare Layer</h1>
        <h2 className="text-gray-600">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam</h2>
      </div>
      <div className="flex flex-grow items-stretch overflow-hidden">
        <div className="flex flex-col w-full h-full overflow-y-scroll">
          {availableLayers.map((element) => {
            const active = activeLayer === element.layerTypeId;
            const classes = classNames(
              'px-2 py-4 w-full border-b cursor-pointer flex justify-between items-center group',
              {
                'bg-gray-100': active,
              }
            );
            return (
              <div className={classes} onClick={() => setActiveLayer(element.layerTypeId)} key={element.layerTypeId}>
                <div>
                  <h3 className="font-mono text-xl">{element.layerTypeId}</h3>
                  <h4 className="text-gray-500">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam</h4>
                </div>
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
        <div className="w-full"></div>
      </div>
    </AbstractModal>
  );
};

export default LayersModal;
