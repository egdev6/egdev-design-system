import type { Preview } from '@storybook/react-vite';
import { jsdocControlsEnhancer } from './jsdoc-controls';
import './preview.css';

const preview: Preview = {
  argTypesEnhancers: [jsdocControlsEnhancer],
  parameters: {
    backgrounds: { disable: true },
    layout: 'padded',
    options: {
      storySort: { order: ['Arquitectura', 'Primitives', 'Atoms', 'Molecules', 'Organisms', 'Templates'] }
    }
  }
};
export default preview;
