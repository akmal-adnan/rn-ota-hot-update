/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/navigations', () => {
  const ReactRuntime = require('react');
  const {View} = require('react-native');

  return {
    RootNavigator: () =>
      ReactRuntime.createElement(View, {testID: 'root-navigator'}),
  };
});

import App from '../App';

test('renders correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });

  expect(renderer!.root.findByProps({testID: 'root-navigator'})).toBeTruthy();
});
