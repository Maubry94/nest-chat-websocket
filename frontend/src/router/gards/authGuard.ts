import type { Router } from "vue-router";
import { routerPageName } from "../routerPageName";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";

export function authGuard(router: Router) {
	router.beforeEach(
		async(to, _from, next) => {
			const { isConnected, fetchInformation } = useUserInformation();
			const { LOGIN_PAGE, HOME_PAGE } = routerPageName;

			await fetchInformation();

			if (to.name === LOGIN_PAGE && isConnected.value) {
				next({ name: HOME_PAGE });
			} else if (to.name !== LOGIN_PAGE && !isConnected.value) {
				next({ name: LOGIN_PAGE });
			} else {
				next();
			}
		},
	);
}
