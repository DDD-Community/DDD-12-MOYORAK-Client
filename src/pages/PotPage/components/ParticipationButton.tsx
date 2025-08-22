import Button from '@/components/Button/Button';
import { BUTTON_TEXT } from '@/constants/data.constant';

interface ParticipationButtonProps {
	timeStatus: 'before_start' | 'voting_active' | 'after_end';
	attended: boolean;
	attendable: boolean;
	isVoted?: boolean;
	selectedRestaurantId?: number | null;
	isLoading?: boolean;
	onParticipateClick: () => void;
}

const ParticipationButton = ({
	timeStatus,
	attended,
	attendable,
	isVoted = false,
	selectedRestaurantId = null,
	isLoading = false,
	onParticipateClick,
}: ParticipationButtonProps) => {
	// 버튼 텍스트 결정
	const getButtonText = (): string => {
		if (isLoading) {
			return '처리 중...';
		}

		// 참여할 수 없는 팟인 경우
		if (!attendable) {
			return '참여할 수 없는 팟이에요';
		}

		if (timeStatus === 'after_end') {
			return BUTTON_TEXT.voteEnded;
		}

		if (!attended) {
			return BUTTON_TEXT.participate;
		}

		const buttonTextMap = {
			before_start: BUTTON_TEXT.participated,
			voting_active: isVoted ? BUTTON_TEXT.voteAgain : BUTTON_TEXT.vote,
		};

		return buttonTextMap[timeStatus] || BUTTON_TEXT.participate;
	};

	// 버튼 비활성화 여부
	const isButtonDisabled = (): boolean => {
		if (isLoading) return true;
		if (!attendable) return true; // 참여할 수 없는 팟
		if (timeStatus === 'after_end') return true;
		if (!attended) return false; // 참여하지 않은 경우 참여 가능
		if (timeStatus === 'before_start') return true; // 참여했지만 투표 전
		if (timeStatus === 'voting_active') {
			if (isVoted) return false; // 투표했지만 다시 투표 가능
			return selectedRestaurantId === null; // 식당 선택 안 함
		}
		return true;
	};

	// 버튼 스타일 클래스
	const getButtonClassName = (): string => {
		return isButtonDisabled() ? 'bg-gray-03 text-gray-08' : 'bg-[#BEEE05] text-gray-10';
	};

	return (
		<div className="fixed bottom-7.5 w-full left-0 px-4.5">
			<Button variant={isButtonDisabled() ? 'disabled' : 'active'} onClick={onParticipateClick} disabled={isButtonDisabled()} className={getButtonClassName()}>
				{getButtonText()}
			</Button>
		</div>
	);
};

export default ParticipationButton;
