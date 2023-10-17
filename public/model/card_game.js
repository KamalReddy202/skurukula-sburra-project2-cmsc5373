export class CardGame {
    constructor({ balance = 15 } = {}) {
        this.balance = balance
        this.currentBets = 0;
        this.cardLocation = Math.floor(Math.random() * 3);
        this.bets = [0, 0, 0];
        this.won = 0;
        this.running = true;

        this.status = 'Press [New Game] button to start!';
    }

    updateGameState() {
        for (let i = 0; i < this.bets.length; i++) {
            const bet = this.bets[i];
            this.balance -= bet;
            if (i == this.cardLocation) {
                this.won = bet * 3;
                this.balance += this.won;
            }
        }
        this.running = false;
    }

    set_docId(id, timestamp) {
        this.docId = id;
        this.timestamp = timestamp;
    }

    toFirestore() {
        return {
            balance: this.balance,
            won: this.won,
            bets: this.currentBets,
        };
    }
}