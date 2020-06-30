import { faTimes, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AButton from '../../atoms/AButton';
import ALink from '../../atoms/ALink';
import AModelNameDisplayer from '../../atoms/AModelNameDisplayer';
import { useAuth } from '../../contexts/AuthProvider';
import { useModelContext } from '../../contexts/ModelProvider';
import { Model, User } from '../../data/models';

export interface ModelPageNavigationProps {
  model: Model;
  user: User;
}

const ModelPageNavigation: React.FC<ModelPageNavigationProps> = ({ model, user }) => {
  const { updateModel } = useModelContext();
  const [isUserNavigationOpen, setUserNavigationOpen] = useState(false);
  const history = useHistory();
  const { deauthenticate } = useAuth();

  const handleUserNavigationClick = () => {
    setUserNavigationOpen(!isUserNavigationOpen);
  };

  const handleLogout = async () => {
    const loggedOut = await deauthenticate();
    if (loggedOut) {
      history.push('/login');
    }
  };

  const onModelNameSave = async (name: string) => {
    await updateModel({
      type: 'UPDATE_MODEL_NAME',
      newName: name,
    });
  };

  return (
    <div className="flex py-2 items-center justify-between bg-white px-4 border-b">
      <div className="flex items-center">
        <Link to="/" className="flex rounded hover:bg-gray-300 items-center justify-center h-10 w-10 mr-4">
          <img className="h-8" src="/static/assets/logo.png" alt="Neurodex logo" />
        </Link>
        <div>
          <AModelNameDisplayer modelName={model.name} onSave={onModelNameSave} />
          <h2 className="text-gray-600">
            Du · {DateTime.fromISO(model.createdAt, { zone: 'utc' }).toRelative({ padding: 1000 })} erstellt
          </h2>
        </div>
      </div>
      <div className="flex items-center">
        <AButton colorClasses="bg-blue-700 hover:bg-blue-800 text-white" additionalClasses="mr-4">
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          Kollaboration
        </AButton>
        <ALink to="/" additionalClasses="mr-4">
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          Schließen
        </ALink>
        <div className="relative">
          <button
            className="rounded-full bg-warn text-center h-10 w-10 text-white focus:outline-none hover:shadow"
            onClick={handleUserNavigationClick}
          >
            {user.name.substr(0, 1)}
          </button>
          {isUserNavigationOpen && (
            <div className="bg-white rounded border absolute right-0 mt-2 shadow-xl w-48 z-50 flex flex-col">
              <Link
                className="border-b px-2 py-2 flex items-center hover:bg-gray-100 transition-colors duration-150"
                to="/account"
              >
                Account Einstellungen
              </Link>
              <button
                onClick={handleLogout}
                className="border-b px-2 py-2 flex items-center hover:bg-gray-100 transition-colors duration-150"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelPageNavigation;
