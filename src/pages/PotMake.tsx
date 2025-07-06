import { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '@/components/Button/Button';
import Icon from '@/components/Icon';
import FormLabel from '@/components/Input/FormLabel';
import Input from '@/components/Input/Input';
import NavBar from '@/components/NavBar/NavBar';
import Radio from '@/components/Radio/Radio';
import Switch from '@/components/Switch';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const PotMake = () => {
	const [potTitle, setPotTitle] = useState('');
	const [potMember, setPotMember] = useState('');
	const [potMethod, setPotMethod] = useState('');
	const [isToggle, setIsToggle] = useState(false);
	const [potDesc, setPotDesc] = useState('');
	const handleToggleChange = (checked: boolean) => {
		setIsToggle(checked);
	};

	const handlePotTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPotTitle(e.target.value);
	};

	const handlePotMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPotMember(e.target.value);
	};

	const handlePotMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPotMethod(e.target.value);
	};

	const handlePotDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPotDesc(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<>
			<NavBar variant="iconWithText" leftIcon="back" leftText="팟 만들기" />
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
							<div className="flex justify-between">
								<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07} className="mt-0.5 mb-5 ml-7">
									선택 인원 외 자율참여 허용하기
								</Typography>
								<Switch size="S" checked={isToggle} onCheckedChange={handleToggleChange} />
							</div>
						)}

						{/* 
						드롭다운 컴포넌트 추가
						*/}
					</div>

					{/* 식당 선택 */}
					<div className="py-6 px-4 rounded-[20px] bg-white">
						<FormLabel id="potRestaurant" label="식당 선택" isEssential />
						<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray06} className="mt-[3px] mb-[15px]">
							*팀 내 등록된 맛집에서만 추가가 가능합니다.
							<br />
							*최대 5개까지 추가할 수 있습니다.
						</Typography>

						<Link to="/select-restaurant">
							<Button variant="general" className="flex items-center justify-center">
								<Icon name="restaurantPlusButton" />
							</Button>
						</Link>
					</div>

					{/* 방식 선택 */}
					<div className="py-6 px-4 rounded-[20px] bg-white">
						<FormLabel id="potMember" label="방식 선택" isEssential />

						<div className="flex flex-col gap-2.5 mt-[15px]">
							<Radio label="일반 투표" checked={potMethod === 'normal'} onChange={handlePotMethodChange} value="normal" name="potMethod" />
							<Radio label="랜덤 추첨" checked={potMethod === 'random'} onChange={handlePotMethodChange} value="random" name="potMethod" />
						</div>
					</div>

					{/* 팟 설명 */}
					<div className="py-6 px-4 rounded-[20px] bg-white">
						<FormLabel id="potMember" label="팟 설명" />
						<textarea
							className="w-full h-[79px]
							relative
							border border-gray-04 rounded-[12px] p-[15px] mt-[10px] placeholder:text-gray-06 text-[16px] placeholder:text-gray-06"
							placeholder="팟 설명을 입력해주세요"
							maxLength={50}
							value={potDesc}
							onChange={handlePotDescChange}
						/>
						<div className="absolute right-10 text-xs text-gray-400">
							<Typography as="span" variant={FONT_VARIANT.label01} fontColor={PALETTE.gray10}>
								{potDesc.length}
							</Typography>
							<Typography as="span" variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07}>
								/50
							</Typography>
						</div>
					</div>

					{/* 버튼 */}
					<Button variant={!potTitle || !potMethod || !potMember ? 'disabled' : 'active'}>팟 만들기</Button>
				</form>
			</div>
		</>
	);
};

export default PotMake;
