<script setup lang="ts">
import ChatHeader from "@/domains/chat/components/ChatHeader.vue";

</script>

<template>
	<section class="h-full flex flex-col bg-background">
		<ChatHeader />

		<div class="flex-1 flex flex-col justify-center items-center text-center">
			<div class="mb-2 text-2xl font-bold">
				Bienvenue dans votre chat !
			</div>

			<p>
				Sélectionnez une conversation pour commencer à discuter.
			</p>
		</div>
	</section>
</template>
