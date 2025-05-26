<script setup lang="ts">
import { LUMINANCE_CONFIG, calculateLuminance } from "@/lib/utils";
import { computed } from "vue";
import TheIcon from "@/components/TheIcon.vue";

const sizeMapper = {
	sm: "scale-100",
	md: "scale-125",
	lg: "scale-150",
	xl: "scale-175",
};

interface Props {
	profileColor?: string;
	avatarUrl?: string;
	size?: keyof typeof sizeMapper;
}

const props = withDefaults(defineProps<Props>(), {
	profileColor: "#FFFFFF",
	avatarUrl: "",
	size: "sm",
});

const iconColor = computed(() => {
	const luminance = calculateLuminance(props.profileColor);
	return luminance > LUMINANCE_CONFIG.LUMINANCE_THRESHOLD
		? "var(--muted-foreground)"
		: "var(--background)";
});
</script>

<template>
	<div
		class="flex-shrink-0 rounded-full"
		:style="{ backgroundColor: profileColor }"
		:class="[sizeMapper[size]]"
	>
		<TheIcon
			v-if="!avatarUrl"
			name="user"
			size="xl"
			:style="{ color: iconColor }"
			class="m-2"
		/>

		<img
			v-else
			:src="avatarUrl"
			alt="User Avatar"
			class="w-full h-full flex-shrink-0 object-cover rounded-full"
		>
	</div>
</template>
