import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { FONT_COLOR, PALETTE, type TFontColorTypes, type TFontVariantKeys } from '@/constants/styles';

type TTypographyProps<T extends ElementType> = {
	as?: T;
	variant: TFontVariantKeys;
	fontColor?: TFontColorTypes;
	children?: ReactNode; // string에서 ReactNode로 변경
} & ComponentPropsWithoutRef<T>;

/**
 * Typography 컴포넌트
 *
 * @description
 * 다양한 HTML 태그나 컴포넌트로 렌더링 가능
 * 태그에 맞는 props 타입으로 자동으로 인식
 */
const Typography = <T extends ElementType>({ as, variant, fontColor = PALETTE.gray09, children, className, ...props }: TTypographyProps<T>) => {
	const Component = as || 'p';

	// className을 별도로 분리하여 처리
	const combinedClassName = `${variant} ${FONT_COLOR[fontColor]} ${className ?? ''}`;

	return (
		<Component className={combinedClassName} {...props}>
			{children}
		</Component>
	);
};

export default Typography;
