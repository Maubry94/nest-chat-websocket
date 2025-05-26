<script setup lang="ts">
import type { User } from "@/schemas/userSchema";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { ref } from "vue";
import { useSonner } from "@/composables/useSonner";
import ChatHeader from "@/domains/chat/components/ChatHeader.vue";
import UserAvatar from "../components/UserAvatar.vue";
import { TheLabel } from "@/components/ui/label";
import { TheInput } from "@/components/ui/input";
import ColorPicker from "../components/ColorPicker.vue";
import TheButton from "@/components/ui/button/TheButton.vue";

const { user } = useUserInformation();
const { sonnerError, sonnerMessage } = useSonner();

const inputProfileColor = ref(user.value?.profileColor);

async function handleUpdateProfileColor() {
	if (inputProfileColor.value === user.value?.profileColor) {
		return;
	}

	try {
		await window.backendClient.patch<User>(
			"/update-user",
			{
				profileColor: inputProfileColor.value,
			},
		);

		if (inputProfileColor.value && user.value) {
			user.value.profileColor = inputProfileColor.value;
			sonnerMessage("La couleur de profil a été mise à jour avec succès.");
		}
	} catch {
		inputProfileColor.value = user.value?.profileColor;
		sonnerError("La couleur de profil doit être une couleur hexadécimale valide.");
	}
}
</script>

<template>
	<section class="h-full flex flex-col">
		<ChatHeader />

		<div class="flex-1 flex flex-col justify-center items-center text-center">
			<div class="w-full max-w-xs lg:max-w-md p-8 bg-card border border-border rounded-lg shadow-md">
				<div class="flex flex-col items-center mb-6">
					<UserAvatar
						:profile-color="user?.profileColor"
						size="md"
					/>

					<h2 class="text-2xl font-bold text-center">
						Mon profil
					</h2>
				</div>

				<form
					class="space-y-4"
					@submit.prevent="handleUpdateProfileColor"
				>
					<div class="space-y-2">
						<TheLabel for="username">
							Nom d'utilisateur
						</TheLabel>

						<TheInput
							id="username"
							:model-value="user?.username"
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
							:model-value="user?.email"
							disabled
							autocomplete="email"
						/>
					</div>

					<div class="space-y-2">
						<TheLabel for="profileColor">
							Couleur de profil
						</TheLabel>

						<TheInput
							id="profileColor"
							v-model="inputProfileColor"
							autocomplete="profile-color"
						/>
					</div>

					<TheButton
						class="w-full"
						type="submit"
					>
						Modifier
					</TheButton>
				</form>
			</div>
		</div>
	</section>
</template>
