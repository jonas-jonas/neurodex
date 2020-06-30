import { faCog, faCompressAlt, faExpandAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useRef, useState, useReducer } from 'react';
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
import { exitFullscreen, requestFullscreen } from '../util/fullscreen';
import { Modal } from '../components/utility/Modal';
import SettingsModal from '../components/modelpage/SettingsModal';
import CollaborationModal from '../components/modelpage/CollaborationModal';
import LayersModal from '../components/modelpage/LayersModal';

enum ModelpageView {
  listView,
  canvasView,
  codeView,
}

enum ModalType {
  settings,
  collaboration,
  addLayer,
}

type ModalStateReducerAction = { type: 'SHOW_MODAL'; modalType: ModalType } | { type: 'HIDE_CURRENT_MODAL' };

type ModalStateReducerState = {
  modal: ModalType | null;
  currentlyShowing: boolean;
};

function modalStateReducer(state: ModalStateReducerState, action: ModalStateReducerAction): ModalStateReducerState {
  switch (action.type) {
    case 'SHOW_MODAL':
      return { modal: action.modalType, currentlyShowing: true };
    case 'HIDE_CURRENT_MODAL':
      return { modal: null, currentlyShowing: false };
  }
}

export const Modelpage: React.FC = () => {
  const { model, updateModel } = useModelContext();
  const { user } = useAuth();
  const [isFullscreen, setFullscreen] = useState(false);
  const [modalState, updateModalState] = useReducer(modalStateReducer, {
    modal: null,
    currentlyShowing: true,
  });
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

  const showSettingsModal = () => {
    updateModalState({ type: 'SHOW_MODAL', modalType: ModalType.settings });
  };

  const showCollaborationModal = () => {
    updateModalState({ type: 'SHOW_MODAL', modalType: ModalType.collaboration });
  };

  const showAddLayerModal = () => {
    updateModalState({ type: 'SHOW_MODAL', modalType: ModalType.addLayer });
  };

  const hideModals = () => updateModalState({ type: 'HIDE_CURRENT_MODAL' });

  return (
    <div className="flex h-full flex-auto pb-2 flex-col bg-gray-200" ref={wrapperRef}>
      <ModelPageNavigation model={model} user={user!} showCollaborationModal={showCollaborationModal} />
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
          <AButton additionalClasses="mr-4" onClick={showSettingsModal}>
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
          <ModelLayerPanel showAddLayerModal={showAddLayerModal} />
          <div className="w-full h-full pl-6 overflow-x-auto">
            <div className="flex justify-between mb-4 py-2">
              <span className="font-bold tracking-wide">MODELL</span>
            </div>
            <ModelActivatorCanvas axis="x" useDragHandle onSortEnd={updateModelActivatorOrder} />
          </div>
        </div>
      )}
      {currentView === ModelpageView.codeView && <h1>Code View</h1>}
      {modalState.currentlyShowing && (
        <>
          {modalState.modal === ModalType.collaboration && (
            <Modal component={<CollaborationModal />} onClose={hideModals} />
          )}
          {modalState.modal === ModalType.settings && <Modal component={<SettingsModal />} onClose={hideModals} />}
          {modalState.modal === ModalType.addLayer && <Modal component={<LayersModal />} onClose={hideModals} />}
        </>
      )}
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
