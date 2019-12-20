import { faPlus, faTimes, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import LoadingIndicator from '../components/LoadingIndicator';
import { PageContext } from '../contexts/pagecontext';
import { Layer, LayerType, Model } from '../data/model';
import { api } from '../util/api';

SyntaxHighlighter.registerLanguage('python', python);

const Modelpage: React.FC = props => {
	const { setPageTitle } = useContext(PageContext);
	const { modelId } = useParams();
	const [model, setModel] = useState<Model>();

	const availableLayers: LayerType[] = useMemo(() => {
		return [{
			displayName: 'torch.nn.Linear',
			description: "",
			params: [
				{
					name: 'in_features',
					type: 'number'
				},
				{
					name: 'out_features',
					type: 'number'
				},
				{
					name: 'bias',
					type: 'boolean'
				}
			]
		}];
	}, []);

	useEffect(() => {
		const fetchModel = async () => {
			const response = await api.get('model/' + modelId);
			if (response.status === 200) {
				const { model }: { model: Model } = await response.json();
				setPageTitle(model.name);
				model.layers = [
					{
						type: availableLayers[0],
						data: {
							[availableLayers[0].params[0].name]: '3',
							[availableLayers[0].params[1].name]: '3',
							[availableLayers[0].params[2].name]: false
						}
					}
				]
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
		return <div className="flex h-full flex-auto pb-2">
			<div className="w-7/12 flex">

				<Panel>
					<div className="px-3 py-2 border-b bg-white rounded-t">
						<h2 className="text-lg font-bold">Layers</h2>
					</div>
					<div className="p-2 flex-grow overflow-y-scroll" >
						{availableLayers.map((layer) => {
							return <LayerCard {...layer} key={layer.displayName} />
						})}
					</div>
				</Panel>
				<Panel>
					<div className="px-3 py-2 flex items-center justify-between border-b bg-white rounded-t">
						<h2 className="text-lg font-bold font-mono">__init__</h2>
						<button title="Clear all" className=" px-1" >
							<FontAwesomeIcon icon={faUndo} />
						</button>
					</div>
					<div className="p-2 overflow-y-scroll h-full">
						{model.layers.map((layer) => {
							return <ConstructorCard {...layer} />
						})}
					</div>
				</Panel>

				<Panel>
					<div className="px-3 py-2 bg-blue-800 rounded-t text-white flex items-center justify-between">
						<h2 className="text-lg font-bold font-mono">forward</h2>
					</div>
					<div>Body</div>
				</Panel>
			</div>
			<div className="flex-grow h-full rounded px-3 py-2 overflow-y-scroll">
				<SyntaxHighlighter language="python" showLineNumbers style={docco}>
					{`class Model(nn.Module):
	def __init__(self):
		super(Model, self).__init__()
		self.linear = nn.Linear(128, 3000)
			
	def forward(self, inputs):
		return 0`}
				</SyntaxHighlighter>
			</div>

		</div>
	}
};

const LayerCard: React.FC<LayerType> = ({ displayName }) => {
	return <div className="shadow bg-blue-800 text-white mb-2 p-3 rounded cursor-pointer select-none border-2 border-transparent hover:underline focus:border-gray-100 flex justify-between items-center">
		<h2 className="font-mono mr-1">{displayName}</h2>
		<FontAwesomeIcon icon={faPlus} />
	</div>
}

const ConstructorCard: React.FC<Layer> = ({ type, data }: { type: LayerType, data: object }) => {

	return <div className="shadow rounded mb-2 font-mono bg-white">
		<div className="px-3 py-1 bg-orange-500 rounded-t text-white flex justify-between items-center cursor-move">
			<div className="pr-3">
				<input type="text" className="w-full bg-orange-500" value="linear1" />
				<span className="text-xs">{type.displayName}</span>
			</div>
			<button className="focus:outline-none">
				<FontAwesomeIcon icon={faTimes} />
			</button>
		</div>
		<div className="p-3">
			<table className="table-auto">
				<tbody>
					{Object.entries(data).map((param) => {
						return <tr>
							<td>{param[0]}</td>
							<td>
								<input type="number" className="w-full border" value={param[1]} />
							</td>
						</tr>
					})}
				</tbody>
			</table>
		</div>
	</div>
}

type PanelProps = {

}

const Panel: React.FC<PanelProps> = ({ children }) => {
	return <div className="px-2 w-2/6">
		<div className="h-full flex flex-col border rounded">
			{children}
		</div>
	</div>
}

export default Modelpage;
