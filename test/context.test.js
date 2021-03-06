import React from 'react';
import { FormspreeProvider, useFormspree } from '../src';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { createClient } from '@formspree/core';
import { ErrorBoundary } from './helpers';

jest.mock('@formspree/core');

const { act } = ReactTestUtils;

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('instantiates a client and provides it via useFormspree hook', () => {
  createClient.mockImplementation(config => ({
    startBrowserSession: () => {},
    key: config.project
  }));

  const Component = () => {
    const client = useFormspree();
    return <div id="client">project: {client.key}</div>;
  };

  const Page = ({ project }) => {
    return (
      <FormspreeProvider project={project}>
        <Component />
      </FormspreeProvider>
    );
  };

  act(() => {
    ReactDOM.render(<Page project="xxx" />, container);
  });

  expect(container.querySelector('#client').textContent).toBe('project: xxx');
});

it('throws an error if project prop is not provided', () => {
  // Mock error console to suppress noise in output
  console.error = jest.fn();

  act(() => {
    ReactDOM.render(
      <ErrorBoundary>
        <FormspreeProvider></FormspreeProvider>
      </ErrorBoundary>,
      container
    );
  });

  const error = container.querySelector('#error');
  expect(error.textContent).toBe('project is required');
});
