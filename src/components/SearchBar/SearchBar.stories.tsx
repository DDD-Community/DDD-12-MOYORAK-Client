import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import SearchBar, { type ISearchBarProps } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
	title: 'Components/SearchBar',
	component: SearchBar,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: { type: 'radio' },
			options: ['primary', 'secondary'],
		},
		searchIconName: {
			control: 'select',
			options: ['search', 'close'],
		},
		placeholder: {
			control: 'text',
		},
		onChange: { action: 'changed', table: { disable: true } },
	},
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Primary: Story = {
	render: (args: ISearchBarProps) => {
		const [value, setValue] = useState('');

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setValue(e.target.value);
			if (args.onChange) args.onChange(e);
		};

		return <SearchBar {...args} value={value} onChange={handleChange} />;
	},
	args: {
		type: 'primary',
		placeholder: '입력해주세요.',
	},
};

export const Secondary: Story = {
	render: (args: ISearchBarProps) => {
		const [value, setValue] = useState('');

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setValue(e.target.value);
			if (args.onChange) args.onChange(e);
		};

		return <SearchBar {...args} value={value} onChange={handleChange} />;
	},
	args: {
		type: 'secondary',
		placeholder: '입력해주세요.',
	},
};
