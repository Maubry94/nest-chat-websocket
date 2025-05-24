import type { User } from "@/schemas/userSchema";
import { useLocalStorageItem } from "@/composables/useLocalStorageItem";
import { HttpStatusCode } from "axios";
import { computed, ref, watch } from "vue";
import type { MyConversation } from "@/lib/axios/types/myConversationsSchema";

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
			const [myConversationsResponse, userResponse] = await Promise.all([
				window.backendClient.get<MyConversation[]>("/get-my-conversations"),
				window.backendClient.get<User>("/user"),
			]);

			if (
				myConversationsResponse.status === HttpStatusCode.Ok
				&& userResponse.status === HttpStatusCode.Ok
			) {
				user.value = userResponse.data;
				user.value.myConversations = myConversationsResponse.data;
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

void Promise
	.resolve()
	.then(
		fetchInformation,
	);
