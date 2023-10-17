import { homePageView } from "../view/home_page.js"
import { historyPageView } from "../view/history_page.js"

export const routePathnames = {
    HOME: '/',
    HISTORY: '/history',
}

export const routes = [
    {path: routePathnames.HOME, page: homePageView},
    {path: routePathnames.HISTORY, page: historyPageView},
];

export function routing(pathname, hash){
    const route = routes.find(r => r.path == pathname);
    if(route) {
        if(hash && hash.length > 1) {
            route.page(hash.substring(1));
        }else{
            route.page();
        }
    } else{
        routes[0].page();
    }
}