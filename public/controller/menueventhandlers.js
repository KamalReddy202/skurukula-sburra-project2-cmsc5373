import { homePageView } from "../view/home_page.js";
import { MenuPageView } from "../view/menu2_page.js";
import { signOutFirebase } from "./firebase_auth.js";
import { routePathenames } from "./route_controller.js";

export function onClickHomeMenu(e) {
    history.pushState(null, null, routePathenames.HOME);
    homePageView();
}
export function onClickMenu2Menu(e) {
    history.pushState(null, null, routePathenames.MENU2);
    MenuPageView();
}

export async function onClickSignoutMenu(e){
    await signOutFirebase(e)
}