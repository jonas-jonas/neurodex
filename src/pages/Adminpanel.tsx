import React from 'react';
import { Link, Route } from 'react-router-dom';
import Dashboard from './admin/Dashboard';
import { faColumns, faUsersCog, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscourse } from '@fortawesome/free-brands-svg-icons';

const Adminpanel: React.FC = () => {
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
      <div className="px-4">
        <Route exact path="/admin">
          <Dashboard />
        </Route>
        <Route path="/admin/users">
          <h1 className="text-4xl font-serif">Users</h1>
        </Route>
        <Route path="/admin/courses">
          <h1 className="text-4xl font-serif">Courses</h1>
        </Route>
        <Route path="/admin/torch">
          <h1 className="text-4xl font-serif">PyTorch</h1>
        </Route>
      </div>
    </div>
  );
};

export default Adminpanel;
