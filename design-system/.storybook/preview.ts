import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'black',
      values: [
        { name: 'black',    value: '#000000' },
        { name: 'subtle',   value: '#08080F' },
        { name: 'elevated', value: '#0F0F1A' },
      ],
    },
    layout: 'centered',
    docs: {
      theme: {
        base: 'dark',
        brandTitle: 'Neo Design System',
        brandTarget: '_self',
        colorPrimary: '#7C3AED',
        colorSecondary: '#8B5CF6',
        appBg: '#08080F',
        appContentBg: '#0F0F1A',
        appPreviewBg: '#000000',
        appBorderColor: '#2C2C4A',
        appBorderRadius: 8,
        fontBase: "'Inter', sans-serif",
        fontCode: "'JetBrains Mono', monospace",
        textColor: '#F0F0F8',
        textInverseColor: '#000000',
        textMutedColor: '#9898B3',
        barTextColor: '#9898B3',
        barHoverColor: '#F0F0F8',
        barSelectedColor: '#A78BFA',
        barBg: '#08080F',
        inputBg: '#0F0F1A',
        inputBorder: '#2C2C4A',
        inputTextColor: '#F0F0F8',
        inputBorderRadius: 6,
      },
    },
  },
};

export default preview;
