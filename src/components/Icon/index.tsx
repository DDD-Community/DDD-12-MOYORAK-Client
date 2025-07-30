import type { SVGProps } from 'react';

import * as iconTypes from './lib';

export type IconTypes = keyof typeof iconTypes;

export interface IconProps extends SVGProps<SVGSVGElement> {
	name: IconTypes;
	size?: number;
	color?: string;
}

const Icon = ({ name, size = 24, color, ...props }: IconProps) => {
	const IconComponent = iconTypes[name];

	return <IconComponent width={size} height={size} fill={color} {...props} />;
};

export default Icon;
