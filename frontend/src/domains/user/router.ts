import type { RouteRecordRaw } from "vue-router";

export const routerPageNameUser = Object.freeze({
	PROFILE_PAGE: "profile",
});

export default (): RouteRecordRaw[] => [
	{
		name: routerPageNameUser.PROFILE_PAGE,
		path: "/profile",
		component: () => import("./pages/ProfilePage.vue"),
	},
];
