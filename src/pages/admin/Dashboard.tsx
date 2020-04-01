import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardData } from '../Adminpanel';

export type DashboardProps = {
  data?: DashboardData;
  loading?: boolean;
};

const Dashboard: React.FC<DashboardProps> = ({ data, loading }) => {
  return (
    <div className="">
      <h1 className="text-4xl font-serif">Admin Dashboard</h1>
      <div className="flex">
        <Link
          to="/admin/users"
          className="bg-white rounded p-5 shadow hover:bg-gray-100 transition-all duration-300 m-2"
        >
          <h2 className="text-xl font-bold">Benutzer</h2>
          {!loading && <h2 className="">{data?.userCount} registrierte Benutzer</h2>}
          {loading && <FontAwesomeIcon icon={faSpinner} spin />}
        </Link>
        <Link
          to="/admin/courses"
          className="bg-white rounded p-5 shadow hover:bg-gray-100 transition-all duration-300 m-2"
        >
          <h2 className="text-xl font-bold">Kurse</h2>
          {!loading && <h2 className="">30 laufende Kurse</h2>}
          {loading && <FontAwesomeIcon icon={faSpinner} spin />}
        </Link>
        <div className="bg-white rounded p-5 m-2 shadow">
          <h2 className="text-xl font-bold">Modelle</h2>
          {!loading && <h2 className="">{data?.modelCount} erstellte Modelle</h2>}
          {loading && <FontAwesomeIcon icon={faSpinner} spin />}
        </div>
      </div>
      <div className="flex">
        <Link
          to="/admin/torch"
          className="bg-white rounded p-5 shadow hover:bg-gray-100 transition-all duration-300 m-2"
        >
          <h2 className="text-xl font-bold">PyTorch</h2>
          {!loading && <h2 className="">Version: {data?.torchVersion}</h2>}
          {loading && <FontAwesomeIcon icon={faSpinner} spin />}
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
