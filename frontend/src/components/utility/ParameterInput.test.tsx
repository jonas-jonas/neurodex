import { cleanup, render, screen, act, fireEvent } from '@testing-library/react';
import React from 'react';
import generate from '../../util/generate';
import { ParameterInput } from './ParameterInput';

afterEach(cleanup);

describe('ParameterInput', () => {
  it('renders data from parameter data if present', () => {
    const functionParameter = generate.functionParameter();
    const parameterData = {
      [functionParameter.name]: { value: 'random-value' },
    };
    const onUpdate = jest.fn();
    render(<ParameterInput parameter={functionParameter} parameterData={parameterData} onUpdate={onUpdate} />);

    expect(screen.getByDisplayValue('random-value')).toBeDefined();
  });

  it('has defaultValue as placeholder', () => {
    const functionParameter = generate.functionParameter({ defaultValue: 'default-random' });
    const onUpdate = jest.fn();
    render(<ParameterInput parameter={functionParameter} parameterData={{}} onUpdate={onUpdate} />);

    expect(screen.getByPlaceholderText('default-random')).toBeDefined();
  });

  it('has name of parameter as title', () => {
    const functionParameter = generate.functionParameter({ name: 'title-random' });
    const onUpdate = jest.fn();
    render(<ParameterInput parameter={functionParameter} parameterData={{}} onUpdate={onUpdate} />);

    expect(screen.getByTitle('title-random')).toBeDefined();
  });

  it('triggers update with correct data', async () => {
    const functionParameter = generate.functionParameter({ name: 'random-name' });
    const onUpdate = jest.fn();
    render(<ParameterInput parameter={functionParameter} parameterData={{}} onUpdate={onUpdate} />);

    const input = screen.getByTitle('random-name');

    await act(async () => {
      fireEvent.input(input, { target: { value: 'some-other-random-value' } });
      fireEvent.blur(input);
    });

    expect(onUpdate).toBeCalledWith('random-name', 'some-other-random-value');
  });

  it('does not trigger data for same parameter data', async () => {
    const functionParameter = generate.functionParameter({ name: 'random-name' });
    const parameterData = {
      [functionParameter.name]: { value: 'random-value' },
    };
    const onUpdate = jest.fn();
    render(<ParameterInput parameter={functionParameter} parameterData={parameterData} onUpdate={onUpdate} />);

    const input = screen.getByTitle('random-name');

    await act(async () => {
      fireEvent.input(input, { target: { value: 'random-value' } });
      fireEvent.blur(input);
    });

    expect(onUpdate).toHaveBeenCalledTimes(0);
  });
});
