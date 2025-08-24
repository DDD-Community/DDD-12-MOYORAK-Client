import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useSignupStore } from '@/store/signupStore';

import BasicProfile from './components/BasicProfile';
import CompanySearch from './components/CompanySearch';
import FoodPreference from './components/FoodPreference';
import SignUpSuccess from './components/SignUpSuccess';
import TeamSearch from './components/TeamSearch';

const TOTAL_STEPS = 4;

const SignUpPage = () => {
	const navigate = useNavigate();

	const [searchParams, setSearchParams] = useSearchParams();

	const step = useSignupStore((state) => state.step);
	const setStep = useSignupStore((state) => state.setStep);

	const { prevStep, nextStep, allergyFoods, dislikedFoods } = useSignupStore();

	useEffect(() => {
		const rawStep = searchParams.get('step');

		if (!rawStep) {
			setStep(1);
			setSearchParams({ step: '1' });
			return;
		}

		const stepParam = Number(rawStep);
		if (!isNaN(stepParam) && stepParam !== step) {
			setStep(stepParam);
		}
	}, []);

	useEffect(() => {
		setSearchParams({ step: step.toString() });
	}, [step, setSearchParams]);

	const handlePrevStep = () => {
		if (step === 1) {
			navigate('/auth', { replace: true });
		} else {
			prevStep();
		}
	};

	if (step === 'success') {
		return <SignUpSuccess />;
	}

	return (
		<div>
			<NavBar variant="iconOnly" onLeftIconClick={handlePrevStep} />
			{step === 2 && (
				<div className="flex justify-end mt-5 mr-5 mb-[23px]">
					<button onClick={nextStep} disabled={allergyFoods?.length === 0 || dislikedFoods?.length === 0 ? true : false}>
						<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09}>
							건너뛰기
						</Typography>
					</button>
				</div>
			)}

			<section className="flex flex-col">
				<Typography as="span" variant={FONT_VARIANT.body01} className={`${step !== 2 && 'pt-[65px]'} px-5 mb-[9px]`}>
					<span className="text-gray-10">{step}</span>
					<span className="text-gray-07">/{TOTAL_STEPS}</span>
				</Typography>

				{step === 1 && <BasicProfile />}
				{step === 2 && <FoodPreference />}
				{step === 3 && <CompanySearch />}
				{step === 4 && <TeamSearch />}
			</section>
		</div>
	);
};

export default SignUpPage;
