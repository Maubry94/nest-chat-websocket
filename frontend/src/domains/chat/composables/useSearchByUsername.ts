import type { User } from "@/schemas/userSchema";
import { HttpStatusCode } from "axios";
import { ref, watch, type Ref } from "vue";

export function useSearchByUsername(
	username: Ref<string | null>,
) {
	const users = ref<User[]>([]);

	async function searchByUsername() {
		await window.backendClient.get<User[]>(
			"/users",
			{
				params: { username: username.value },
			},
		).then(
			(response) => {
				if (response.status === HttpStatusCode.Ok) {
					users.value = response.data;
				}
			},
		);
	}

	watch(
		username,
		() => {
			if (username.value) {
				void searchByUsername();
			}
		},
		{ immediate: true },
	);

	return {
		users,
		searchByUsername,
	};
}
