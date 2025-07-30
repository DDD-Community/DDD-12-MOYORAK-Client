import { useState } from 'react';

import { useQuerySearchCompany } from '@/apis/useQuerySearchCompany';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useSignupStore } from '@/store/signupStore';

const CompanySearch = () => {
	const { nextStep, company, setCompany } = useSignupStore();

	const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

	const { isSuccess, isError } = useQuerySearchCompany(company, isSearchEnabled);

	const getValidMessage = () => {
		if (isSuccess) return '입력한 회사 이름이 초대받은 회사 이름과 일치합니다.';
		if (isError) return '입력한 회사 이름이 초대받은 회사 이름과 일치하지 않습니다.';
		return '';
	};

	return (
		<section className="px-5">
			<Typography as="h1" variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="mb-[5px]">
				우리 회사 찾기
			</Typography>
			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="mb-[60px]">
				함께 점심을 즐길 팀을 찾을 수 있도록 <br /> 현재 근무 중인 회사를 알려주세요.
			</Typography>

			<Input
				label="회사 이름"
				isEssential={true}
				placeholder="회사 이름을 입력해주세요."
				className="mb-[50px]"
				onChange={(e) => setCompany(e.target.value)}
				rightButton={
					!isSearchEnabled && (
						<button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setIsSearchEnabled(true)}>
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.primary200}>
								입력
							</Typography>
						</button>
					)
				}
				isSuccess={isSuccess}
				isError={isError}
				message={getValidMessage()}
			/>

			{isError && (
				<>
					<Input label="회사 주소" isEssential={true} placeholder="회사 주소를 검색해 주세요." />
					<Input placeholder="상세 주소" />
				</>
			)}

			<div className="fixed bottom-[30px] left-0 w-full px-5">
				<Button variant="active" onClick={nextStep}>
					다음
				</Button>
			</div>
		</section>
	);
};

export default CompanySearch;
