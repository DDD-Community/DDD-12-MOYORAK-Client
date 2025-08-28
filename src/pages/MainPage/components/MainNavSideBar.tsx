import { type Dispatch, type SetStateAction, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutationTeamInvitation } from '@/apis/useMutationTeamInvitation';
import invite from '@/assets/invite.png';
import CustomDialog from '@/components/Dialog/CustomDialog';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
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
		<div className="absolute right-2 top-11 w-[160px] bg-white shadow-lg rounded-[8px] py-2 z-50">
			<button className="w-full text-left px-4 py-2 border-b border-gray-02 hover:bg-gray-100" onClick={handleOpen}>
				<Typography variant={FONT_VARIANT.label01} className="font-medium">
					우리 팀에 초대하기
				</Typography>
			</button>
			<button className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-02" onClick={() => navigate('/restaurant-registration')}>
				<div className="flex items-center justify-between">
					<Typography variant={FONT_VARIANT.label01} className="font-medium">
						우리 팀 식당 등록
					</Typography>
					<Icon name="ourTeamRestaurantPlus" className="w-4 h-4" />
				</div>
			</button>
			<button className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-02" onClick={() => navigate('/admin-team')}>
				<Typography variant={FONT_VARIANT.label01} className="font-medium">
					팀원 관리
				</Typography>
			</button>
			<CustomDialog
				onOpen={open}
				onOpenChange={setOpen}
				className="w-[271px] h-[200px]"
				headerText={{
					title: '우리 팀에 초대하기',
					description: (
						<>
							<Icon name="close" className="w-5 h-5 absolute top-4.5 right-4.5" onClick={handleClose} />
							<img src={invite} alt="초대" className="w-[175px] h-[102px] absolute bottom-45 left-1/2 -translate-x-1/2" />
							주소를 복사하고 공유해서
							<br />
							새로운 팀원을 초대해 보세요!
						</>
					),
				}}
			>
				<div className="w-full h-[46px] rounded-[8px] border border-primary-200 flex items-center justify-center">
					<div className="pl-2">
						<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07} className="text-ellipsis overflow-hidden whitespace-nowrap">
							{redirectUrl}
						</Typography>
					</div>

					<button className="w-[76px] h-[46px] bg-primary-200 rounded-r-[8px] flex items-center justify-center ml-[-18px]" onClick={onCopyInviteUrl}>
						<Typography variant={FONT_VARIANT.body01} className="font-semibold text-[#1F2511]">
							복사
						</Typography>
					</button>
				</div>
			</CustomDialog>
		</div>
	);
};

export default MainNavSideBar;
