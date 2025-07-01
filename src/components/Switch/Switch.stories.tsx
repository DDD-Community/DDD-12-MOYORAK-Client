import type { Meta, StoryObj } from '@storybook/react-vite';

import Switch from './Switch';

const meta = {
	title: 'Switch',
	component: Switch,
	args: {},
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		size: 'M',
	},
};
