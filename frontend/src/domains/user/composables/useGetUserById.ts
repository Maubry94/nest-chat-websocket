import type { User } from "@/schemas/userSchema";
import { HttpStatusCode } from "axios";
import { ref, watch, type Ref } from "vue";
import { useUserInformation } from "./useUserInformation";

export function useGetUserById(
	userId: Ref<string>,
	whenFindError: () => void,
) {
	const { user: connectedUser } = useUserInformation();
	const user = ref<User | null>(null);

	async function getUserById() {
		try {
			if (userId.value === connectedUser.value?.id) {
				throw new Error("User already loaded");
			}

			const response = await window.backendClient.get<User>(
				`/users/${userId.value}`,
			);

			if (response.status === HttpStatusCode.Ok) {
				user.value = response.data;
			}
		} catch {
			whenFindError();
		}
	}

	watch(
		userId,
		() => {
			void getUserById();
		},
		{ immediate: true },
	);

	return {
		user,
		getUserById,
	};
}
