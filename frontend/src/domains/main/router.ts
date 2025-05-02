import type { RouteRecordRaw } from "vue-router";

export const routerPageNameMain = Object.freeze({
	HOME_PAGE: "home",
	NOT_FOUND_PAGE: "not-found",
});

export default (): RouteRecordRaw[] => [
	{
		name: routerPageNameMain.HOME_PAGE,
		path: "/",
		component: () => import("./pages/HomePage.vue"),
	},
];

export function notFound(): RouteRecordRaw {
	return {
		path: "/:notFoundPath(.*)*",
		component: () => import("@/layouts/BaseLayout.vue"),
		children: [
			{
				name: routerPageNameMain.NOT_FOUND_PAGE,
				path: "/:notFoundPath(.*)*",
				component: () => import("./pages/NotFoundPage.vue"),
			},
		],
	};
}

