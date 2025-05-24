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
