import type { RouteRecordRaw } from "vue-router";

export const routerPageNameAuth = Object.freeze({
	LOGIN_PAGE: "login",
});

export default (): RouteRecordRaw[] => [
	{
		name: routerPageNameAuth.LOGIN_PAGE,
		path: "/login",
		component: () => import("./pages/LoginPage.vue"),
	},
];
