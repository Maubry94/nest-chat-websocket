import type { Message } from "@/schemas/messageSchema";
import { HttpStatusCode } from "axios";
import { ref, watch, type Ref } from "vue";

export function useGetConversation(
	receiverId: Ref<string>,
) {
	const conversation = ref<Message[]>([]);

	async function getConversation() {
		await window.backendClient.get<Message[]>(
			`/messages/${receiverId.value}`,
		).then(
			(response) => {
				if (response.status === HttpStatusCode.Ok) {
					conversation.value = response.data;
				}
			},
		);
	}

	watch(
		receiverId,
		() => {
			void getConversation();
		},
		{ immediate: true },
	);

	return {
		conversation,
		getConversation,
	};
}
