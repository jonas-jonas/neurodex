import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type LoadingIndicatorProps = {
  /** The text to be displayed */
  text: String;
};

/**
 * A loading indicator that displays a spinner and some @param text.
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ text }) => {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="block text-center text-gray-300">
        <FontAwesomeIcon icon={faSpinner} spin={true} />
        <h2>{text}</h2>
      </div>
    </div>
  );
};

export default LoadingIndicator;
