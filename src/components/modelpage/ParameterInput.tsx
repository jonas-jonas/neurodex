import React from 'react';
import { useModelContext } from '../../contexts/modelcontext';
import { FunctionParameter, LayerParameter, Value } from '../../data/models';

type ParameterInputProps = {
  id: string;
  parameter: LayerParameter | FunctionParameter;
  updateData: (parameterName: string, newData: string) => Promise<void>;
  value?: Value;
};

/**
 * A "proxy" element that renders the responsible ParameterInput depending on the parameter type
 *
 * @param props - the properties that should be passed to the rendered input
 */
const ParameterInput: React.FC<ParameterInputProps> = props => {
  switch (props.parameter.type) {
    case 'boolean':
      return <BooleanParameterInput {...props} />;
    case 'number':
      return <NumberParameterInput {...props} />;
    case 'layer':
      return <LayerSelect {...props} />;
    default:
      //TODO: Add a message about missing datatype support?
      return <span>Unknown datatype "{props.parameter.type}"</span>;
  }
};

/**
 * An input element that displays a number
 *
 * @param {ParameterInputProps} - The properties of this element
 */
const NumberParameterInput: React.FC<ParameterInputProps> = ({
  parameter,
  updateData,
  value,
  id
}: ParameterInputProps) => {
  const onBlurHandler = async (e: React.FocusEvent<HTMLInputElement>) => {
    let newValue = (e.target as HTMLInputElement).value;
    if (!newValue) {
      newValue = parameter.defaultValue;
    }
    if (newValue !== value?.value) {
      await updateData(parameter.name, newValue);
    }
  };

  return (
    <input
      type={parameter.type}
      className="w-full border px-2 py-1"
      defaultValue={(value?.value as string)}
      onBlur={onBlurHandler}
      placeholder={parameter.defaultValue}
      title={parameter.name}
      id={id}
    />
  );
};

/**
 * A checkbox that displays a boolean value (true/false or on/off)
 *
 * @param {ParameterInputProps} - The properties of this element
 */
const BooleanParameterInput: React.FC<ParameterInputProps> = ({
  parameter,
  updateData,
  value,
  id
}: ParameterInputProps) => {
  const onCheckHandler = async (e: React.MouseEvent<HTMLInputElement>) => {
    const checked = (e.target as HTMLInputElement).checked;
    if ((value?.value === 'true') !== checked) {
      // Only update if the data is not the same
      await updateData(parameter.name, String(checked));
    }
  };

  return (
    <input
      type="checkbox"
      className="w-full border px-2 py-1"
      defaultChecked={value?.value === 'true'}
      onClick={onCheckHandler}
      title={parameter.name}
      id={id}
    />
  );
};

const LayerSelect: React.FC<ParameterInputProps> = ({ parameter, updateData, value, id }) => {
  const { model } = useModelContext();

  const onChangeHandler = (e: React.ChangeEvent) => {
    const layerId = (e.target as HTMLSelectElement).value;
    updateData(parameter.name, layerId);
  };

  return (
    <select
      id={id}
      className="w-full border px-2 py-1"
      value={String((value?.id))}
      onChange={onChangeHandler}
      title={parameter.name}
    >
      {!value?.id && <option value=""></option>}
      {model.layers.map(layer => {
        return (
          <option value={layer.id} key={layer.id}>
            {layer.layerName}
          </option>
        );
      })}
    </select>
  );
};

export default ParameterInput;
