import { faSpinner, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../util/api';

const ConfirmEmailPage: React.FC = () => {
  const { id } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<String>();

  useEffect(() => {
    const confirmId = async () => {
      const data = {
        confirmationId: id
      };
      try {
        await api.post('users/confirm-email', { json: data });
      } catch (error) {
        if (error instanceof api.HTTPError) {
          const json = await error.response.json();
          setError(json.message);
        }
      } finally {
        setLoading(false);
      }
    };

    confirmId();
  }, [id]);

  const body = useMemo(() => {
    if (isLoading) {
      return <FontAwesomeIcon icon={faSpinner} spin size="3x" />;
    } else if (error) {
      return (
        <>
          <FontAwesomeIcon icon={faTimesCircle} size="5x" className="text-error mb-4" />
          <p className="mb-2">{error}</p>
          <Link to="/login#register" replace className="underline">
            Bitte registriere dich erneut
          </Link>
        </>
      );
    } else {
      return (
        <>
          <FontAwesomeIcon icon={faCheckCircle} size="5x" className="text-success mb-4" />
          <p className="mb-2">Deine Email-Adresse wurde erfolgreich bestätigt.</p>
          <Link to="/login" replace className="underline">
            Du kannst dich jetzt einloggen
          </Link>
        </>
      );
    }
  }, [error, isLoading]);

  return (
    <div className="w-full max-w-xs mx-auto pt-8">
      <div className="bg-white shadow-md rounded mb-4 mx-auto">
        <div className="px-8 pt-6 pb-8 text-center">{body}</div>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
