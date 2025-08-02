import { useNavigate } from 'react-router-dom';

import completeSignup from '@/assets/completeSignup.png';
import onBoardingIcon from '@/assets/onBoarding.png';
import Button from '@/components/Button/Button';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const SignUpSuccess = () => {
	const navigate = useNavigate();

	return (
		<div className="pt-[99px] relative min-h-screen">
			<Typography as="h1" variant={FONT_VARIANT.title03} fontColor={PALETTE.gray10} className="mb-[5px] text-center">
				회원가입이 완료되었어요
			</Typography>

			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08} className="text-center mb-[103px]">
				팀원들과 함께 맛집을 탐험하고 기록해봐요!
			</Typography>

			<img src={completeSignup} alt="모여락 시작하기" className="mx-auto relative z-30" />
			<img src={onBoardingIcon} alt="온보딩 아이콘" className="shadow-gray-custom absolute top-[202px] right-10 w-[105px] h-[108px] z-10" />

			<div className="absolute bottom-0 left-0 w-full px-[18px] pb-[30px] z-30">
				<div className="absolute bottom-0 left-0 w-full h-[130px] bg-gradient-to-t from-white to-transparent z-0 pointer-events-none" />
				<div className="relative z-30">
					<Button
						variant="active"
						onClick={() =>
							navigate('/', {
								state: {
									login: true,
								},
							})
						}
					>
						<Typography variant={FONT_VARIANT.header04} fontColor={PALETTE.gray10}>
							모여락 시작하기
						</Typography>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SignUpSuccess;
