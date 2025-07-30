import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';

import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT } from '@/constants/styles';
import { useSignupStore } from '@/store/signupStore';

import BasicProfile from './components/BasicProfile';
import CompanySearch from './components/CompanySearch';
import FoodPreference from './components/FoodPreference';
import TeamSearch from './components/TeamSearch';

const TOTAL_STEPS = 4;

const SignUpPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const step = useSignupStore((state) => state.step);
	const setStep = useSignupStore((state) => state.setStep);

	const { prevStep, nextStep } = useSignupStore();

	useEffect(() => {
		const rawStep = searchParams.get('step');

		const stepParam = Number(rawStep);
		if (!isNaN(stepParam) && stepParam !== step) {
			setStep(stepParam);
		}
	}, [searchParams, setStep]);

	useEffect(() => {
		setSearchParams({ step: step.toString() });
	}, [step, setSearchParams]);

	const handlePrevStep = () => {
		if (step === 1) {
			// TODO) 뒤로가기 막기 추가
			alert('못가요');
		} else {
			prevStep();
		}
	};

	return (
		<div>
			<NavBar variant="iconOnly" onLeftIconClick={handlePrevStep} />
			{step === 2 && (
				<div className="flex justify-end mt-5 mr-5">
					<button onClick={nextStep}>건너뛰기</button>
				</div>
			)}

			<section className="flex flex-col">
				<Typography as="span" variant={FONT_VARIANT.body01} className="pt-[65px] px-5 mb-[9px]">
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
