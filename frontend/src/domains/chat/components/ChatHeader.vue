<script setup lang="ts">
import DarkModeToggle from "@/components/DarkModeToggle.vue";
import TheInput from "@/components/ui/input/TheInput.vue";
import MobileNav from "@/domains/chat/components/MobileNav.vue";
import TheIcon from "@/components/TheIcon.vue";
import { computed, ref } from "vue";
import { useSearchByUsername } from "../composables/useSearchByUsername";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { routerPageName } from "@/router/routerPageName";

interface Props {
	chatName?: string;
}

const props = defineProps<Props>();
const { CHAT_PAGE, PROFILE_PAGE } = routerPageName;

const searchedUsername = ref("");
const { user } = useUserInformation();

const { users } = useSearchByUsername(
	computed(() => searchedUsername.value || null),
);

const chatName = computed(() => props.chatName ?? "");
</script>

<template>
	<header class="sticky top-0 z-10 px-6 py-4 bg-card border-b border-border shadow-sm">
		<div class="flex items-center justify-between gap-6">
			<div class="flex items-center gap-4 shrink-0">
				<MobileNav />

				<div>
					<h1
						class="text-lg font-semibold tracking-tight"
					>
						{{ chatName }}
					</h1>
				</div>
			</div>

			<div class="w-full max-w-xs flex gap-2">
				<div class="relative flex-grow">
					<TheInput
						v-model="searchedUsername"
						type="text"
						placeholder="Rechercher un utilisateur..."
						class="pl-10 pr-4 bg-muted"
					/>

					<TheIcon
						name="userSearch"
						class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none"
					/>

					<ul
						v-if="searchedUsername"
						class="absolute w-full mt-2 bg-popover border border-border rounded-md shadow-md z-20 max-h-60 overflow-y-auto"
					>
						<li
							v-if="users.length === 0"
							class="px-4 py-2 text-sm text-muted-foreground text-center"
						>
							Aucun utilisateur trouvé
						</li>

						<li
							v-for="searchedUser in users"
							:key="searchedUser.id"
							class="px-4 py-2 text-sm hover:bg-muted cursor-pointer transition"
						>
							<RouterLink
								v-if="searchedUser.id !== user?.id"
								:to="{ name: CHAT_PAGE, params: { userId: searchedUser.id } }"
							>
								{{ searchedUser.username }}
							</RouterLink>

							<RouterLink
								v-else
								:to="{ name: PROFILE_PAGE }"
							>
								{{ "(Vous) " + user.username }}
							</RouterLink>
						</li>
					</ul>
				</div>

				<DarkModeToggle />
			</div>
		</div>
	</header>
</template>
