import React, { useMemo } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import vs from 'react-syntax-highlighter/dist/esm/styles/hljs/vs';
import { LayerParameter, Model, ModelLayer } from '../../data/models';

SyntaxHighlighter.registerLanguage('python', python);

type CodeBlockProps = {
	model: Model;
}

const JSToPython: Record<string, string> = {
	true: 'True',
	false: 'False'
}

const CodeBlock: React.FC<CodeBlockProps> = ({ model }) => {

	const layers = useMemo(() => {
		return model.layers.map((layer: ModelLayer) => {
			const params = layer.layerType.parameters.map((parameter: LayerParameter) => {
				const name = parameter.name;
				const value = layer.parameterData[name] || parameter.defaultValue;
				return `${name}=${JSToPython[value] || value}`;
			}).join(', ');
			// The indentation is to correctly indent every line of layers
			return `		self.${layer.layerName} = ${layer.layerType.id}(${params})`
		}).join('\n');

	}, [model.layers]);

	return <SyntaxHighlighter language="python" showLineNumbers style={vs} className="font-mono text-lg font-bold rounded">
		{`class ${model.name}(torch.nn.Module):
	def __init__(self):
		super(${model.name}, self).__init__()
${layers}

	def forward(self, inputs):
		return 0`}
	</SyntaxHighlighter>
}

export default CodeBlock;