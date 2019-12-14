import {
	faArrowRight,
	faPlus,
	faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime, Settings } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../contexts/auth';
import { api } from '../util/api';
import { Model } from '../data/model';
Settings.defaultLocale = 'de';

interface ModelsData {
	models: Model[];
}

const Homepage: React.FC = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const [creatingNewModel, setCreatingNewModel] = useState(false);
	const history = useHistory();
	const [models, setModels] = useState<Model[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadModels = async () => {
			setLoading(true);
			const response = await api.get('models');
			if (response.status === 200) {
				const data: ModelsData = await response.json();
				setModels(data.models);
			}
			setLoading(false);
		};
		loadModels();
	}, []);

	/**
	 * Handles the click on the "new" button
	 *
	 *
	 */
	const handleNewModel = async () => {
		setCreatingNewModel(true);
		const result = await Swal.fire({
			title: 'Modellname',
			input: 'text',
			inputAttributes: {
				autocapitalize: 'off',
				placeholder: 'Name'
			},
			customClass: { popup: 'shadow' },
			confirmButtonText: 'Erstellen'
		});
		if (result.value) {
			const data = new FormData();
			data.append('name', result.value);
			const { id } = await api.post('model/create', { body: data }).json();
			history.push('/model/' + id);
		}
		setCreatingNewModel(false);
	};

	if (!isAuthenticated) {
		return <Redirect to="/login" />;
	}
	return (
		<div className="container py-3">
			<div className="flex justify-between items-center ">
				<h1 className="text-3xl">{models.length} Models</h1>
				<button
					className="p-3"
					title="Neues modell"
					onClick={handleNewModel}
					disabled={creatingNewModel}
				>
					<FontAwesomeIcon
						icon={creatingNewModel ? faSpinner : faPlus}
						spin={creatingNewModel}
					/>
				</button>
			</div>

			{loading && (
				<div className="flex items-center justify-center h-48">
					<div className="block text-center text-gray-300">
						<FontAwesomeIcon icon={faSpinner} spin={true} />
						<h2>Loading models...</h2>
					</div>
				</div>
			)}
			{!loading &&
				models.map((model: Model) => {
					return <ModelCard model={model} key={model.id} />;
				})}
		</div>
	);
};

type ModelCardProps = {
	model: Model;
};

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
	console.log(model);
	return (
		<Link
			className="bg-white rounded py-2 px-5 mb-3 shadow border-b-4 border-transparent hover:border-blue-500 flex items-center justify-between"
			to={'/model/' + model.id}
		>
			<div className="">
				<h2 className="text-xl font-bold">{model.name}</h2>
				<i className="text-gray-300">
					Du · {DateTime.fromHTTP(model.updated).toRelative()} bearbeitet ·{' '}
					{DateTime.fromISO(model.created).toRelative()} erstellt
				</i>
			</div>
			<FontAwesomeIcon icon={faArrowRight} />
		</Link>
	);
};

const parseDate = (date: string) => {
	return DateTime.fromFormat(date, 'EEE');
}

export default Homepage;
