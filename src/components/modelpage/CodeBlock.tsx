import React, { useMemo } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import vs from 'react-syntax-highlighter/dist/esm/styles/hljs/vs';
import { ActivationFunctionParameter, Model, ModelFunction, ModelLayer, LayerParameter } from '../../data/models';

SyntaxHighlighter.registerLanguage('python', python);

type CodeBlockProps = {
  model: Model;
};

const JSToPython: Record<string, string> = {
  true: 'True',
  false: 'False'
};

const CodeBlock: React.FC<CodeBlockProps> = ({ model }) => {
  const layers = useMemo(() => {
    return model.layers
      .map((layer: ModelLayer) => {
        const params = layer.layerType.parameters
          .map((parameter: LayerParameter) => {
            const name = parameter.name;
            const value = layer.parameterData[name] || parameter.defaultValue;
            return `${name}=${JSToPython[value] || value}`;
          })
          .join(', ');
        // The indentation is to correctly indent every line of layers
        return `		self.${layer.layerName} = ${layer.layerType.id}(${params})`;
      })
      .join('\n');
  }, [model.layers]);

  const functions = useMemo(() => {
    return model.functions
      .map((func: ModelFunction) => {
        const functions = func.function.parameters
          .filter(parameter => !!func.parameterData[parameter.name])
          .map((parameter: ActivationFunctionParameter) => {
            const name = parameter.name;
            const value = func.parameterData[name]?.value || parameter.defaultValue;
            return `${name}=${JSToPython[value] || value}`;
          })
          .join(', ');

        return `		inputs = ${func.function.name}(${functions})`;
      })
      .join('\n');
  }, [model.functions]);

  return (
    <SyntaxHighlighter language="python" showLineNumbers style={vs} className="font-mono text-lg font-bold rounded">
      {`import torch.nn.functional as F

class ${model.name}(torch.nn.Module):
	def __init__(self):
		super(${model.name}, self).__init__()
${layers}

	def forward(self, inputs):
${functions}
		return inputs`}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
