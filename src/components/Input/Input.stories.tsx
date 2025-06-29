import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import Input from './Input';

const meta = {
	title: 'Input',
	component: Input,
	args: {
		label: 'Label',
		isEssential: false,
		value: '',
		onChange: action('onChange'),
	},
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: '',
	},
};
