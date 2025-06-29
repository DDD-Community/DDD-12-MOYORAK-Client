import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { FONT_COLOR, PALETTE, type TFontColorTypes, type TFontVariantKeys } from '@/constants/styles';

type TTypographyProps<T extends ElementType> = {
	as?: T;
	variant: TFontVariantKeys;
	fontColor?: TFontColorTypes;
	children?: string;
} & ComponentPropsWithoutRef<T>;

/**
 * Typography 컴포넌트
 *
 * @description
 * 다양한 HTML 태그나 컴포넌트로 렌더링 가능
 * 태그에 맞는 props 타입으로 자동으로 인식
 */
const Typography = <T extends ElementType>({ as, variant, fontColor = PALETTE.gray09, children, ...props }: TTypographyProps<T>) => {
	const Component = as || 'p';

	return (
		<Component className={`${variant} ${FONT_COLOR[fontColor]} ${props.className ?? ''}`} {...props}>
			{children}
		</Component>
	);
};

export default Typography;
