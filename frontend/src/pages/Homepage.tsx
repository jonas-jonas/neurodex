import { faArrowRight, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime, Settings } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import AbstractModal, { Modal, useOverlayContext } from '../components/utility/AbstractModal';
import FormField from '../components/utility/FormField';
import LoadingIndicator from '../components/utility/LoadingIndicator';
import { Model } from '../data/models';
import { api } from '../util/api';
Settings.defaultLocale = 'de';

const Homepage: React.FC = () => {
  const [creatingNewModel, setCreatingNewModel] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      const response = await api.get('models');
      if (response.status === 200) {
        const models = await response.json();
        setModels(models);
      }
      setLoading(false);
    };
    loadModels();
  }, []);

  const showAddModelModal = () => setCreatingNewModel(true);
  const hideAddModelModal = () => setCreatingNewModel(false);

  return (
    <div className="container py-3">
      <div className="flex justify-between items-center ">
        <h1 className="text-3xl">
          {models.length} Modell{models.length !== 1 && 'e'}
        </h1>
        <button className="p-3" title="Neues Modell" onClick={showAddModelModal} disabled={creatingNewModel}>
          <FontAwesomeIcon icon={creatingNewModel ? faSpinner : faPlus} spin={creatingNewModel} />
        </button>
      </div>

      {loading && <LoadingIndicator text="Loading models..." />}
      {!loading &&
        models.map((model: Model) => {
          return <ModelCard model={model} key={model.modelId} />;
        })}
      {creatingNewModel && <Modal component={<CreateModelModal />} onClose={hideAddModelModal} />}
    </div>
  );
};

type ModelCardProps = {
  model: Model;
};

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <Link
      className="bg-white rounded py-2 px-5 mb-3 shadow border-b-4 border-transparent hover:border-blue-500 flex items-center justify-between"
      to={'/model/' + model.modelId}
    >
      <div className="">
        <h2 className="text-xl font-bold">{model.name}</h2>
        <i className="text-gray-600">
          Du · {DateTime.fromISO(model.updatedAt, { zone: 'utc' }).toRelative({ padding: 1000 })} bearbeitet ·{' '}
          {DateTime.fromISO(model.createdAt, { zone: 'utc' }).toRelative({ padding: 1000 })} erstellt
        </i>
      </div>
      <FontAwesomeIcon icon={faArrowRight} />
    </Link>
  );
};

const CreateModelModal = () => {
  const { register, handleSubmit, errors, setError, formState, setValue } = useForm({ mode: 'onChange' });

  const { handleClose } = useOverlayContext();

  const history = useHistory();

  const createModel = async (values: Record<string, any>) => {
    const data = {
      name: values.name,
    };
    try {
      const response = await api.post('models', { json: data });
      const { modelId } = await response.json();
      handleClose();
      history.push('/model/' + modelId);
    } catch (error) {
      if (error instanceof api.HTTPError) {
        const response = error.response;
        const { message } = await response.json();
        setError('name', 'notMatch', message);
        setValue('name', '');
      }
    }
  };

  return (
    <AbstractModal size="SMALL">
      <div className="bg-gray-100 rounded-t p-4 flex-shrink-0 border-b-4 border-blue-700 flex-shrink-0">
        <h1 className="font-serif text-3xl text-center">Neues Modell erstellen</h1>
      </div>
      <form className="flex-grow flex flex-col pt-6 pb-8 w-64 mx-auto" onSubmit={handleSubmit(createModel)}>
        <div className="flex-grow">
          <FormField
            label="Name"
            placeholder="Modellname"
            ref={register({ required: true })}
            name="name"
            validationMessage={errors.name?.message}
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={formState.isSubmitting || !formState.isValid || !formState.dirty}
          className="mt-4 font-bold py-1 px-5 border border-blue-800 rounded focus:outline-none font-bold focus:shadow-outline hover:bg-gray-100 w-full disabled:opacity-50"
        >
          {formState.isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Erstellen'}
        </button>
      </form>
    </AbstractModal>
  );
};

export default Homepage;
