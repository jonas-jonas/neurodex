import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useModelContext } from '../../contexts/modelcontext';
import { ActivationFunction, ModelFunction } from '../../data/models';
import LoadingIndicator from '../utility/LoadingIndicator';
import ParameterInput from './ParameterInput';

type ForwardCardProps = {
  currentFunction: ModelFunction;
};

const ForwardCard: React.FC<ForwardCardProps> = ({ currentFunction }) => {
  const { activationFunctions, updateModel } = useModelContext();
  const [updating, setUpdating] = useState(false);

  const handleFunctionChange = async (e: React.ChangeEvent) => {
    setUpdating(true);
    const id = (e.target as HTMLSelectElement).value;
    await updateModel({
      type: 'UPDATE_MODEL_FUNCTION_ACTIVATOR',
      functionId: currentFunction.id,
      modelFunctionId: Number(id)
    });
    setUpdating(false);
  };

  const handleDeleteButtonClick = async () => {
    setUpdating(true);
    await updateModel({
      type: 'DELETE_MODEL_FUNCTION',
      modelFunctionId: currentFunction.id
    });
    setUpdating(false);
  };

  const handleDataChange = async (parameterName: string, data: any) => {
    setUpdating(true);
    await updateModel({
      type: 'UPDATE_MODEL_FUNCTION_DATA',
      modelFunctionId: currentFunction.id,
      parameterName: parameterName,
      newData: data
    });
    setUpdating(false);
  };

  return (
    <div className="rounded mb-2 font-mono bg-white select-none relative border border-blue-800">
      <div className="px-3 py-1 rounded-t flex justify-between items-center cursor-move border-b border-blue-800 bg-blue-800 text-white">
        <button className="focus:outline-none" onClick={handleDeleteButtonClick}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="p-3">
        <table className="table-auto w-full">
          <tbody className="">
            <tr className="border-b">
              <td>
                <label>Aktivator</label>
              </td>
              <td>
                <select
                  className="w-full border px-2"
                  onChange={handleFunctionChange}
                  value={currentFunction.function.id}
                >
                  {activationFunctions.map((func: ActivationFunction) => {
                    return (
                      <option value={func.id} key={func.id}>
                        {func.name}
                      </option>
                    );
                  })}
                </select>
              </td>
            </tr>
            {currentFunction.function.parameters.map(parameter => {
              const id = '';
              return (
                <tr className="border-b" key={id}>
                  <td>
                    <label htmlFor={id}>{parameter.name}</label>
                  </td>
                  <td>
                    <ParameterInput
                      id={id}
                      parameter={parameter}
                      updateData={handleDataChange}
                      data={currentFunction.parameterData[parameter.name]?.id}
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

export default ForwardCard;
