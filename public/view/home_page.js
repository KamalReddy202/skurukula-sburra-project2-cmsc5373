import * as Elements from './elements.js'
import { routePathnames } from '../controller/route_controler.js'
import * as protectedView from './protected_view.js'
import { currentUser } from '../controller/firebase_auth.js'
import { CardGame } from '../model/card_game.js'
import * as Constants from '../model/constants.js';
import { addGameHistory } from '../controller/firestore_controller.js'

export function addEventListeners() {

	Elements.menus.cardgame.addEventListener('click', () => {
		history.pushState(null, null, routePathnames.HOME)
		homePageView()
	})
}

let gameModal;

let screen = {
    balance: null,
    currentBets: null,
    debt: null,
    cardLocation: null,
    cards: null,
    bets: null,
    reduceButtons: null,
    increaseButtons: null,
    playButton: null,
    restartButton: null,
    newGameButton: null,
    statusMessage: null, 
    initState: true
}


export async function homePageView() {
    if (!currentUser) {
        Elements.root.innerHTML = protectedView.html;
        return;
    }

    // Retrive the user data here
    // gameModal = await CloudFunctions.getRecentRecord();
    if (typeof gameModal === 'undefined')
        gameModal = new CardGame();

    let html;
    const res = await fetch('/view/templates/home_page_template.html', { cache: 'no-store' });
    html = await res.text();
    Elements.root.innerHTML = html;

    getScreenElements();
    addGameEvents();
    updateScreen();
}

function getScreenElements() {
    screen.balance = document.getElementById('balanceCounter');
    screen.currentBets = document.getElementById('cBets');
    screen.debt = document.getElementById('debtCounter');
    screen.cardLocation = document.getElementById('cardLocation');

    screen.cards = [];
    screen.bets = [];
    screen.reduceButtons = [];
    screen.increaseButtons = [];
    for (let i = 0; i < 3; i++) {
        screen.cards.push(document.getElementById('image-' + i));
        screen.bets.push(document.getElementById('betCounter-' + i));
        screen.reduceButtons.push(document.getElementById('btnCounterMinus-' + i));
        screen.increaseButtons.push(document.getElementById('btnCounterPlus-' + i));
    }

    screen.playButton = document.getElementById('playBtn');
    screen.restartButton = document.getElementById('restartBtn');
    screen.newGameButton = document.getElementById('newGameBtn');
    screen.statusMessage = document.getElementById('status-section');
}

function addGameEvents() {

    const manageUpdateBet = document.getElementsByClassName('formUpdateBet');
    for (let i = 0; i < manageUpdateBet.length; i++) {
        manageUpdateBet[i].addEventListener('submit', async e => {
            e.preventDefault();
            const submitter = e.target.submitter;
            const formId = e.currentTarget.id;
            const pos = await formId[formId.length - 1];

            if (submitter == 'REDUCE') {
                gameModal.bets[pos]--;
                gameModal.currentBets--;

            } else if (submitter == 'INCREASE') {
                gameModal.bets[pos]++;
                gameModal.currentBets++;
            } else {
                if (Constants.DEV) console.log(e);
            }
            updateScreen();
        });
    }

    screen.playButton.addEventListener('click', playBtnHandler);

    screen.newGameButton.addEventListener('click', async () => {
        // gameModal = await CloudFunctions.getRecentRecord();
        screen.initState = false;
        for (let i = 0; i < 3; i++) {
            screen.cards[i].src = Constants.imagePaths.back;
        }
        if(typeof gameModal === 'undefined'){
            gameModal = new CardGame(); 
        }
        else {
            gameModal = new CardGame({balance: gameModal.balance})
        }
        gameModal.status = 'Bet on cards and press [PLAY]'
        updateScreen();
    });

    screen.restartButton.addEventListener('click', async () => {
        screen.initState = true;
        gameModal = new CardGame(); 
        addGameHistory({
            "balance": 15,
            "email": currentUser.email,
            "timestamp":  Date.now(),
            "restart": true
        })
        updateScreen();
    });
}

function updateScreen() {
    screen.balance.innerHTML = gameModal.balance;
    screen.currentBets.innerHTML = gameModal.currentBets;
    screen.cardLocation.innerHTML = gameModal.cardLocation;

    for (let i = 0; i < 3; i++) {
        screen.bets[i].innerHTML = gameModal.bets[i];
        screen.reduceButtons[i].disabled = !gameModal.running || gameModal.bets[i] <= 0;
        screen.increaseButtons[i].disabled = !gameModal.running || gameModal.currentBets == gameModal.balance;
    }
    screen.playButton.disabled = !gameModal.running || gameModal.currentBets == 0;
    screen.newGameButton.disabled = gameModal.running || gameModal.balance == 0;
    screen.restartButton.disabled = !gameModal.balance == 0;

    screen.statusMessage.innerHTML = gameModal.status;

    if(screen.initState) {
        for (let i = 0; i < 3; i++) {
            screen.reduceButtons[i].disabled = true;
            screen.increaseButtons[i].disabled = true;
        }
        screen.restartButton.disabled = true;
        screen.playButton.disabled = true;
        screen.newGameButton.disabled = false;
    }
}

async function playBtnHandler(e) {
    for (let i = 0; i < 3; i++) {
        screen.cards[i].src = Constants.imagePaths.empty;
        if (i == gameModal.cardLocation) {
            screen.cards[i].src = Constants.imagePaths.firebase;
        }
    }
    await gameModal.updateGameState();
    // await addDbEntry(false);
    gameModal.status = `You won ${gameModal.won} by betting ${gameModal.currentBets} coins <br>
    Press [New Game] to play again.`;
    screen.playButton.disabled = true;
    let data = gameModal.toFirestore();
    data["email"] = currentUser.email;
    data["timestamp"] = Date.now();
    data["restart"] = false;
    addGameHistory(data)
    updateScreen();
}