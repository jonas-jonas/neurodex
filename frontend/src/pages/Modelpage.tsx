import { faCog, faCompressAlt, faExpandAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { SortEnd, SortEvent } from 'react-sortable-hoc';
import AButton from '../atoms/AButton';
import ModelActivatorCanvas from '../components/modelpage/ModelActivatorCanvas';
import ModelLayerPanel from '../components/modelpage/ModelLayerPanel';
import ModelPageNavigation from '../components/modelpage/ModelPageNavigation';
import LoadingIndicator from '../components/utility/LoadingIndicator';
import { useAuth } from '../contexts/AuthProvider';
import { ModelContextProvider, useModelContext } from '../contexts/ModelProvider';
import { usePage } from '../contexts/PageProvider';
import { Model } from '../data/models';
import { api } from '../util/api';
import { exitFullscreen, requestFullscreen } from '../util/functions';

enum ModelpageView {
  listView,
  canvasView,
  codeView,
}

export const Modelpage: React.FC = () => {
  const { model, updateModel } = useModelContext();
  const { user } = useAuth();
  const [isFullscreen, setFullscreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [currentView, setCurrentView] = useState<ModelpageView>(ModelpageView.canvasView);

  const updateModelActivatorOrder = async (sort: SortEnd, event: SortEvent) => {
    const movedActivator = model.activators[sort.oldIndex];
    await updateModel({
      type: 'UPDATE_MODEL_ACTIVATOR_ORDER',
      activatorId: movedActivator.modelActivatorId,
      newIndex: sort.newIndex,
    });
  };

  const getViewButtonClasses = (view: ModelpageView): string => {
    return classNames('mr-2', { 'bg-gray-300': currentView === view });
  };

  const handleFullscreenButtonClick = () => {
    if (isFullscreen) {
      exitFullscreen();
      setFullscreen(false);
    } else {
      if (wrapperRef.current) {
        requestFullscreen(wrapperRef.current);
        setFullscreen(true);
      }
    }
  };

  const handleViewSwitch = (view: ModelpageView) => {
    return () => {
      setCurrentView(view);
    };
  };

  return (
    <div className="flex h-full flex-auto pb-2 flex-col bg-gray-200" ref={wrapperRef}>
      <ModelPageNavigation model={model} user={user!} />
      <div className="bg-white px-4 py-2 flex justify-between">
        <div className="flex">
          <AButton
            colorClasses="font-bold hover:bg-gray-300"
            additionalClasses={getViewButtonClasses(ModelpageView.canvasView)}
            onClick={handleViewSwitch(ModelpageView.canvasView)}
          >
            Leinwand-Ansicht
          </AButton>
          <AButton
            colorClasses="font-bold hover:bg-gray-300"
            additionalClasses={getViewButtonClasses(ModelpageView.codeView)}
            onClick={handleViewSwitch(ModelpageView.codeView)}
          >
            Code-Ansicht
          </AButton>

          <div className="rounded bg-gray-200">
            <FontAwesomeIcon icon={faSearch} className="mx-2 text-gray-600" />
            <input className="px-2 py-1 rounded bg-gray-200 outline-none" placeholder="Suche" type="search" />
          </div>
        </div>
        <div>
          <AButton additionalClasses="mr-4">
            <FontAwesomeIcon icon={faCog} className="mr-2" />
            Einstellungen
          </AButton>
          <AButton onClick={handleFullscreenButtonClick}>
            <FontAwesomeIcon icon={isFullscreen ? faCompressAlt : faExpandAlt} className="mr-2" />
            {isFullscreen ? 'Vollbild verlassen' : 'Vollbildschirm'}
          </AButton>
        </div>
      </div>
      {currentView === ModelpageView.canvasView && (
        <div className="flex-grow flex px-4 pt-2">
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
      )}
      {currentView === ModelpageView.codeView && <h1>Code View</h1>}
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
