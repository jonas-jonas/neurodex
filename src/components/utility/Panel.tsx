import React from 'react';

/**
 * A generic panel with default styling
 *
 * @param children - the children to be displayed
 */
export const Panel: React.FC = ({ children }) => {
  return (
    <div className="px-1 w-2/6 relative">
      <div className="h-full flex flex-col bg-white rounded">{children}</div>
    </div>
  );
};
