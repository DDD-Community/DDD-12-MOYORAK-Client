import { useEffect, useState } from 'react';

import { useMutationLeaveTeam } from '@/apis/useMutationLeaveTeam';
import { useMutationLogout } from '@/apis/useMutationLogout';
import { useMutationMealAlone } from '@/apis/useMutationMealAlone';
import { useMutationMealTags } from '@/apis/useMutationMealTags';
import { useQueryMealAlone } from '@/apis/useQueryMealAlone';
import { useQueryMealTags } from '@/apis/useQueryMealTags';
import reviewDelete from '@/assets/reviewDelete.png';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import NavBar from '@/components/NavBar/NavBar';
import Switch from '@/components/Switch';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const MyPage = () => {
	const { data } = useQueryMealAlone();
	const { data: mealTagsData, refetch: refetchMealTags } = useQueryMealTags();
	const userId = localStorage.getItem('userId');
	const [isLogoutOpen, setIsLogoutOpen] = useState(false);
	const [isLeaveTeamOpen, setIsLeaveTeamOpen] = useState(false);
	const { mutate: mutateMealLone } = useMutationMealAlone(Number(userId));
	const { mutate: mutateMealTags } = useMutationMealTags();
	const { mutate: logout } = useMutationLogout();
	const { mutate: leaveTeam } = useMutationLeaveTeam();

	const [isChecked, setIsChecked] = useState(data?.state === 'ON');

	const [allergyFoods, setAllergyFoods] = useState<string[]>([]);
	const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
	const [isEditingAllergy, setIsEditingAllergy] = useState(false);
	const [isEditingDislike, setIsEditingDislike] = useState(false);
	const [newAllergyInput, setNewAllergyInput] = useState('');
	const [newDislikeInput, setNewDislikeInput] = useState('');

	const email = localStorage.getItem('email');
	const name = localStorage.getItem('name');
	const profileImage = localStorage.getItem('profileImage');

	// 음식 태그 업데이트 함수 - 두 리스트 모두 포함
	const updateMealTags = () => {
		const details = [...allergyFoods.map((item) => ({ type: 'ALLERGY' as const, item })), ...dislikedFoods.map((item) => ({ type: 'DISLIKE' as const, item }))];

		mutateMealTags(
			{
				userId: Number(userId),
				details,
			},
			{
				onSuccess: () => {
					refetchMealTags();
				},
			}
		);
	};

	// 알러지 음식 수정 완료 처리
	const handleAllergyEditComplete = () => {
		setIsEditingAllergy(false);
		setNewAllergyInput('');
		updateMealTags();
	};

	// 비선호 음식 수정 완료 처리
	const handleDislikeEditComplete = () => {
		setIsEditingDislike(false);
		setNewDislikeInput('');
		updateMealTags();
	};

	// 알러지 음식 추가
	const handleAddAllergy = () => {
		if (newAllergyInput.trim() && !allergyFoods.includes(newAllergyInput.trim())) {
			setAllergyFoods([...allergyFoods, newAllergyInput.trim()]);
			setNewAllergyInput('');
		}
	};

	// 비선호 음식 추가
	const handleAddDislike = () => {
		if (newDislikeInput.trim() && !dislikedFoods.includes(newDislikeInput.trim())) {
			setDislikedFoods([...dislikedFoods, newDislikeInput.trim()]);
			setNewDislikeInput('');
		}
	};

	// Enter 키로 알러지 음식 추가
	const handleAllergyKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleAddAllergy();
		}
	};

	// Enter 키로 비선호 음식 추가
	const handleDislikeKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleAddDislike();
		}
	};

	// 로그아웃 처리
	const handleLogout = () => {
		logout();
	};

	const handleLogoutCancel = () => {
		setIsLogoutOpen(false);
	};

	// 팀 탈퇴 처리
	const handleLeaveTeam = () => {
		const teamId = localStorage.getItem('teamId');
		if (teamId) {
			leaveTeam(teamId, {
				onSuccess: () => {
					setIsLeaveTeamOpen(false);
				},
				onError: (error) => {
					console.error('팀 탈퇴 실패:', error);
					alert('팀 탈퇴에 실패했습니다. 다시 시도해주세요.');
				},
			});
		} else {
			alert('팀 정보를 찾을 수 없습니다.');
		}
	};

	const handleLeaveTeamCancel = () => {
		setIsLeaveTeamOpen(false);
	};

	useEffect(() => {
		if (mealTagsData) {
			setAllergyFoods(mealTagsData.allergies.map((tag) => tag.item));
			setDislikedFoods(mealTagsData.dislikes.map((tag) => tag.item));
		}
	}, [mealTagsData]);

	useEffect(() => {
		setIsChecked(data?.state === 'ON');
	}, [data?.state]);

	return (
		<div className="bg-gray-02 min-h-screen pb-20">
			<NavBar variant="centerText" centerText="마이페이지" />

			<div className="px-[18px]">
				{/* 프로필 정보 */}
				<div className="relative flex flex-col items-center bg-white rounded-[20px] h-[123px] mx-auto mt-[50px] mb-[22px]">
					<div className="absolute -top-[30px] w-[60px] h-[60px] rounded-full bg-gray-200 flex items-center justify-center">
						<img src={profileImage ?? ''} alt="profile" className="w-[60px] h-[60px] rounded-full" />
					</div>
					<div className="flex flex-col items-center justify-center h-full pt-[15px]">
						<Typography variant={FONT_VARIANT.header02} className="text-[#171719]">
							{name ?? '이름'}
						</Typography>
						<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray07}>
							{email ?? '이메일'}
						</Typography>
					</div>
				</div>

				{/* 오늘 혼밥 모드 */}
				<div className="bg-white py-6.5 px-4.5 rounded-[20px] mx-auto mb-[22px]">
					<div className="flex items-center justify-between mb-2">
						<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
							오늘 혼밥 모드
						</Typography>
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

				{/* 알러지 음식 */}
				<div className="bg-white py-6.5 px-4.5 rounded-[20px] mx-auto mb-[22px]">
					<div className="flex items-center justify-between mb-3">
						<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray09} className="font-semibold">
							알러지 음식
						</Typography>
						<button
							className="text-primary-500 text-sm"
							onClick={() => {
								if (isEditingAllergy) {
									handleAllergyEditComplete();
								} else {
									setIsEditingAllergy(true);
								}
							}}
						>
							{isEditingAllergy ? (
								<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07} className="underline">
									수정완료
								</Typography>
							) : (
								<div className="flex items-center ">
									<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
										수정하기
									</Typography>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
										<path
											d="M5.90913 3.24507C5.67482 3.47939 5.67482 3.85929 5.90913 4.0936L9.81819 8.00267L5.90913 11.9117C5.67482 12.1461 5.67482 12.526 5.90913 12.7603C6.14345 12.9946 6.52335 12.9946 6.75766 12.7603L11.091 8.42693C11.3253 8.19262 11.3253 7.81272 11.091 7.57841L6.75766 3.24507C6.52335 3.01076 6.14345 3.01076 5.90913 3.24507Z"
											fill="#8A8A8A"
										/>
									</svg>
								</div>
							)}
						</button>
					</div>

					{/* 알러지 음식 입력 필드 */}
					{isEditingAllergy && (
						<div className="relative mb-3">
							<input
								type="text"
								value={newAllergyInput}
								onChange={(e) => setNewAllergyInput(e.target.value)}
								onKeyPress={handleAllergyKeyPress}
								placeholder="알러지 음식을 입력하세요"
								className="w-full py-2 px-0 pr-16 border-b border-gray-300 focus:outline-none focus:border-primary-200 text-gray-900 placeholder:text-gray-500"
							/>
							<button
								onClick={handleAddAllergy}
								className={`absolute right-0 top-1/2 -translate-y-1/2 px-1 py-1 text-[15px] font-semibold transition-colors ${
									newAllergyInput.trim() ? 'text-[#B4E300] hover:text-[#9BC800]' : 'text-gray-05 cursor-not-allowed'
								}`}
								disabled={!newAllergyInput.trim()}
							>
								입력
							</button>
						</div>
					)}

					<div className="flex flex-wrap gap-2 mb-8.75">
						{allergyFoods.map((food, index) => (
							<FilterButton
								key={index}
								variant={isEditingAllergy ? 'general' : 'clicked'}
								borderRadius="16"
								onClick={() => {
									if (isEditingAllergy) {
										setAllergyFoods(allergyFoods.filter((_, i) => i !== index));
									}
								}}
								className={isEditingAllergy ? 'cursor-pointer' : 'cursor-default'}
							>
								{food} {isEditingAllergy && '×'}
							</FilterButton>
						))}
						{allergyFoods.length === 0 && !isEditingAllergy && (
							<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
								알러지 음식을 입력하세요
							</Typography>
						)}
					</div>

					{/* 비선호 음식 */}
					<div className="flex items-center justify-between mb-3">
						<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray09} className="font-semibold">
							비선호 음식
						</Typography>
						<button
							className="text-primary-500 text-sm"
							onClick={() => {
								if (isEditingDislike) {
									handleDislikeEditComplete();
								} else {
									setIsEditingDislike(true);
								}
							}}
						>
							{isEditingDislike ? (
								<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07} className="underline">
									수정완료
								</Typography>
							) : (
								<div className="flex items-center">
									<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
										수정하기
									</Typography>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
										<path
											d="M5.90913 3.24507C5.67482 3.47939 5.67482 3.85929 5.90913 4.0936L9.81819 8.00267L5.90913 11.9117C5.67482 12.1461 5.67482 12.526 5.90913 12.7603C6.14345 12.9946 6.52335 12.9946 6.75766 12.7603L11.091 8.42693C11.3253 8.19262 11.3253 7.81272 11.091 7.57841L6.75766 3.24507C6.52335 3.01076 6.14345 3.01076 5.90913 3.24507Z"
											fill="#8A8A8A"
										/>
									</svg>
								</div>
							)}
						</button>
					</div>

					{/* 비선호 음식 입력 필드 */}
					{isEditingDislike && (
						<div className="relative mb-3">
							<input
								type="text"
								value={newDislikeInput}
								onChange={(e) => setNewDislikeInput(e.target.value)}
								onKeyPress={handleDislikeKeyPress}
								placeholder="비선호 음식을 입력하세요"
								className="w-full py-2 px-0 pr-16 border-b border-gray-300 focus:outline-none focus:border-primary-200 text-gray-900 placeholder:text-gray-500"
							/>
							<button
								onClick={handleAddDislike}
								className={`absolute right-0 top-1/2 -translate-y-1/2 px-1 py-1 text-[15px] font-semibold transition-colors ${
									newDislikeInput.trim() ? 'text-[#B4E300] hover:text-[#9BC800]' : 'text-gray-05 cursor-not-allowed'
								}`}
								disabled={!newDislikeInput.trim()}
							>
								입력
							</button>
						</div>
					)}

					<div className="flex flex-wrap gap-2">
						{dislikedFoods.map((food, index) => (
							<FilterButton
								key={index}
								variant={isEditingDislike ? 'general' : 'clicked'}
								borderRadius="16"
								onClick={() => {
									if (isEditingDislike) {
										setDislikedFoods(dislikedFoods.filter((_, i) => i !== index));
									}
								}}
								className={isEditingDislike ? 'cursor-pointer' : 'cursor-default'}
							>
								{food} {isEditingDislike && '×'}
							</FilterButton>
						))}
						{dislikedFoods.length === 0 && !isEditingDislike && (
							<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
								비선호 음식을 입력하세요
							</Typography>
						)}
					</div>
				</div>

				{/* 메뉴 리스트 */}
				<div className="bg-white py-6.5 px-4.5 rounded-[20px] mx-auto">
					<ul>
						<a className="flex items-center justify-between pb-5 " href="/mypage/my-review">
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray09} className="font-medium">
								내가 쓴 리뷰 관리
							</Typography>
							<Icon name="arrowRight" width={18} height={18} />
						</a>
						<a
							className="flex items-center justify-between pb-5 "
							href="https://marsh-methane-db9.notion.site/251faa5de80280ba9914cb87093485ff?source=copy_link"
							target="_blank"
							rel="noreferrer"
						>
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray09} className="font-medium">
								이용약관
							</Typography>
							<Icon name="arrowRight" width={18} height={18} />
						</a>
						<button className="flex items-center justify-between pb-5 w-full" onClick={() => setIsLogoutOpen(true)}>
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray09} className="font-medium">
								로그아웃
							</Typography>
							<Icon name="arrowRight" width={18} height={18} />
						</button>
						<button className="flex items-center justify-between w-full" onClick={() => setIsLeaveTeamOpen(true)}>
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray09} className="font-medium">
								탈퇴하기
							</Typography>
							<Icon name="arrowRight" width={18} height={18} />
						</button>
					</ul>
				</div>
			</div>

			{/* 팀 탈퇴 다이얼로그 */}
			{isLeaveTeamOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/50" onClick={handleLeaveTeamCancel} />

					<div className="relative bg-white rounded-[20px] w-[271px] p-6 shadow-lg">
						<div className="text-center mb-[7px]">
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold">
								모여락에서 탈퇴하기
							</Typography>
						</div>

						<div className="text-center mb-6">
							<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
								탈퇴 시 모든 계정 정보와 이용 기록이
								<br />
								삭제되며, 복구가 불가능해요.
							</Typography>
						</div>

						<img src={reviewDelete} alt="리뷰 삭제 완료" className="w-[133px] h-[128px] absolute bottom-44 left-18" />

						<div className="flex gap-2 max-w-[283px]">
							<button onClick={handleLeaveTeamCancel} className="w-[89px] rounded-[20px] border border-gray-03 bg-white h-[50px]">
								<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08} className="font-medium">
									취소
								</Typography>
							</button>
							<button onClick={handleLeaveTeam} className="w-[154px] rounded-[20px] bg-primary-200 h-[50px]">
								<Typography variant={FONT_VARIANT.body01} className="font-semibold text-[#1F2511]">
									탈퇴하기
								</Typography>
							</button>
						</div>
					</div>
				</div>
			)}

			{isLogoutOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/50" onClick={handleLogoutCancel} />

					<div className="relative bg-white rounded-[20px] w-[271px] p-6 shadow-lg">
						<div className="text-center mb-6">
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold">
								모여락에서 로그아웃하기
							</Typography>
						</div>

						<div className="flex gap-2 max-w-[283px]">
							<button onClick={handleLogoutCancel} className="w-[89px] rounded-[20px] border border-gray-03 bg-white h-[50px]">
								<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08} className="font-medium">
									취소
								</Typography>
							</button>
							<button onClick={handleLogout} className="w-[154px] rounded-[20px] bg-primary-200 h-[50px]">
								<Typography variant={FONT_VARIANT.body01} className="font-semibold text-[#1F2511]">
									로그아웃
								</Typography>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyPage;
