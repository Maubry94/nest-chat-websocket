import type { User } from "@/schemas/userSchema";
import { useLocalStorageItem } from "@/composables/useLocalStorageItem";
import { HttpStatusCode } from "axios";
import { computed, ref, watch } from "vue";

const accessTokenLocalStorageKey = "accessToken";
const user = ref<User | null>(null);

export function useUserInformation() {
	const accessTokenItem = useLocalStorageItem<string>(accessTokenLocalStorageKey);

	function setAccessToken(accessToken: string) {
		accessTokenItem.value = accessToken;
	}

	function deleteAccessToken() {
		accessTokenItem.value = null;
	}

	const isConnected = computed(() => !!user.value);
	const accessToken = computed(() => accessTokenItem.value);

	async function fetchInformation() {
		try {
			const userResponse = await window.backendClient.get<User>("/user");
			if (userResponse.status === HttpStatusCode.Ok) {
				user.value = userResponse.data;
			} else {
				user.value = null;
				accessTokenItem.value = null;
			}
		} catch {
			accessTokenItem.value = null;
			user.value = null;
		}
	}

	return {
		setAccessToken,
		deleteAccessToken,
		fetchInformation,
		isConnected,
		accessToken,
		user,
	};
}

const { accessToken, fetchInformation } = useUserInformation();

watch(
	accessToken,
	(value) => {
		if (value) {
			void fetchInformation();
		}
	},
);
