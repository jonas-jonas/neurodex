import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../util/api';
import { PageContext } from '../../contexts/pagecontext';

type DashboardData = {
  userCount: number;
  modelCount: number;
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>();
  const { setPageTitle } = useContext(PageContext);

  useEffect(() => {
    setPageTitle('Admin Dashboard');
    const fetchStats = async () => {
      const statsResponse = await api.get('admin/stats');
      setData(await statsResponse.json());
      setLoading(false);
    };
    fetchStats();
    return () => setPageTitle('');
  }, [setPageTitle]);

  return (
    <div className="">
      <h1 className="text-4xl font-serif">Admin Dashboard</h1>
      <div className="flex">
        <Link
          to="/admin/users"
          className="bg-white rounded p-5 hover:shadow hover:bg-gray-100 transition-all duration-300 m-2"
        >
          <h2 className="text-xl font-bold">Benutzer</h2>
          {!loading && <h2 className="">{data?.userCount} registrierte Benutzer</h2>}
          {loading && <FontAwesomeIcon icon={faSpinner} spin />}
        </Link>
        <Link
          to="/admin/courses"
          className="bg-white rounded p-5 hover:shadow hover:bg-gray-100 transition-all duration-300 m-2"
        >
          <h2 className="text-xl font-bold">Kurse</h2>
          {!loading && <h2 className="">30 laufende Kurse</h2>}
          {loading && <FontAwesomeIcon icon={faSpinner} spin />}
        </Link>
        <div className="bg-white rounded p-5 m-2">
          <h2 className="text-xl font-bold">Modelle</h2>
          {!loading && <h2 className="">{data?.modelCount} erstellte Modelle</h2>}
          {loading && <FontAwesomeIcon icon={faSpinner} spin />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
