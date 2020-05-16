export type User = {
  userId: string;
  email: string;
  name: string;
  // password: string;
  roles: String[];
};

export type Model = {
  modelId: string;
  name: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  layers: ModelLayer[];
  activators: ModelActivator[];
};

export type ModelActivator = {
  modelActivatorId: number;
  value: Function | ModelLayer;
  parameterData: Record<string, Value>;
};

export type ModelLayer = {
  activatorTargetId: number;
  displayName: string;
  name: string;
  parameterData: Record<string, Value>;
  layerType: LayerType;
  type: 'model_layer';
};

export type LayerType = {
  layerTypeId: string;
  description?: string;
  layerName: string;
  parameters: LayerParameter[];
};

export type LayerParameter = {
  name: string;
  description: string;
  type: string;
  defaultValue: string;
  required: boolean;
};

export type Function = {
  activatorTargetId: number;
  description: string;
  name: string;
  parameters: FunctionParameter[];
  type: 'function';
  displayName: string;
};

export type FunctionParameter = {
  defaultValue: string;
  name: string;
  type: string;
};

export type Value = {
  value_id?: number;
  value: string;
};
