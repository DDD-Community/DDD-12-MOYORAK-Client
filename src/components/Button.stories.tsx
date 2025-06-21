import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from './Button';

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: '버튼',
		variant: 'general',
	},
};

export const Active: Story = {
	args: {
		children: '버튼',
		variant: 'active',
	},
};

export const Disabled: Story = {
	args: {
		children: '버튼',
		variant: 'disabled',
		disabled: true,
	},
};
