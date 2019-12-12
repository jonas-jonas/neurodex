import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { PageContext } from '../contexts/pagecontext';

const Modelpage: React.FC = props => {
	const { setPageTitle } = useContext(PageContext);
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			setPageTitle(id);
		}
		return () => {
			setPageTitle('');
		}
	}, [id, setPageTitle]);

	return <h2>{id}</h2>;
};

export default Modelpage;
