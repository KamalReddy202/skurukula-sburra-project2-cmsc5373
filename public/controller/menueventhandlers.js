import { homePageView } from "../view/home_page.js";
import { historyPageView } from "../view/history_page.js";
import { signOutFirebase } from "./firebase_auth.js";
import { routePathnames } from "./route_controler.js";

export function onClickHomeMenu(e){
    history.pushState(null, null, routePathnames.HOME);
    homePageView();
}

export function onClickMenu2Menu(e){
    history.pushState(null, null, routePathnames.HISTORY);
    historyPageView();
}

export async function onClickSignoutMenu(e){
    await signOutFirebase(e);
}