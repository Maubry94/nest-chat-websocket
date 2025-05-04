import { createRouter, createWebHistory } from "vue-router";
import auth from "@/domains/auth/router";
import main, { notFound } from "@/domains/main/router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			component: () => import("@/layouts/BaseLayout.vue"),
			children: [
				...main(),
				...auth(),
			],
		},
		notFound(),
	],
});

export default router;
