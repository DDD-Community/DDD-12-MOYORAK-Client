import { useEffect, useState } from 'react';

import { useMutationMealAlone } from '@/apis/useMutationMealAlone';
import { useQueryMealAlone } from '@/apis/useQueryMealAlone';
import Icon from '@/components/Icon';
import NavBar from '@/components/NavBar/NavBar';
import Switch from '@/components/Switch';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const MyPage = () => {
	const { data } = useQueryMealAlone();
	const userId = localStorage.getItem('userId');

	const { mutate: mutateMealLone } = useMutationMealAlone(Number(userId));

	const [isChecked, setIsChecked] = useState(data?.state === 'ON');

	useEffect(() => {
		setIsChecked(data?.state === 'ON');
	}, [data?.state]);

	return (
		<div className="bg-gray-02 min-h-screen">
			<NavBar variant="centerText" centerText="마이페이지" />
			{/* 프로필 정보 */}
			<div className="relative flex flex-col items-center bg-white rounded-[20px] h-[123px] w-[339px] mx-auto mt-[50px] mb-[22px]">
				<img src="" alt="프로필" className="absolute -top-[30px] w-[60px] h-[60px] rounded-full" />
				<div className="flex flex-col items-center justify-center h-full pt-[30px]">
					<Typography variant={FONT_VARIANT.header02}>이지민</Typography>
					<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray07}>
						이메일주소
					</Typography>
				</div>
			</div>

			{/* 혼밥모드 */}
			<div className="bg-white p-4 rounded-[20px] w-[339px] mx-auto mb-[22px]">
				<div className="flex items-center justify-between mb-2">
					<Typography variant={FONT_VARIANT.body01}>오늘 혼밥 모드</Typography>
					<Switch
						checked={isChecked}
						onCheckedChange={() => {
							setIsChecked((prev) => !prev);

							mutateMealLone();
						}}
					/>
				</div>
				<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
					혼밥 모드는 자정이 지나면 자동으로 Off로 전환됩니다.
				</Typography>
			</div>

			{/* 알러지 / 비선호 음식 */}
			<div className="bg-white w-[339px] mx-auto mb-[22px]">
				<Typography variant={FONT_VARIANT.body01}>알러지 음식</Typography>

				<button>수정하기</button>
			</div>

			<div className="bg-white w-[339px] mx-auto">
				<ul>
					<li className="flex items-center justify-between px-[18px] pt-5">
						<Typography variant={FONT_VARIANT.body01}>내가 쓴 리뷰 관리</Typography>
						<Icon name="arrowRight" width={18} height={18} />
					</li>
					<li className="flex items-center justify-between px-[18px] pt-5">
						<Typography variant={FONT_VARIANT.body01}>이용약관</Typography>
						<Icon name="arrowRight" width={18} height={18} />
					</li>
					<li className="flex items-center justify-between px-[18px] pt-5">
						<Typography variant={FONT_VARIANT.body01}>로그아웃</Typography>
						<Icon name="arrowRight" width={18} height={18} />
					</li>
					<li className="flex items-center justify-between px-[18px] py-5">
						<Typography variant={FONT_VARIANT.body01}>탈퇴하기</Typography>
						<Icon name="arrowRight" width={18} height={18} />
					</li>
				</ul>
			</div>
		</div>
	);
};

export default MyPage;
