import { useState } from 'react';

import Input from '@/components/Input/Input';
import NavBar from '@/components/NavBar/NavBar';

const PotMake = () => {
	const [potTitle, setPotTitle] = useState('');
	const [potMember, setPotMember] = useState('');
	const [potMethod, setPotMethod] = useState('');

	const handlePotTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPotTitle(e.target.value);
	};

	const handlePotMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPotMember(e.target.value);
	};

	const handlePotMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPotMethod(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(potTitle, potMember, potMethod);
	};

	return (
		<>
			<NavBar variant="iconWithText" leftIcon="back" leftText="팟 만들기" />
			<div className="bg-gray-02 min-h-screen py-0">
				<form className="p-4.5 flex flex-col gap-6 " onSubmit={handleSubmit}>
					<div className="py-6 px-4 rounded-[20px] bg-white">
						<Input
							label="팟 제목"
							isEssential
							id="potTitle"
							placeholder="제목을 입력해 주세요"
							className="text-[15px] font-semibold"
							value={potTitle}
							onChange={handlePotTitleChange}
						/>
					</div>

					{/* 팀원 선택 */}
					<div className="py-6 px-4 rounded-[20px] bg-white">
						<label className="block text-[15px] font-semibold text-gray-900 mb-1" htmlFor="potMember">
							팀원 선택 <span className="text-danger-01">*</span>
						</label>
						<div className="text-xs text-gray-400 mb-3">*이 선택 시 모든 팀 인원이 참가할 수 있습니다.</div>
						<div className="flex flex-col gap-2">
							<label className="flex items-center gap-2">
								<input type="radio" name="team" className="accent-primary-200" id="potMember" value="none" onChange={handlePotMemberChange} />
								<span className="text-[15px] text-gray-700">팀원 미선택</span>
								<div className="w-full h-full bg-gray-03 rounded-[10px] flex items-center justify-center">
									<div className="w-full h-full bg-gray-03 rounded-[10px]" />
								</div>
							</label>
							<label className="flex items-center gap-2">
								<input type="radio" name="team" className="accent-primary-200" id="potMember" value="select" onChange={handlePotMemberChange} />
								<span className="text-[15px] text-gray-700">팀원 선택</span>
								<div className="w-full h-full bg-gray-03 rounded-[10px]">
									<div className="w-full h-full bg-gray-03 rounded-[10px]" />
								</div>
							</label>
						</div>
					</div>

					{/* 식당 선택 */}
					<div className="py-6 px-4 rounded-[20px] bg-white">
						<label className="block text-[15px] font-semibold text-gray-900 mb-1" htmlFor="potRestaurant">
							식당 선택 <span className="text-danger-01">*</span>
						</label>
						<div className="text-xs text-gray-400 mb-3">
							*팀 내 등록된 맛집에서만 추가가 가능합니다.
							<br />
							*최대 5개까지 추가할 수 있습니다.
						</div>
						<button
							type="button"
							id="potRestaurant"
							className="w-full h-12 flex items-center justify-center border border-gray-300 rounded-[10px] bg-gray-50 text-2xl text-gray-400"
						>
							+
						</button>
					</div>

					{/* 방식 선택 */}
					<div className="py-6 px-4 rounded-[20px] bg-white">
						<label className="block text-[15px] font-semibold text-gray-900 mb-1" htmlFor="potMethod">
							방식 선택 <span className="text-danger-01">*</span>
						</label>
						<div className="flex flex-col gap-2 mt-2">
							<label className="flex items-center gap-2">
								<input type="radio" name="method" className="accent-primary-200" id="potMethod" value="normal" onChange={handlePotMethodChange} />
								<span className="text-[15px] text-gray-700">일반 투표</span>
							</label>
							<label className="flex items-center gap-2">
								<input type="radio" name="method" className="accent-primary-200" id="potMethod" value="random" onChange={handlePotMethodChange} />
								<span className="text-[15px] text-gray-700">랜덤 추첨</span>
							</label>
						</div>
					</div>

					{/* 팟 설명 */}
					<div className="py-6 px-4 rounded-[20px] bg-white">
						<Input label="팟 설명" id="potDesc" placeholder="팟 설명을 입력해주세요" className="text-[15px]" maxLength={50} />
						<div className="text-right text-xs text-gray-400 mt-1">0/50</div>
					</div>

					{/* 버튼 */}
					<button type="submit" className="w-full h-12 rounded-[40px] bg-gray-300 text-white text-[17px] font-semibold" disabled>
						팟 만들기
					</button>
				</form>
			</div>
		</>
	);
};

export default PotMake;
