import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isTodayDate(date: Date) {
	const now = new Date();

	return (
		date.getDate() === now.getDate()
		&& date.getMonth() === now.getMonth()
		&& date.getFullYear() === now.getFullYear()
	);
}

export function getHoursAndMinutesFromDate(date: Date) {
	return date.toLocaleTimeString("fr-FR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function scrollToBottom(
	element: HTMLElement | null | undefined,
	onScrollComplete?: () => void,
): void {
	if (!element) {
		return;
	}

	element.scrollTop = element.scrollHeight;
	onScrollComplete?.();
}

export const LUMINANCE_CONFIG = {
	RED_MULTIPLIER: 0.2126,
	GREEN_MULTIPLIER: 0.7152,
	BLUE_MULTIPLIER: 0.0722,
	LUMINANCE_THRESHOLD: 0.8,
	RGB_MAX_VALUE: 255,
	HEX_COLOR_LENGTH: 6,
	RED_START_INDEX: 0,
	GREEN_START_INDEX: 2,
	BLUE_START_INDEX: 4,
	COLOR_SEGMENT_LENGTH: 2,
	DEFAULT_LUMINANCE: 1,
} as const;

function convertHexToRgb(hexSegment: string): number {
	return parseInt(hexSegment, 16) / LUMINANCE_CONFIG.RGB_MAX_VALUE;
}

export function calculateLuminance(color: string): number {
	const hex = color.replace("#", "").toUpperCase();

	if (hex.length !== LUMINANCE_CONFIG.HEX_COLOR_LENGTH) {
		return LUMINANCE_CONFIG.DEFAULT_LUMINANCE;
	}

	const redValue = convertHexToRgb(
		hex.slice(
			LUMINANCE_CONFIG.RED_START_INDEX,
			LUMINANCE_CONFIG.RED_START_INDEX + LUMINANCE_CONFIG.COLOR_SEGMENT_LENGTH,
		),
	);
	const greenValue = convertHexToRgb(
		hex.slice(
			LUMINANCE_CONFIG.GREEN_START_INDEX,
			LUMINANCE_CONFIG.GREEN_START_INDEX + LUMINANCE_CONFIG.COLOR_SEGMENT_LENGTH,
		),
	);
	const blueValue = convertHexToRgb(
		hex.slice(
			LUMINANCE_CONFIG.BLUE_START_INDEX,
			LUMINANCE_CONFIG.BLUE_START_INDEX + LUMINANCE_CONFIG.COLOR_SEGMENT_LENGTH,
		),
	);

	return (
		(LUMINANCE_CONFIG.RED_MULTIPLIER * redValue)
		+ (LUMINANCE_CONFIG.GREEN_MULTIPLIER * greenValue)
		+ (LUMINANCE_CONFIG.BLUE_MULTIPLIER * blueValue)
	);
}
