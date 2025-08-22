import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

import SelectRestaurantPopup from './components/SelectRestaurantPopup';

const MOCK_TEAM_MEMBER = [
	{
		id: 1,
		name: '홍길동',
		team: '팀1',
		isHonbapMode: true,
	},
	{
		id: 2,
		name: '이순신',
		team: '팀1',
	},
	{
		id: 3,
		name: '강감찬',
		team: '팀1',
	},
	{
		id: 4,
		name: '유관순',
		team: '팀1',
	},
	{
		id: 5,
		name: '유관순1',
		team: '팀1',
	},
];

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
}

// interface ITeamMembersResponse {
// 	size: number;
// 	currentPage: number;
// 	totalCount: number;
// 	data: [
// 		{
// 			teamUserId: number;
// 			name: string;
// 			email: string;
// 			profileImage: string;
// 			status: 'APPROVED' | 'PENDING' | 'REJECTED';
// 		},
// 	];
// }

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

const PotMake = () => {
	const [potTitle, setPotTitle] = useState('');
	const [potMember, setPotMember] = useState('');
	const [potMethod, setPotMethod] = useState('');
	const [potDesc, setPotDesc] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [selectedMembers, setSelectedMembers] = useState<ITeamMember[]>([]);
	const [optionList, _] = useState<ITeamMember[]>(MOCK_TEAM_MEMBER);

	const [potMakeRequest, setPotMakeRequest] = useState<IPotMakeRequest>({
		title: '',
		isUserSelected: false,
		users: { ids: [] },
		restaurants: { ids: [] },
		voteType: 'SELECT',
		fromTime: '',
		toTime: '',
		mealTime: '',
		content: '',
	});

	// const [teamMembers, setTeamMembers] = useState<ITeamMembersResponse>();
	const [isToggle, setIsToggle] = useState(false);

	const handleToggleChange = (checked: boolean) => {
		setIsToggle(checked);
	};

	const [startTime, setStartTime] = useState('오전 11:30');
	const [announceTime, setAnnounceTime] = useState('오전 12:00');
	const [eatTime, setEatTime] = useState('오전 12:00');

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

	const handleChangeOpen = () => {
		setIsOpen(!isOpen);
	};

	const handleChangeMembers = (value: ITeamMember[]) => {
		setSelectedMembers(value);
		// potMakeRequest 업데이트
		setPotMakeRequest((prev) => ({
			...prev,
			isUserSelected: value.length > 0,
			users: { ids: value.map((member) => ({ userId: member.id })) },
		}));
	};

	const handlePotTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setPotTitle(value);
		// potMakeRequest 업데이트
		setPotMakeRequest((prev) => ({
			...prev,
			title: value,
		}));
	};

	const handlePotMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setPotMember(value);

		if (value === 'none') {
			// 팀원 미선택 시
			setSelectedMembers([]);
			setPotMakeRequest((prev) => ({
				...prev,
				isUserSelected: false,
				users: { ids: [] },
			}));
		} else if (value === 'select') {
			// 팀원 선택 시
			setPotMakeRequest((prev) => ({
				...prev,
				isUserSelected: true,
			}));
		}
	};

	const handlePotDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setPotDesc(value);
		// potMakeRequest 업데이트
		setPotMakeRequest((prev) => ({
			...prev,
			content: value,
		}));
	};

	const handleMethodChange = (method: string) => {
		setPotMethod(method);
		// potMakeRequest 업데이트
		setPotMakeRequest((prev) => ({
			...prev,
			voteType: method === 'normal' ? 'SELECT' : 'RANDOM',
		}));
	};

	const handleTimeChange = (type: 'fromTime' | 'toTime' | 'mealTime', value: string) => {
		const formattedTime = getDisplayTime(value);

		switch (type) {
			case 'fromTime':
				setStartTime(value);
				setPotMakeRequest((prev) => ({ ...prev, fromTime: formattedTime }));
				break;
			case 'toTime':
				setAnnounceTime(value);
				setPotMakeRequest((prev) => ({ ...prev, toTime: formattedTime }));
				break;
			case 'mealTime':
				setEatTime(value);
				setPotMakeRequest((prev) => ({ ...prev, mealTime: formattedTime }));
				break;
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// 최종 potMakeRequest 데이터 구성
		const finalRequest: IPotMakeRequest = {
			...potMakeRequest,
			title: potTitle,
			content: potDesc,
			restaurants: {
				ids: selectedRestaurants.map((restaurant) => ({
					restaurantId: restaurant.teamRestaurantId,
				})),
			},
		};

		console.log('Final Pot Make Request:', finalRequest);
		navigate('/pot-make-success');
	};

	const navigate = useNavigate();

	const getDisplayTime = (value: string) => {
		const [ampm, time] = value.split(' ');
		const [hour, minute] = time.split(':');
		return formatTo24AMPM(ampm, Number(hour), Number(minute));
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
			// potMakeRequest 업데이트
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

	// 선택된 식당 삭제 함수
	const handleRemoveRestaurant = (restaurantId: number) => {
		const updatedRestaurants = selectedRestaurants.filter((r) => r.teamRestaurantId !== restaurantId);
		setSelectedRestaurants(updatedRestaurants);

		// potMakeRequest 업데이트
		setPotMakeRequest((prev) => ({
			...prev,
			restaurants: {
				ids: updatedRestaurants.map((restaurant) => ({
					restaurantId: restaurant.teamRestaurantId,
				})),
			},
		}));
	};

	// 필수 필드 검증
	const isFormValid = potTitle && potMethod && potMember && selectedRestaurants.length > 0;

	return (
		<>
			{selectRestaurantPopup ? (
				<SelectRestaurantPopup onClose={handleRestaurantSelection} initialSelectedIds={selectedRestaurants.map((r) => r.teamRestaurantId)} />
			) : (
				<>
					<NavBar variant="iconWithText" leftIcon="back" leftText="팟 만들기" onLeftIconClick={() => navigate('/pot')} />
					<div className="bg-gray-02 min-h-screen ">
						<form className="p-4.5 flex flex-col gap-6 " onSubmit={handleSubmit}>
							<div className="py-6 px-4 rounded-[20px] bg-white">
								<Input label="팟 제목" isEssential id="potTitle" placeholder="제목을 입력해 주세요" value={potTitle} onChange={handlePotTitleChange} />
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
									<div className="mb-4 p-4 bg-gray-02 rounded-[12px]">
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
															{restaurant.restaurantCategory}
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
							<div className="py-6 px-4 rounded-[20px] bg-white ">
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
												<TimePicker value={startTime} onChange={(value) => handleTimeChange('fromTime', value)} displayValue={getDisplayTime(startTime)} />
											</div>
											<div className="flex justify-between items-center border-b border-gray-02 pb-2.5 pt-2.5">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
													투표 발표 시간
												</Typography>
												<TimePicker value={announceTime} onChange={(value) => handleTimeChange('toTime', value)} displayValue={getDisplayTime(announceTime)} />
											</div>
											<div className="flex justify-between items-center">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="pt-2.5">
													식사 시간
												</Typography>
												<TimePicker value={eatTime} onChange={(value) => handleTimeChange('mealTime', value)} displayValue={getDisplayTime(eatTime)} />
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
												<TimePicker value={announceTime} onChange={(value) => handleTimeChange('toTime', value)} displayValue={getDisplayTime(announceTime)} />
											</div>
											<div className="flex justify-between items-center">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="pt-2.5">
													식사 시간
												</Typography>
												<TimePicker value={eatTime} onChange={(value) => handleTimeChange('mealTime', value)} displayValue={getDisplayTime(eatTime)} />
											</div>
										</div>
									)}
								</div>
							</div>

							{/* 팟 설명 */}
							<div className="py-6 px-4 rounded-[20px] bg-white relative">
								<FormLabel id="potMember" label="팟 설명" />
								<textarea
									className="w-full h-[79px]
							border border-gray-04 rounded-[12px] p-[15px] mt-[10px] placeholder:text-gray-06 text-[16px]"
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
