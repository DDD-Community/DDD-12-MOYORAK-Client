import type { Meta, StoryObj } from '@storybook/react-vite';

import CustomDialog from './CustomDialog';

const meta = {
	title: 'CustomDialog',
	component: CustomDialog,
	args: {
		headerText: {
			title: '',
		},
	},
} satisfies Meta<typeof CustomDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		headerText: {
			title: 'Dialog 입니당',
		},
	},
};
