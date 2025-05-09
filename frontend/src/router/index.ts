import { createRouter, createWebHistory } from "vue-router";
import auth from "@/domains/auth/router";
import chat, { notFound } from "@/domains/chat/router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/login",
			component: () => import("@/layouts/BaseLayout.vue"),
			children: [...auth()],
		},
		{
			path: "/",
			component: () => import("@/layouts/ChatLayout.vue"),
			children: [...chat()],
		},
		notFound(),
	],
});

export default router;
