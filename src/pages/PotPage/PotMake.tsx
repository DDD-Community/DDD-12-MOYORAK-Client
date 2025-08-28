import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutationMakeParty } from '@/apis/useMutationMakeParty';
import { useQueryTeamMembers } from '@/apis/useQueryTeamMembers';
import Button from '@/components/Button/Button';
import PotDropdown, { type ITeamMember } from '@/components/Dropdown/PotDropdown';
import Icon from '@/components/Icon';
import FormLabel from '@/components/Input/FormLabel';
import Input from '@/components/Input/Input';
import NavBar from '@/components/NavBar/NavBar';
import Radio from '@/components/Radio/Radio';
import Switch from '@/components/Switch';
import TimePicker from '@/components/TimePicker/TimePicker';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useCategoryMapping } from '@/hooks/useCategoryMapping';

import SelectRestaurantPopup from './components/SelectRestaurantPopup';

interface IPotMakeRequest {
	title: string;
	isUserSelected: boolean;
	users: {
		ids: {
			userId: number;
		}[];
	};
	restaurants: {
		ids: {
			restaurantId: number;
		}[];
	};
	voteType: 'SELECT' | 'RANDOM';
	fromTime: string;
	toTime: string;
	mealTime: string;
	content: string;
	attendable: boolean;
}

function formatTo24AMPM(ampm: string, hour: number, minute: number) {
	let h = hour;
	const period = ampm === '오전' ? 'AM' : 'PM';

	if (ampm === '오전') {
		h = hour === 12 ? 0 : hour;
	} else {
		h = hour === 12 ? 12 : hour + 12;
	}

	const hh = h.toString().padStart(2, '0');
	const mm = minute.toString().padStart(2, '0');
	return `${hh}:${mm} ${period}`;
}

function formatTo24Hour(ampm: string, hour: number, minute: number) {
	let h = hour;

	if (ampm === '오전') {
		h = hour === 12 ? 0 : hour;
	} else {
		h = hour === 12 ? 12 : hour + 12;
	}

	const hh = h.toString().padStart(2, '0');
	const mm = minute.toString().padStart(2, '0');
	return `${hh}:${mm}:00`;
}

