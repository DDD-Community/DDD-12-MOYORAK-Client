import { type Dispatch, type SetStateAction, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutationTeamInvitation } from '@/apis/useMutationTeamInvitation';
import invite from '@/assets/invite.png';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import useDialogHandler from '@/hooks/useDialogHandler';

interface IUser {
	companyId: number;
	teamId: number;
	teamRole: string;
}

interface IMainNavBarProps {
	onCopy: Dispatch<SetStateAction<boolean>>;
	user: IUser;
}

const MainNavSideBar = ({ onCopy, user }: IMainNavBarProps) => {
	const teamId = localStorage.getItem('teamId');
	const { mutate, data } = useMutationTeamInvitation(Number(teamId));
	const isAdmin = user.teamRole === '관리자';

	const navigate = useNavigate();

	const { open, handleOpen, handleClose } = useDialogHandler();

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
		<>
			<div className="absolute right-2 top-11 w-[160px] bg-white shadow-lg rounded-[8px] py-2 z-50 max-w-120 mx-auto ">
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
				<button
					className="w-full text-left px-4 py-2 hover:bg-gray-100 "
					onClick={() => (isAdmin ? navigate('/admin-team') : alert('관리자만 접근할 수 있습니다.'))}
				>
					<Typography variant={FONT_VARIANT.label01} className="font-medium">
						팀원 관리
					</Typography>
				</button>
			</div>
			{/* 초대 모달 */}
			{open && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center">
					<div className="absolute inset-0 bg-black/60" onClick={handleClose} />

					<div className="relative bg-white rounded-[20px] w-[271px] h-[200px] p-[18px] shadow-lg">
						<button onClick={handleClose} className="absolute top-[18px] right-[18px] w-5 h-5 flex items-center justify-center">
							<Icon name="close" className="w-5 h-5" />
						</button>

						{/* 제목 */}
						<div className="text-center mb-[7px]">
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold mt-5 ">
								우리 팀에 초대하기
							</Typography>
						</div>

						{/* 설명 텍스트 */}
						<div className="text-center mb-5">
							<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
								주소를 복사하고 공유해서
								<br />
								새로운 팀원을 초대해 보세요!
							</Typography>
						</div>

						<img src={invite} alt="초대" className="w-[175px] h-[102px] absolute bottom-45 left-1/2 -translate-x-1/2" />

						<div className="w-full h-[46px] rounded-[8px] border border-primary-200 flex items-center">
							<div className="flex-1 pl-2 pr-2">
								<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07} className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[159px]">
									{redirectUrl}
								</Typography>
							</div>
							<button className="w-[76px] h-[46px] bg-primary-200 rounded-r-[8px] flex items-center justify-center" onClick={onCopyInviteUrl}>
								<Typography variant={FONT_VARIANT.body01} className="font-semibold text-[#1F2511]">
									복사
								</Typography>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default MainNavSideBar;
