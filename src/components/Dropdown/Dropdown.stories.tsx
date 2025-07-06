import type { Meta, StoryObj } from '@storybook/react-vite';

import { useSelectBoxHandler } from '@/hooks/useSelectBoxHandler';

import Dropdown from './Dropdown';

const SELECT_LIST = ['한식', '양식', '중식', '일식', '아시안', '분식', '패스트푸드', '치킨&피자', '기타'] as const;
type TSelectOption = (typeof SELECT_LIST)[number];

const meta: Meta<typeof Dropdown> = {
	title: 'Components/Dropdown',
	component: Dropdown,
	argTypes: {
		optionList: { control: 'object' },
		selected: { control: 'radio', options: SELECT_LIST },
		isOpen: { control: 'boolean' },
	},
	args: {
		optionList: [...SELECT_LIST],
		selected: '양식',
		isOpen: false,
	},
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
	render: (args) => {
		const { isOpen, selected, onChangeOpen, onSelect } = useSelectBoxHandler<TSelectOption>(args.selected);

		return <Dropdown {...args} isOpen={isOpen} selected={selected} onChangeOpen={onChangeOpen} onChange={onSelect} />;
	},
};
