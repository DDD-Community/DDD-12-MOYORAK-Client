import potIcon from '@/assets/potIcon.png';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const Pot = () => {
	return (
		<div className="px-4.5">
			<div className="flex justify-center mt-4">
				<img src={potIcon} alt="팟아이콘 이미지" className="w-[100px]" />
			</div>
			<div
				className="
			text-center
			pt-[40px] px-[20px] pb-[20px] rounded-[30px] bg-[linear-gradient(148deg,_#1F2511_19.11%,_#748B40_226.78%)] [box-shadow:0px_0px_10px_0px_rgba(102,_102,_102,_0.20)] h-[183px]"
			>
				<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.white} className="font-semibold">
					오늘 점심시간을 함께 할<br /> 팀원을 모아보세요!
				</Typography>
			</div>
		</div>
	);
};
export default Pot;
