import type { RouteRecordRaw } from "vue-router";

export const routerPageNameChat = Object.freeze({
	HOME_PAGE: "home",
	CHAT_PAGE: "chat",
	NOT_FOUND_PAGE: "not-found",
});

export default (): RouteRecordRaw[] => [
	{
		name: routerPageNameChat.HOME_PAGE,
		path: "/",
		component: () => import("./pages/HomePage.vue"),
	},
	{
		name: routerPageNameChat.CHAT_PAGE,
		path: "/chat/:id",
		component: () => import("./pages/ChatPage.vue"),
	},
];

export function notFound(): RouteRecordRaw {
	return {
		path: "/:notFoundPath(.*)*",
		component: () => import("@/layouts/BaseLayout.vue"),
		children: [
			{
				name: routerPageNameChat.NOT_FOUND_PAGE,
				path: "/:notFoundPath(.*)*",
				component: () => import("./pages/NotFoundPage.vue"),
			},
		],
	};
}
