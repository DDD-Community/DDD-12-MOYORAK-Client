import { create } from 'zustand';

interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	setAccessToken: (token: string) => void;
	setRefreshToken: (token: string) => void;
	clearTokens: () => void;
	isLoggedIn: () => boolean;
}

const initialTokens = { accessToken: null, refreshToken: null };

export const useTokenStore = create<AuthState>((set, get) => ({
	accessToken: null,
	refreshToken: null,
	setAccessToken: (token: string) => set({ accessToken: token }),
	setRefreshToken: (token: string) => set({ refreshToken: token }),
	clearTokens: () => set({ ...initialTokens }),
	isLoggedIn: () => !!get().accessToken,
}));
