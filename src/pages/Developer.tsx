import { type ChangeEvent, useState } from 'react';

import Button from '@/components/Button/Button';
import CustomDialog from '@/components/Dialog/CustomDialog';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import useDialogHandler from '@/hooks/useDialogHandler';

const Developer = () => {
	const [state, setState] = useState('');

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setState(e.target.value);
	};

	const { open, setOpen, handleOpen, handleClose } = useDialogHandler();

	return (
		<>
			<Input
				label="label"
				value={state}
				onChange={handleInputChange}
				placeholder="이름을 입력해주세요."
				isEssential={true}
				message="입력한 회사 이름이 초대받은 회사 이름과 일치합니다."
			/>
			<Typography variant={FONT_VARIANT.header02} fontColor={PALETTE.gray05}>
				테스트입니당
			</Typography>
			<Button onClick={handleOpen}>Dialog 테스트</Button>

			<CustomDialog
				onOpen={open}
				onOpenChange={setOpen}
				headerText={{
					title: '타이틀',
					description: '설명',
				}}
			>
				<Button onClick={handleClose}>닫기</Button>
			</CustomDialog>
		</>
	);
};

export default Developer;
