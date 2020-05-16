import { random, internet, name, lorem, date, helpers } from 'faker/locale/en';
import {
  User,
  Model,
  ModelLayer,
  LayerType,
  LayerParameter,
  Function,
  FunctionParameter,
  ModelActivator,
} from '../data/models';

function generate<T>(fn: () => T, count: number): T[] {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(fn());
  }
  return result;
}

export function user(overrides = {}): User {
  return {
    userId: random.uuid(),
    email: internet.email(),
    name: name.firstName(),
    roles: [],
    ...overrides,
  };
}

export function model(overrides = {}): Model {
  return {
    modelId: random.uuid(),
    name: lorem.word(),
    user: user(),
    createdAt: date.recent().toISOString(),
    updatedAt: date.recent().toISOString(),
    layers: [],
    activators: [],
    ...overrides,
  };
}

export function modelLayer(overrides = {}): ModelLayer {
  return {
    activatorTargetId: random.number(),
    displayName: helpers.randomize(),
    name: helpers.randomize(),
    parameterData: {},
    layerType: layerType(),
    type: 'model_layer',
    ...overrides,
  };
}

export function layerType(overrides = {}, parameterCount = 1): LayerType {
  return {
    layerTypeId: lorem.slug().replace('-', '_'),
    description: lorem.words(10),
    layerName: helpers.randomize(),
    parameters: [...generate(layerParameter, parameterCount)],
    ...overrides,
  };
}

export function layerParameter(overrides = {}): LayerParameter {
  return {
    name: helpers.randomize(),
    type: helpers.randomize(),
    defaultValue: helpers.randomize(),
    ...overrides,
  };
}

export function function_(overrides = {}, parameterCount = 1): Function {
  return {
    activatorTargetId: random.number(),
    description: lorem.words(10),
    displayName: helpers.randomize(),
    name: random.word(),
    parameters: [...generate(functionParameter, parameterCount)],
    type: 'function',
    ...overrides,
  };
}

export function functionParameter(overrides = {}): FunctionParameter {
  return {
    defaultValue: random.word(),
    name: random.word(),
    type: random.word(),
    ...overrides,
  };
}

export function modelFunction(overrides = {}): ModelActivator {
  return {
    modelActivatorId: random.number(),
    parameterData: {},
    value: modelLayer(),
    ...overrides,
  };
}

export default {
  function_,
  functionParameter,
  layerParameter,
  layerType,
  model,
  modelFunction,
  modelLayer,
  user,
};
