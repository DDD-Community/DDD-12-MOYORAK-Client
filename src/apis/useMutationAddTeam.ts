import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { post } from '.';

export interface IAddTeamRequest {
	company: number;
	team: string;
}

export interface IAddCompanyResponse {
	companyId: number;
}

const postAddTeam = async ({ company, team }: IAddTeamRequest): Promise<IAddCompanyResponse> => {
	return await post<IAddCompanyResponse>(`/companies/${company}/teams`, { name: team });
};

export const useMutationAddTeam = (options?: UseMutationOptions<IAddCompanyResponse, Error, IAddTeamRequest>) => {
	return useMutation<IAddCompanyResponse, Error, IAddTeamRequest>({
		mutationKey: ['companies'],
		mutationFn: (request) => postAddTeam(request),
		...options,
	});
};
