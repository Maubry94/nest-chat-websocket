import type { User } from "@/schemas/userSchema";
import { useLocalStorageItem } from "@/composables/useLocalStorageItem";
import backendClient from "@/lib/axios";
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
		user.value = null;
	}

	const isConnected = computed(() => !!user.value);
	const accessToken = computed(() => accessTokenItem.value);

	async function fetchInformation() {
		try {
			const response = await backendClient.get("/user", {
				headers: {
					Authorization: accessTokenItem.value,
				},
			});

			if (response.status === HttpStatusCode.Ok) {
				user.value = response.data;
			} else {
				accessTokenItem.value = null;
				user.value = null;
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

void Promise
	.resolve()
	.then(
		fetchInformation,
	);
