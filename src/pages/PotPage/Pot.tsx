import { useNavigate } from 'react-router-dom';

import arrow from '@/assets/arrow.png';
import potIcon from '@/assets/potIcon.png';
import potIconFinger from '@/assets/potIconFinger.png';
import Button from '@/components/Button/Button';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { POT_PARTICIPANTS, POT_PARTICIPANTS_IMAGE, POT_TITLE } from '@/constants/data.constant';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const POT_PARTICIPANTS_COUNT = 3;
const IS_VOTING = true;

const POT_TIME = '20분';

const Pot = () => {
	const navigate = useNavigate();

	return (
		<div className="px-4.5 bg-gray-02">
			<div className="flex justify-center mt-29">
				<img src={potIcon} alt="팟아이콘 이미지" className="w-[177px] absolute top-10" />
				<img src={potIconFinger} alt="팟아이콘 손가락 이미지" className="w-[177px] absolute top-20.5 z-10" />
			</div>

			<div
				className="relative
			text-center
			pt-[40px] px-[20px] pb-[20px] rounded-[30px]
			mb-[26px]
			bg-[linear-gradient(148deg,_#1F2511_19.11%,_#748B40_226.78%)] [box-shadow:0px_0px_10px_0px_rgba(102,_102,_102,_0.20)] h-[183px]"
			>
				<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.white} className="font-semibold mb-6">
					오늘 점심시간을 함께 할<br /> 팀원을 모아보세요!
				</Typography>
				{/*
				TODO : 버튼 배경색 안 먹는 이슈 있음 해결 필요
				*/}
				<Button variant="active" className="rounded-[40px] flex justify-between items-center px-[12px] py-[8px]" onClick={() => navigate('/pot-make')}>
					<Icon size={31} name="potPlusButton" />
					모여락으로 팀원 모으기
					<img src={arrow} alt="arrow" />
				</Button>
			</div>

			<div className={`p-[22px] rounded-[30px] bg-[#FFF] relative border ${IS_VOTING ? 'border-[#BEEE0540]' : 'border-gray-04'}`}>
				{IS_VOTING && (
					<div className="absolute top-[-10px] right-[20px]">
						<FilterButton variant="active" borderRadius="10">
							참여했어요!
						</FilterButton>
					</div>
				)}
				<div className="flex items-center mb-2">
					<FilterButton variant="clicked" borderRadius="10">
						투표 전
					</FilterButton>
					<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray09} className="font-semibold ml-2">
						{POT_TIME}
					</Typography>
					<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-medium ml-1">
						뒤 투표가 시작돼요
					</Typography>
				</div>
				<Typography variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="font-semibold mb-6">
					{POT_TITLE}
				</Typography>
				<div className="flex flex-col gap-2">
					{POT_PARTICIPANTS.map((_, idx) => (
						<div key={idx} className="flex items-center justify-between rounded-[15px] border border-gray-03 bg-gray-01 px-4 py-2.5">
							<div className="flex items-center gap-1">
								<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray10} className="font-semibold">
									{_.name}
								</Typography>
								<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.gray07} className="font-medium">
									{_.category}
								</Typography>
							</div>
							<div className="flex items-center">
								<Icon name="star" width={11} className="mr-0.5 mt-0.5" />
								<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.gray08} className="font-medium">
									{_.rating}
								</Typography>
								<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.gray08} className="font-medium">
									· 리뷰 {_.reviewCount}
								</Typography>
							</div>
						</div>
					))}
				</div>
				<div className="flex items-center gap-2 mt-7">
					<div className="flex">
						<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray09} className="font-semibold">
							{POT_PARTICIPANTS_COUNT}
						</Typography>
						<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray08} className="font-semibold">
							명이 참가중이에요!
						</Typography>
					</div>
					<div className="flex -space-x-2">
						{POT_PARTICIPANTS_IMAGE.map((_, idx) => (
							<div key={idx} className="w-9 h-9 rounded-full border-[1px] border-solid border-gray-04 bg-gray-02">
								<img src={_.image} alt="팟 참가자 이미지" className="w-full h-full rounded-full" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
export default Pot;
