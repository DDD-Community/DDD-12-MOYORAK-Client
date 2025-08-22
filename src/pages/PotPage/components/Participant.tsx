import { useEffect, useState } from 'react';

import { get } from '@/apis';
import noParticipant from '@/assets/noParticipant.png';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { BUTTON_TEXT } from '@/constants/data.constant';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface IParticipantResponse {
	userId: number;
	userName: string;
	profileImage: string;
	mealTags: {
		dislikes: string[];
		allergies: string[];
	};
}

interface ParticipantProps {
	timeStatus: 'before_start' | 'voting_active' | 'after_end';
	isParticipated: boolean;
	onParticipateClick: () => void;
}

const Participant = ({ timeStatus, isParticipated, onParticipateClick }: ParticipantProps) => {
	const [expandedParticipant, setExpandedParticipant] = useState<number | null>(null);
	const [participantList, setParticipantList] = useState<IParticipantResponse[]>([]);

	const toggleParticipantExpansion = (participantId: number) => {
		setExpandedParticipant((prev) => {
			const newValue = prev === participantId ? null : participantId;
			return newValue;
		});
	};

	// 투표 상태에 따른 버튼 텍스트
	const getButtonText = (): string => {
		if (timeStatus === 'after_end') {
			return BUTTON_TEXT.voteEnded;
		}

		if (!isParticipated) {
			return BUTTON_TEXT.participate;
		}

		const buttonTextMap = {
			before_start: BUTTON_TEXT.participated,
			voting_active: BUTTON_TEXT.vote,
		};

		return buttonTextMap[timeStatus] || BUTTON_TEXT.participate;
	};

	// 버튼 비활성화 여부
	const isButtonDisabled = (): boolean => {
		if (timeStatus === 'after_end') return true;
		if (isParticipated && timeStatus === 'before_start') return true;
		return false;
	};

	// 버튼 스타일 클래스
	const getButtonClassName = (): string => {
		return isButtonDisabled() ? 'bg-gray-03 text-gray-08' : 'bg-[#BEEE05] text-gray-10';
	};

	const partyId = 1;
	const teamId = 1;

	const getParticipantList = async () => {
		try {
			const response = await get<IParticipantResponse[]>(`/teams/${teamId}/parties/${partyId}/party-attendees`);
			setParticipantList(response as IParticipantResponse[]);
		} catch (error) {
			console.error('팟 참여자 목록 조회 실패:', error);
			setParticipantList([]);
		}
	};

	useEffect(() => {
		getParticipantList();
	}, []);

	return (
		<div className="px-4.5 bg-[#F5F5F5] pt-5 h-screen">
			<div className="flex items-center justify-between mb-5">
				<div className="flex items-center gap-1">
					<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="font-medium">
						현재 참여중인 사람
					</Typography>
					<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray10} className="font-semibold">
						{participantList.length}명
					</Typography>
				</div>
				<div className="relative group">
					<Icon name="information" className="cursor-pointer" />
					<div className="absolute right-[-10px] mt-3 px-3 py-2.5 bg-gray-09 rounded-[10px] z-10 w-[267px] opacity-0 group-hover:opacity-100 ">
						<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.white}>
							더보기 버튼을 누르면 참여자의 알러지 정보와 비선호 음식을 볼 수 있어요!
						</Typography>
						<div className="absolute bottom-full right-3 border-l-10 border-r-10 border-t-10 border-transparent border-t-gray-09 rotate-180" />
					</div>
				</div>
			</div>

			{participantList.length > 0 ? (
				<div className="space-y-3.25 mb-6">
					{participantList.map((participant) => {
						const isExpanded = expandedParticipant === participant.userId;

						return (
							<div key={participant.userId} className="bg-white rounded-[10px] border border-gray-03 px-3.75 py-5">
								<button
									onClick={() => toggleParticipantExpansion(participant.userId)}
									className="w-full flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
									type="button"
								>
									<div className="flex items-center gap-2.5 pointer-events-none">
										<div className="w-7 h-7 border border-gray-04 bg-gray-02 rounded-full flex items-center justify-center">
											{participant.profileImage ? (
												<img src={participant.profileImage} alt={participant.userName} className="w-full h-full object-cover rounded-full" />
											) : (
												<Icon name="avatar" size={20} className="text-gray-06" />
											)}
										</div>
										<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
											{participant.userName}
										</Typography>
									</div>
									<Icon
										name="selectOpen"
										size={14}
										className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} pointer-events-none`}
									/>
								</button>

								{isExpanded && (
									<div className="pt-5 space-y-3.75">
										{participant.mealTags ? (
											<>
												{participant.mealTags.allergies && participant.mealTags.allergies.length > 0 && (
													<div>
														<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray10} className="font-semibold mb-2">
															알러지 음식
														</Typography>
														<div className="flex flex-wrap gap-2">
															{participant.mealTags.allergies.map((item, allergyIndex) => (
																<div key={`allergy-${participant.userId}-${allergyIndex}`} className="px-3.5 py-1.5 rounded-[17px] border border-gray-05 ">
																	<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07} className="font-medium">
																		{item}
																	</Typography>
																</div>
															))}
														</div>
													</div>
												)}
												{participant.mealTags.dislikes && participant.mealTags.dislikes.length > 0 && (
													<div>
														<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold mb-2">
															비선호 음식
														</Typography>
														<div className="flex flex-wrap gap-2">
															{participant.mealTags.dislikes.map((item, dislikeIndex) => (
																<div key={`dislike-${participant.userId}-${dislikeIndex}`} className="px-3.5 py-1.5 rounded-[17px] border border-gray-05">
																	<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07} className="font-medium">
																		{item}
																	</Typography>
																</div>
															))}
														</div>
													</div>
												)}
												{(!participant.mealTags.allergies || participant.mealTags.allergies.length === 0) &&
													(!participant.mealTags.dislikes || participant.mealTags.dislikes.length === 0) && (
														<div className="pt-5">
															<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray06} className="text-center">
																알러지나 비선호 음식 정보가 없습니다.
															</Typography>
														</div>
													)}
											</>
										) : (
											<div className="pt-5">
												<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray06} className="text-center">
													알러지나 비선호 음식 정보가 없습니다.
												</Typography>
											</div>
										)}
									</div>
								)}
							</div>
						);
					})}
				</div>
			) : (
				<div className="flex flex-col items-center mt-17.5">
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="mb-5.25 text-center">
						참여한 사람이 아직 없어요! <br />
						먼저 참여해보는 건 어떠세요?
					</Typography>
					<img src={noParticipant} alt="noParticipant" className="w-30 h-30.75" />
				</div>
			)}

			<div className="fixed bottom-7.5 w-full left-0 px-4.5">
				<Button
					variant={isButtonDisabled() ? 'disabled' : 'active'}
					onClick={onParticipateClick}
					disabled={isButtonDisabled()}
					className={getButtonClassName()}
				>
					{getButtonText()}
				</Button>
			</div>
		</div>
	);
};

export default Participant;
