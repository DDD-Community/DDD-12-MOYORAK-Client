import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import type { IAuthSignInResponse } from './useMutationAuthSignIn';

interface IApiErrorResponse {
	type: string;
	title: string;
	status: number;
	detail: string;
	instance: string;
}

type TApiResponse<T = unknown> = T;

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

export const get = async <T = unknown>(url: string, params?: object): Promise<TApiResponse<T>> => {
	const { data } = await api.get<TApiResponse<T>>(url, { params });
	return data;
};

export const post = async <T = unknown>(url: string, body?: object): Promise<T> => {
	const { data } = await api.post<T>(url, body);
	return data;
};

export const put = async <T = unknown>(url: string, body?: object): Promise<TApiResponse> => {
	const { data } = await api.put<TApiResponse<T>>(url, body);
	return data;
};

export const del = async <T = unknown>(url: string, params?: object): Promise<TApiResponse> => {
	const { data } = await api.delete<TApiResponse<T>>(url, { params });
	return data;
};

// // 요청 인터셉터 추가: localStorage에서 토큰을 가져와 Authorization 헤더에 추가
api.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError<IApiErrorResponse>) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			if (!isRefreshing) {
				isRefreshing = true;
				try {
					const refreshToken = localStorage.getItem('refreshToken');
					if (!refreshToken) throw new Error('No refresh token');

					const { data } = await axios.post<IAuthSignInResponse>(`${import.meta.env.VITE_API_URL}/auth/refresh`, { 'X-REFRESH-TOKEN': refreshToken });

					const newAccessToken = data.accessToken;
					localStorage.setItem('accessToken', newAccessToken);

					pendingRequests.forEach((cb) => cb(newAccessToken));
					pendingRequests = [];

					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return api(originalRequest);
				} catch (refreshError) {
					console.error('토큰 갱신 실패:', refreshError);
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					window.location.href = '/auth';
					return Promise.reject(refreshError);
				} finally {
					isRefreshing = false;
				}
			}

			return new Promise((resolve) => {
				pendingRequests.push((token: string) => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					resolve(api(originalRequest));
				});
			});
		}

		return Promise.reject(error);
	}
);
