import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';

import { CustomToast, Toaster } from './BaseToaster';

const meta: Meta = {
	title: 'CustomToast',
	component: Toaster,
	argTypes: {
		showToast: {
			control: 'boolean',
			defaultValue: false,
		},
		title: {
			control: 'text',
			defaultValue: 'Test Toast',
		},
		icon: {
			control: { type: 'select' },
			options: ['check', 'copy'],
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: ({ showToast, title, icon }) => {
		useEffect(() => {
			if (!showToast || !title || !icon) {
				return;
			}

			toast(<CustomToast title={title} icon={icon} />);
		}, [showToast, title, icon]);

		return (
			<>
				<h1>Controls로 Toast를 설정해주세요.</h1>
				<Toaster />
			</>
		);
	},
};
