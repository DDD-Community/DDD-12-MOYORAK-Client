import { type Dispatch, type SetStateAction, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutationTeamInvitation } from '@/apis/useMutationTeamInvitation';
import Button from '@/components/Button/Button';
import CustomDialog from '@/components/Dialog/CustomDialog';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT } from '@/constants/styles';
import useDialogHandler from '@/hooks/useDialogHandler';

interface IMainNavBarProps {
	onCopy: Dispatch<SetStateAction<boolean>>;
}

const MainNavSideBar = ({ onCopy }: IMainNavBarProps) => {
	const teamId = localStorage.getItem('teamId');
	const { mutate, data } = useMutationTeamInvitation(Number(teamId));

	const navigate = useNavigate();

	const { open, setOpen, handleOpen, handleClose } = useDialogHandler();

	const redirectUrl = `${window.location.href}?token=${data?.invitationToken ?? ''}`;

	useEffect(() => {
		if (!open) return;

		mutate(Number(teamId));
	}, [open]);

	const onCopyInviteUrl = async () => {
		try {
			await navigator.clipboard.writeText(redirectUrl);
		} catch (error) {
			console.error(error);
		}

		onCopy(true);
		handleClose();
	};

	return (
		<div className="absolute right-2 top-14 w-[160px] bg-white shadow-lg rounded-xl py-2 z-50">
			<button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleOpen}>
				<Typography variant={FONT_VARIANT.label01}>우리 팀에 초대하기</Typography>
			</button>
			<button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => navigate('/restaurant-registration')}>
				<Typography variant={FONT_VARIANT.label01}>우리 팀 식당 등록</Typography>
			</button>
			<button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
				<Typography variant={FONT_VARIANT.label01}>팀원 관리</Typography>
			</button>
			<CustomDialog
				onOpen={open}
				onOpenChange={setOpen}
				headerText={{
					title: '우리팀에 초대하기',
					description: (
						<>
							주소를 복사하고 공유해서
							<br />
							새로운 팀원을 초대해 보세요!
						</>
					),
				}}
			>
				<Input
					placeholder="주소 url"
					className="flex-1 border-none rounded-none focus:ring-0"
					value={redirectUrl}
					rightButton={
						<Button variant="active" className="w-[76px]" onClick={onCopyInviteUrl}>
							복사
						</Button>
					}
				/>
			</CustomDialog>
		</div>
	);
};

export default MainNavSideBar;
