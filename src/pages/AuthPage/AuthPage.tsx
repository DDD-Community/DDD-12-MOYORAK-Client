import { useNavigate } from 'react-router-dom';

import auth from '@/assets/auth.png';
import Icon from '@/components/Icon';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const AuthPage = () => {
	const navigate = useNavigate();

	const googleLogin = () => {
		const REDIRECT_URI = import.meta.env.VITE_GOOGLE_AUTH_REDIRECT_URI as string;

		if (!REDIRECT_URI) {
			throw new Error('Google OAuth 설정이 누락되었습니다.');
			return;
		}
		navigate(`${REDIRECT_URI}`);
	};

	return (
		<main>
			<header>
				<NavBar variant="iconOnly" onLeftIconClick={() => navigate(-1)} />
			</header>

			<section className="px-5 mb-[89px]">
				<Typography as="h1" variant={FONT_VARIANT.title02} className="mt-[65px] mb-[13px] font-bold">
					모여락에
					<br />
					오신 걸 환영합니다!
				</Typography>
				<Typography as="h2" variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					모여락은 팀원들과 함께
					<br />
					맛집 공유 리스트를 만들고 관리하는 서비스로
					<br />
					로그인 후 다양한 서비스를 이용할 수 있습니다.
				</Typography>
			</section>

			<img src={auth} className="mx-auto mb-[104px] w-70" />
			<button onClick={googleLogin} className="border-[1px] border-gray-05 flex items-center gap-[11.9px] py-[13px] px-[72px] rounded-[50px] mb-[15px] mx-auto">
				<Icon name="googleLogin" />
				<Typography variant={FONT_VARIANT.body01}>Google로 간편하게 시작</Typography>
			</button>

			<div className="flex items-center justify-center gap-[5px]">
				<Icon name="notice" width={18} height={18} />
				<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08} className="text-center">
					모여락은 현재 구글 간편 로그인으로만 이용할 수 있습니다.
				</Typography>
			</div>
		</main>
	);
};

export default AuthPage;
