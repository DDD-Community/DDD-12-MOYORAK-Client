import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import onBoardingIcon from '@/assets/onBoarding.png';
import CustomDialog from '@/components/Dialog/CustomDialog';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import KakaoMap from '@/components/KakaoMap';
import Typography from '@/components/Typography';
import { FONT_VARIANT } from '@/constants/styles';
import useDialogHandler from '@/hooks/useDialogHandler';

const MOCK_MARKER_OPTIONS = [
	{
		center: { lat: 37.5665, lng: 126.978 },
		level: 3,
		placeName: '서울특별시청',
	},
	{
		center: { lat: 37.57, lng: 126.9768 },
		placeName: '덕수궁',
	},
	{
		center: { lat: 37.5658, lng: 126.9753 },
		placeName: '서울광장',
	},
];

const MainPage = () => {
	const navigate = useNavigate();
	const { open, handleOpen } = useDialogHandler();

	useEffect(() => {
		handleOpen();
	}, []);

	return (
		<>
			<KakaoMap optionsList={MOCK_MARKER_OPTIONS} />
			<div className="relative">
				<CustomDialog
					onOpen={open}
					onOpenChange={handleOpen}
					headerText={{
						title: '팀원들과 함께 맛집 리스트를 만들고,\n 편하게 관리해 보세요!',
						description: '모여락은 로그인해야 이용하실 수 있습니다.',
					}}
					className="bg-white top-1/3 -translate-y-0 px-[25px] py-[30px] z-30"
					alignHeaderCenter={false}
					headerAdornment={<img src={onBoardingIcon} className="absolute -top-[60px] right-0 w-[105px] h-[108px] z-0" alt="온보딩 아이콘" />}
					overlay={false}
				>
					<FilterButton
						variant="active"
						onClick={() => {
							navigate('/auth');
						}}
						className="rounded-[17px] w-[135px] px-3.5 h-[26px] flex items-center mt-5"
					>
						<Typography variant={FONT_VARIANT.label01}>로그인하러 가기</Typography>
						<Icon name="arrowRight" width={18} />
					</FilterButton>
				</CustomDialog>
			</div>
		</>
	);
};
export default MainPage;
