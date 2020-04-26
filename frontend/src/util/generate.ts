import { random, internet, name, lorem, date, helpers } from 'faker/locale/en';
import {
  User,
  Model,
  ModelLayer,
  LayerType,
  LayerParameter,
  Function,
  FunctionParameter,
  ModelFunction,
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
    id: random.uuid(),
    email: internet.email(),
    name: name.firstName(),
    roles: [],
    ...overrides,
  };
}

export function model(overrides = {}): Model {
  return {
    id: random.uuid(),
    name: lorem.word(),
    user: user(),
    createdAt: date.recent().toISOString(),
    updatedAt: date.recent().toISOString(),
    layers: [],
    functions: [],
    ...overrides,
  };
}

export function modelLayer(overrides = {}): ModelLayer {
  return {
    id: random.number(),
    layerName: helpers.randomize(),
    parameterData: {},
    layerType: layerType(),
    ...overrides,
  };
}

export function layerType(overrides = {}, parameterCount = 1): LayerType {
  return {
    id: lorem.slug().replace('-', '_'),
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
    id: random.number(),
    description: lorem.words(10),
    name: random.word(),
    parameters: [...generate(functionParameter, parameterCount)],
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

export function modelFunction(overrides = {}): ModelFunction {
  return {
    function: function_(),
    id: random.number(),
    parameterData: {},
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
