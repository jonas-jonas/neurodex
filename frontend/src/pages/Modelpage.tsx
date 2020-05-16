import { faChevronCircleLeft, faCode, faShare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import ModelActivatorCanvas from '../components/modelpage/ModelActivatorCanvas';
import ModelLayerPanel from '../components/modelpage/ModelLayerPanel';
import LoadingIndicator from '../components/utility/LoadingIndicator';
import { ModelContextProvider, useModelContext } from '../contexts/ModelProvider';
import { usePage } from '../contexts/PageProvider';
import { api } from '../util/api';
import { Model } from '../data/models';
import { SortEnd, SortEvent } from 'react-sortable-hoc';

export const Modelpage: React.FC = () => {
  const { model, updateModel } = useModelContext();
  const history = useHistory();

  const updateModelActivatorOrder = async (sort: SortEnd, event: SortEvent) => {
    const movedActivator = model.activators[sort.oldIndex];
    await updateModel({
      type: 'UPDATE_MODEL_ACTIVATOR_ORDER',
      activatorId: movedActivator.modelActivatorId,
      newIndex: sort.newIndex,
    });
  };

  return (
    <div className="flex h-full flex-auto pb-2 flex-col px-4">
      <div className="flex flex-shrink-0 pb-4 justify-between items-center">
        <div className="flex">
          <button className="" onClick={history.goBack}>
            <FontAwesomeIcon icon={faChevronCircleLeft} size="2x" />
          </button>
          <div className="pl-5">
            <h1 className="text-2xl">{model.name}</h1>
            <h2 className="text-gray-600">
              Du · {DateTime.fromISO(model.createdAt, { zone: 'utc' }).toRelative({ padding: 1000 })} erstellt
            </h2>
          </div>
        </div>
        <div className="rounded shadow flex border border-gray-400 bg-white">
          <button className="hover:bg-gray-100 focus:bg-gray-100 focus:outline-none hover:text-black block py-2 px-5 transition-colors duration-150 text-gray-800 font-bold border-r rounded-l border-gray-400">
            <FontAwesomeIcon icon={faCode} className="mr-2" />
            Code Anzeigen
          </button>
          <button className="hover:bg-gray-100 focus:bg-gray-100 focus:outline-none hover:text-black block py-2 px-5 transition-colors duration-150 text-gray-800 font-bold border-r border-gray-400">
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Löschen
          </button>
          <button className="hover:bg-gray-100 focus:bg-gray-100 focus:outline-none hover:text-black block py-2 px-5 transition-colors duration-150 text-gray-800 font-bold rounded-r">
            <FontAwesomeIcon icon={faShare} className="mr-2" />
            Teilen
          </button>
        </div>
      </div>
      <div className="flex-grow flex">
        <ModelLayerPanel />
        <div className="w-full h-full pl-6 overflow-x-auto">
          <div className="flex justify-between mb-4 py-2">
            <span className="font-bold tracking-wide">MODELL</span>
          </div>
          <ModelActivatorCanvas axis="x" useDragHandle onSortEnd={updateModelActivatorOrder} />
        </div>
        <div className="h-full flex flex-col relative w-1/6">
          <span className="font-bold tracking-wide py-2">EINSTELLUNGEN</span>
          <div className="rounded bg-white h-full shadow">
            <div className="py-4 px-4 flex items-center border-b">
              <label className="text-gray-700 font-bold w-1/2 block">Epochs</label>
              <input className="ml-2 w-1/2 text-right border px-2 py-1" placeholder="0" type="number" />
            </div>
            <div className="py-4 px-4 flex items-center border-b">
              <label className="text-gray-700 font-bold w-1/2 block">Learning Rate</label>
              <input className="ml-2 text-right border px-2 py-1 w-1/2" placeholder="0" type="number" />
            </div>
            <div className="py-4 px-4 flex items-center">
              <label className="text-gray-700 font-bold mb-2 w-1/2 block">Loss Function</label>
              <select className="w-1/2 cursor-pointer border px-2 py-1">
                <option>CrossEntropyLoss</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModelpageWrapper = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState<Model | undefined>(undefined);
  const { setPageTitle } = usePage();

  useEffect(() => {
    /**
     * Fetches the current model object
     */
    const fetchModel = async () => {
      const response = await api.get('models/' + modelId);
      if (response.status === 200) {
        const model = await response.json();
        setPageTitle(model.name);
        setModel(model);
      }
    };
    fetchModel();

    return () => {
      setPageTitle('');
    };
  }, [modelId, setPageTitle]);

  if (!model) {
    return (
      <div className="container">
        <LoadingIndicator text="Loading model..." />
      </div>
    );
  } else {
    return (
      <ModelContextProvider initialModel={model}>
        <Modelpage />
      </ModelContextProvider>
    );
  }
};

export default ModelpageWrapper;
