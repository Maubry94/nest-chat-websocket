import { useLocalStorageItem } from "@/composables/useLocalStorageItem";
import axios, { HttpStatusCode } from "axios";
import { computed, ref, watch } from "vue";

const accessTokenLocalStorageKey = "accessToken";
const user = ref(null);

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
		return axios
			.get("/user")
			.then(
				(response) => {
					if (response.status === HttpStatusCode.Ok) {
						user.value = response.data;
					} else {
						accessTokenItem.value = null;
					}
				},
			);
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
