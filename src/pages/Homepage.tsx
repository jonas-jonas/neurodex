import {
	faArrowRight,
	faPlus,
	faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';
import { Model, ModelContext } from '../contexts/modelcontext';

const dummyModels = [
	{
		name: 'Modelname',
		id: 'asd',
		created: new Date(),
		updated: new Date()
	},
	{
		name: 'Modelname',
		id: 'asd2',
		created: new Date(),
		updated: new Date()
	}
];

const Homepage: React.FC = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const { createNewModel } = useContext(ModelContext);
	const [creatingNewModel, setCreatingNewModel] = useState(false);
	const history = useHistory();

	/**
	 * Handles the click on the "new" button
	 *
	 *
	 */
	const handleNewModel = async () => {
		setCreatingNewModel(true);
		const id = await createNewModel();
		setCreatingNewModel(false);
		history.push('/model/' + id);
	};

	if (!isAuthenticated) {
		return <Redirect to="/login" />;
	}
	return (
		<div className="container py-3">
			<div className="flex justify-between items-center ">
				<h1 className="text-3xl">{dummyModels.length} Models</h1>
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

			{dummyModels.map((model: Model) => {
				return <ModelCard model={model} key={model.id} />;
			})}
		</div>
	);
};

type ModelCardProps = {
	model: Model;
};

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
	return (
		<Link
			className="bg-white rounded py-2 px-5 mb-3 shadow border-b-4 border-transparent hover:border-blue-500 flex items-center justify-between"
			to={'/model/' + model.id}
		>
			<div className="">
				<h2 className="text-xl font-bold">{model.name}</h2>
				<i className="text-gray-300">
					Du · vor 2 Stunden bearbeitet · vor 3 Stunden erstellt
				</i>
			</div>
			<FontAwesomeIcon icon={faArrowRight} />
		</Link>
	);
};

export default Homepage;
