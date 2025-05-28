<script setup lang="ts">
import { useChatSounds } from "../composables/useChatSounds";
import { TheButton } from "@/components/ui/button";
import TheIcon from "@/components/TheIcon.vue";

const { isAudioEnabled, toggleAudio } = useChatSounds();
</script>

<template>
	<TheButton
		variant="outline"
		@click="toggleAudio"
	>
		<TheIcon
			v-if="isAudioEnabled === 'enable'"
			name="soundOn"
		/>

		<TheIcon
			v-else
			name="soundOff"
		/>
	</TheButton>
</template>
