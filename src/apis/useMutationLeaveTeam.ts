import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from '.';

const leaveTeam = async (teamId: string): Promise<unknown> => {
	return await del<unknown>(`/teams/${teamId}/team-members/me`);
};

export const useMutationLeaveTeam = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['leave-team'],
		mutationFn: leaveTeam,
		onSuccess: () => {
			// 팀 탈퇴 성공 시 로컬 스토리지에서 teamId 제거
			localStorage.removeItem('teamId');
			localStorage.removeItem('companyId');
			localStorage.removeItem('userId');
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('email');
			localStorage.removeItem('name');
			localStorage.removeItem('profileImage');

			// 팀 관련 쿼리 캐시 무효화
			queryClient.invalidateQueries({ queryKey: ['team'] });
			queryClient.invalidateQueries({ queryKey: ['team-members'] });
			queryClient.invalidateQueries({ queryKey: ['team-restaurants'] });

			// 메인 페이지로 리다이렉트
			window.location.href = '/';
		},
	});
};
