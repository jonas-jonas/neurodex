import { faDownload, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import vs from 'react-syntax-highlighter/dist/esm/styles/hljs/vs';
import { ActivationFunctionParameter, LayerParameter, Model, ModelFunction, ModelLayer } from '../../data/models';

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
    if (model.layers.length === 0) {
      return '		# TODO: Layer einfügen';
    }
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
    if (model.functions.length === 0) {
      return '		# TODO: Funktionen einfügen';
    }
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
    <div className="h-full px-1 overflow-y-auto w-5/12">
      <div className="rounded shadow">
        <div className="px-3 py-2 rounded-t bg-gray-100 border-b border-gray-700 flex justify-between items-center shadow">
          <div className="flex items-center">
            <h2 className="text-lg font-bold">Vorschau</h2>
            <span className="text-gray-700 hover:underline cursor-pointer ml-3 font-semibold italic select-none">
              {model.name}.py
            </span>
          </div>
          <div className="flex ">
            <button className="px-2">
              <FontAwesomeIcon icon={faDownload} />
            </button>
            <button className="px-2">
              <FontAwesomeIcon icon={faShare} />
            </button>
          </div>
        </div>
        <SyntaxHighlighter language="python" showLineNumbers style={vs} className="font-mono text-lg rounded-b">
          {`import torch
import torch.nn.functional as F

class ${model.name}(torch.nn.Module):
	def __init__(self):
		super(${model.name}, self).__init__()
${layers}

	def forward(self, inputs):
${functions}
		return inputs`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
