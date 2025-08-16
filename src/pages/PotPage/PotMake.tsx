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
	const [isToggle, setIsToggle] = useState(false);
	const [potDesc, setPotDesc] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [selectedMembers, setSelectedMembers] = useState<ITeamMember[]>([]);
	const [optionList, _] = useState<ITeamMember[]>(MOCK_TEAM_MEMBER);

	const [startTime, setStartTime] = useState('오전 11:30');
	const [announceTime, setAnnounceTime] = useState('오전 12:00');
	const [eatTime, setEatTime] = useState('오전 12:00');

	const [selectRestaurantPopup, setSelectRestaurantPopup] = useState(false);

	const handleChangeOpen = () => {
		setIsOpen(!isOpen);
	};

	const handleChangeMembers = (value: ITeamMember[]) => {
		setSelectedMembers(value);
	};

	const handleToggleChange = (checked: boolean) => {
		setIsToggle(checked);
	};

	const handlePotTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPotTitle(e.target.value);
	};

	const handlePotMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPotMember(e.target.value);
	};

	const handlePotDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPotDesc(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		navigate('/pot-make-success');
	};

	const navigate = useNavigate();

	const getDisplayTime = (value: string) => {
		const [ampm, time] = value.split(' ');
		const [hour, minute] = time.split(':');
		return formatTo24AMPM(ampm, Number(hour), Number(minute));
	};

	return (
		<>
			{selectRestaurantPopup ? (
				<SelectRestaurantPopup onClose={() => setSelectRestaurantPopup(false)} />
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
									*최대 5개까지 추가할 수 있습니다.
								</Typography>

								<Button variant="general" className="flex items-center justify-center" onClick={() => setSelectRestaurantPopup(true)}>
									<Icon name="restaurantPlusButton" />
								</Button>
							</div>

							{/* 방식 선택 */}
							<div className="py-6 px-4 rounded-[20px] bg-white ">
								<FormLabel id="potMethod" label="방식 선택" isEssential />
								<div className="flex flex-col mt-[15px]">
									<Radio label="일반 투표" checked={potMethod === 'normal'} onChange={() => setPotMethod('normal')} value="normal" name="potMethod" />
									<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07} className="mt-0.25 mb-3 ml-7">
										팀원과 함께 투표로 식당을 결정해요
									</Typography>
									{potMethod === 'normal' && (
										<div className="rounded-[12px] border border-gray-04 px-5 py-4.25 flex flex-col my-1.25 mb-3.75">
											<div className="flex justify-between items-center border-b border-gray-02 pb-2.5">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
													투표 시작 시간
												</Typography>
												<TimePicker value={startTime} onChange={setStartTime} displayValue={getDisplayTime(startTime)} />
											</div>
											<div className="flex justify-between items-center border-b border-gray-02 pb-2.5 pt-2.5">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
													투표 발표 시간
												</Typography>
												<TimePicker value={announceTime} onChange={setAnnounceTime} displayValue={getDisplayTime(announceTime)} />
											</div>
											<div className="flex justify-between items-center">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="pt-2.5">
													식사 시간
												</Typography>
												<TimePicker value={eatTime} onChange={setEatTime} displayValue={getDisplayTime(eatTime)} />
											</div>
										</div>
									)}
									<Radio label="랜덤 추첨" checked={potMethod === 'random'} onChange={() => setPotMethod('random')} value="random" name="potMethod" />
									<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07} className="mt-0.25 mb-3 ml-7">
										랜덤으로 식당을 추첨해줘요
									</Typography>
									{potMethod === 'random' && (
										<div className="rounded-[12px] border border-gray-04 px-5 py-4.25 flex flex-col gap-2">
											<div className="flex justify-between items-center border-b border-gray-02 pb-2.5">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
													랜덤 발표 시간
												</Typography>
												<TimePicker value={announceTime} onChange={setAnnounceTime} displayValue={getDisplayTime(announceTime)} />
											</div>
											<div className="flex justify-between items-center">
												<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="pt-2.5">
													식사 시간
												</Typography>
												<TimePicker value={eatTime} onChange={setEatTime} displayValue={getDisplayTime(eatTime)} />
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
								<Button variant={!potTitle || !potMethod || !potMember ? 'disabled' : 'active'}>등록하기</Button>
							</div>
						</form>
					</div>
				</>
			)}
		</>
	);
};

export default PotMake;
