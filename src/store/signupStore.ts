import { create } from 'zustand';

export type TGender = 'MALE' | 'FEMALE';

interface SignupState {
	step: number | 'success';
	username: string;
	birth: string;
	gender: TGender | null;

	allergyFoods?: string[];
	dislikedFoods?: string[];
	company: string;
	baseAddress: string;
	detailAddress?: string;
	team: string;

	setUsername: (name: string) => void;
	setBirth: (birth: string) => void;
	setGender: (gender: TGender) => void;
	setAllergyFoods: (foods?: string[]) => void;
	setDislikedFoods: (foods?: string[]) => void;
	setCompany: (company: string) => void;
	setBaseAddress: (baseAddress: string) => void;
	setDetailAddress: (detailAddress?: string) => void;
	setTeam: (team: string) => void;

	nextStep: () => void;
	prevStep: () => void;
	setStep: (step: number | 'success') => void;
	reset: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
	step: 1,
	username: '',
	birth: '',
	gender: null,
	allergyFoods: undefined,
	dislikedFoods: undefined,
	company: '',
	team: '',
	baseAddress: '',
	detailAddress: undefined,

	setUsername: (username) => set({ username }),
	setBirth: (birth) => set({ birth }),
	setGender: (gender) => set({ gender }),
	setAllergyFoods: (foods) => set({ allergyFoods: foods }),
	setDislikedFoods: (foods) => set({ dislikedFoods: foods }),
	setCompany: (company) => set({ company }),
	setBaseAddress: (baseAddress) => set({ baseAddress }),
	setDetailAddress: (detailAddress) => set({ detailAddress }),
	setTeam: (team) => set({ team }),

	nextStep: () =>
		set((state) => {
			if (state.step === 4) {
				return { step: 'success' };
			}
			if (typeof state.step === 'number') {
				return { step: state.step + 1 };
			}
			return state;
		}),

	prevStep: () =>
		set((state) => {
			if (typeof state.step === 'number') {
				return { step: Math.max(state.step - 1, 1) };
			}
			return state;
		}),

	setStep: (step) => set({ step }),
	reset: () =>
		set({
			step: 1,
			username: '',
			birth: '',
			gender: null,
			allergyFoods: undefined,
			dislikedFoods: undefined,
			company: '',
			team: '',
		}),
}));
