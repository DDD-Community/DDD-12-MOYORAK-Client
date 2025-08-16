import { useEffect, useState } from 'react';

import profile from '@/assets/profile.png';
import Icon from '@/components/Icon';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import FilterButton from '../FilterButton/FilterButton';
import Typography from '../Typography';

export interface ITeamMember {
	id: number;
	name: string;
	team: string;
	isHonbapMode?: boolean; // 혼밥모드 여부
}

interface IPotDropdownProps {
	isOpen: boolean;
	selectedMembers: ITeamMember[];
	onChangeOpen: () => void;
	onChange: (selected: ITeamMember[]) => void;
	optionList: ITeamMember[];
	placeholder?: string;
	onComplete?: () => void; // 선택 완료 콜백
}

const PotDropdown = ({ isOpen, selectedMembers, onChange, onChangeOpen, optionList, placeholder, onComplete }: IPotDropdownProps) => {
	// 임시 선택 상태 (드롭다운 내에서만 사용)
	const [tempSelectedMembers, setTempSelectedMembers] = useState<ITeamMember[]>(selectedMembers);

	// 드롭다운이 열릴 때마다 현재 선택된 멤버로 임시 상태 초기화
	useEffect(() => {
		if (isOpen) {
			setTempSelectedMembers(selectedMembers);
		}
	}, [isOpen, selectedMembers]);

	const tempSelectedIds = tempSelectedMembers.map((m) => m.id);

	const totalSelectableMembers = optionList.length;

	const handleSelect = (member: ITeamMember) => {
		// 혼밥모드인 경우 선택 불가
		if (member.isHonbapMode) return;

		// 임시 선택 상태에서 토글
		const isSelected = tempSelectedIds.includes(member.id);
		if (isSelected) {
			setTempSelectedMembers(tempSelectedMembers.filter((m) => m.id !== member.id));
		} else {
			setTempSelectedMembers([...tempSelectedMembers, member]);
		}
	};

	const handleRemove = (member: ITeamMember) => {
		onChange(selectedMembers.filter((m) => m.id !== member.id));
	};

	const handleClearAll = () => {
		setTempSelectedMembers([]);
	};

	const handleComplete = () => {
		// 임시 선택 상태를 실제 선택 상태로 반영
		onChange(tempSelectedMembers);
		onComplete?.();
		onChangeOpen(); // 드롭다운 닫기
	};

	return (
		<div className="relative w-full mb-2.5">
			<button
				type="button"
				onClick={onChangeOpen}
				className="w-full px-5 py-[13px] rounded-[20px] text-left border border-gray-04 bg-white mb-[7px] flex justify-between items-center"
			>
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					{placeholder}
				</Typography>
				<Icon name={isOpen ? 'categorySelectClose' : 'selectOpen'} width={18} height={18} />
			</button>

			{/* 드롭다운 리스트 */}
			{isOpen && (
				<div className="absolute z-10 w-full bg-white border border-gray-04 rounded-[20px] overflow-hidden">
					<div className="max-h-60 overflow-y-auto scrollbar-none">
						{optionList.length === 0 ? (
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="px-4 py-3">
								팀원이 없습니다
							</Typography>
						) : (
							optionList.map((member) => {
								const isSelected = tempSelectedIds.includes(member.id);
								return (
									<button
										key={member.id}
										type="button"
										onClick={() => handleSelect(member)}
										disabled={member.isHonbapMode}
										className={`w-full px-5 py-3.75 text-left flex items-center ${FONT_VARIANT.header04} text-gray-08 ${
											member.isHonbapMode ? 'cursor-not-allowed opacity-60' : 'hover:bg-primary-200 cursor-pointer'
										}`}
									>
										<img src={profile} alt="profile" className="w-10 h-10 rounded-full mr-2" />
										<div className="flex flex-col flex-1">
											<Typography variant={FONT_VARIANT.body01} fontColor={member.isHonbapMode ? PALETTE.gray06 : PALETTE.gray10} className="font-semibold">
												{member.name}
											</Typography>
											<Typography variant={FONT_VARIANT.caption01} fontColor={member.isHonbapMode ? PALETTE.gray06 : PALETTE.gray07}>
												{member.team}
											</Typography>
										</div>
										{/* 체크박스 */}
										<div
											className={`w-5 h-5 border-1 rounded flex items-center justify-center ${
												member.isHonbapMode ? 'border-gray-05 bg-gray-02' : isSelected ? 'border-primary-200 bg-primary-200' : 'border-gray-05 bg-white'
											}`}
										>
											{isSelected && !member.isHonbapMode && <Icon name="check" size={12} className="text-white" />}
										</div>
									</button>
								);
							})
						)}
					</div>

					{/* 하단 버튼 영역 */}
					<div className="border-t border-gray-04 px-5 py-4 flex items-center justify-between">
						<div className="flex items-center gap-0.75">
							<Typography variant={FONT_VARIANT.label01} fontColor={tempSelectedMembers.length > 0 ? PALETTE.gray09 : PALETTE.gray07}>
								{tempSelectedMembers.length}
							</Typography>
							<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07}>
								of {totalSelectableMembers}
							</Typography>
						</div>

						<div className="flex gap-3.5">
							<button type="button" onClick={handleClearAll}>
								<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.primary300} className="font-medium">
									전체 삭제
								</Typography>
							</button>
							<FilterButton variant="active" borderRadius="17" onClick={handleComplete}>
								선택 완료
							</FilterButton>
						</div>
					</div>
				</div>
			)}

			{/* 선택된 팀원 리스트 */}
			{selectedMembers.length > 0 && (
				<div className="mt-3 flex flex-col gap-3">
					{selectedMembers.map((member) => (
						<div key={member.id} className="flex items-center justify-between p-[5px]">
							<div className="flex items-center gap-2">
								<img src={profile} alt="profile" className="w-10 h-10 rounded-full mr-2" />
								<div className="flex flex-col">
									<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
										{member.name}
									</Typography>
									<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
										{member.team}
									</Typography>
								</div>
							</div>
							<button onClick={() => handleRemove(member)}>
								<Icon name="close" size={20} />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default PotDropdown;
