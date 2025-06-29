import { type ChangeEvent, useCallback, useState } from 'react';

import Input from '@/components/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const Developer = () => {
	const [state, setState] = useState('');

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setState(e.target.value);
		},
		[setState]
	);

	return (
		<>
			<Input
				label="label"
				value={state}
				onChange={handleChange}
				placeholder="이름을 입력해주세요."
				isEssential={true}
				message="입력한 회사 이름이 초대받은 회사 이름과 일치합니다."
			/>
			<Typography variant={FONT_VARIANT.header02} fontColor={PALETTE.gray05}>
				테스트입니당
			</Typography>
		</>
	);
};

export default Developer;
