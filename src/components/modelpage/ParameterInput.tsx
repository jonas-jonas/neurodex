import React from 'react';
import { useModelContext } from '../../contexts/modelcontext';
import { ActivationFunctionParameter, LayerParameter } from '../../data/models';

type ParameterInputProps = {
  id: string;
  parameter: LayerParameter | ActivationFunctionParameter;
  updateData: (parameterName: string, newData: string) => Promise<void>;
  data?: number | boolean | string | string[];
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
      return null;
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
  data,
  id
}: ParameterInputProps) => {
  const onBlurHandler = async (e: React.FocusEvent<HTMLInputElement>) => {
    let value = (e.target as HTMLInputElement).value;
    if (!value) {
      value = parameter.defaultValue;
    }
    if (value !== data) {
      await updateData(parameter.name, value);
    }
  };

  return (
    <input
      type={parameter.type}
      className="w-full border px-2"
      defaultValue={data as number}
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
  data,
  id
}: ParameterInputProps) => {
  const onCheckHandler = async (e: React.MouseEvent<HTMLInputElement>) => {
    const checked = (e.target as HTMLInputElement).checked;
    if ((data === 'true') !== checked) {
      // Only update if the data is not the same
      await updateData(parameter.name, String(checked));
    }
  };

  return (
    <input
      type="checkbox"
      className="w-full border px-2"
      defaultChecked={data === 'true'}
      onClick={onCheckHandler}
      title={parameter.name}
      id={id}
    />
  );
};

const LayerSelect: React.FC<ParameterInputProps> = ({ parameter, updateData, data, id }) => {
  const { model } = useModelContext();

  const onChangeHandler = (e: React.ChangeEvent) => {
    const layerId = (e.target as HTMLSelectElement).value;
    updateData(parameter.name, layerId);
  };

  return (
    <select id={id} className="w-full border px-2" value={String(data)} onChange={onChangeHandler}>
      {!data && <option value=""></option>}
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
