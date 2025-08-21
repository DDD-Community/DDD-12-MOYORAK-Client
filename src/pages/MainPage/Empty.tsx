import Typography from '@/components/Typography';
import emptyMain from '@/assets/emptyMain.png';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const Empty = () => {
	console.log('tes');
	return (
		<div className="h-full flex flex-col justify-center align-middle">
			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="whitespace-pre-line text-center mb-[13px]">
				등록된 식당이 없어요
				{'\n'}
				우리팀 맛집을 등록해주세요!
			</Typography>
			<img src={emptyMain} className="mx-auto" />
		</div>
	);
};

export default Empty;
