import { useState } from 'react';

import noParticipant from '@/assets/noParticipant.png';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const SAMPLE_PARTICIPANTS = [
	{
		id: 1,
		name: '나',
		team: 'Web2팀',
		preferences: {
			liked: ['새우', '게'],
			disliked: ['돼지고기', '닭고기'],
		},
	},
	{
		id: 2,
		name: '최지현',
		team: 'Web2팀',
		preferences: {
			liked: ['소고기', '양고기'],
			disliked: ['새우'],
		},
	},
	{
		id: 3,
		name: '백수연',
		team: 'Web2팀',
		preferences: {
			liked: ['닭고기', '돼지고기'],
			disliked: ['게'],
		},
	},
	{
		id: 4,
		name: '이무성',
		team: 'Web2팀',
		preferences: {
			liked: ['양고기', '소고기'],
			disliked: ['새우'],
		},
	},
];

const Participant = () => {
	const [expandedParticipant, setExpandedParticipant] = useState<number | null>(null);

	const toggleParticipantExpansion = (participantId: number) => {
		setExpandedParticipant((prev) => (prev === participantId ? null : participantId));
	};

	const handleParticipateClick = () => {
		console.log('참여하기');
	};

	return (
		<div className="px-4.5 bg-[#F5F5F5] pt-5 h-screen">
			<div className="flex items-center justify-between mb-5">
				<div className="flex items-center gap-1">
					<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="font-medium">
						현재 참여중인 사람
					</Typography>
					<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray10} className="font-semibold">
						{SAMPLE_PARTICIPANTS.length}명
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

			{SAMPLE_PARTICIPANTS.length > 0 ? (
				<div className="space-y-3.25 mb-6">
					{SAMPLE_PARTICIPANTS.map((participant) => {
						const isExpanded = expandedParticipant === participant.id;
						return (
							<div key={participant.id} className="bg-white rounded-[10px] border border-gray-03 px-3.75 py-5">
								<button onClick={() => toggleParticipantExpansion(participant.id)} className="w-full flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										<div className="w-7 h-7 border border-gray-04 bg-gray-02 rounded-full flex items-center justify-center">
											<img src="" alt="" />
										</div>
										<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
											{participant.name}
										</Typography>
									</div>
									<Icon name="selectOpen" size={14} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
								</button>

								{isExpanded && (
									<div className="pt-5 space-y-3.75">
										<div>
											<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray10} className="font-semibold mb-2">
												알러지 음식
											</Typography>
											<div className="flex flex-wrap gap-2">
												{participant.preferences.liked.map((item, index) => (
													<div key={`liked-${participant.id}-${index}`} className="px-3.5 py-1.5 rounded-[17px] border border-gray-05">
														<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07} className="font-medium">
															{item}
														</Typography>
													</div>
												))}
											</div>
										</div>
										<div>
											<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold mb-2">
												비선호 음식
											</Typography>
											<div className="flex flex-wrap gap-2">
												{participant.preferences.disliked.map((item, index) => (
													<div key={`disliked-${participant.id}-${index}`} className="px-3.5 py-1.5 rounded-[17px] border border-gray-05">
														<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07} className="font-medium">
															{item}
														</Typography>
													</div>
												))}
											</div>
										</div>
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
				<Button variant="active" onClick={handleParticipateClick}>
					참여하기
				</Button>
			</div>
		</div>
	);
};

export default Participant;
