import type { SVGProps } from 'react';

import * as iconTypes from './lib';

export type IconTypes = keyof typeof iconTypes;

export interface IconProps extends SVGProps<SVGSVGElement> {
	name: IconTypes;
	size?: number;
}

const Icon = ({ name, size = 24, ...props }: IconProps) => {
	const IconComponent = iconTypes[name];

	return <IconComponent width={size} height={size} {...props} />;
};

export default Icon;
