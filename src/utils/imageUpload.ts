import { post } from '@/apis';

interface IImageUploadResponse {
	url: string;
	path: string;
}

export const extractPathFromUrl = (url: string): string => {
	if (!url) return '';

	try {
		if (!url.startsWith('http')) {
			return url;
		}

		const urlObj = new URL(url);
		return urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
	} catch (error) {
		console.error('URL 파싱 실패:', error);
		const lastSlashIndex = url.lastIndexOf('/');
		return lastSlashIndex !== -1 ? url.substring(lastSlashIndex + 1) : url;
	}
};

/**
 * 파일 확장자를 추출하고 HEIC/HEIF 포맷을 JPG로 변환
 */
export const getFileExtension = (file: File): string => {
	const fileName = file.name;
	const lastDotIndex = fileName.lastIndexOf('.');
	let extension = '';

	if (lastDotIndex !== -1) {
		extension = fileName.substring(lastDotIndex + 1).toLowerCase();
	}

	if (extension === 'heic' || extension === 'heif') {
		console.log(`${extension} 포맷을 JPG로 변환합니다.`);
		return 'jpg';
	}

	const mimeType = file.type;
	switch (mimeType) {
		case 'image/jpeg':
			return 'jpg';
		case 'image/png':
			return 'png';
		case 'image/gif':
			return 'gif';
		case 'image/webp':
			return 'webp';
		case 'image/svg+xml':
			return 'svg';
		case 'image/bmp':
			return 'bmp';
		case 'image/heic':
		case 'image/heif':
			console.log('HEIC/HEIF MIME 타입을 JPG로 변환합니다.');
			return 'jpg';
		default:
			return 'jpg';
	}
};

/**
 * 단일 이미지를 S3에 업로드
 */
export const uploadSingleImage = async (file: File): Promise<string> => {
	const extension = getFileExtension(file);

	try {
		// 1단계: 서버에서 업로드 URL 받기
		const response = await post<IImageUploadResponse>('/images', {
			extensionName: extension,
		});

		let uploadUrl = '';
		let imagePath = '';

		if (response && typeof response === 'object') {
			if ('url' in response) {
				uploadUrl = (response as { url: string }).url;
			}
			if ('path' in response) {
				imagePath = (response as { path: string }).path;
			}
		}

		if (!uploadUrl || !imagePath) {
			console.error('응답에서 URL 또는 path를 찾을 수 없습니다:', response);
			throw new Error('서버 응답에서 업로드 URL 또는 path를 찾을 수 없습니다.');
		}

		// 2단계: S3에 실제 이미지 업로드
		const uploadResponse = await fetch(uploadUrl, {
			method: 'PUT',
			body: file,
			headers: {
				'Content-Type': file.type,
			},
		});

		if (!uploadResponse.ok) {
			throw new Error(`S3 업로드 실패: ${uploadResponse.status} ${uploadResponse.statusText}`);
		}
		console.log('3단계 - 업로드 완료:', imagePath);
		return imagePath; // S3 업로드 후 path 반환
	} catch (error) {
		console.error('이미지 업로드 실패:', error);
		throw new Error('이미지 업로드에 실패했습니다.');
	}
};

/**
 * 파일 유효성 검증
 */
export const validateImageFiles = (files: File[]): File[] => {
	const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/heic', 'image/heif'];

	return files.filter((file) => {
		// MIME 타입 체크
		const isValidMimeType = supportedTypes.includes(file.type);

		// 파일 확장자 체크 (MIME 타입이 없거나 잘못된 경우 대비)
		const fileName = file.name.toLowerCase();
		const hasValidExtension =
			fileName.endsWith('.jpg') ||
			fileName.endsWith('.jpeg') ||
			fileName.endsWith('.png') ||
			fileName.endsWith('.gif') ||
			fileName.endsWith('.webp') ||
			fileName.endsWith('.bmp') ||
			fileName.endsWith('.heic') ||
			fileName.endsWith('.heif');

		if (!isValidMimeType && !hasValidExtension) {
			alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다. JPG, PNG, GIF, WEBP, BMP, HEIC, HEIF 파일만 업로드 가능합니다.`);
			return false;
		}

		return true;
	});
};

/**
 * 다중 이미지 업로드 처리
 */
export const uploadMultipleImages = async (
	files: File[],
	maxImages = 5,
	onProgress?: (isUploading: boolean) => void
): Promise<{ successUrls: string[]; uploadedFiles: File[] }> => {
	if (onProgress) onProgress(true);

	console.log('maxImages', maxImages);

	try {
		const uploadedUrls: string[] = [];
		const uploadedFiles: File[] = [];

		for (const file of files) {
			try {
				const url = await uploadSingleImage(file);
				uploadedUrls.push(url);
				uploadedFiles.push(file);
			} catch (error) {
				console.error(`${file.name} 업로드 실패:`, error);
			}
		}

		if (uploadedUrls.length === 0) {
			throw new Error('모든 이미지 업로드에 실패했습니다.');
		}

		return { successUrls: uploadedUrls, uploadedFiles };
	} catch (error) {
		console.error('이미지 업로드 에러:', error);
		throw error;
	} finally {
		if (onProgress) onProgress(false);
	}
};
