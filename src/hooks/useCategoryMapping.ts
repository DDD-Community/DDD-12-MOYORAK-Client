export const useCategoryMapping = () => {
	const getCategoryDisplay = (apiCategory: string): string => {
		const categoryMapping: Record<string, string> = {
			KOREAN: '한식',
			WESTERN: '양식',
			CHINESE: '중식',
			JAPANESE: '일식',
			ASIAN: '아시안',
			SNACK: '분식',
			FAST_FOOD: '패스트푸드',
			CHICKEN_PIZZA: '치킨&피자',
			ETC: '기타',
		};
		return categoryMapping[apiCategory] || apiCategory;
	};

	return { getCategoryDisplay };
};
