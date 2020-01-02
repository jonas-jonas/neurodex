import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { useParams } from 'react-router';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ModelLayerPanel from '../components/modelpage/ModelLayerPanel';
import LoadingIndicator from '../components/utility/LoadingIndicator';
import { ModelContext, ModelContextProvider } from '../contexts/modelcontext';
import { LayerType } from '../data/models';
import { api } from '../util/api';
import { Panel } from '../components/utility/Panel';

SyntaxHighlighter.registerLanguage('python', python);

const Modelpage: React.FC = () => {

	const { model, setModel, availableLayers } = useContext(ModelContext);

	const handleLayerAdd = async (id: string) => {
		const data = new FormData();
		data.append('layerId', id);
		const response = await api.post('model/' + model?.id + '/layer', { body: data });

		const json = await response.json();
		setModel(json.model);
	}

	if (!model) {
		return <div className="container">
			<LoadingIndicator text="Loading model..." />
		</div>;
	} else {
		return <div className="flex h-full flex-auto pb-2">
			<div className="w-7/12 flex">
				<Panel>
					<div className="px-3 py-2 rounded-t">
						<h2 className="text-lg font-bold">Layers</h2>
					</div>
					<div className="p-2 flex-grow overflow-y-auto" >
						{availableLayers.map((layerType) => {
							return <LayerCard layerType={layerType} key={layerType.id} onAdd={handleLayerAdd} />
						})}
					</div>
				</Panel>
				<ModelLayerPanel />

				<Panel>
					<div className="px-3 py-2 flex items-center justify-between rounded-t">
						<h2 className="text-lg font-bold font-mono">forward</h2>
					</div>
					<div>Body</div>
				</Panel>
			</div>
			<div className="flex-grow h-full rounded px-3 py-2 overflow-y-auto">
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

type LayerCardProps = {
	layerType: LayerType;
	onAdd: (id: string) => void;
}

const LayerCard: React.FC<LayerCardProps> = ({ layerType, onAdd }) => {

	const handleAdd = () => {
		onAdd(layerType.id);
	}

	return <div className="shadow bg-blue-800 text-white mb-2 p-3 rounded cursor-pointer select-none border-b-2 border-transparent focus:border-gray-100 flex justify-between items-center">
		<h2 className="font-mono mr-1">{layerType.id}</h2>
		<button className="px-2 hover:bg-blue-700 focus:outline-none" onClick={handleAdd}>
			<FontAwesomeIcon icon={faPlus} />
		</button>
	</div>
}

const ModelpageWrapper = () => {

	const { modelId } = useParams();

	return <ModelContextProvider modelId={modelId}>
		<Modelpage />
	</ModelContextProvider>
}

export default ModelpageWrapper;
