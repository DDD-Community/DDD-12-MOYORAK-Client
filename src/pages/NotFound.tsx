import { useNavigate } from 'react-router-dom';

import notFound from '@/assets/404.png';
import Button from '@/components/Button/Button';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center h-screen px-7.5">
			<img src={notFound} alt="404" className="w-full mt-12.25" />
			<Typography variant={FONT_VARIANT.header01} fontColor={PALETTE.gray10} className="mt-12 mb-2 font-semibold">
				요청하신 페이지를 찾을 수 없어요.
			</Typography>
			<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="mb-7.5">
				페이지가 삭제되었거나 주소가 변경되었을 수 있어요.
			</Typography>
			<div className="w-[235px]">
				<Button variant="active" onClick={() => navigate('/')}>
					홈으로 이동하기
				</Button>
			</div>
		</div>
	);
};

export default NotFound;
