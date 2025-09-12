import { useNavigate } from 'react-router-dom';

import potSuccess from '@/assets/potSuccess.png';
import Button from '@/components/Button/Button';
import Typography from '@/components/Typography/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const PotMakeSuccess = () => {
	const navigate = useNavigate();

	return (
		<div className="bg-gray-02 min-h-screen flex flex-col items-center justify-center">
			<div className="flex flex-col items-center justify-center">
				<Typography variant={FONT_VARIANT.title03} fontColor={PALETTE.gray10} className="font-bold">
					팟 생성이 완료되었어요
				</Typography>
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08} className="mt-[5px] mb-30">
					팀원들과 함께 오늘의 점심 식당을 정해보세요!
				</Typography>
				<img src={potSuccess} alt="potSuccess" className="w-[270px] h-[160px]" />
			</div>
			<div className="w-full px-4.5 fixed bottom-[30px] max-w-[480px]">
				<Button variant="active" onClick={() => navigate('/pot')}>
					확인
				</Button>
			</div>
		</div>
	);
};

export default PotMakeSuccess;
