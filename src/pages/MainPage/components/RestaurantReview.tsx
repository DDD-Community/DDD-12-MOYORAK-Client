import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useMutationDeleteTeamRestaurant } from '@/apis/useMutationDeleteTeamRestaurant';
import type { ITeamRestaurantItem } from '@/apis/useQueryTeamRestaurantList';
import reviewDelete from '@/assets/reviewDelete.png';
import Button from '@/components/Button/Button';
import CustomDialog from '@/components/Dialog/CustomDialog';
import Icon from '@/components/Icon';
import { CustomToast } from '@/components/Toast/BaseToaster';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useCategoryMapping } from '@/hooks/useCategoryMapping';

const RestaurantReview = ({ item }: { item: ITeamRestaurantItem }) => {
	const navigate = useNavigate();
	const { getCategoryDisplay } = useCategoryMapping();
	const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const teamId = localStorage.getItem('teamId') ?? '';
	const { mutate: deleteTeamRestaurant, isPending } = useMutationDeleteTeamRestaurant(teamId);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (isOptionMenuOpen) {
				const target = event.target as Element;
				if (!target.closest('.option-menu-container')) {
					setIsOptionMenuOpen(false);
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOptionMenuOpen]);

	const handleMoreClick = () => {
		setIsOptionMenuOpen(!isOptionMenuOpen);
	};

	const handleEdit = () => {
		setIsOptionMenuOpen(false);
		navigate(`/restaurant-edit/${item.teamRestaurantId}`, {
			state: {
				restaurant: item,
			},
		});
	};

	const handleDelete = () => {
		setIsOptionMenuOpen(false);
		setIsDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		deleteTeamRestaurant(item.teamRestaurantId.toString(), {
			onSuccess: () => {
				toast(<CustomToast title="식당 삭제가 완료되었어요." icon="check" />);
				setIsDeleteDialogOpen(false);
			},
			onError: (error) => {
				console.error('팀 식당 삭제 실패:', error);
				toast(<CustomToast title="식당 삭제에 실패했습니다." icon="invalidInput" />);
				setIsDeleteDialogOpen(false);
			},
		});
	};

	const handleCancelDelete = () => {
		setIsDeleteDialogOpen(false);
	};

	const handleRestaurantClick = () => {
		navigate(`/restaurant-detail/${item.teamRestaurantId}`);
	};

	return (
		<>
			<li className="flex items-start gap-3.75 pb-3.75 border-b border-gray-02">
				<img src={item.reviewImagePath} alt="식당 사진" className="w-[71px] h-[71px] object-cover rounded-md cursor-pointer" onClick={handleRestaurantClick} />

				<div className="flex flex-1 flex-col justify-between">
					<div className="flex justify-between items-center">
						<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
							{getCategoryDisplay(item.restaurantCategory)}
						</Typography>
						<div className="relative option-menu-container">
							<Icon name="more" width={24} height={24} className="cursor-pointer" onClick={handleMoreClick} />
							{isOptionMenuOpen && (
								<div className="absolute right-0 top-6 bg-white border border-gray-03 rounded-[8px] shadow-[0px_0px_14px_0px_rgba(102,102,102,0.20)] z-10 w-30">
									<button onClick={handleEdit} className="w-full px-3.75 py-2.5 text-left hover:bg-gray-01 transition-colors border-b border-gray-02">
										<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray10}>
											수정하기
										</Typography>
									</button>
									<button onClick={handleDelete} className="w-full px-3.75 py-2.5 text-left hover:bg-gray-01 transition-colors">
										<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray10}>
											삭제하기
										</Typography>
									</button>
								</div>
							)}
						</div>
					</div>

					<Typography variant={FONT_VARIANT.header03} className="font-semibold mb-[3px] cursor-pointer" onClick={handleRestaurantClick}>
						{item.restaurantName}
					</Typography>

					<div className="flex items-center gap-1 text-gray-600">
						<Icon name="star" width={14} height={14} />
						<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-medium">
							{item.averageReviewScore}
						</Typography>
						<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-medium">
							{`· 리뷰 ${item.reviewCount}`}
						</Typography>
					</div>
				</div>
			</li>

			{/* 삭제 확인 모달 */}
			<CustomDialog
				headerText={{
					title: '우리팀 식당 삭제하기',
					description: (
						<>
							식당 삭제를 하시면 우리 팀에 등록된
							<br />
							모든 정보가 영구적으로 삭제돼요.
						</>
					),
				}}
				onOpen={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				className="w-[271px]"
			>
				<img src={reviewDelete} alt="식당 삭제 완료" className="w-[133px] h-[128px] absolute bottom-44 left-18" />
				<div className="flex gap-2 mt-[24px]">
					<button onClick={handleCancelDelete} disabled={isPending} className="rounded-[20px] border border-gray-03 bg-white w-[89px] px-5 disabled:opacity-50">
						취소
					</button>
					<Button variant="active" onClick={handleConfirmDelete} disabled={isPending}>
						{isPending ? '삭제 중...' : '삭제하기'}
					</Button>
				</div>
			</CustomDialog>
		</>
	);
};

export default RestaurantReview;
