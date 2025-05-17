import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { envs } from "@/envs";
import { io } from "socket.io-client";

const { accessToken } = useUserInformation();

export const chatSocket = io(
	envs.VITE_API_BASE_URL,
	{
		auth: {
			get token() {
				return accessToken.value ?? undefined;
			},
		},
	},
);
