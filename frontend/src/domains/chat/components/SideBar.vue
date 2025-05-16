<script setup lang="ts">
import { useRouter } from "vue-router";
import { routerPageName } from "@/router/routerPageName";
import { useSonner } from "@/composables/useSonner";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import type { Conversation } from "@/schemas/conversationSchema";
import { conversations } from "@/mocks/conversations";
import { computed, ref } from "vue";
import { TheInput } from "@/components/ui/input";
import UserAvatar from "@/domains/user/components/UserAvatar.vue";
import { TheButton } from "@/components/ui/button";

const router = useRouter();
const { LOGIN_PAGE, PROFILE_PAGE } = routerPageName;
const { sonnerError, sonnerMessage } = useSonner();
const { deleteAccessToken, user } = useUserInformation();

// Mock des conversations
const convs = ref<Conversation[]>(conversations);
// End Mock

const search = ref("");
const filteredConvs = computed(() => convs.value.filter((conv) => conv.name.toLowerCase().includes(search.value.toLowerCase())));

function logout() {
	try {
		deleteAccessToken();
		sonnerMessage("Déconnexion réussie", {
			description: "Vous êtes maintenant déconnecté.",
		});
		void router.push({ name: LOGIN_PAGE });
	} catch {
		sonnerError("Erreur de déconnexion", {
			description: "Une erreur est survenue lors de la déconnexion.",
		});
	}
}
</script>

<template>
	<aside class="w-68 md:w-80 h-full p-4 hidden sm:flex flex-col gap-6 bg-sidebar border-r border-sidebar-border">
		<h1 class="mb-2 text-2xl font-bold text-sidebar-primary">
			Nestflix & Chat
		</h1>

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
					v-for="conv in filteredConvs"
					:key="conv.id"
				>
					<RouterLink
						:to="{ name: 'chat', params: { id: conv.id } }"
						class="block px-3 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition"
					>
						<div class="font-medium">
							{{ conv.name }}
						</div>

						<div class="text-xs text-muted-foreground truncate">
							<span class="font-semibold">{{ conv.lastMessage.user }} :</span>
							{{ conv.lastMessage.content }}
						</div>
					</RouterLink>
				</li>

				<li
					v-if="filteredConvs.length === 0"
					class="px-3 py-2 text-sm text-muted-foreground"
				>
					Aucune conversation trouvée.
				</li>
			</ul>
		</nav>

		<div class="pt-2 flex flex-col gap-2 items-center">
			<div
				v-if="user?.username"
				class="mb-2 flex items-center gap-2 text-sm text-muted-foreground"
			>
				<UserAvatar />

				<span>{{ user.username }}</span>
			</div>

			<TheButton
				as-child
				class="w-full"
				variant="outline"
			>
				<RouterLink
					:to="{ name: PROFILE_PAGE }"
				>
					Mon profil
				</RouterLink>
			</TheButton>

			<TheButton
				class="w-full"
				@click="logout"
			>
				Se déconnecter
			</TheButton>
		</div>
	</aside>
</template>
