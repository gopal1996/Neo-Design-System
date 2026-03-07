import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  enableWebsockets: true,
  host: 'localhost',
  port: 7007,
});

export default StorybookUIRoot;
