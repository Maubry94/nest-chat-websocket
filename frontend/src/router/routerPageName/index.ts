import { routerPageNameAuth } from "@/domains/auth/router";
import { routerPageNameChat } from "@/domains/chat/router";

export const routerPageName = Object.freeze({
	...routerPageNameAuth,
	...routerPageNameChat,
});
