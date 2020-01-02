import React from 'react';

/**
 * A generic panel with default styling
 * 
 * @param children - the children to be displayed
 */
export const Panel: React.FC = ({ children }) => {
	return <div className="px-1 w-2/6 relative">
		<div className="h-full flex flex-col border border-gray-200 rounded bg-whiteShade-100" >
			{children}
		</div>
	</div>
}