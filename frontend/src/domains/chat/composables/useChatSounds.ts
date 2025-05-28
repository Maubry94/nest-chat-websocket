import { useLocalStorageItem } from "@/composables/useLocalStorageItem";

const isAudioEnabled = useLocalStorageItem<string>("audio-enabled");

if (isAudioEnabled.value === null) {
	isAudioEnabled.value = "enable";
}

const sendSound = new Audio("/sounds/plop1.mp3");
const receiveSound = new Audio("/sounds/plop2.mp3");

sendSound.volume = 0.5;
receiveSound.volume = 0.5;

export function useChatSounds() {
	function playSendSound() {
		if (isAudioEnabled.value !== "enable") {
			return;
		}

		sendSound.currentTime = 0;
		void sendSound.play();
	}

	function playReceiveSound() {
		if (isAudioEnabled.value !== "enable") {
			return;
		}

		receiveSound.currentTime = 0;
		void receiveSound.play();
	}

	function toggleAudio() {
		isAudioEnabled.value = isAudioEnabled.value === "enable" ? "disable" : "enable";
	}

	return {
		isAudioEnabled,
		playSendSound,
		playReceiveSound,
		toggleAudio,
	};
}
