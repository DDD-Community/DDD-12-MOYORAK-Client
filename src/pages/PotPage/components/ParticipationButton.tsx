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
	voteType?: string;
	isPotCreator?: boolean;
}

const ParticipationButton = ({
	timeStatus,
	attended,
	attendable,
	isVoted = false,
	selectedRestaurantId = null,
	isLoading = false,
	onParticipateClick,
	voteType,
	isPotCreator = false,
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

		// 팟 생성자인 경우
		if (isPotCreator) {
			if (timeStatus === 'after_end') {
				return '투표가 종료되었어요';
			}
			if (voteType === 'RANDOM') {
				if (timeStatus === 'before_start') {
					return '아직 추첨이 시작되지 않았어요';
				}
				return '랜덤 추첨이 종료되었어요';
			}
			if (timeStatus === 'before_start') {
				return '아직 투표가 시작되지 않았어요';
			}

			return '투표가 종료되었어요';
		}

		// 일반 사용자인 경우
		if (!attended) {
			return BUTTON_TEXT.participate; // "참여하기"
		}

		// 참여한 사용자
		if (voteType === 'RANDOM') {
			if (timeStatus === 'before_start') {
				return BUTTON_TEXT.notStarted; // "아직 추첨이 시작되지 않았어요"
			}
			if (timeStatus === 'after_end') {
				return BUTTON_TEXT.randomEnded; // "랜덤 추첨이 종료되었어요"
			}
		}

		// 일반 투표일 때
		if (timeStatus === 'before_start') {
			return BUTTON_TEXT.participated; // "아직 투표가 시작되지 않았어요"
		}
		if (timeStatus === 'voting_active') {
			if (isVoted) {
				return BUTTON_TEXT.voteAgain; // "다시 투표하기"
			}
			// 투표하지 않은 경우, 식당 선택 여부에 따라 버튼 텍스트 결정
			if (selectedRestaurantId !== null) {
				return BUTTON_TEXT.vote; // "투표하기" (식당 선택됨)
			}
			return '투표하기'; // 식당 선택 안 됨
		}
		if (timeStatus === 'after_end') {
			return BUTTON_TEXT.voteEnded; // "투표가 종료되었어요"
		}

		return BUTTON_TEXT.participate;
	};

	// 버튼 비활성화 여부
	const isButtonDisabled = (): boolean => {
		if (isLoading) return true;
		if (!attendable) return true; // 참여할 수 없는 팟
		if (!attended) return false; // 참여하지 않은 경우 참여 가능

		// RANDOM 타입일 때는 참여 후에만 버튼 비활성화
		if (voteType === 'RANDOM') {
			// 참여한 경우, 모든 상태에서 버튼 비활성화
			return true;
		}

		// 일반 투표일 때
		if (timeStatus === 'before_start') return true; // 참여했지만 투표 전
		if (timeStatus === 'voting_active') {
			if (isVoted) return false; // 투표했지만 다시 투표 가능
			// 투표하지 않은 경우, 식당 선택 여부에 따라 버튼 활성화/비활성화
			return selectedRestaurantId === null; // 식당 선택 안 함 → 버튼 비활성화
		}
		if (timeStatus === 'after_end') return true; // 투표 종료 후
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
