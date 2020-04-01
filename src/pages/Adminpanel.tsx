import { faDiscourse } from '@fortawesome/free-brands-svg-icons';
import { faColumns, faLocationArrow, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { Link, Route } from 'react-router-dom';
import Dashboard from './admin/Dashboard';
import Torch from './admin/Torch';
import { api } from '../util/api';

export type DashboardData = {
  userCount: number;
  modelCount: number;
  torchVersion: string;
};

const Adminpanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>();

  useEffect(() => {
    const fetchStats = async () => {
      const statsResponse = await api.get('admin/stats');
      setData(await statsResponse.json());
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="container py-3 flex">
      <div>
        <div className="w-56 block bg-white rounded p-1">
          <Link
            to="/admin"
            className="block hover:bg-gray-200 hover:underline pl-10 pr-3 py-2 relative flex items-center"
          >
            <FontAwesomeIcon icon={faColumns} className="absolute left-0 ml-3" />
            Übersicht
          </Link>
          <Link
            to="/admin/users"
            className="block hover:bg-gray-200 hover:underline pl-10 pr-3 py-2 relative flex items-center"
          >
            <FontAwesomeIcon icon={faUsersCog} className="absolute left-0 ml-3" />
            Benutzer
          </Link>
          <Link
            to="/admin/courses"
            className="block hover:bg-gray-200 hover:underline pl-10 pr-3 py-2 relative flex items-center"
          >
            <FontAwesomeIcon icon={faDiscourse} className="absolute left-0 ml-3" />
            Kurse
          </Link>
          <Link
            to="/admin/torch"
            className="block hover:bg-gray-200 hover:underline pl-10 pr-3 py-2 relative flex items-center"
          >
            <FontAwesomeIcon icon={faLocationArrow} className="absolute left-0 ml-3" />
            PyTorch
          </Link>
        </div>
      </div>
      <div className="px-4 w-full">
        <Route exact path="/admin">
          <Dashboard data={data} loading={loading} />
        </Route>
        <Route path="/admin/users">
          <h1 className="text-4xl font-serif">Users</h1>
        </Route>
        <Route path="/admin/courses">
          <h1 className="text-4xl font-serif">Courses</h1>
        </Route>
        <Route path="/admin/torch">
          <Torch data={data} />
        </Route>
      </div>
    </div>
  );
};

export default Adminpanel;
