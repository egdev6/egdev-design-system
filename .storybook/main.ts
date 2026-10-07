import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../docs/**/*.mdx', '../packages/*/src/**/*.mdx', '../packages/*/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    }
  },
  viteFinal: async (cfg) =>
    mergeConfig(cfg, {
      plugins: [tailwindcss()],
      resolve: { alias: { '@': fileURLToPath(new URL('../packages/ui/src', import.meta.url)) } }
    })
};
export default config;
