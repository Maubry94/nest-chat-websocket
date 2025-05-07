
import { envs } from "@/envs";
import axios from "axios";

export const backendClient = axios.create({
	baseURL: envs.VITE_API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

export default backendClient;
