<script setup lang="ts">
import {
	Menu,
	User,
	Send,
	Check,
	CheckCheck,
	UserSearch,
	Palette,
} from "lucide-vue-next";

const iconMapper = {
	menu: Menu,
	user: User,
	send: Send,
	check: Check,
	checkCheck: CheckCheck,
	userSearch: UserSearch,
	palette: Palette,
};

const sizeMapper = {
	xs: "size-3",
	sm: "size-3.5",
	base: "size-4",
	lg: "size-4.5",
	xl: "size-5",
	"2xl": "size-6",
	"3xl": "size-7.5",
	"4xl": "size-9",
	"5xl": "size-12",
	"6xl": "size-15",
	"7xl": "size-18",
	"8xl": "size-24",
	"9xl": "size-32",
};

interface Props {
	name: keyof typeof iconMapper;
	size?: keyof typeof sizeMapper;
}
withDefaults(defineProps<Props>(), {
	size: "base",
});
</script>

<template>
	<component
		:is="iconMapper[name]"
		:class="sizeMapper[size]"
	/>
</template>
