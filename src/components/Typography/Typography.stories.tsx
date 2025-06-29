import type { Meta, StoryObj } from '@storybook/react-vite';

import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import Typography from './Typography';

const meta = {
	title: 'Typography',
	component: Typography,
	argTypes: {
		variant: {
			control: { type: 'select' },
			options: Object.keys(FONT_VARIANT),
			mapping: FONT_VARIANT,
			description: '타이포그래피 크기 설정',
		},
		fontColor: {
			control: { type: 'select' },
			options: Object.keys(PALETTE),
			mapping: PALETTE,
			description: '타이포그래피 색상 설정',
		},
	},
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Title: Story = {
	args: {
		variant: FONT_VARIANT.body01,
		children: 'Typography',
		fontColor: PALETTE.danger01,
	},
};
