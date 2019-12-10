import React from 'react';
import { useParams } from 'react-router';

const Modelpage: React.FC = (props) => {
	const { id } = useParams();
	return <h2>{id}</h2>;
};

export default Modelpage;