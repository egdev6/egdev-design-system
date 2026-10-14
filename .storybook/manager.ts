import { addons } from 'storybook/manager-api';
import { createBrandTheme } from './theme';
import './manager.css';

addons.setConfig({ theme: createBrandTheme() });
