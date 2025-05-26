<script setup lang="ts">
import { LUMINANCE_CONFIG, calculateLuminance } from "@/lib/utils";
import { computed } from "vue";
import TheInput from "@/components/ui/input/TheInput.vue";
import TheIcon from "@/components/TheIcon.vue";
import TheButton from "@/components/ui/button/TheButton.vue";

interface Props {
	modelValue?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

const inputTextColor = computed(() => {
	const luminance = calculateLuminance(props.modelValue || "#FFFFFF");
	return luminance > LUMINANCE_CONFIG.LUMINANCE_THRESHOLD
		? "var(--muted-foreground)"
		: "var(--background)";
});

function handleColorChange(event: Event) {
	const input = event.target as HTMLInputElement;
	emit("update:modelValue", input.value);
}
</script>

<template>
	<div class="flex gap-2 items-center">
		<TheInput
			:model-value="modelValue"
			:style="{
				backgroundColor: modelValue,
				color: inputTextColor
			}"
			readonly
			class="flex-1"
		/>

		<div class="relative">
			<input
				type="color"
				:value="modelValue"
				class="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
				@input="handleColorChange"
			>

			<TheButton
				type="button"
				variant="outline"
				size="icon"
			>
				<TheIcon name="palette" />
			</TheButton>
		</div>
	</div>
</template>
