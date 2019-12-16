import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { PageContext } from '../contexts/pagecontext';
import { api } from '../util/api';
import { Model } from '../data/model';
import LoadingIndicator from '../components/LoadingIndicator';

const Modelpage: React.FC = props => {
	const { setPageTitle } = useContext(PageContext);
	const { modelId } = useParams();
	const [model, setModel] = useState<Model>();

	useEffect(() => {
		const fetchModel = async () => {
			const response = await api.get('model/' + modelId);
			if (response.status === 200) {
				const { model } = await response.json();
				setPageTitle(model.name);
				setModel(model);
			}
		}
		fetchModel()
	}, [modelId, setPageTitle]);

	if (!model) {
		return <div className="container">
			<LoadingIndicator text="Loading model..." />
		</div>;
	} else {
		return <div></div>

	}

};

export default Modelpage;
