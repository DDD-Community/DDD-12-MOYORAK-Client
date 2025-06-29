export const PALETTE = {
	gray01: 'gray01',
	gray02: 'gray02',
	gray03: 'gray03',
	gray04: 'gray04',
	gray05: 'gray05',
	gray06: 'gray06',
	gray07: 'gray07',
	gray08: 'gray08',
	gray09: 'gray09',
	gray10: 'gray10',

	white: 'white',
	// 숫자가 클수록 진한 색
	primary600: 'primary600',
	primary500: 'primary500',
	primary400: 'primary400',
	primary300: 'primary300',
	primary200: 'primary200',
	primary100: 'primary100',
	danger01: 'danger01',
	danger02: 'danger02',
} as const;

export const FONT_COLOR = {
	[PALETTE.gray01]: 'text-gray-01',
	[PALETTE.gray02]: 'text-gray-02',
	[PALETTE.gray03]: 'text-gray-03',
	[PALETTE.gray04]: 'text-gray-04',
	[PALETTE.gray05]: 'text-gray-05',
	[PALETTE.gray06]: 'text-gray-06',
	[PALETTE.gray07]: 'text-gray-07',
	[PALETTE.gray08]: 'text-gray-08',
	[PALETTE.gray09]: 'text-gray-09',
	[PALETTE.gray10]: 'text-gray-10',
	[PALETTE.white]: 'text-white',

	[PALETTE.primary600]: 'text-primary-600',
	[PALETTE.primary500]: 'text-primary-500',
	[PALETTE.primary400]: 'text-primary-400',
	[PALETTE.primary300]: 'text-primary-300',
	[PALETTE.primary200]: 'text-primary-200',
	[PALETTE.primary100]: 'text-primary-100',

	[PALETTE.danger01]: 'text-danger-01',
	[PALETTE.danger02]: 'text-danger-02',
} as const;

export const FONT_VARIANT = {
	title02: 'text-[28px] leading-[38px]',
	title03: 'text-[24px] leading-[32px]',
	header01: 'text-[22px] leading-[30px]',
	header02: 'text-[20px] leading-[28px]',
	header03: 'text-[18px] leading-[26px]',
	header04: 'text-[17px] leading-[24px]',
	body01: 'text-[16px] leading-[24px]',
	body02: 'text-[15px] leading-[22px]',
	label01: 'text-[14px] leading-[20px]',
	label02: 'text-[13px] leading-[18px]',
	caption01: 'text-[12px] leading-[16px]',
	caption02: 'text-[11px] leading-[14px]',
} as const;

export type TFontColorTypes = (typeof PALETTE)[keyof typeof PALETTE];
export type TFontVariantKeys = (typeof FONT_VARIANT)[keyof typeof FONT_VARIANT];
