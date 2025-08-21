import { useMutationAuthSignIn } from '@/apis/useMutationAuthSignIn';
import { useMutationAuthSignUp } from '@/apis/useMutationAuthSignUp';
import Button from '@/components/Button/Button';
import DatePicker from '@/components/DatePicker/DatePicker';
import FormLabel from '@/components/Input/FormLabel';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useSignupStore } from '@/store/signupStore';
import { useLocation } from 'react-router-dom';

const BasicProfile = () => {
	const { state } = useLocation();
	const { username, birth, gender, setUsername, setBirth, setGender, nextStep } = useSignupStore();

	const { mutate } = useMutationAuthSignUp();
	const { mutate: signIn } = useMutationAuthSignIn();

	const onSignup = () => {
		if (!gender) return;

		mutate(
			{
				email: state.email,
				name: username,
				gender: gender,
				birthday: birth.replace(/\//g, '-'),
				profileImage: state.profileImage,
			},
			{
				onSuccess: (data) => {
					localStorage.setItem('userId', String(data.userId));
					// 로그인 호출
					signIn(data.userId);

					// 로그인 후 다음 단계
					nextStep();
				},
				onError: (error) => {
					nextStep();
					console.error('Signup failed:', error);
				},
			}
		);
	};

	return (
		<section className="relative px-5 min-h-screen pb-[100px]">
			<Typography as="h1" variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="mb-[5px]">
				기본 프로필
			</Typography>

			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="mb-[60px]">
				팀원들과 원활하게 모여락을 사용하기 위해 <br /> 기본 정보를 먼저 알려주세요.
			</Typography>

			<div className="flex flex-col gap-[50px]">
				<Input label="이름" isEssential placeholder="이름을 입력해주세요." value={username} onChange={(e) => setUsername(e.target.value)} />
				<Input
					label="생년월일"
					isEssential
					placeholder="생년월일을 입력해주세요."
					value={birth}
					onChange={(e) => setBirth(e.target.value)}
					className="disabled"
					rightButton={<DatePicker date={birth} onChangeDate={setBirth} />}
				/>
				<div>
					<FormLabel label="성별" isEssential className="mb-[10px]" />
					<div className="flex gap-[11px]">
						<Button variant={gender === 'MALE' ? 'clicked' : undefined} onClick={() => setGender('MALE')}>
							남성
						</Button>
						<Button variant={gender === 'FEMALE' ? 'clicked' : undefined} onClick={() => setGender('FEMALE')}>
							여성
						</Button>
					</div>
				</div>
			</div>

			<div className="fixed bottom-[30px] left-0 w-full px-5">
				<Button variant={!username || !birth || !gender ? 'disabled' : 'active'} onClick={onSignup}>
					<Typography variant={FONT_VARIANT.header04} fontColor={!username || !birth || !gender ? PALETTE.gray06 : PALETTE.primary600}>
						다음
					</Typography>
				</Button>
			</div>
		</section>
	);
};

export default BasicProfile;
