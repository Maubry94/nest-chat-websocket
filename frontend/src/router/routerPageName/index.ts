import { routerPageNameAuth } from "@/domains/auth/router";
import { routerPageNameMain } from "@/domains/main/router";

export const routerPageName = Object.freeze({
	...routerPageNameAuth,
	...routerPageNameMain,
});
