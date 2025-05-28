<script setup lang="ts">
import { ref, watch } from "vue";
import { TheTextarea } from "@/components/ui/textarea";
import { TheButton } from "@/components/ui/button";
import TheIcon from "@/components/TheIcon.vue";
import { debounce } from "lodash";

interface Emits {
	(e: "send", message: string): void;
	(e: "isTyping", value: boolean): void;
}

const emit = defineEmits<Emits>();
const message = ref("");

const TYPING_TIMEOUT_MS = 2000;
const isTyping = ref(false);

function updateTyping(value: boolean) {
	if (isTyping.value !== value) {
		isTyping.value = value;
		emit("isTyping", value);
	}
}

const stopTyping = debounce(() => {
	updateTyping(false);
}, TYPING_TIMEOUT_MS);

watch(
	() => message.value,
	(val) => {
		const isCurrentlyTyping = !!val.trim();

		if (isCurrentlyTyping) {
			updateTyping(true);
			stopTyping();
		} else {
			stopTyping.cancel();
			updateTyping(false);
		}
	},
);

function handleSend() {
	if (!message.value.trim()) {
		return;
	}
	emit("send", message.value);
	message.value = "";
}
</script>

<template>
	<div class="h-16 mx-4 flex gap-2">
		<TheTextarea
			ref="textareaRef"
			v-model="message"
			placeholder="Tapez votre message ici..."
			class="resize-none"
			@keydown.enter.exact.prevent="handleSend"
		/>

		<TheButton
			class="h-full aspect-square"
			@click="handleSend"
		>
			<TheIcon
				name="send"
				size="xl"
			/>
		</TheButton>
	</div>
</template>
