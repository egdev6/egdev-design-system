import type { Preview } from '@storybook/react';
import './preview.css';

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    layout: 'padded',
    options: {
      storySort: { order: ['Arquitectura', 'Primitives', 'Atoms', 'Molecules', 'Organisms', 'Templates'] }
    }
  }
};
export default preview;
