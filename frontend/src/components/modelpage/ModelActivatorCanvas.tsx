import { faFoursquare } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRight,
  faArrowsAlt,
  faLayerGroup,
  faPlus,
  faSpinner,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useModelContext } from '../../contexts/ModelProvider';
import { ModelActivator } from '../../data/models';
import { Modal, useModal } from '../utility/Modal';
import { ParameterInput } from '../utility/ParameterInput';

const ModelActivatorCanvas = SortableContainer(() => {
  const [isAddingActivator, setAddingActivator] = useState(false);
  const { model } = useModelContext();

  const showAddActivatorModal = () => setAddingActivator(true);
  const hideAddActivatorModal = () => setAddingActivator(false);

  return (
    <div className="overflow-y-auto flex flex-wrap items-center select-none py-3">
      <span className="font-bold text-gray-500">DATA</span>
      {model.activators.map((modelActivator, index) => (
        <React.Fragment key={modelActivator.modelActivatorId}>
          <FontAwesomeIcon icon={faArrowRight} className="mx-3" />
          <ModelActivatorCard index={index} modelActivator={modelActivator} />
        </React.Fragment>
      ))}
      <FontAwesomeIcon icon={faArrowRight} className="mx-3" />
      <button className="mx-3" onClick={showAddActivatorModal}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      {isAddingActivator && <Modal onClose={hideAddActivatorModal} component={<AddModelActivatorModal />} />}
    </div>
  );
});

type ModelActivatorCardProps = {
  modelActivator: ModelActivator;
};

const ModelActivatorCard = SortableElement(({ modelActivator }: ModelActivatorCardProps) => {
  const { updateModel } = useModelContext();
  const [isDeleting, setDeleting] = useState(false);

  const handleParameterChange = async (parameterName: string, newValue: any) => {
    await updateModel({
      type: 'UPDATE_MODEL_ACTIVATOR_PARAMETER_DATA',
      modelActivatorId: modelActivator.modelActivatorId,
      parameterName: parameterName,
      newValue: newValue,
    });
  };

  const deleteActivator = async () => {
    setDeleting(true);
    await updateModel({
      type: 'DELETE_MODEL_ACTIVATOR',
      modelActivatorId: modelActivator.modelActivatorId,
    });
    setDeleting(false);
  };

  return (
    <div className="p-1 text-left bg-white shadow rounded items-stretch flex select-none max-w-xs group">
      <div className="px-2 py-2 flex-grow">
        <div className="flex justify-between">
          <h3 className="font-bold flex items-center">
            <FontAwesomeIcon icon={modelActivator.value.type === 'function' ? faFoursquare : faLayerGroup} />
            <p className="px-2">{modelActivator.value.displayName}</p>
            <span className="font-bold text-sm text-gray-600">#{modelActivator.modelActivatorId}</span>
          </h3>
          <button
            className="focus:text-error transition-colors transition-opacity duration-150 opacity-0 group-hover:opacity-100 focus:outline-none focus:opacity-100 ml-2"
            title="Aktivator Löschen"
            onClick={deleteActivator}
          >
            <FontAwesomeIcon icon={isDeleting ? faSpinner : faTimesCircle} spin={isDeleting} />
          </button>
        </div>
        {'parameters' in modelActivator.value && modelActivator.value.parameters.length > 0 && (
          <div className="mt-2">
            {modelActivator.value.parameters.map((parameter) => {
              return (
                <div className="flex mb-1 items-center" key={parameter.name}>
                  <label className="w-1/2 block" htmlFor={modelActivator.modelActivatorId + '.' + parameter.name}>
                    <span>{parameter.name}</span>
                  </label>
                  <ParameterInput
                    id={modelActivator.modelActivatorId + '.' + parameter.name}
                    parameter={parameter}
                    onUpdate={handleParameterChange}
                    parameterData={modelActivator.parameterData}
                    disabled={isDeleting}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="rounded-r border-l flex-shrink-0 inline-flex items-center">
        <Handle />
      </div>
    </div>
  );
});

const Handle = SortableHandle(() => (
  <div className="px-3 cursor-pointer">
    <FontAwesomeIcon icon={faArrowsAlt} />
  </div>
));

const AddModelActivatorModal = () => {
  const modal = useModal();
  const { activationFunctions, model, updateModel } = useModelContext();

  const handleAddActivator = async (activatorId: number) => {
    const result = await updateModel({
      type: 'ADD_MODEL_ACTIVATOR',
      activatorId: activatorId,
    });
    if (result) {
      modal.close();
    }
  };

  return (
    <>
      <Modal.Title title="Verfügbare Aktivatoren" closeTooltip="Verfügbare Aktivatoren schließen" />
      <div className="flex-grow overflow-y-scroll">
        <h2 className="p-4">
          <span className="font-bold text-gray-700 text-lg">Definitierte Layer</span>
        </h2>
        {model.layers.map((layer) => {
          return (
            <AddModelActivatorModalEntry
              name={layer.displayName}
              modelActivatorId={layer.activatorTargetId}
              key={layer.activatorTargetId}
              onAdd={handleAddActivator}
            />
          );
        })}
        <h2 className="p-4">
          <span className="font-bold text-gray-700 text-lg">Funktionen</span>
        </h2>
        {activationFunctions.map((fn) => {
          return (
            <AddModelActivatorModalEntry
              name={fn.displayName}
              description={fn.description}
              modelActivatorId={fn.activatorTargetId}
              key={fn.activatorTargetId}
              onAdd={handleAddActivator}
            />
          );
        })}
      </div>
    </>
  );
};

type AddModelActivatorModalEntryProps = {
  modelActivatorId: number;
  name: string;
  description?: string;
  onAdd: (modelActivatorId: number) => Promise<void>;
};

const AddModelActivatorModalEntry = (props: AddModelActivatorModalEntryProps) => {
  const [isAdding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (isAdding) return;
    setAdding(true);
    await props.onAdd(props.modelActivatorId);
    setAdding(false);
  };

  return (
    <div className="w-full px-4 py-4 pl-8 group flex items-center hover:bg-gray-100">
      <div className="w-full">
        <h3 className="text-lg font-bold">{props.name}</h3>
        <h4 className="text-gray-600">{props.description}</h4>
      </div>
      <button
        className="rounded px-2 py-1 focus:opacity-100 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none transition-colors duration-150 font-bold text-gray-700 group-hover:opacity-100 opacity-0"
        onClick={handleAdd}
        disabled={isAdding}
      >
        {!isAdding && 'Verwenden'}
        {isAdding && <FontAwesomeIcon icon={faSpinner} spin />}
      </button>
    </div>
  );
};

export default ModelActivatorCanvas;
