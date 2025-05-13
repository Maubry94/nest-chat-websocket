<script setup lang="ts">
import { useRouter } from "vue-router";
import { routerPageName } from "@/router/routerPageName";
import { useSonner } from "@/composables/useSonner";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import backendClient from "@/lib/axios";
import { HttpStatusCode } from "axios";
import TheButton from "@/components/ui/button/TheButton.vue";

const router = useRouter();
const { HOME_PAGE } = routerPageName;
const { sonnerError, sonnerMessage } = useSonner();
const { setAccessToken } = useUserInformation();

async function googleSign() {
	const provider = new GoogleAuthProvider();
	const auth = getAuth(firebaseApp);

	try {
		const userCredential = await signInWithPopup(auth, provider);
		const fireBaseIdToken = await userCredential.user.getIdToken();

		await backendClient
			.post<string>(
				"/authentication",
				{
					firebaseToken: fireBaseIdToken,
				},
			).then((response) => {
				if (response.status === HttpStatusCode.Created) {
					setAccessToken(response.data);
					sonnerMessage(
						"Connexion réussie",
						{
							description: "Vous êtes maintenant connecté.",
						},
					);
					void router.push({ name: HOME_PAGE });
				}
			});
	} catch {
		sonnerError("Erreur de connexion", {
			description: "Une erreur est survenue lors de la connexion.",
		});
	}
}
</script>

<template>
	<section class="h-full flex flex-col gap-6 justify-center items-center">
		<div class="w-full max-w-sm">
			<div class="flex flex-col gap-6">
				<div class="flex flex-col gap-2 items-center">
					<h1 class="text-xl font-bold">
						Nestflix & Chat
					</h1>

					<span class="text-center text-sm">
						Connectez-vous avec votre compte Google
					</span>
				</div>

				<TheButton
					@click="googleSign"
					class="w-full"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path
							d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133
							-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72
							8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0
							12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173
							8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
							fill="currentColor"
						/>
					</svg>
					Connexion avec Google
				</TheButton>
			</div>
		</div>
	</section>
</template>
