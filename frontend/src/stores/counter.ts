import { ref, computed } from "vue";
import { defineStore } from "pinia";

const CONFIG = {
	INITIAL_COUNT: 0,
	MULTIPLIER: 2,
};

export const useCounterStore = defineStore("counter", () => {
	const count = ref(CONFIG.INITIAL_COUNT);
	const doubleCount = computed(() => count.value * CONFIG.MULTIPLIER);
	function increment() {
		count.value++;
	}

	return {
		count,
		doubleCount,
		increment,
	};
});
