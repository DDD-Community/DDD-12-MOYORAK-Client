'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/utils/shadcn';

interface ISwitchProps {
	size?: 'S' | 'M';
}

const Switch = ({ className, size = 'S', ...props }: React.ComponentProps<typeof SwitchPrimitive.Root> & ISwitchProps) => {
	const rootSizeClass = size === 'S' ? 'w-[39px] h-6' : 'w-[52px] h-8';
	const thumbSizeClass = size === 'S' ? 'w-[18px] h-[18px]' : 'w-6 h-6';
	const thumbTranslateClass =
		size === 'S'
			? 'data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-1'
			: 'data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-1';

	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(
				'peer bg-gray-05 data-[state=checked]:bg-primary-200 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center rounded-full border border-transparent shadow transition-all outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50',
				rootSizeClass,
				className
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn('block bg-white rounded-full transform ring-0 transition-transform duration-300 ease-in-out', thumbSizeClass, thumbTranslateClass)}
				style={{ backgroundColor: 'white' }}
			/>
		</SwitchPrimitive.Root>
	);
};

export default Switch;