const PotMake = () => {
	const navigate = useNavigate();
	const { getCategoryDisplay } = useCategoryMapping();

	const teamId = localStorage.getItem('teamId') ?? '';
	const userId = localStorage.getItem('userId') ?? '';

	const [potTitle, setPotTitle] = useState('');
	const [potMember, setPotMember] = useState('');
	const [potMethod, setPotMethod] = useState('');
	const [potDesc, setPotDesc] = useState('');

	const [isOpen, setIsOpen] = useState(false);
	const [selectedMembers, setSelectedMembers] = useState<ITeamMember[]>([]);
	const [attendable, setAttendable] = useState(true);

	// TanStack Query 훅 사용
	const { data: teamMembers = [], isLoading: isLoadingTeamMembers } = useQueryTeamMembers(teamId.toString());
	const { mutate: makeParty } = useMutationMakeParty(teamId.toString());

	const [startTime, setStartTime] = useState('오전 00:00');
	const [announceTime, setAnnounceTime] = useState('오전 00:00');
	const [eatTime, setEatTime] = useState('오전 00:00');

	const [isToggle, setIsToggle] = useState(false);
	const [selectRestaurantPopup, setSelectRestaurantPopup] = useState(false);

	const [selectedRestaurants, setSelectedRestaurants] = useState<
		Array<{
			teamRestaurantId: number;
			restaurantName: string;
			restaurantCategory: string;
			averageReviewScore: number;
			reviewCount: number;
			reviewImagePath: string;
		}>
	>([]);

	// API request state
	const [potMakeRequest, setPotMakeRequest] = useState<IPotMakeRequest>({
		title: '',
		isUserSelected: false,
		users: { ids: [{ userId: Number(userId) }] },
		restaurants: { ids: [] },
		voteType: 'SELECT',
		fromTime: '',
		toTime: '',
		mealTime: '',
		content: '',
		attendable: attendable,
	});

	// Computed values
	const optionList: ITeamMember[] = teamMembers.map((member) => ({
		id: member.userId,
		name: member.name,
		team: '팀',
		isHonbapMode: member.state === 'ON',
	}));

	// 시간 유효성 검사 함수
	const validateTimes = () => {
		if (potMethod === 'normal') {
			// 일반 투표: 투표 시작 < 투표 발표 < 식사 시간
			const startMinutes = convertTimeToMinutes(startTime);
			const announceMinutes = convertTimeToMinutes(announceTime);
			const eatMinutes = convertTimeToMinutes(eatTime);

			if (announceMinutes <= startMinutes) {
				alert('투표 발표 시간은 투표 시작 시간보다 늦어야 합니다.');
				return false;
			}

			if (eatMinutes < announceMinutes) {
				alert('식사 시간은 투표 발표 시간보다 크거나 같아야 합니다.');
				return false;
			}
		} else if (potMethod === 'random') {
			// 랜덤 추첨: 랜덤 발표 < 식사 시간
			const announceMinutes = convertTimeToMinutes(announceTime);
			const eatMinutes = convertTimeToMinutes(eatTime);

			if (eatMinutes < announceMinutes) {
				alert('식사 시간은 랜덤 발표 시간보다 크거나 같아야 합니다.');
				return false;
			}
		}
		return true;
	};

	// 시간을 분 단위로 변환하는 함수
	const convertTimeToMinutes = (timeStr: string) => {
		const [ampm, time] = timeStr.split(' ');
		const [hour, minute] = time.split(':').map(Number);

		let totalMinutes = hour * 60 + minute;
		if (ampm === '오후' && hour !== 12) {
			totalMinutes += 12 * 60;
		} else if (ampm === '오전' && hour === 12) {
			totalMinutes -= 12 * 60; // 오전 12시는 00시로 변환
		}

		return totalMinutes;
	};

	// 기본 시간이 변경되었는지 확인하는 함수
	const isDefaultTime = (time: string) => {
		return time === '오전 00:00';
	};

	const isFormValid =
		potTitle &&
		potMethod &&
		potMember &&
		selectedRestaurants.length > 0 &&
		potDesc &&
		(potMethod === 'normal'
			? !isDefaultTime(startTime) && !isDefaultTime(announceTime) && !isDefaultTime(eatTime)
			: !isDefaultTime(announceTime) && !isDefaultTime(eatTime));

	const handleChangeOpen = () => {
		setIsOpen(!isOpen);
	};

	const handleToggleChange = (checked: boolean) => {
		setIsToggle(checked);
		setAttendable(checked);
		setPotMakeRequest((prev) => ({
			...prev,
			attendable: checked,
		}));
	};

	const handleChangeMembers = (value: ITeamMember[]) => {
		setSelectedMembers(value);
		setPotMakeRequest((prev) => ({
			...prev,
			isUserSelected: value.length > 0,
			users: { ids: [...value.map((member) => ({ userId: member.id })), { userId: Number(userId) }] },
		}));
	};

	const handlePotTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setPotTitle(value);
		setPotMakeRequest((prev) => ({
			...prev,
			title: value,
		}));
	};

	const handlePotMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setPotMember(value);

		if (value === 'none') {
			setSelectedMembers([]);
			setPotMakeRequest((prev) => ({
				...prev,
				isUserSelected: false,
				// 팀원 미선택이어도 본인(userId)은 포함
				users: { ids: [{ userId: Number(userId) }] },
			}));
		} else if (value === 'select') {
			setPotMakeRequest((prev) => ({
				...prev,
				isUserSelected: true,
			}));
		}
	};

	const handlePotDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setPotDesc(value);
		setPotMakeRequest((prev) => ({
			...prev,
			content: value,
		}));
	};

	const handleMethodChange = (method: string) => {
		setPotMethod(method);
		setPotMakeRequest((prev) => ({
			...prev,
			voteType: method === 'normal' ? 'SELECT' : 'RANDOM',
		}));
	};

	const handleTimeChange = (type: 'fromTime' | 'toTime' | 'mealTime', value: string) => {
		const apiTime = getApiTime(value);

		switch (type) {
			case 'fromTime':
				setStartTime(value);
				setPotMakeRequest((prev) => ({ ...prev, fromTime: apiTime }));
				break;
			case 'toTime':
				setAnnounceTime(value);
				setPotMakeRequest((prev) => ({ ...prev, toTime: apiTime }));
				break;
			case 'mealTime':
				setEatTime(value);
				setPotMakeRequest((prev) => ({ ...prev, mealTime: apiTime }));
				break;
		}
	};

	const handleRestaurantSelection = (
		restaurants?: Array<{
			teamRestaurantId: number;
			restaurantName: string;
			restaurantCategory: string;
			averageReviewScore: number;
			reviewCount: number;
			reviewImagePath: string;
		}>
	) => {
		if (restaurants) {
			setSelectedRestaurants(restaurants);
			setPotMakeRequest((prev) => ({
				...prev,
				restaurants: {
					ids: restaurants.map((restaurant) => ({
						restaurantId: restaurant.teamRestaurantId,
					})),
				},
			}));
		}
		setSelectRestaurantPopup(false);
	};

	const handleRemoveRestaurant = (restaurantId: number) => {
		const updatedRestaurants = selectedRestaurants.filter((r) => r.teamRestaurantId !== restaurantId);
		setSelectedRestaurants(updatedRestaurants);
		setPotMakeRequest((prev) => ({
			...prev,
			restaurants: {
				ids: updatedRestaurants.map((restaurant) => ({
					restaurantId: restaurant.teamRestaurantId,
				})),
			},
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateTimes()) {
			return;
		}

		if (potMethod === 'normal' && isDefaultTime(startTime)) {
			alert('투표 시작 시간을 선택해주세요.');
			return;
		}
		if (isDefaultTime(announceTime) || isDefaultTime(eatTime)) {
			alert('시간을 선택해주세요.');
			return;
		}

		const finalRequest: IPotMakeRequest = {
			...potMakeRequest,
			title: potTitle,
			content: potDesc,
			fromTime: potMethod === 'random' ? '00:00:00' : potMakeRequest.fromTime,
			restaurants: {
				ids: selectedRestaurants.map((restaurant) => ({
					restaurantId: restaurant.teamRestaurantId,
				})),
			},
		};

		makeParty(finalRequest, {
			onSuccess: () => {
				navigate('/pot-make-success');
			},
			onError: (error) => {
				console.error('Failed to submit form:', error);
			},
		});
	};

	const getDisplayTime = (value: string) => {
		const [ampm, time] = value.split(' ');
		const [hour, minute] = time.split(':');
		return formatTo24AMPM(ampm, Number(hour), Number(minute));
	};

	const getApiTime = (value: string) => {
		const [ampm, time] = value.split(' ');
		const [hour, minute] = time.split(':');
		return formatTo24Hour(ampm, Number(hour), Number(minute));
	};

	// 로딩 상태 처리
	if (isLoadingTeamMembers) {
		return (
			<div className="bg-gray-02 min-h-screen flex items-center justify-center">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					로딩 중...
				</Typography>
			</div>
		);
	}

	return (
		<>
			{selectRestaurantPopup ? (
				<SelectRestaurantPopup onClose={handleRestaurantSelection} initialSelectedIds={selectedRestaurants.map((r) => r.teamRestaurantId)} />
			) : (
				<>
					<NavBar variant="iconWithText" leftIcon="back" leftText="팟 만들기" onLeftIconClick={() => navigate('/pot')} />
					<div className="bg-gray-02 min-h-screen">
						<form className="p-4.5 flex flex-col gap-6" onSubmit={handleSubmit}>
							{/* 팟 제목 */}
							<div className="py-6 px-4 rounded-[20px] bg-white">
								<FormLabel id="potTitle" label="팟 제목" isEssential />
								<Input id="potTitle" placeholder="제목을 입력해 주세요" value={potTitle} onChange={handlePotTitleChange} />
							</div>

							{/* 팀원 선택 */}
							<div className="py-6 px-4 rounded-[20px] bg-white">
								<FormLabel id="potMember" label="팀원 선택" isEssential />
								<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray06} className="mt-[3px] mb-[15px]">
									*미선택 시 모든 팀 인원이 참가할 수 있습니다.
								</Typography>

								<div className="flex flex-col gap-2.5">
									<Radio label="팀원 미선택" checked={potMember === 'none'} onChange={handlePotMemberChange} value="none" name="potMember" />
									<Radio label="팀원 선택" checked={potMember === 'select'} onChange={handlePotMemberChange} value="select" name="potMember" />
								</div>

								{potMember === 'select' && (
									<>
										<div className="flex justify-between">
											<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07} className="mt-0.5 mb-5 ml-7">
												선택 인원 외 자율참여 허용하기
											</Typography>
											<Switch size="S" checked={isToggle} onCheckedChange={handleToggleChange} />
										</div>

										<PotDropdown
											isOpen={isOpen}
											selectedMembers={selectedMembers}
											onChangeOpen={handleChangeOpen}
											onChange={handleChangeMembers}
											optionList={optionList}
											placeholder="팀에서 팀원 선택하기"
										/>
									</>
								)}
							</div>

							{/* 식당 선택 */}
							<div className="py-6 px-4 rounded-[20px] bg-white">
								<FormLabel id="potRestaurant" label="식당 선택" isEssential />
								<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray06} className="mt-[3px] mb-[15px]">
									*팀 내 등록된 맛집에서만 추가가 가능합니다.
									<br />
									*팀원들이 음식점을 추가할 수 있습니다. (최대 5개)
								</Typography>

								{/* 선택된 식당 목록 */}
								{selectedRestaurants.length > 0 && (
									<div className="p-4 rounded-[12px]">
										<div className="flex flex-col gap-3">
											{selectedRestaurants.map((restaurant) => (
												<div key={restaurant.teamRestaurantId} className="flex items-center gap-[15px]">
													<div className="w-[71px] h-[71px] bg-gray-04 rounded-[6.656px]">
														{restaurant.reviewImagePath && (
															<img src={restaurant.reviewImagePath} alt={restaurant.restaurantName} className="w-full h-full object-cover rounded-[6.656px]" />
														)}
													</div>
													<div className="flex-1">
														<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
															{getCategoryDisplay(restaurant.restaurantCategory)}
														</Typography>
														<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="mb-1 font-semibold">
															{restaurant.restaurantName}
														</Typography>
														<div className="flex items-center gap-1">
															<Icon name="star" width={11} />
															<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
																{restaurant.averageReviewScore}
															</Typography>
															<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
																· 리뷰 {restaurant.reviewCount}
															</Typography>
														</div>
													</div>
													<Icon name="close" size={22} className="cursor-pointer" onClick={() => handleRemoveRestaurant(restaurant.teamRestaurantId)} />
												</div>
											))}
										</div>
									</div>
								)}

								<Button variant="general" className="flex items-center justify-center" onClick={() => setSelectRestaurantPopup(true)}>
									<Icon name="restaurantPlusButton" />
								</Button>
							</div>

							{/* 방식 선택 */}
							<div className="py-6 px-4 rounded-[20px] bg-white">
								<FormLabel id="potMethod" label="방식 선택" isEssential />
								<div className="flex flex-col mt-[15px]">
									<Radio label="일반 투표" checked={potMethod === 'normal'} onChange={() => handleMethodChange('normal')} value="normal" name="potMethod" />
									<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray06} className="mt-0.25 mb-3 ml-7">
										팀원과 함께 투표로 식당을 결정해요
									</Typography>
									{potMethod === 'normal' && (
										<div className="rounded-[12px] border border-gray-04 px-5 py-4.25 flex flex-col my-1.25 mb-3.75">
											<div className="flex justify-between items-center border-b border-gray-02 pb-2.5">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
													투표 시작 시간
												</Typography>
												<TimePicker
													value={startTime}
													onChange={(value) => handleTimeChange('fromTime', value)}
													displayValue={isDefaultTime(startTime) ? '시간을 선택해주세요' : getDisplayTime(startTime)}
												/>
											</div>
											<div className="flex justify-between items-center border-b border-gray-02 pb-2.5 pt-2.5">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
													투표 발표 시간
												</Typography>
												<TimePicker
													value={announceTime}
													onChange={(value) => handleTimeChange('toTime', value)}
													displayValue={isDefaultTime(announceTime) ? '시간을 선택해주세요' : getDisplayTime(announceTime)}
												/>
											</div>
											<div className="flex justify-between items-center">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="pt-2.5">
													식사 시간
												</Typography>
												<TimePicker
													value={eatTime}
													onChange={(value) => handleTimeChange('mealTime', value)}
													displayValue={isDefaultTime(eatTime) ? '시간을 선택해주세요' : getDisplayTime(eatTime)}
												/>
											</div>
										</div>
									)}
									<Radio label="랜덤 추첨" checked={potMethod === 'random'} onChange={() => handleMethodChange('random')} value="random" name="potMethod" />
									<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07} className="mt-0.25 mb-3 ml-7">
										랜덤으로 식당을 추첨해줘요
									</Typography>
									{potMethod === 'random' && (
										<div className="rounded-[12px] border border-gray-04 px-5 py-4.25 flex flex-col gap-2">
											<div className="flex justify-between items-center border-b border-gray-02 pb-2.5">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
													랜덤 발표 시간
												</Typography>
												<TimePicker
													value={announceTime}
													onChange={(value) => handleTimeChange('toTime', value)}
													displayValue={isDefaultTime(announceTime) ? '시간을 선택해주세요' : getDisplayTime(announceTime)}
												/>
											</div>
											<div className="flex justify-between items-center">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="pt-2.5">
													식사 시간
												</Typography>
												<TimePicker
													value={eatTime}
													onChange={(value) => handleTimeChange('mealTime', value)}
													displayValue={isDefaultTime(eatTime) ? '시간을 선택해주세요' : getDisplayTime(eatTime)}
												/>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* 팟 설명 */}
							<div className="py-6 px-4 rounded-[20px] bg-white relative">
								<FormLabel id="potDesc" label="팟 설명" />
								<textarea
									className="w-full h-[79px] border border-gray-04 rounded-[12px] p-[15px] mt-[10px] placeholder:text-gray-06 text-[16px]"
									placeholder="팟 설명을 입력해주세요"
									maxLength={50}
									value={potDesc}
									onChange={handlePotDescChange}
								/>
								<div className="absolute right-7 bottom-10">
									<Typography as="span" variant={FONT_VARIANT.label01} fontColor={PALETTE.gray10}>
										{potDesc.length}
									</Typography>
									<Typography as="span" variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07}>
										/50
									</Typography>
								</div>
							</div>

							{/* 등록하기 버튼 */}
							<div className="w-full">
								<Button variant={!isFormValid ? 'disabled' : 'active'}>등록하기</Button>
							</div>
						</form>
					</div>
				</>
			)}
		</>
	);
};

export default PotMake;
