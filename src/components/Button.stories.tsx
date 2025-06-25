import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from './Button';

const meta = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['disabled', 'general', 'active', 'clicked'],
			description: '버튼의 상태를 선택합니다',
		},
		children: {
			control: 'text',
			description: '버튼 안에 들어갈 텍스트',
		},
		onClick: {
			action: 'clicked',
			description: '버튼 클릭 시 실행되는 함수',
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disabled: Story = {
	args: {
		children: '버튼',
		variant: 'disabled',
	},
};

export const General: Story = {
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

export const Clicked: Story = {
	args: {
		children: '버튼',
		variant: 'clicked',
	},
};

export const LongText: Story = {
	args: {
		children: '매우 긴 텍스트가 들어간 버튼',
		variant: 'active',
	},
};

export const ShortText: Story = {
	args: {
		children: '짧음',
		variant: 'general',
	},
};
