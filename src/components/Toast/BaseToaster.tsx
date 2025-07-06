import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import Icon, { type IconTypes } from '../Icon';
import Typography from '../Typography';

interface ICustomToast {
	title: string;
	icon: IconTypes;
}

/**
 * @description shadcn headless Toaster 컴포넌트
 */
const Toaster = ({ ...props }: ToasterProps) => {
	return <Sonner {...props} />;
};

/**
 * @description 공통 CustomToast 컴포넌트
 */
const CustomToast = ({ title, icon }: ICustomToast) => {
	return (
		<div className="flex items-center gap-[5px]">
			<Icon name={icon} width={14} height={14} />
			<Typography fontColor={PALETTE.white} variant={FONT_VARIANT.label01}>
				{title}
			</Typography>
		</div>
	);
};

export { CustomToast, Toaster };

/**
 * @example
 *
 * - toast 훅
 * - toast 함수로 CustomToast 로 icon, title 지정하여 커스텀
 * <Button onClick={() => toast(<CustomToast icon="check" title="test" />)}>Toast!</Button>
 */
