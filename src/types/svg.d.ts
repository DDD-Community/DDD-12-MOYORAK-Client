/// <reference types="vite-plugin-svgr" />

declare module '*.svg?react' {
	import React from 'react';
	const Component: React.FC<React.SVGProps<SVGSVGElement>>;
	export default Component;
}
