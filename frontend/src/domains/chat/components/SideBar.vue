<script setup lang="ts">
import { useRouter } from "vue-router";
import { routerPageName } from "@/router/routerPageName";
import { useSonner } from "@/composables/useSonner";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { computed, ref } from "vue";
import { TheInput } from "@/components/ui/input";
import UserAvatar from "@/domains/user/components/UserAvatar.vue";
import { TheButton } from "@/components/ui/button";

const router = useRouter();
const { LOGIN_PAGE, PROFILE_PAGE, CHAT_PAGE, HOME_PAGE } = routerPageName;
const { sonnerError, sonnerMessage } = useSonner();
const { deleteAccessToken, user } = useUserInformation();

const search = ref("");

const userConversationsFiltered = computed(
	() => user.value?.conversations.filter(
		(conversation) => conversation.lastMessage.senderUsername.toLowerCase()
			.includes(search.value.toLowerCase()),
	),
);

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
		<RouterLink
			:to="{ name: HOME_PAGE }"
			class="mb-2 text-2xl font-bold text-sidebar-primary"
		>
			Nestflix & Chat
		</RouterLink>

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
					v-for="userConversation in userConversationsFiltered"
					:key="userConversation._id"
				>
					<RouterLink
						:to="{
							name: CHAT_PAGE,
							params: {
								receiverId: userConversation.conversationReceiverId
							}
						}"
						class="block px-3 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition"
					>
						<div class="flex justify-between items-center">
							<div class="font-medium">
								{{ userConversation.conversationName }}
							</div>

							<span
								v-if="userConversation.lastMessage.senderId !== user?.id && !userConversation.lastMessage.isReaded"
								class="ml-2 w-2.5 h-2.5 rounded-full bg-red-500"
							/>
						</div>

						<div class="text-xs text-muted-foreground truncate">
							<span class="font-semibold">
								{{
									userConversation.lastMessage.senderUsername
								}} :
							</span>
							{{ userConversation.lastMessage.content }}
						</div>
					</RouterLink>
				</li>

				<li
					v-if="userConversationsFiltered?.length === 0"
					class="px-3 py-2 text-sm text-muted-foreground"
				>
					Aucune conversation trouvée.
				</li>
			</ul>
		</nav>

		<div class="pt-2 flex flex-col gap-2 items-center">
			<div
				class="mb-2 flex items-center gap-2 text-sm text-muted-foreground"
			>
				<UserAvatar :profile-color="user?.profileColor" />

				<span>{{ user?.username }}</span>
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
