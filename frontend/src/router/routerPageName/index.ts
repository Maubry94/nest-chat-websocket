import { routerPageNameAuth } from "@/domains/auth/router";
import { routerPageNameChat } from "@/domains/chat/router";
import { routerPageNameUser } from "@/domains/user/router";

export const routerPageName = Object.freeze({
	...routerPageNameAuth,
	...routerPageNameChat,
	...routerPageNameUser,
});
