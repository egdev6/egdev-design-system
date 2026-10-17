import type { Preview } from '@storybook/react-vite';
import { jsdocControlsEnhancer } from './jsdoc-controls';
import { createBrandTheme } from './theme';
import './preview.css';
import './documentation.css';

const preview: Preview = {
  argTypesEnhancers: [jsdocControlsEnhancer],
  parameters: {
    backgrounds: { disable: true },
    layout: 'padded',
    // Portable stories also import this file in Node, where computed CSS is unavailable.
    docs: { theme: typeof document === 'undefined' ? undefined : createBrandTheme() },
    options: {
      storySort: {
        order: [
          'Welcome',
          'Foundations',
          ['Color', 'Typography', 'Layout', 'Material', 'Motion'],
          'Arquitectura',
          'Primitives',
          'Atoms',
          'Molecules',
          'Organisms',
          'Templates',
          'Contributing'
        ]
      }
    }
  }
};
export default preview;
