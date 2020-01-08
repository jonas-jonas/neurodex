import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { useModelContext } from '../../contexts/modelcontext';
import { ModelLayer } from '../../data/models';
import LoadingIndicator from '../utility/LoadingIndicator';
import ParameterInput from './ParameterInput';

type ModelLayerCardProps = {
  modelLayer: ModelLayer;
};

const ModelLayerCard: React.FC<ModelLayerCardProps> = ({ modelLayer }) => {
  const { updateModel } = useModelContext();

  const [updating, setUpdating] = useState(false);

  const handleDeleteButtonClick = async () => {
    if (!updating) {
      setUpdating(true);
      const result = await updateModel({
        type: 'DELETE_LAYER',
        modelLayerId: modelLayer.id
      });
      if (result) {
        //TODO: Show notification if deleting failed?
      }
      setUpdating(false);
    }
  };

  const handleDataUpdate = async (parameterName: string, newData: string) => {
    if (!updating) {
      setUpdating(true);
      const result = await updateModel({
        type: 'UPDATE_LAYER',
        modelLayerId: modelLayer.id,
        parameterName: parameterName,
        newValue: newData
      });
      if (result) {
        //TODO: Show notification if deleting failed?
      }
      setUpdating(false);
    }
  };

  return (
    <div className="rounded mb-2 font-mono bg-white select-none relative border border-blue-800">
      <div className="px-3 py-1 rounded-t flex justify-between items-center cursor-move border-b border-blue-800 bg-blue-800 text-white">
        <div className="pr-3">
          <input
            type="text"
            className="w-full p-0 bg-blue-800"
            defaultValue={modelLayer.layerName}
            placeholder="Layername"
          />
          <span className="text-xs">{modelLayer.layerType.id}</span>
        </div>
        <button
          className="focus:outline-none"
          onClick={handleDeleteButtonClick}
          title={'Layer ' + modelLayer.layerName + ' löschen'}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="p-3">
        <table className="table-auto">
          <tbody>
            {modelLayer.layerType.parameters.map(parameter => {
              const id = modelLayer.id + '-' + parameter.name;
              return (
                <tr key={id} data-testid={'parameters-' + modelLayer.id}>
                  <td>
                    <label htmlFor={id}>{parameter.name}</label>
                  </td>
                  <td>
                    <ParameterInput
                      parameter={parameter}
                      updateData={handleDataUpdate}
                      data={modelLayer.parameterData[parameter.name]}
                      id={id}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {updating && (
        <div className="w-full h-full bg-white opacity-50 absolute inset-0">
          <LoadingIndicator text="Updating..." />
        </div>
      )}
    </div>
  );
};

export default SortableElement(ModelLayerCard);
