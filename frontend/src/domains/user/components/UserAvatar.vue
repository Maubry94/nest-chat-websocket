<script setup lang="ts">
import TheIcon from "@/components/TheIcon.vue";

const sizeMapper = {
	sm: "size-9",
	md: "size-12",
	lg: "size-15",
	xl: "size-18",
};

interface Props {
	profileColor?: string;
	size?: keyof typeof sizeMapper;
}

withDefaults(defineProps<Props>(), {
	profileColor: "#FFFFFF",
	size: "sm",
});
</script>

<template>
	<div
		class="flex-shrink-0 rounded-full"
		:style="{ backgroundColor: profileColor }"
		:class="[sizeMapper[size]]"
	>
		<TheIcon
			name="user"
			size="xl"
			class="m-2 text-muted-foreground"
		/>
	</div>
</template>
