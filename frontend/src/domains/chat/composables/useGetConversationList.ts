import type { ConversationList } from "@/lib/axios/types/conversationListSchema";
import { HttpStatusCode } from "axios";
import { ref, watch, type Ref } from "vue";

export function useGetConversationList(
	receiverId: Ref<string>,
) {
	const conversation = ref<ConversationList | null>(null);

	async function getConversationList() {
		await window.backendClient.get<ConversationList>(
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
			void getConversationList();
		},
		{ immediate: true },
	);

	return {
		conversation,
		getConversationList,
	};
}
