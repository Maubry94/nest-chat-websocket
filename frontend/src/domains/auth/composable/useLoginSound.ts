import { useLocalStorageItem } from "@/composables/useLocalStorageItem";

const isAudioEnabled = useLocalStorageItem<string>("audio-enabled");

if (isAudioEnabled.value === null) {
	isAudioEnabled.value = "enable";
}

const loginSound = new Audio("/sounds/toodoom.mp3");
loginSound.volume = 0.5;

export function usePlayLoginSound() {
	function playLoginSound() {
		if (isAudioEnabled.value !== "enable") {
			return;
		}

		loginSound.currentTime = 0;
		void loginSound.play();
	}

	function toggleAudio() {
		isAudioEnabled.value = isAudioEnabled.value === "enable" ? "disable" : "enable";
	}

	return {
		isAudioEnabled,
		playLoginSound,
		toggleAudio,
	};
}
