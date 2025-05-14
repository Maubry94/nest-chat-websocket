<script setup lang="ts">
import { TheButton } from "@/components/ui/button";
import { useRouter } from "vue-router";
import { routerPageName } from "@/router/routerPageName";

const router = useRouter();

async function goToHome() {
	await router.push({ name: routerPageName.HOME_PAGE });
}
</script>

<template>
	<section class="h-full p-4 flex flex-col justify-center items-center text-center">
		<div class="space-y-6">
			<div class="space-y-2">
				<h1 class="text-6xl font-bold text-primary sm:text-8xl">
					404
				</h1>

				<h2 class="text-2xl font-medium">
					Page non trouvée
				</h2>

				<p class="text-muted-foreground max-w-md mx-auto">
					Oups ! Il semble que vous ayez pris un chemin qui n'existe pas ou qui a été déplacé.
				</p>
			</div>

			<div class="pt-4">
				<TheButton
					@click="goToHome"
					size="lg"
				>
					Retourner à l'accueil
				</TheButton>
			</div>
		</div>
	</section>
</template>
