export const CATEGORY_DISPLAY_LIST = ['한식', '양식', '중식', '일식', '아시안', '분식', '패스트푸드', '치킨&피자', '기타'] as const;
export type TCategoryDisplay = (typeof CATEGORY_DISPLAY_LIST)[number];

export const CATEGORY_API_MAPPING: Record<TCategoryDisplay, string> = {
	한식: 'KOREAN',
	양식: 'WESTERN',
	중식: 'CHINESE',
	일식: 'JAPANESE',
	아시안: 'ASIAN',
	분식: 'SNACK',
	패스트푸드: 'FAST_FOOD',
	'치킨&피자': 'CHICKEN_PIZZA',
	기타: 'ETC',
} as const;

export const WAITING_TIME_OPTIONS = [
	{ label: '웨이팅 없음', value: '1' },
	{ label: '5분 이내', value: '2' },
	{ label: '10~15분 이내', value: '3' },
	{ label: '30분 이내', value: '4' },
	{ label: '30분 이상', value: '5' },
];

export const FOOD_PREP_TIME_OPTIONS = [
	{ label: '바로 준비됨', value: '1' },
	{ label: '5분 이내', value: '2' },
	{ label: '10~15분 이내', value: '3' },
	{ label: '30분 이내', value: '4' },
	{ label: '30분 이상', value: '5' },
];

export const SATISFACTION_OPTIONS = [
	{ label: '감동적인 맛이에요!', value: '5' },
	{ label: '기대 이상이었어요!', value: '4' },
	{ label: '무난했어요', value: '3' },
	{ label: '좀 아쉬웠어요', value: '2' },
	{ label: '실망스러웠어요', value: '1' },
	{ label: '별점을 눌러주세요', value: '0' },
];

export const REVIEW_LIST = [
	{
		name: '김지민',
		date: '2025.06.24',
		rating: 5.0,
		waitTime: '10분',
		prepTime: '10분',
		review: '리뷰를 입력해주세요 리뷰를 입력해주세요 정말 맛있는 식당이에요. 음식도 빨리 나오고 직원분들도 친절하셨습니다. 다음에 또 올 의향이 있어요!',
		images: [1, 2, 3], // 이미지 3개
	},
	{
		name: '김지민',
		date: '2025.06.24',
		rating: 5.0,
		waitTime: '10분',
		prepTime: '10분',
		review: '리뷰를 입력해주세요 리뷰를 입력해주세요',
		images: [],
	},
];

export const BUTTON_TEXT = {
	participate: '참여하기',
	participated: '아직 투표가 시작되지 않았어요!',
	vote: '투표하기',
	voteAgain: '다시 투표하기',
	voteEnded: '투표가 종료되었어요',
};
