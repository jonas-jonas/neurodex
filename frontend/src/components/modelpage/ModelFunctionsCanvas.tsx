import { faArrowRight, faArrowsAlt, faCircleNotch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import useForm from 'react-hook-form';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useModelContext } from '../../contexts/ModelProvider';
import { ModelFunction } from '../../data/models';
import AbstractModal, { OverlayContextProvider, useOverlayContext } from '../utility/AbstractModal';

const ModelFunctionsCanvas = SortableContainer(() => {
  const [modelFunctionEdit, setModelFunctionEdit] = useState<ModelFunction | null>(null);
  const { activationFunctions, model, updateModel } = useModelContext();

  const handleAddClick = () => {
    updateModel({
      type: 'ADD_MODEL_FUNCTION',
      activationFunctionId: activationFunctions[1].id,
    });
  };

  return (
    <div className="overflow-y-auto flex flex-wrap items-center">
      <span className="font-bold text-gray-500">DATA</span>
      {model.functions.map((modelFunction, index) => (
        <React.Fragment key={modelFunction.id}>
          <FontAwesomeIcon icon={faArrowRight} className="mx-3" />
          <FunctionCard index={index} modelFunction={modelFunction} onClick={setModelFunctionEdit} />
        </React.Fragment>
      ))}
      <FontAwesomeIcon icon={faArrowRight} className="mx-3" />
      <button className="mx-3" onClick={handleAddClick}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      {modelFunctionEdit && (
        <OverlayContextProvider onClose={() => setModelFunctionEdit(null)}>
          <ModelFunctionModal modelFunction={modelFunctionEdit} />
        </OverlayContextProvider>
      )}
    </div>
  );
});

type FunctionCardProps = {
  modelFunction: ModelFunction;
  onClick?: (modelFunction: ModelFunction) => void;
};

const FunctionCard = SortableElement(({ modelFunction, onClick }: FunctionCardProps) => {
  const handleClick = () => {
    onClick && onClick(modelFunction);
  };

  return (
    <button
      className="p-1 text-left bg-white shadow rounded items-stretch flex select-none w-64 transition-colors duration-150 focus:bg-gray-100 focus:outline-none my-3"
      onClick={handleClick}
    >
      <div className="px-2 py-2 flex-grow">
        <h3 className="font-bold mb-2">
          {modelFunction.function.name}
          <span className="font-bold text-sm text-gray-600">#{modelFunction.id}</span>
        </h3>
        <div>
          {modelFunction.function.parameters.map((parameter, index) => {
            return (
              <div className="flex mb-1" key={index}>
                <span className="w-1/2 block">{parameter.name}</span>
                <span className="w-1/2 block">
                  {modelFunction.parameterData[parameter.name]?.value ?? parameter.defaultValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-r border-l flex-shrink-0 inline-flex items-center">
        <Handle />
      </div>
    </button>
  );
});

const Handle = SortableHandle(() => {
  return (
    <div className="px-3">
      <FontAwesomeIcon icon={faArrowsAlt} />
    </div>
  );
});

type ModelFunctionModalProps = {
  modelFunction: ModelFunction;
};

const ModelFunctionModal: React.FC<ModelFunctionModalProps> = ({ modelFunction }) => {
  const { model, updateModel } = useModelContext();
  const { handleClose } = useOverlayContext();
  const { register, handleSubmit, errors, formState } = useForm({ mode: 'onChange' });

  const onSubmit = async (values: Record<string, any>) => {
    const result = await updateModel({
      type: 'UPDATE_MODEL_FUNCTION_DATA',
      modelFunctionId: modelFunction.id,
      parameters: values['parameters'] ?? {},
    });

    result && handleClose();
  };

  return (
    <AbstractModal size="SMALL">
      <form
        className="p-6 text-lg flex flex-col overflow-y-hidden h-full select-none"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center border-b pb-4 flex-shrink-0">
          {/* <span className="rounded bg-blue-600 inline-block w-6 h-6 text-white text-center mr-2">
            <FontAwesomeIcon icon={faFoursquare} />
          </span> */}
          <span className="font-bold">{modelFunction.function.name}</span>
          <span className="text-gray-600 ml-2">#{modelFunction.id}</span>
        </div>
        <div className="overflow-y-auto flex-grow h-full flex-1">
          {modelFunction.function.parameters.length <= 0 && (
            <div className="text-gray-600 text-center mt-3">Keine Parameter vorhanden</div>
          )}
          {modelFunction.function.parameters.map((param, index) => {
            const value = modelFunction.parameterData[param.name];
            return (
              <div className="flex mb-1 border-b p-2 items-center" key={param.name}>
                <span className="w-1/2 block">
                  {param.name}&nbsp;-&nbsp;<span className="text-gray-600">{param.type}</span>
                </span>
                {param.type === 'number' && (
                  <div className="flex flex-col">
                    <input
                      type="number"
                      name={'parameters.' + param.name}
                      className="border px-2 py-1"
                      defaultValue={value?.value}
                      placeholder={param.defaultValue}
                      title={param.name}
                      disabled={formState.isSubmitting}
                      ref={register({})}
                    />
                    <span className="text-error text-sm">{errors['parameters.' + param.name]?.message}</span>
                  </div>
                )}
                {param.type === 'boolean' && (
                  <div>
                    <input
                      type="checkbox"
                      name={'parameters.' + param.name}
                      className="border px-2 py-1"
                      defaultChecked={value?.value === 'true'}
                      ref={register({})}
                      disabled={formState.isSubmitting}
                      title={param.name}
                    />
                    <span className="text-error text-sm">{errors['parameters.' + param.name]?.message}</span>
                  </div>
                )}
                {param.type === 'layer' && (
                  <div>
                    <select
                      className="border px-2 py-1"
                      defaultValue={String(value?.id)}
                      title={param.name}
                      name={'parameters.' + param.name}
                      disabled={formState.isSubmitting}
                      ref={register({})}
                    >
                      {!value?.id && <option value=""></option>}
                      {model.layers.map((layer) => {
                        return (
                          <option value={layer.id} key={layer.id}>
                            {layer.layerName}
                          </option>
                        );
                      })}
                    </select>
                    <span className="text-error text-sm">{errors['parameters.' + param.name]?.message}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-right flex-shrink-0 flex-">
          <button className="shadow bg-gray-400 rounded py-1 px-3 mr-2" onClick={handleClose} type="reset">
            Abbrechen
          </button>
          <button
            className="shadow bg-blue-600 text-white rounded py-1 px-3 disabled:opacity-50"
            type="submit"
            disabled={!formState.isValid}
          >
            {!formState.isSubmitting && 'Speichern'}
            {formState.isSubmitting && (
              <>
                <FontAwesomeIcon icon={faCircleNotch} spin className="mr-2" />
                Speichert...
              </>
            )}
          </button>
        </div>
      </form>
    </AbstractModal>
  );
};

export default ModelFunctionsCanvas;
