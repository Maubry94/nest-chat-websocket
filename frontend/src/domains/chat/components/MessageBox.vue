<script setup lang="ts">
import { ref } from "vue";
import { TheTextarea } from "@/components/ui/textarea";
import { TheButton } from "@/components/ui/button";
import TheIcon from "@/components/TheIcon.vue";

const emit = defineEmits<(e: "send", value: string) => void>();

const message = ref("");

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
