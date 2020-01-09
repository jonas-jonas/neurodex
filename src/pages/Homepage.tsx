import { faArrowRight, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime, Settings } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../contexts/auth';
import { api } from '../util/api';
import { Model } from '../data/models';
import LoadingIndicator from '../components/utility/LoadingIndicator';
Settings.defaultLocale = 'de';

interface ModelsData {
  models: Model[];
}

const Homepage: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [creatingNewModel, setCreatingNewModel] = useState(false);
  const history = useHistory();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      const response = await api.get('model');
      if (response.status === 200) {
        const data: ModelsData = await response.json();
        setModels(data.models);
      }
      setLoading(false);
    };
    if (isAuthenticated) {
      loadModels();
    }
  }, [isAuthenticated]);

  /**
   * Handles the click on the "new" button
   *
   *
   */
  const handleNewModel = async () => {
    setCreatingNewModel(true);
    const result = await Swal.fire({
      title: 'Modellname',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'Name'
      },
      customClass: { popup: 'shadow' },
      confirmButtonText: 'Erstellen'
    });
    if (result.value) {
      const data = new FormData();
      data.append('name', result.value);
      const response = await api.post('model', { body: data });
      if (response.status === 200) {
        const { id } = await response.json();
        history.push('/model/' + id);
      }
    }
    setCreatingNewModel(false);
  };

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  return (
    <div className="container py-3">
      <div className="flex justify-between items-center ">
        <h1 className="text-3xl">{models.length} Models</h1>
        <button className="p-3" title="Neues modell" onClick={handleNewModel} disabled={creatingNewModel}>
          <FontAwesomeIcon icon={creatingNewModel ? faSpinner : faPlus} spin={creatingNewModel} />
        </button>
      </div>

      {loading && <LoadingIndicator text="Loading models..." />}
      {!loading &&
        models.map((model: Model) => {
          return <ModelCard model={model} key={model.id} />;
        })}
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
      to={'/model/' + model.id}
    >
      <div className="">
        <h2 className="text-xl font-bold">{model.name}</h2>
        <i className="text-gray-600">
          Du · {DateTime.fromISO(model.updatedAt).toRelative()} bearbeitet ·{' '}
          {DateTime.fromISO(model.createdAt).toRelative()} erstellt
        </i>
      </div>
      <FontAwesomeIcon icon={faArrowRight} />
    </Link>
  );
};

export default Homepage;
