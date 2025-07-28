import Icon from '@/components/Icon';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import Typography from '../Typography';

export interface ITeamMember {
	id: number;
	name: string;
	team: string;
}

interface IPotDropdownProps {
	isOpen: boolean;
	selectedMembers: ITeamMember[];
	onChangeOpen: () => void;
	onChange: (selected: ITeamMember[]) => void;
	optionList: ITeamMember[];
	placeholder?: string;
}

const PotDropdown = ({ isOpen, selectedMembers, onChange, onChangeOpen, optionList, placeholder }: IPotDropdownProps) => {
	const selectedIds = selectedMembers.map((m) => m.id);
	const availableMembers = optionList.filter((m) => !selectedIds.includes(m.id));

	const handleSelect = (member: ITeamMember) => {
		onChange([...selectedMembers, member]);
	};
	const handleRemove = (member: ITeamMember) => {
		onChange(selectedMembers.filter((m) => m.id !== member.id));
	};

	return (
		<div className="relative w-full mb-2.5">
			<button
				type="button"
				onClick={onChangeOpen}
				className="w-full px-5 py-[13px] rounded-[20px] text-left border border-gray-04 bg-white mb-[7px] flex justify-between items-center"
			>
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					{selectedMembers.length === 0 ? placeholder || '선택하세요' : '팀원 선택 완료'}
				</Typography>
				<Icon name={isOpen ? 'selectClose' : 'selectOpen'} width={18} height={18} />
			</button>

			{/* 드롭다운 리스트 */}
			{isOpen && (
				<div className="absolute z-10 w-full bg-white border border-gray-04 rounded-[20px] max-h-60 overflow-y-auto scrollbar-none">
					{availableMembers.length === 0 ? (
						<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="px-4 py-3">
							선택할 팀원이 없습니다
						</Typography>
					) : (
						availableMembers.map((member) => (
							<button
								key={member.id}
								type="button"
								onClick={() => handleSelect(member)}
								className={`w-full px-5 py-3.75 text-left hover:bg-primary-200 ${FONT_VARIANT.header04} text-gray-08 flex items-center`}
							>
								<Icon name="avatar" width={40} height={40} className="mr-2" />
								<div className="flex flex-col">
									<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
										{member.name}
									</Typography>
									<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
										{member.team}
									</Typography>
								</div>
							</button>
						))
					)}
				</div>
			)}

			{/* 선택된 팀원 리스트 */}
			{selectedMembers.length > 0 && (
				<div className="mt-3 flex flex-col gap-3">
					{selectedMembers.map((member) => (
						<div key={member.id} className="flex items-center justify-between p-[5px]">
							<div className="flex items-center gap-2">
								<Icon name="avatar" width={40} height={40} />
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
