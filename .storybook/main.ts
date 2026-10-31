import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

const documentedNativeProps: Record<string, readonly string[]> = {
  ambientBackground: ['id', 'title', 'dir', 'lang', 'aria-describedby', 'className', 'style'],
  indicator: ['id', 'title', 'dir', 'aria-describedby', 'className', 'onClick', 'onKeyDown', 'onFocus', 'onBlur'],
  panel: ['id', 'title', 'dir', 'aria-describedby', 'className'],
  panelHeader: ['id', 'title', 'dir', 'aria-describedby', 'className'],
  panelBody: ['id', 'title', 'dir', 'aria-describedby', 'className'],
  panelFooter: ['id', 'title', 'dir', 'aria-describedby', 'className'],
  collapsible: ['id', 'title', 'dir', 'aria-describedby', 'className'],
  collapsibleTrigger: [
    'id',
    'title',
    'dir',
    'aria-describedby',
    'className',
    'onClick',
    'onKeyDown',
    'onFocus',
    'onBlur',
    'aria-label',
    'aria-labelledby'
  ],
  collapsibleContent: ['title', 'dir', 'aria-describedby', 'className', 'role', 'aria-label', 'aria-labelledby'],
  moduleCard: ['id', 'dir', 'aria-describedby', 'aria-busy', 'onClick', 'className', 'style'],
  timeline: ['id', 'title', 'aria-describedby', 'aria-busy', 'className', 'style', 'onClick'],
  avatar: ['id', 'title', 'aria-describedby', 'className', 'style'],
  navList: ['id', 'title', 'dir', 'lang', 'aria-describedby', 'className', 'onClick'],
  carousel: ['id', 'title', 'dir', 'lang', 'aria-describedby', 'className', 'onKeyDown', 'onFocus', 'onBlur'],
  button: ['type', 'disabled', 'onClick', 'id', 'title', 'aria-describedby', 'className', 'name', 'value', 'tabIndex'],
  buttonGroup: ['id', 'title', 'dir', 'aria-labelledby', 'aria-describedby', 'className'],
  pageHeader: ['id', 'dir', 'lang', 'aria-describedby', 'className', 'style', 'onClick'],
  checkbox: ['id', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid', 'className', 'form'],
  chip: ['id', 'title', 'name', 'onClick', 'aria-describedby', 'className'],
  chipGroup: ['id', 'title', 'onClick', 'aria-describedby', 'className', 'style'],
  countdown: ['id', 'title', 'dir', 'lang', 'aria-describedby', 'className'],
  dropzone: ['id', 'title', 'disabled', 'className', 'aria-describedby', 'onClick'],
  gauge: ['id', 'title', 'aria-describedby', 'className', 'style'],
  field: ['id', 'title', 'aria-describedby', 'className', 'style'],
  fieldMessage: ['id', 'title', 'role', 'aria-live', 'aria-describedby', 'className', 'style'],
  gaugeDock: ['id', 'title', 'dir', 'aria-describedby', 'className', 'style'],
  gaugeDockItem: ['id', 'title', 'aria-describedby', 'className', 'style'],
  gaugeDockSeparator: ['id', 'title', 'className', 'style'],
  hoverCardTrigger: ['href', 'id', 'title', 'target', 'rel', 'onClick', 'aria-label', 'className', 'style'],
  hoverCardContent: ['id', 'title', 'aria-label', 'aria-describedby', 'className', 'style'],
  notice: ['id', 'title', 'role', 'aria-describedby', 'className', 'style'],
  toast: [
    'id',
    'title',
    'aria-describedby',
    'className',
    'forceMount',
    'onEscapeKeyDown',
    'onPause',
    'onResume',
    'onSwipeStart',
    'onSwipeMove',
    'onSwipeCancel',
    'onSwipeEnd'
  ],
  divider: ['id', 'title', 'dir', 'aria-label', 'aria-labelledby', 'className', 'style'],
  aspectRatio: ['id', 'title', 'aria-describedby', 'className', 'style', 'onClick'],
  visuallyHidden: ['id', 'title', 'aria-describedby', 'className', 'style', 'lang'],
  skeleton: ['id', 'title', 'className', 'style'],
  spinner: ['id', 'title', 'className', 'style'],
  stat: ['id', 'title', 'aria-describedby', 'className', 'style'],
  socialLinks: ['id', 'title', 'dir', 'lang', 'aria-describedby', 'className', 'style', 'onClick'],
  tabs: ['id', 'title', 'aria-describedby', 'className', 'style'],
  logo: ['id', 'title', 'className', 'style', 'target', 'rel'],
  statusDot: ['id', 'title', 'className', 'style'],
  kbd: ['id', 'title', 'className'],
  link: ['id', 'title', 'href', 'target', 'rel', 'onClick', 'aria-describedby', 'className', 'style'],
  listItem: ['id', 'title', 'aria-describedby', 'aria-labelledby', 'className', 'style', 'onClick'],
  listItemBody: ['id', 'title', 'aria-describedby', 'className'],
  listItemContent: ['id', 'title', 'aria-describedby', 'className'],
  listItemMedia: ['id', 'title', 'aria-describedby', 'className'],
  listItemFooter: ['id', 'title', 'aria-describedby', 'className'],
  listItemMeta: ['id', 'title', 'aria-describedby', 'className'],
  listItemActions: ['id', 'title', 'aria-describedby', 'className'],
  badge: ['id', 'title', 'aria-describedby', 'className'],
  radioGroup: ['id', 'aria-labelledby', 'aria-describedby', 'className'],
  selectTile: ['id', 'title', 'aria-describedby', 'className', 'style'],

  switch: ['id', 'aria-label', 'aria-labelledby', 'aria-describedby', 'className'],
  progressBar: ['id', 'title', 'aria-describedby', 'className', 'style'],
  meterRow: ['id', 'title', 'dir', 'lang', 'className', 'style'],
  photoFrame: [
    'srcSet',
    'sizes',
    'width',
    'height',
    'loading',
    'decoding',
    'crossOrigin',
    'referrerPolicy',
    'onLoad',
    'onError',
    'id',
    'title',
    'lang',
    'dir',
    'aria-describedby',
    'className',
    'style'
  ],
  pullQuote: ['cite', 'id', 'title', 'lang', 'dir', 'aria-describedby', 'className'],
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
  sectionHeader: ['id', 'dir', 'lang', 'aria-describedby', 'aria-labelledby', 'className', 'style', 'onClick'],
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
  gaugeGroup: ['id', 'title', 'aria-describedby', 'className'],
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
  popoverTrigger: ['disabled', 'id', 'title', 'onClick', 'aria-label', 'aria-describedby', 'className'],
  popoverClose: ['disabled', 'id', 'title', 'onClick', 'aria-label', 'aria-describedby', 'className'],
  popoverContent: ['title', 'aria-describedby', 'className', 'onClick'],
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
