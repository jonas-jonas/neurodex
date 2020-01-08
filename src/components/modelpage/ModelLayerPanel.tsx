import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode, useContext, useState, useEffect } from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { ModelContext } from '../../contexts/modelcontext';
import LoadingIndicator from '../utility/LoadingIndicator';
import { Panel } from '../utility/Panel';
import ModelLayerCard from './ModelLayerCard';
import { ModelLayer } from '../../data/models';
import arrayMove from 'array-move';

const SortableModelLayerPanel = SortableContainer(({ children }: { children: ReactNode }) => {
  return <div className="p-2 overflow-y-auto h-full">{children}</div>;
});

const ModelLayerPanel: React.FC = () => {
  const [updating, setUpdating] = useState(false);

  const { model, updateOrder } = useContext(ModelContext);

  const [layers, setLayers] = useState<ModelLayer[]>([]);

  useEffect(() => {
    if (model) {
      setLayers(model.layers);
    }
  }, [model]);

  const handleOnSortEnd = async ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const modelLayer = layers[oldIndex];

    if (modelLayer && !updating) {
      setUpdating(true);
      /** Update the local cache of layers with the updated order */
      setLayers(arrayMove(layers, oldIndex, newIndex));
      await updateOrder(modelLayer.id, newIndex);
      setUpdating(false);
    }
  };

  return (
    <Panel>
      <div className="px-3 py-2 flex items-center justify-between rounded-t">
        <h2 className="text-lg font-bold font-mono">__init__</h2>
        <button title="Clear all" className="px-1">
          <FontAwesomeIcon icon={faTimesCircle} />
        </button>
      </div>
      <div className="overflow-y-auto h-full">
        <SortableModelLayerPanel onSortEnd={handleOnSortEnd} distance={50}>
          {layers.map((layer, index) => {
            return <ModelLayerCard modelLayer={layer} index={index} key={layer.id} />;
          })}
        </SortableModelLayerPanel>
      </div>
      {updating && (
        <div className="w-full h-full bg-white opacity-50 absolute inset-0">
          <LoadingIndicator text="Updating..." />
        </div>
      )}
    </Panel>
  );
};

export default ModelLayerPanel;
