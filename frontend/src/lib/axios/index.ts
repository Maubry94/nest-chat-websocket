import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { envs } from "@/envs";
import axios, { type AxiosInstance } from "axios";

const { accessToken } = useUserInformation();
declare global {
	interface Window {
		backendClient: AxiosInstance;
	}
}

export const backendClient: AxiosInstance = axios.create({
	baseURL: envs.VITE_API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

backendClient.interceptors.request.use(
	(config) => {
		if (accessToken.value) {
			config.headers.Authorization = accessToken.value ?? undefined;
		}
		return config;
	},
);

window.backendClient = backendClient;
