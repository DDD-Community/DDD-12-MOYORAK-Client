import type { FOOD_PREP_TIME_OPTIONS, WAITING_TIME_OPTIONS } from '@/constants/data.constant';

export const useGetValueFromLabel = (label: string, options: typeof FOOD_PREP_TIME_OPTIONS | typeof WAITING_TIME_OPTIONS) => {
	if (!label) return '';

	const normalizedLabel = label.replace(/\s/g, '');
	const found = options.find((option) => option.label.replace(/\s/g, '') === normalizedLabel);

	return found ? found.value : '';
};
