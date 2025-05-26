<script setup lang="ts">
import { useRouter } from "vue-router";
import { routerPageName } from "@/router/routerPageName";
import { useSonner } from "@/composables/useSonner";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { computed, ref } from "vue";
import { TheSheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { TheButton } from "@/components/ui/button";
import TheIcon from "@/components/TheIcon.vue";
import { TheInput } from "@/components/ui/input";
import UserAvatar from "@/domains/user/components/UserAvatar.vue";

const router = useRouter();
const { LOGIN_PAGE, PROFILE_PAGE, CHAT_PAGE, HOME_PAGE } = routerPageName;
const { sonnerError, sonnerMessage } = useSonner();
const { deleteAccessToken, user } = useUserInformation();

const search = ref("");

const myConversationsFiltered = computed(
	() => user.value?.myConversations.filter(
		(myConversation) => myConversation.lastMessage.senderUsername.toLowerCase()
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
						v-for="myConversation in myConversationsFiltered"
						:key="myConversation._id"
					>
						<SheetClose as-child>
							<RouterLink
								:to="{
									name: CHAT_PAGE,
									params: {
										userId: myConversation.conversationReceiverId
									}
								}"
								class="block px-3 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition"
							>
								<div class="font-medium">
									{{ myConversation.conversationName }}
								</div>

								<div class="text-xs text-muted-foreground truncate">
									<span class="font-semibold">
										{{
											myConversation.isConnectedSender ?
												"(Vous)"
												: myConversation.lastMessage.senderUsername
										}} :
									</span>
									{{ myConversation.lastMessage.content }}
								</div>
							</RouterLink>
						</SheetClose>
					</li>

					<li
						v-if="myConversationsFiltered?.length === 0"
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
