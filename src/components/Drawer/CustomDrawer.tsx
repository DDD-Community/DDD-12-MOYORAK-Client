'use client';

import Button from '../Button/Button';

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './BasicDrawer';

const CustomDrawer = () => {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button>Open Drawer</Button>
			</DrawerTrigger>
			<DrawerContent className="h-screen overflow-y-auto z-50 px-4 pb-4">
				<DrawerHeader>
					<DrawerTitle>Move Goal</DrawerTitle>
					<DrawerDescription>Set your daily activity goal.</DrawerDescription>
				</DrawerHeader>

				<div className="bg-gray-100 flex items-center justify-center space-x-2 my-4">
					<div className="flex-1 text-center">
						<div className="text-7xl font-bold tracking-tighter">test</div>
						<div className="text-muted-foreground text-[0.70rem] uppercase">Calories/day</div>
					</div>
				</div>

				<div className="mt-4 h-[300px] bg-white rounded-md" />

				<DrawerFooter className="mt-4">
					<Button>Submit</Button>
					<DrawerClose asChild>
						<Button>Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default CustomDrawer;
