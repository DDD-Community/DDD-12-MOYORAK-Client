import preventingScreenDeparture from '@/assets/preventingScreenDeparture.png';
import Button from '@/components/Button/Button';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import Typography from '../Typography';

const PreventingScreenDeparture = () => {
	return (
		<div className="w-full rounded-t-[30px] bg-white shadow-[0px_-1px_7px_0px_rgba(0,0,0,0.25)] px-6.5 py-9 flex flex-col items-center">
			<img src={preventingScreenDeparture} alt="preventingScreenDeparture" className="mb-5 w-[80px] h-[76px]" />
			<Typography variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="font-semibold">
				나중에 작성하시겠어요?
			</Typography>
			<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="mt-1.25 mb-5.75">
				지금까지 작성한 내용은 저장되지 않아요.
			</Typography>
			<div className="w-full flex gap-2">
				<Button variant="general" className="w-full">
					나중에 작성하기
				</Button>
				<Button variant="active" className="w-full">
					지금 작성하기
				</Button>
			</div>
		</div>
	);
};

export default PreventingScreenDeparture;
