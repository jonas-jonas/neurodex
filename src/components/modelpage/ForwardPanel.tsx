import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { ModelContext } from '../../contexts/modelcontext';
import { ActivationFunction, ModelFunction } from '../../data/models';
import { Panel } from '../utility/Panel';
import LoadingIndicator from '../utility/LoadingIndicator';
import ParameterInput from './ParameterInput';

const ForwardPanel = () => {
	const { activationFunctions, model, addModelFunction } = useContext(
		ModelContext
	);

	const handleAddClick = () => {
		addModelFunction(activationFunctions[0].id);
	};

	return (
		<Panel>
			<div className="px-3 py-2 flex items-center justify-between rounded-t">
				<h2 className="text-lg font-bold font-mono">forward</h2>
				<button
					title="Funktion hinzufügen"
					className="px-1"
					onClick={handleAddClick}
				>
					<FontAwesomeIcon icon={faPlus} />
				</button>
			</div>
			<div className="overflow-y-auto h-full">
				<div className="p-2 overflow-y-auto h-full">
					{model?.functions.map(func => {
						return <ForwardCard currentFunc={func} key={func.id} />;
					})}
				</div>
			</div>
		</Panel>
	);
};

type ForwardCardProps = {
	currentFunc: ModelFunction;
};

const ForwardCard: React.FC<ForwardCardProps> = ({ currentFunc }) => {
	const {
		model,
		activationFunctions,
		deleteModelFunction,
		updateModelFunctionActivator,
		updateModelFunctionData
	} = useContext(ModelContext);
	const [updating, setUpdating] = useState(false);

	const handleFunctionChange = async (e: React.ChangeEvent) => {
		setUpdating(true);
		const id = (e.target as HTMLSelectElement).value;
		await updateModelFunctionActivator(currentFunc.id, Number(id));
		setUpdating(false);
	};

	const handleDeleteButtonClick = async () => {
		setUpdating(true);
		await deleteModelFunction(currentFunc.id);
		setUpdating(false);
	};

	const handleDataChange = async (parameterName: string, data: any) => {
		setUpdating(true);
		await updateModelFunctionData(currentFunc.id, parameterName, data);
		setUpdating(false);
	};

	return (
		<div className="rounded mb-2 font-mono bg-white select-none relative border border-blue-800">
			<div className="px-3 py-1 rounded-t flex justify-between items-center cursor-move border-b border-blue-800 bg-blue-800 text-white">
				<button
					className="focus:outline-none"
					onClick={handleDeleteButtonClick}
				>
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
			<div className="p-3">
				<table className="table-auto w-full">
					<tbody className="">
						<tr className="border-b">
							<td>
								<label>Aktivator</label>
							</td>
							<td>
								<select
									className="w-full border px-2"
									onChange={handleFunctionChange}
									value={currentFunc.function.id}
								>
									{activationFunctions.map((func: ActivationFunction) => {
										return (
											<option value={func.id} key={func.id}>
												{func.name}
											</option>
										);
									})}
								</select>
							</td>
						</tr>
						{currentFunc.function.parameters.map(parameter => {
							const id = '';
							return (
								<tr className="border-b" key={id}>
									<td>
										<label htmlFor={id}>{parameter.name}</label>
									</td>
									<td>
										<ParameterInput
											id={id}
											parameter={parameter}
											updateData={handleDataChange}
											data={currentFunc.parameterData[parameter.name]}
										/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{updating && (
				<div className="w-full h-full bg-white opacity-50 absolute inset-0">
					<LoadingIndicator text="Updating..." />
				</div>
			)}
		</div>
	);
};
export default ForwardPanel;
