import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Radio from './Radio';

const meta: Meta<typeof Radio> = {
	title: 'Components/Radio',
	component: Radio,
};
export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
	render: () => {
		const [selected, setSelected] = useState('none');
		return (
			<div className="flex flex-col gap-4">
				<Radio label="팀원 미선택" checked={selected === 'none'} onChange={() => setSelected('none')} value="none" name="team" />
				<Radio label="팀원 선택" checked={selected === 'select'} onChange={() => setSelected('select')} value="select" name="team" />
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Radio label="비활성화" checked={false} onChange={() => {}} value="disabled" name="team" disabled />
			<Radio label="비활성화 선택됨" checked={true} onChange={() => {}} value="disabled2" name="team2" disabled />
		</div>
	),
};
