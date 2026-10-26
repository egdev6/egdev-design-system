import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

const documentedNativeProps: Record<string, readonly string[]> = {
  avatar: ['id', 'title', 'aria-describedby', 'className', 'style'],
  button: ['type', 'disabled', 'onClick', 'id', 'title', 'aria-describedby', 'className', 'name', 'value', 'tabIndex'],
  checkbox: ['id', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid', 'className', 'form'],
  dropzone: ['id', 'title', 'disabled', 'className', 'aria-describedby', 'onClick'],
  gauge: ['id', 'title', 'aria-describedby', 'className', 'style'],
  divider: ['id', 'title', 'dir', 'aria-label', 'aria-labelledby', 'className', 'style'],
  aspectRatio: ['id', 'title', 'aria-describedby', 'className', 'style', 'onClick'],
  visuallyHidden: ['id', 'title', 'aria-describedby', 'className', 'style', 'lang'],
  skeleton: ['id', 'title', 'className', 'style'],
  spinner: ['id', 'title', 'className', 'style'],
  logo: ['id', 'title', 'className', 'style', 'target', 'rel'],
  statusDot: ['id', 'title', 'className', 'style'],
  kbd: ['id', 'title', 'className'],
  link: ['id', 'title', 'href', 'target', 'rel', 'onClick', 'aria-describedby', 'className', 'style'],
  badge: ['id', 'title', 'aria-describedby', 'className'],
  radioGroup: ['id', 'aria-labelledby', 'aria-describedby', 'className'],
  switch: ['id', 'aria-label', 'aria-labelledby', 'aria-describedby', 'className'],
  progressBar: ['id', 'title', 'aria-describedby', 'className', 'style'],
  textarea: [
    'id',
    'name',
    'rows',
    'placeholder',
    'disabled',
    'readOnly',
    'required',
    'maxLength',
    'aria-invalid',
    'aria-describedby',
    'className'
  ],
  input: ['id', 'name', 'placeholder', 'disabled', 'readOnly', 'required', 'className'],
  productMark: ['id', 'title', 'className', 'target', 'rel'],
  searchTrigger: [
    'id',
    'title',
    'disabled',
    'onClick',
    'aria-describedby',
    'aria-keyshortcuts',
    'aria-haspopup',
    'aria-expanded',
    'aria-controls',
    'className'
  ],
  select: [
    'id',
    'title',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-invalid',
    'className',
    'onFocus',
    'onBlur',
    'form'
  ],
  slider: ['id', 'title', 'aria-describedby', 'className'],
  toggle: ['disabled', 'type', 'id', 'title', 'className', 'style', 'onClick', 'aria-describedby'],
  // Native props re-exposed in autodocs per component, keyed by camelCase component name.
  // Gauge retains its approved passive measurement list; Label documents the native
  // association (htmlFor/id) and the approved class-merge surface. Nothing else from
  // node_modules declarations is admitted.
  label: ['htmlFor', 'id', 'className'],
  stack: ['id', 'title', 'aria-describedby', 'className', 'style'],
  cluster: ['id', 'title', 'aria-describedby', 'className', 'style'],
  text: ['id', 'title', 'aria-describedby', 'className', 'style'],
  heading: ['id', 'title', 'aria-describedby', 'className', 'style'],
  icon: ['id', 'aria-describedby', 'className', 'style'],
  iconButton: [
    'id',
    'title',
    'aria-describedby',
    'className',
    'type',
    'disabled',
    'onClick',
    'onKeyDown',
    'name',
    'value',
    'tabIndex'
  ],
  surface: ['id', 'title', 'role', 'aria-label', 'aria-labelledby', 'className', 'style']
};
const camelCase = (name: string) => name.charAt(0).toLowerCase() + name.slice(1);

const config: StorybookConfig = {
  staticDirs: [
    { from: '../packages/tokens/dist', to: '/tokens' },
    { from: './public', to: '/brand' }
  ],
  stories: ['../docs/**/*.mdx', '../packages/*/src/**/*.mdx', '../packages/*/src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-mcp',
      options: {
        endpoint: '/mcp',
        toolsets: { dev: false, docs: true, test: false }
      }
    }
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  features: { componentsManifest: true },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // Match the installed Vite plugin defaults in direct parser regressions too.
      shouldIncludePropTagMap: true,
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop, component) =>
        documentedNativeProps[camelCase(component.name)]?.includes(prop.name) ||
        (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    }
  },
  viteFinal: async (cfg) =>
    mergeConfig(cfg, {
      plugins: [tailwindcss()],
      resolve: { alias: { '@': fileURLToPath(new URL('../packages/ui/src', import.meta.url)) } }
    })
};
export default config;
