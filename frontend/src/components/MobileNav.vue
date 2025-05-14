<script setup lang="ts">
import { useRouter } from "vue-router";
import { routerPageName } from "@/router/routerPageName";
import { useSonner } from "@/composables/useSonner";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import type { Conversation } from "@/schemas/conversationSchema";
import { computed, ref } from "vue";
import { TheSheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { TheInput } from "@/components/ui/input";
import { TheButton } from "./ui/button";
import TheIcon from "./TheIcon.vue";

const router = useRouter();
const { LOGIN_PAGE, PROFILE_PAGE } = routerPageName;
const { sonnerError, sonnerMessage } = useSonner();
const { deleteAccessToken } = useUserInformation();

// Mock des conversations
const conversations = ref<Conversation[]>([
	{
		id: "b1e7c8a2-1f2d-4e3b-9a7c-1234567890ab",
		name: "Groupe Dev",
		messages: [],
		lastMessage: {
			sender: "them",
			user: "Alice",
			content: "Coucou !",
			createdAt: new Date().toISOString(),
		},
	},
	{
		id: "a2c9d7b3-2e4f-5c6d-8b9e-abcdef123456",
		name: "Alice",
		messages: [],
		lastMessage: {
			sender: "them",
			user: "Alice",
			content: "Salut !",
			createdAt: new Date().toISOString(),
		},
	},
	{
		id: "c3d8e9f4-3a5b-6d7e-9c0f-fedcba654321",
		name: "Bob",
		messages: [],
		lastMessage: {
			sender: "them",
			user: "Bob",
			content: "Yo !",
			createdAt: new Date().toISOString(),
		},
	},
]);
// End Mock

const search = ref("");
const filteredConversations = computed(() => conversations.value.filter((conv) => conv.name.toLowerCase().includes(search.value.toLowerCase())));

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
	<TheSheet>
		<SheetTrigger as-child>
			<TheButton
				variant="outline"
				size="icon"
				class="shrink-0 sm:hidden"
			>
				<TheIcon
					name="menu"
				/>
			</TheButton>
		</SheetTrigger>

		<SheetContent
			side="left"
			class="w-full max-w-68 p-4 flex flex-col gap-6 bg-sidebar border-r border-sidebar-border"
		>
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
						v-for="conv in filteredConversations"
						:key="conv.id"
					>
						<SheetClose as-child>
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
						</SheetClose>
					</li>

					<li
						v-if="filteredConversations.length === 0"
						class="px-3 py-2 text-sm text-muted-foreground"
					>
						Aucune conversation trouvée.
					</li>
				</ul>
			</nav>

			<div class="pt-2 space-y-2">
				<SheetClose as-child>
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
				</SheetClose>

				<SheetClose as-child>
					<TheButton
						class="w-full"
						@click="logout"
					>
						Se déconnecter
					</TheButton>
				</SheetClose>
			</div>
		</SheetContent>
	</TheSheet>
</template>
