import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { ModelContext } from '../../contexts/modelcontext';
import { Panel } from '../utility/Panel';
import ForwardCard from './ForwardCard';

const ForwardPanel = () => {
  const { activationFunctions, model, addModelFunction } = useContext(ModelContext);

  const handleAddClick = () => {
    addModelFunction(activationFunctions[0].id);
  };

  return (
    <Panel>
      <div className="px-3 py-2 flex items-center justify-between rounded-t">
        <h2 className="text-lg font-bold font-mono">forward</h2>
        <button title="Funktion hinzufügen" className="px-1" onClick={handleAddClick}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="overflow-y-auto h-full">
        <div className="p-2 overflow-y-auto h-full">
          {model?.functions.map(func => (
            <ForwardCard currentFunction={func} key={func.id} />
          ))}
        </div>
      </div>
    </Panel>
  );
};

export default ForwardPanel;
