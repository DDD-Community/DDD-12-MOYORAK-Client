import { useQuery } from '@tanstack/react-query';

import { get } from '.';

export interface ICompanyPositionResponse {
	longtitude: number;
	latitude: number;
}

const getCompanyPosition = async (companyId: number): Promise<ICompanyPositionResponse> => {
	return await get<ICompanyPositionResponse>(`/companies/${companyId}/position`);
};

export const useQueryCompanyPosition = (companyId: number, enabled = true) => {
	return useQuery({
		queryKey: ['companies', companyId, 'position'],
		enabled,
		queryFn: () => getCompanyPosition(companyId),
	});
};
