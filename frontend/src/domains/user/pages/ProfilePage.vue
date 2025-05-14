<script setup lang="ts">
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import ChatHeader from "@/domains/chat/components/ChatHeader.vue";
import UserAvatar from "../components/UserAvatar.vue";
import { TheLabel } from "@/components/ui/label";
import { TheInput } from "@/components/ui/input";

const { user } = useUserInformation();
</script>

<template>
	<section class="h-full flex flex-col">
		<ChatHeader />

		<div class="flex-1 flex flex-col justify-center items-center text-center">
			<div class="w-full max-w-xs lg:max-w-md p-8 bg-card border border-border rounded-lg shadow-md">
				<div class="flex flex-col items-center mb-6">
					<UserAvatar
						size="lg"
						url="https://picsum.photos/200"
					/>

					<h2 class="text-2xl font-bold text-center">
						Mon profil
					</h2>
				</div>

				<form class="space-y-4">
					<div class="space-y-2">
						<TheLabel for="username">
							Nom d'utilisateur
						</TheLabel>

						<TheInput
							id="username"
							:model-value="user?.username ?? ''"
							disabled
							autocomplete="username"
						/>
					</div>

					<div class="space-y-2">
						<TheLabel for="email">
							Adresse e-mail
						</TheLabel>

						<TheInput
							id="email"
							:model-value="user?.email ?? ''"
							disabled
							autocomplete="email"
						/>
					</div>
				</form>
			</div>
		</div>
	</section>
</template>
