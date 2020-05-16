import { faArrowRight, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime, Settings } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import LoadingIndicator from '../components/utility/LoadingIndicator';
import { Model } from '../data/models';
import { SWALClasses } from '../util/alert';
import { api } from '../util/api';
Settings.defaultLocale = 'de';

const Homepage: React.FC = () => {
  const [creatingNewModel, setCreatingNewModel] = useState(false);
  const history = useHistory();
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
      customClass: SWALClasses,
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'Name',
      },
      inputValidator: (value: string) => {
        // if (!value.match(/([A-Z][a-z0-9]+)+/)) {
        //   return 'Der Name muss in PascalCase geschrieben sein.';
        // }
        if (value.includes(' ')) {
          return 'Der Name darf keine Leerzeichen enthalten.';
        }
        return '';
      },
      confirmButtonText: 'Erstellen',
    });
    if (result.value) {
      const data = {
        name: result.value,
      };
      const response = await api.post('models', { json: data });
      if (response.status === 200) {
        const { modelId } = await response.json();
        history.push('/model/' + modelId);
      }
    }
    setCreatingNewModel(false);
  };

  return (
    <div className="container py-3">
      <div className="flex justify-between items-center ">
        <h1 className="text-3xl">
          {models.length} Modell{models.length !== 1 && 'e'}
        </h1>
        <button className="p-3" title="Neues Modell" onClick={handleNewModel} disabled={creatingNewModel}>
          <FontAwesomeIcon icon={creatingNewModel ? faSpinner : faPlus} spin={creatingNewModel} />
        </button>
      </div>

      {loading && <LoadingIndicator text="Loading models..." />}
      {!loading &&
        models.map((model: Model) => {
          return <ModelCard model={model} key={model.modelId} />;
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

export default Homepage;
