<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import TheSonner from "./components/ui/sonner/TheSonner.vue";
import { RouterView } from "vue-router";

useColorMode({
	disableTransition: false,
});
</script>

<template>
	<TheSonner close-button />

	<RouterView />
</template>
