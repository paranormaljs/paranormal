// @flow
import React from 'react';
import { render } from 'react-dom';
import { injectGlobal } from 'styled-components';
import App from './App';
import type { ExamplesData } from '../types';

const EXAMPLES_DATA: ExamplesData = window.EXAMPLES_DATA;

injectGlobal`
  html,
  body,
  #root {
    position: relative;
    width: 100%;
    height: 100%;
  }

  body {
    margin: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    -webkit-font-smoothing: antialiased;
  }
`;

let root = document.getElementById('root');
if (!root) throw new Error('Missing #root');
render(<App examples={EXAMPLES_DATA} />, root);
