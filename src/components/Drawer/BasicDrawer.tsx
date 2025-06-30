'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/utils/shadcn';

const Drawer = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => <DrawerPrimitive.Root data-slot="drawer" {...props} />;

const DrawerTrigger = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) => <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;

const DrawerPortal = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) => <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;

const DrawerClose = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) => <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;

const DrawerOverlay = ({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Overlay>) => (
	<DrawerPrimitive.Overlay
		data-slot="drawer-overlay"
		className={cn(
			'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-white',
			className
		)}
		{...props}
	/>
);

const DrawerContent = ({ className, children, ...props }: React.ComponentProps<typeof DrawerPrimitive.Content>) => {
	const scrollRef = React.useRef<HTMLDivElement>(null);

	// 터치 시작 좌표 저장용
	const startY = React.useRef<number | null>(null);

	// 터치 이동 핸들러
	const onTouchMove = (e: React.TouchEvent) => {
		if (!scrollRef.current) return;

		const scrollEl = scrollRef.current;
		const scrollTop = scrollEl.scrollTop;
		const scrollHeight = scrollEl.scrollHeight;
		const offsetHeight = scrollEl.offsetHeight;
		const atTop = scrollTop === 0;
		const atBottom = scrollTop + offsetHeight >= scrollHeight;

		const currentY = e.touches[0].clientY;

		if (startY.current === null) {
			startY.current = currentY;
			return;
		}

		const diff = currentY - startY.current;

		// 위로 스크롤 중인데 이미 최상단이면 (즉, 더 올리려 함)
		if (diff > 0 && atTop) {
			// 드로어 자체의 드래그 허용 (preventDefault 해제)
			e.preventDefault();
		}
		// 아래로 스크롤 중인데 이미 최하단이면 (즉, 더 내리려 함)
		else if (diff < 0 && atBottom) {
			e.preventDefault();
		}
	};

	const onTouchEnd = () => {
		startY.current = null;
	};

	return (
		<DrawerPortal>
			<DrawerOverlay />
			<DrawerPrimitive.Content
				data-slot="drawer-content"
				className={cn(
					'group/drawer-content bg-background fixed z-50 flex h-auto flex-col',
					'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
					'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
					'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',
					'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',
					className
				)}
				{...props}
			>
				<div ref={scrollRef} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} className="overflow-y-auto flex-1">
					{children}
				</div>
			</DrawerPrimitive.Content>
		</DrawerPortal>
	);
};

const DrawerHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div
		data-slot="drawer-header"
		className={cn(
			'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left',
			className
		)}
		{...props}
	/>
);

const DrawerFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div data-slot="drawer-footer" className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
);

const DrawerTitle = ({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) => (
	<DrawerPrimitive.Title data-slot="drawer-title" className={cn('text-foreground font-semibold', className)} {...props} />
);

const DrawerDescription = ({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Description>) => (
	<DrawerPrimitive.Description data-slot="drawer-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
);

export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger };
