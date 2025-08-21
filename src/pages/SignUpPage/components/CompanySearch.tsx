import { useMemo, useState } from 'react';

import { useQuerySearchCompany } from '@/apis/useQuerySearchCompany';
import Button from '@/components/Button/Button';
import IconButton from '@/components/Button/IconButton';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useSignupStore } from '@/store/signupStore';
import { useMutationAddCompany } from '@/apis/useMutationAddCompany';
import useKakaoMapSdk from '@/hooks/useKakaoMapSdk';

const CompanySearch = () => {
	const { nextStep, company, setCompany, baseAddress, setBaseAddress, detailAddress, setDetailAddress } = useSignupStore();

	const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);

	// 신규 등록 버튼 클릭 여부
	const [isRegisterCompany, setIsRegisterCompany] = useState<boolean>(false);

	// 회사 검색
	const { isSuccess, isError, data: companyList } = useQuerySearchCompany(company, isSearchEnabled && !isRegisterCompany);

	// 회사 저장
	const { mutate } = useMutationAddCompany({
		onSuccess: (data) => {
			(localStorage.setItem('companyId', String(data.companyId)), nextStep());
		},
	});

	const validMessage = useMemo(() => {
		if (!isSearchEnabled) return '';

		if (companyList && companyList.searchResponses.length === 1) return '입력한 회사 이름이 초대받은 회사 이름과 일치합니다.';
		if (companyList && companyList.searchResponses.length === 0) return `${company}는 아직 등록되어 있지 않습니다.`;
	}, [isSearchEnabled, companyList]);

	const handleOpenPostcodePopup = () => {
		const popup = window.open('/popup-address', '우편번호 찾기', 'width=500,height=600,scrollbars=yes');

		const handleMessage = (event: MessageEvent) => {
			if (event.origin !== window.location.origin) return;

			const { type, payload } = event.data;
			if (type === 'selectedAddress') {
				setBaseAddress(payload);
				popup?.close();
				window.removeEventListener('message', handleMessage);
			}
		};

		window.addEventListener('message', handleMessage);
	};

	const onRegisterCompany = () => {
		setIsRegisterCompany(true);
		setIsSearchEnabled(false);
	};

	const kakaoLoaded = useKakaoMapSdk();

	const getCoordinates = (address: string) => {
		return new Promise<{ longitude: number; latitude: number }>((resolve, reject) => {
			if (!kakaoLoaded) {
				reject(new Error('Kakao 지도 SDK가 아직 로드되지 않았습니다.'));
				return;
			}

			const geocoder = new kakaoLoaded.maps.services.Geocoder();
			geocoder.addressSearch(address, (result: { x: any; y: any }[], status: any) => {
				if (status === kakaoLoaded.maps.services.Status.OK) {
					const { x, y } = result[0];
					resolve({ longitude: parseFloat(x), latitude: parseFloat(y) });
				} else {
					reject(new Error('주소로 좌표를 찾을 수 없습니다.'));
				}
			});
		});
	};

	const onSaveCompany = async () => {
		if (!company || !baseAddress) {
			alert('회사 이름과 주소를 입력해주세요.');
			return;
		}

		try {
			const { longitude, latitude } = await getCoordinates(baseAddress);

			mutate({
				name: company,
				address: baseAddress,
				addressDetail: detailAddress ?? '',
				longitude,
				latitude,
			});

			nextStep();
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
			} else {
				alert('알 수 없는 오류가 발생했습니다.');
			}
			console.error(error);
		}
	};

	return (
		<section className="px-5 relative">
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
				className={`mb-[${isError ? '20px' : '50px'}]`}
				value={company}
				onChange={(e) => setCompany(e.target.value)}
				rightButton={
					company &&
					!isError &&
					!companyList && (
						<button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setIsSearchEnabled(true)}>
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.primary200}>
								입력
							</Typography>
						</button>
					)
				}
				isSuccess={!isRegisterCompany && isSuccess && companyList?.searchResponses.length === 1}
				isError={!isRegisterCompany && companyList?.searchResponses.length === 0}
				message={validMessage}
			/>

			{companyList && companyList.searchResponses.length === 0 && (
				<FilterButton variant="general" className="rounded-[17px] py-1.5 flex items-center gap-0.5 mt-5" onClick={onRegisterCompany}>
					신규 등록하기
					<Icon name="plus" width={18} height={18} />
				</FilterButton>
			)}

			{isRegisterCompany && (
				<>
					<Input
						label="회사 주소"
						isEssential={true}
						placeholder="회사 주소를 검색해 주세요."
						value={baseAddress}
						className="mt-[50px] mb-[30px]"
						readOnly
						rightButton={
							<IconButton
								onClick={handleOpenPostcodePopup}
								className="absolute right-2 top-1/2 -translate-y-1/2"
								iconStyle={{ name: 'inputSearch', width: 22, height: 22, className: baseAddress ? 'text-primary-200' : 'text-gray-05' }}
							/>
						}
					/>
					<Input placeholder="상세 주소" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} />
				</>
			)}

			<div className="fixed bottom-[30px] left-0 w-full px-5">
				<Button variant={isSuccess || (company && baseAddress) ? 'active' : 'disabled'} onClick={onSaveCompany}>
					<Typography variant={FONT_VARIANT.header04} fontColor={isSuccess || (company && baseAddress) ? PALETTE.primary600 : PALETTE.gray06}>
						{isRegisterCompany ? '등록하기' : '다음'}
					</Typography>
				</Button>
			</div>
		</section>
	);
};

export default CompanySearch;
