import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from '../Button/Button';

import CustomDialog from './CustomDialog';

const meta = {
	title: 'Components/CustomDialog',
	component: CustomDialog,
	args: {
		onOpen: true,
		headerText: {
			title: '',
			description: '',
		},
		showCloseButton: false,
	},
	argTypes: {
		onOpen: { control: false },
		onOpenChange: { action: 'onOpenChange' },
		children: { control: false },
	},
} satisfies Meta<typeof CustomDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onOpenChange: () => {},
		headerText: {
			title: '헤더를 입력해주세요',
			description: '이곳에 들어갈 설명을 입력해주세요',
		},
		children: (
			<Button variant="active" className="rounded-[20px]">
				확인
			</Button>
		),
	},
};

export const DualActionDialog: Story = {
	args: {
		onOpenChange: () => {},
		onOpen: true,
		headerText: {
			title: '헤더를 입력해주세요',
			description: '이곳에 들어갈 설명을 입력해주세요',
		},
		children: (
			<div className="flex gap-2 w-full">
				<Button variant="general">버튼</Button>
				<Button variant="active">버튼</Button>
			</div>
		),
	},
};

export const CloseBtnDialog: Story = {
	args: {
		onOpenChange: () => {},
		onOpen: true,
		headerText: {
			title: '헤더를 입력해주세요',
			description: '이곳에 들어갈 설명을 입력해주세요',
		},
		showCloseButton: true,
	},
};

export const LoginActionDialog: Story = {
	args: {
		onOpenChange: () => {},
		onOpen: true,
		headerText: {
			title: '헤더를 입력해주세요',
			description: '이곳에 들어갈 설명을 입력해주세요',
		},
		children: <Button variant="active">로그인하러 가기</Button>,
	},
};
