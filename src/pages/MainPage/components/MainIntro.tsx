import { useNavigate } from 'react-router-dom';

import onBoardingIcon from '@/assets/onBoarding.png';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const MainIntro = () => {
	const navigate = useNavigate();

	return (
		<div className="w-[339px] fixed top-1/3 left-1/2 -translate-x-1/2 z-30">
			<img src={onBoardingIcon} className="shadow-gray-custom absolute -top-[60px] right-0 w-[105px] h-[108px] z-0" alt="온보딩 아이콘" />

			<div className="relative z-10 bg-white rounded-[20px] px-[25px] py-[30px] max-w-md shadow-lg">
				<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="whitespace-pre-line mb-2">
					팀원들과 함께 맛집 리스트를 만들고,{'\n'}
					편하게 관리해 보세요!
				</Typography>

				<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
					모여락은 로그인해야 이용하실 수 있습니다.
				</Typography>

				<FilterButton
					variant="active"
					onClick={() => navigate('/auth')}
					className="rounded-[17px] w-[135px] px-3.5 py-1.5 h-[26px] flex items-center justify-center mt-5"
				>
					<Typography variant={FONT_VARIANT.label01}>로그인하러 가기</Typography>
					<Icon name="arrowRight" width={18} />
				</FilterButton>
			</div>
		</div>
	);
};

export default MainIntro;
