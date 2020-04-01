import { faExternalLinkAlt, faTrash, faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PageContext } from '../../contexts/pagecontext';
import { LayerType } from '../../data/models';
import { api } from '../../util/api';
import { DashboardProps } from './Dashboard';
import classNames from 'classnames';
import LoadingIndicator from '../../components/utility/LoadingIndicator';

const Torch: React.FC<DashboardProps> = ({ data }) => {
  const { setPageTitle } = useContext(PageContext);
  const [availableLayers, setAvailableLayers] = useState<LayerType[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('PyTorch Settings');

    /**
     * Fetches all available layers into the state
     */
    const fetchLayers = async () => {
      try {
        const response = await api.get('layers');
        const layers = await response.json();
        setAvailableLayers(layers);
      } catch (error) {
        toast.error('Fehler beim Laden der Layer');
        setAvailableLayers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLayers();

    return () => setPageTitle('');
  }, [setPageTitle]);

  const triggerImport = async () => {
    try {
      setLoading(true);
      const response = await api.get('layers/reimport');
      setAvailableLayers(await response.json());
    } catch (error) {
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const deleteLayer = async (id: string) => {
    try {
      const response = await api.delete('layers/' + id);
      setAvailableLayers(await response.json());
      toast.success('Layer gelöscht');
    } catch (error) {
      toast.error(error.toString());
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-4xl font-serif">
        <span className="mr-2">PyTorch</span>
        {data && (
          <span className="text-lg text-gray-700 ">
            (
            <a
              className="underline"
              href={'https://pytorch.org/docs/' + data.torchVersion}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="mr-1">v {data.torchVersion}</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
            </a>
            )
          </span>
        )}
      </h1>
      <div className="flex">
        <button
          className="font-bold py-1 px-5 rounded focus:outline-none border border-blue-800 text-blue-800 font-bold focus:shadow-outline hover:bg-gray-100 mr-2"
          onClick={triggerImport}
        >
          Reimport Layer
        </button>
        <button
          disabled
          className="font-bold py-1 px-5 rounded focus:outline-none border border-blue-800 text-blue-800 font-bold focus:shadow-outline hover:bg-gray-100 mr-2"
        >
          Reimport Functions
        </button>
      </div>
      {isLoading && <LoadingIndicator text="Lädt Layer" />}
      {!isLoading && (
        <table className="table-auto w-full">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-2 text-gray-600 font-bold uppercase">Name</th>
              <th className="px-4 py-2 text-gray-600 font-bold uppercase">Benutzt in</th>
              <th className="px-4 py-2 text-gray-600 font-bold uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {availableLayers.map((layer: LayerType, index: number) => {
              const rowClasses = classNames('hover:bg-gray-300', { 'bg-white': index % 2 === 0 });
              return (
                <tr className={rowClasses} key={layer.id}>
                  <td className="border border-gray-500 px-4 py-2">{layer.layerName}</td>
                  <td className="border border-gray-500 px-4 py-2">3 Modellen</td>
                  <td className="border border-gray-500 px-4 py-2">
                    <button
                      className="px-2 hover:underline hover:text-gray-900 rounded"
                      onClick={() => deleteLayer(layer.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="px-2 hover:underline hover:text-gray-900 rounded">
                      <FontAwesomeIcon icon={faCode} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Torch;
