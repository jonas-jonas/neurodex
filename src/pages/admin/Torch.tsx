import {
  faExternalLinkAlt,
  faTrash,
  faCode,
  faChevronLeft,
  faChevronRight,
  faPassport,
  faExternalLinkSquareAlt
} from '@fortawesome/free-solid-svg-icons';
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
        const response = await api.get('admin/layers');
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
      <hr />
      <div className="flex">
        <button
          className="font-bold py-1 px-5 rounded focus:outline-none bg-blue-800 text-white font-bold focus:shadow-outline hover:bg-blue-700 mr-2 shadow"
          onClick={triggerImport}
        >
          Reimport Layer
        </button>
      </div>
      {isLoading && <LoadingIndicator text="Lädt Layer" />}
      {!isLoading && (
        <table className="table-auto w-full mt-2">
          <thead className="text-left">
            <tr className="rounded-t bg-white border border-gray-500">
              <th className="px-4 py-2 font-bold uppercase rounded-tl">Name</th>
              <th className="px-4 py-2 font-bold uppercase">Benutzt in</th>
              <th className="px-4 py-2 font-bold uppercase rounded-tr">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {availableLayers.map((layer: LayerType) => {
              return (
                <tr className="hover:bg-gray-200 bg-white" key={layer.id}>
                  <td className="border-b border-gray-500 px-4 py-2 border-l">
                    <a
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={'https://pytorch.org/docs/stable/nn.html#' + layer.id}
                    >
                      {layer.layerName}
                      <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" className="ml-1" />
                    </a>
                  </td>
                  <td className="border-b border-gray-500 px-4 py-2">3 Modellen</td>
                  <td className="border-b border-gray-500 px-4 py-2 border-r">
                    <button
                      className="inline-block px-2 rounded duration-100 transition-colors hover:text-white border border-error hover:bg-error text-sm font-bold mr-2"
                      onClick={() => deleteLayer(layer.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      Löschen
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
