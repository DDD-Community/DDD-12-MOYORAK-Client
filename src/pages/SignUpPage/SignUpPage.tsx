import { useNavigate, useSearchParams } from 'react-router-dom';

import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT } from '@/constants/styles';

import BasicProfile from './components/BasicProfile';

const TOTAL_STEPS = 4;

const SignUpPage = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const stepParam = Number(searchParams.get('step')) || 1;
	const currentStep = Math.max(1, Math.min(stepParam, TOTAL_STEPS));

	const handleGoBack = () => {
		const prevStep = currentStep - 1;
		if (prevStep < 1) {
			navigate(-1);
		} else {
			setSearchParams({ step: String(prevStep) });
		}
	};

	return (
		<div>
			<NavBar variant="iconOnly" onLeftIconClick={handleGoBack} />

			<Typography variant={FONT_VARIANT.body01}>
				<span className="text-gray-10">{currentStep}</span>
				<span className="text-gray-07">/{TOTAL_STEPS}</span>
			</Typography>

			{currentStep === 1 && <BasicProfile />}
			{/* TODO: step 2~4에 따라 컴포넌트 추가 */}
		</div>
	);
};

export default SignUpPage;
