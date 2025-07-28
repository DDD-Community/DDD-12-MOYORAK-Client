import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { FONT_COLOR, PALETTE, type TFontColorTypes, type TFontVariantKeys } from '@/constants/styles';
import { cn } from '@/utils/shadcn';

type TTypographyProps<T extends ElementType> = {
	as?: T;
	variant: TFontVariantKeys;
	fontColor?: TFontColorTypes;
	children?: ReactNode;
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

	return (
		<Component className={cn(variant, FONT_COLOR[fontColor], className)} {...props}>
			{children}
		</Component>
	);
};

export default Typography;
