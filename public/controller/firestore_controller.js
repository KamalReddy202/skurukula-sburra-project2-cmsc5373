import {
    getFirestore,
    collection,
    addDoc,
    orderBy,
    getDocs,
    getDoc,
    query,
    doc,
    where,
    deleteDoc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js"
import { app } from "./firebase_core.js"
import { CollectionName } from "../model/constants.js";
import { currentUser } from "./firebase_auth.js";

const db = getFirestore(app);

export async function addGameHistory(gameModal){
    const collRef = collection(db, CollectionName);
    const docRef = await addDoc(collRef, gameModal)
    return docRef.id;
}

export async function getGameHistoryList() {
    let historyList = [];
    const q = query(collection(db, CollectionName),
        where('email', '==', currentUser.email),
        orderBy('timestamp', 'desc'));
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const docId = doc.id;
        const {bets, won, balance, timestamp, restart} = doc.data();
        historyList.push({bets, won, balance, timestamp, restart, docId});
    });
    return historyList;
}

export async function deleteAllDocs(){
    let history = await getGameHistoryList();
    for (let i = 0; i < history.length; i++) {
        const docRef = doc(db, CollectionName, history[i].docId);
        await deleteDoc(docRef);
    }
}
