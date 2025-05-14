<script setup lang="ts">
import TheIcon from "@/components/TheIcon.vue";

const sizeMapper = {
	sm: "size-9",
	md: "size-12",
	lg: "size-15",
	xl: "size-18",
};

interface Props {
	url?: string;
	size?: keyof typeof sizeMapper;
}

withDefaults(defineProps<Props>(), {
	url: "",
	size: "sm",
});
</script>

<template>
	<div
		class="flex-shrink-0 bg-accent rounded-full"
		:class="sizeMapper[size]"
	>
		<TheIcon
			v-if="!url"
			name="user"
			size="xl"
			class="m-2 text-muted-foreground"
		/>

		<img
			v-else
			:src="url"
			alt="User Avatar"
			class="w-full h-full flex-shrink-0 object-cover rounded-full"
		>
	</div>
</template>
