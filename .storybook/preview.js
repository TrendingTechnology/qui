import Vue from 'vue';
import { addParameters } from '@storybook/vue';

import QComponents from '../src/qComponents';
import theme from './theme';

import '../src/main.scss';
import '../src/fonts/index.scss';
import '../src/icons/index.scss';
import '../src/qStyles/main.scss';

Vue.use(QComponents);

addParameters({
  layout: 'centered',
  controls: { expanded: true },
  options: {
    theme
  },
  docs: {
    inlineStories: true
  }
});
