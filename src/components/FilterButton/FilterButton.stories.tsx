import type { Meta, StoryObj } from '@storybook/react-vite';

import FilterButton from './FilterButton';

const meta = {
	title: 'Components/FilterButton',
	component: FilterButton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['general', 'active', 'clicked'],
			description: '필터 버튼의 상태를 선택합니다',
		},
		children: {
			control: 'text',
			description: '버튼 안에 들어갈 텍스트',
		},
		borderRadius: {
			control: { type: 'range', min: 0, max: 50, step: 0.5 },
			description: '버튼의 모서리 둥글기 (px)',
		},
	},
} satisfies Meta<typeof FilterButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const General: Story = {
	args: {
		children: '전체',
		variant: 'general',
		borderRadius: '8.5',
	},
};

export const Active: Story = {
	args: {
		children: '선택됨',
		variant: 'active',
		borderRadius: '8.5',
	},
};

export const Clicked: Story = {
	args: {
		children: '클릭됨',
		variant: 'clicked',
		borderRadius: '8.5',
	},
};

// 다양한 borderRadius 예시
export const RoundedSmall: Story = {
	args: {
		children: '작은 둥글기',
		variant: 'active',
		borderRadius: '8.5',
	},
};

export const RoundedMedium: Story = {
	args: {
		children: '중간 둥글기',
		variant: 'active',
		borderRadius: '17',
	},
};

// 텍스트 길이별 예시
export const ShortText: Story = {
	args: {
		children: '짧음',
		variant: 'general',
		borderRadius: '8.5',
	},
};

export const MediumText: Story = {
	args: {
		children: '중간 길이 텍스트',
		variant: 'active',
		borderRadius: '8.5',
	},
};

export const LongText: Story = {
	args: {
		children: '매우 긴 텍스트가 들어간 필터',
		variant: 'clicked',
		borderRadius: '8.5',
	},
};

// 실제 사용 예시 (카테고리 필터)
export const CategoryAll: Story = {
	args: {
		children: '전체',
		variant: 'active',
		borderRadius: '17',
	},
};

export const CategoryFood: Story = {
	args: {
		children: '음식',
		variant: 'general',
		borderRadius: '17',
	},
};

export const CategoryShopping: Story = {
	args: {
		children: '쇼핑',
		variant: 'clicked',
		borderRadius: '17',
	},
};

export const CategoryTravel: Story = {
	args: {
		children: '여행',
		variant: 'general',
		borderRadius: '17',
	},
};
