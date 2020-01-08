export type User = {
  id: string;
  username: string;
  // password: string;
  admin: boolean;
};

export type Model = {
  id: string;
  name: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  layers: ModelLayer[];
  functions: ModelFunction[];
};

export type ModelLayer = {
  id: number;
  layerName: string;
  parameterData: Record<string, string>;
  layerType: LayerType;
};

export type ModelLayerParameterData = {
  modelLayer: ModelLayer;
  parameterName: string;
  value: string;
};

export type LayerType = {
  id: string;
  description: string;
  layerName: string;
  parameters: LayerParameter[];
};

export type LayerParameter = {
  name: string;
  type: string;
  defaultValue: string;
};

export type ActivationFunction = {
  id: number;
  name: string;
  description: string;
  parameters: ActivationFunctionParameter[];
};

export type ActivationFunctionParameter = {
  type: string;
  name: string;
  defaultValue: string;
};

export type ModelFunction = {
  id: number;
  function: ActivationFunction;
  parameterData: Record<string, Value>;
};
export type Value = {
  value: string;
  id?: number;
};
