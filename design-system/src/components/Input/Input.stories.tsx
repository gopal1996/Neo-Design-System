import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="9" r="6" />
    <path d="M13.5 13.5L17 17" strokeLinecap="round" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="5" width="16" height="12" rx="2" />
    <path d="M2 8l8 5 8-5" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="9" width="12" height="9" rx="2" />
    <path d="M7 9V7a3 3 0 016 0v2" />
  </svg>
);

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: { placeholder: 'Placeholder text', size: 'md' },
  decorators: [Story => <div style={{ width: 320 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'Email address', placeholder: 'you@company.com' },
};

export const WithHint: Story = {
  args: { label: 'Username', hint: 'Must be 3–20 characters', placeholder: 'johndoe' },
};

export const WithError: Story = {
  args: { label: 'Password', error: 'Must be at least 8 characters', type: 'password', placeholder: '••••••••' },
};

export const WithIcons: Story = {
  args: { label: 'Search', iconLeft: <SearchIcon />, placeholder: 'Search anything…' },
};

export const WithAddon: Story = {
  args: {
    label: 'Website',
    addonLeft: 'https://',
    addonRight: '.com',
    placeholder: 'yoursite',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Input size="sm" placeholder="Small input" iconLeft={<MailIcon />} />
      <Input size="md" placeholder="Medium input" iconLeft={<MailIcon />} />
      <Input size="lg" placeholder="Large input" iconLeft={<MailIcon />} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Email', value: 'locked@neo.io', disabled: true },
};

export const PasswordField: Story = {
  args: { label: 'Password', type: 'password', iconLeft: <LockIcon />, placeholder: '••••••••' },
};
