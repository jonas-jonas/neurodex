export type User = {
  id: string;
  email: string;
  // password: string;
  roles: String[];
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
  parameterData: Record<string, Value>;
  layerType: LayerType;
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

export type Function = {
  description: string;
  id: number;
  name: string;
  parameters: FunctionParameter[];
};

export type FunctionParameter = {
  defaultValue: string;
  id: number;
  name: string;
  type: string;
};

export type ModelFunction = {
  function: Function;
  id: number;
  parameterData: Record<string, Value>;
};

export type Value = {
  id?: number;
  value: string;
};

