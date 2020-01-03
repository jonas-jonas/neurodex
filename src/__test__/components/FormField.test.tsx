import React from 'react';
import ReactDOM from 'react-dom';
import FormField from '../../components/FormField';

let container: HTMLDivElement | null = null;
beforeEach(() => {
	// setup a DOM element as a render target
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	// cleanup on exiting
	if (container) {
		ReactDOM.unmountComponentAtNode(container);
		container.remove();
		container = null;
	}
});

it('Renders with correct label and name', () => {
	ReactDOM.render(<FormField label="test" name="test" />, container);
	expect(container?.children.length).toBe(1);

	const field = container?.querySelector('div');
	expect(field?.children.length).toBe(2)

	const label = field?.querySelector('label');
	expect(label?.textContent).toBe('test');

	const input = field?.querySelector('input');
	expect(input?.name).toBe('test');

	const validationMessage = field?.querySelector('p.text-error');
	expect(validationMessage).toBeNull();
});

it('Renders with validation message', () => {
	ReactDOM.render(<FormField label="test" name="test" validationMessage="message" />, container);
	const messageElement = container?.querySelector('div p.text-error');
	expect(messageElement?.textContent).toBe('message');

	const input = container?.querySelector('div input');
	expect(input?.classList).toContain('border-error');
})
