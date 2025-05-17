<script setup lang="ts">
import { useRouter } from "vue-router";
import { routerPageName } from "@/router/routerPageName";
import { useSonner } from "@/composables/useSonner";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { ref } from "vue";
import { TheInput } from "@/components/ui/input";
import UserAvatar from "@/domains/user/components/UserAvatar.vue";
import { TheButton } from "@/components/ui/button";

const router = useRouter();
const { LOGIN_PAGE, PROFILE_PAGE, CHAT_PAGE } = routerPageName;
const { sonnerError, sonnerMessage } = useSonner();
const { deleteAccessToken, user } = useUserInformation();

interface Friend {
	name: string;
	id: string;
}

const convs = ref<Friend[]>([
	{
		name: "liamdu92",
		id: "9772943f-99db-4a24-a7a0-017ab51a8301",
	},
	{
		name: "liam.macquaire2002",
		id: "d9f5c1b0-3e24-4b95-9aec-729c83a62fd6",
	},
]);

const search = ref("");

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
					v-for="conv in convs"
					:key="conv.id"
				>
					<RouterLink
						v-if="conv.name !== user?.username"
						:to="{ name: CHAT_PAGE, params: { userId: conv.id } }"
						class="block px-3 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition"
					>
						<div class="font-medium">
							{{ conv.name }}
						</div>
					</RouterLink>
				</li>

				<li
					v-if="convs.length === 0"
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
