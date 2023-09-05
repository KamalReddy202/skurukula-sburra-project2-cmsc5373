import { 
    getAuth ,signInWithEmailAndPassword,
     onAuthStateChanged , signOut
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { app } from "./firebase_core.js";
import { DEV } from "../model/constants.js";
import { homePageView } from "../view/home_page.js";
import { signinPageView } from "../view/signin_page.js";
import { routePathenames, routing } from "./route_controller.js";

const auth = getAuth(app);

export let currentUser = null;

 export async function signinFirebase(e){
     e.preventDefault();
     const email = e.target.email.value;
     const password = e.target.password.value;

     try{
        const  userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

     }catch(error){ 
        if (DEV) console.log('sigin error', error);
        const errorCode = error.code;
        const errorMessage = error.message;
        alert ('Sigin Error:' + errorCode + ' ' + errorMessage )
     }
 }

 export function attachAuthStateChangeObserver(){
    onAuthStateChanged(auth, authStateChangeListiner);
 }
function authStateChangeListiner(user){
    currentUser = user;
    if(user) {
        const postAuth = document.getElementsByClassName('myclass-postauth');
        for (let i = 0; i < postAuth.length; i++){
            postAuth[i].classList.replace('d-none', 'd-block');
        }
        const preAuth = document.getElementsByClassName('myclass-preauth');
        for (let i = 0; i < preAuth.length; i++){
            preAuth[i].classList('d-block', 'd-none');
        }
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        routing(pathname,hash)
    }else {
        const postAuth = document.getElementsByClassName('myclass-postauth');
        for (let i = 0; i < postAuth.length; i++){
            postAuth[i].classList.replace('d-block', 'd-none');
        }
        const preAuth = document.getElementsByClassName('myclass-preauth');
        for (let i = 0; i < preAuth.length; i++){
            preAuth[i].classList('d-none', 'd-block');
        }
        history.pushState(null, null, routePathenames.HOME);
        signinPageView();
    }
}

export  async function signOutFirebase(){
     await signOut(auth);

}