<script setup lang="ts">
import { computed, ref } from "vue";
import { TheButton } from "@/components/ui/button";
import TheInput from "./ui/input/TheInput.vue";

// Mock data for conversations
const conversations = ref([
	{
		id: 1,
		name: "Groupe Dev",
		lastMessage: "À ce soir !",
	},
	{
		id: 2,
		name: "Alice",
		lastMessage: "Merci pour l'aide !",
	},
	{
		id: 3,
		name: "Bob",
		lastMessage: "On se capte demain ?",
	},
]);
// End of mock data

const search = ref("");
const filteredConversations = computed(() => conversations.value.filter((conv) => conv.name.toLowerCase().includes(search.value.toLowerCase())));
</script>

<template>
	<aside class="w-80 h-full p-4 flex flex-col gap-6 bg-sidebar border-r border-sidebar-border">
		<div class="mb-2 flex items-center justify-between">
			<h1 class="text-2xl font-bold text-sidebar-primary">
				Nestflix & Chat
			</h1>
		</div>

		<div>
			<TheInput
				v-model="search"
				type="text"
				placeholder="Rechercher une conversation..."
			/>
		</div>

		<nav class="flex-1 mt-2 overflow-y-auto">
			<ul class="space-y-1">
				<li
					v-for="conv in filteredConversations"
					:key="conv.id"
				>
					<a
						href="#"
						class="block px-3 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
					>
						<div class="font-medium">{{ conv.name }}</div>

						<div class="text-xs text-muted-foreground truncate">{{ conv.lastMessage }}</div>
					</a>
				</li>

				<li
					v-if="filteredConversations.length === 0"
					class="px-3 py-2 text-sm text-muted-foreground"
				>
					Aucune conversation trouvée.
				</li>
			</ul>
		</nav>

		<div class="pt-2">
			<TheButton
				class="w-full"
				variant="outline"
			>
				Mon profil
			</TheButton>
		</div>
	</aside>
</template>
