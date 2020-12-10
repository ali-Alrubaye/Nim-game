class Player {
    constructor(name, myTurn) {
        this.name = name;
        this.mySticks = 0
        this.myTurn = myTurn;
    };
};

class Game {
    constructor() {
        this.players = [];
        this.stack = 21;
        this.throw();
        this.throw_player_sticks();
    };
    throw () {
        let game_sticks = document.getElementById('game_sticks');
        game_sticks.innerHTML = '';
        for (let i = 0; i < this.stack; i++) {
            game_sticks.innerHTML += `<img src="images/stick.png" id="stick_${i + 1}" alt="">`;
        }
    }
    throw_player_sticks() {
        let player_sticks = document.querySelectorAll('.player_sticks');
        for (let i = 0; i < this.players.length; i++) {
            const element = this.players[i];
            player_sticks[i].innerHTML = `Stick: ${element.mySticks}`;
        }
    }
    addPlayer(playername) {
        let newPlayer = new Player(playername, false);
        this.players.push(newPlayer);
        this.players[0].myTurn = true;
    };

    change_player_turn() {
        this.players.forEach(x => {
                x.myTurn = x.myTurn ? false : true;
            })
            // p.myTurn = p.myTurn ? false : true;
    }
    draw(number) {
        if (this.stack == 0) {
            this.endGame();
        }
        for (let player of this.players) {
            if (player.myTurn == true) {
                this.stack -= number;
                this.throw();
                // console.log('player ' + player.name + ' ' + player.myTurn + ' ' + -number)
                if (this.stack == 0 || this.stack == 1) {
                    // console.log('you win ' + player.name + ' ' + player.myTurn)
                    let test = this.players.find(x => x.myTurn == false);
                    return test;
                }
            } else {
                // player.myTurn = true;
                // this.change_player_turn(player)
                // document.getElementById("player1ID").classList.add("active");
            }
            this.change_player_turn(player);
        }
        this.player_is_active()
    }
    draw_sticks(number) {
        if (this.stack == 0) {
            this.endGame();
        }
        this.stack -= number; // Minska från total Sticks
        this.throw();

        if (this.stack > 0) {
            this.set_player(number);
        } else {
            this.set_player(number);
            this.endGame();
        }
    }
    set_player(number) {
        this.players.forEach(p => {
            if (p.myTurn) {
                p.mySticks += number; // Addera hur mycket spelare drågit
                this.throw_player_sticks(); // Addera hur mycket spelare har samlat
            }
        })
        this.change_player_turn(); // ätt andra spelare till true & nuvarande spelare till false
        this.player_is_active(); // Det ska placera efter change_player_turn
    }
    startGame() {

        // let player1 = 'Player 1'; // Test Data
        // let player2 = 'Player 2'; // Test Data
        let player1 = prompt("Name of player one?");
        let player2 = prompt("Name of player two?");
        this.addPlayer(player1);
        this.addPlayer(player2);

        let player_one = document.getElementById("name_one");
        player_one.innerHTML = player1;
        player_one.parentElement.dataset.name = player1;
        let player_two = document.getElementById("name_two");
        player_two.innerHTML = player2;
        player_two.parentElement.dataset.name = player2;
        this.player_is_active();
        this.throw();
    }
    player_is_active() {
        let player_active = document.querySelectorAll('.player');
        player_active.forEach((x, index) => {
            x.classList.remove('active');
            if (this.players[index].myTurn == true) {
                x.classList.add('active');
            }
        })
    }
    endGame() {
        if (this.stack <= 0) {
            this.players.forEach(p => {
                if (p.myTurn) {
                    alert(`You  winner ${p.name}`)
                }
            })
        }
        let play_again = confirm('Do you want play again?');
        if (play_again) {
            this.startGame();
            console.log(play_again)
        } else {
            console.log(play_again)
        }
        console.log('The end')
    }
};


let max_draw = 3;
let count = 21;


document.addEventListener("DOMContentLoaded", function(e) {

    let game1 = new Game();
    game1.startGame();
    /**
     * // Todo list.
     * 
     * start over game
     * highscore
     */
    let start_over_game = document.getElementById('btn_over'); // Todo 
    start_over_game.addEventListener('click', () => {
        // if (game1.stack == 21) {
        //     location.reload();
        // }
        game1.startGame();
    })

    let btn1 = document.getElementById('btn1');
    let btn2 = document.getElementById('btn2');
    let btn3 = document.getElementById('btn3');

    btn1.addEventListener('click', () => { game1.draw_sticks(1) })
    btn2.addEventListener('click', () => { game1.draw_sticks(2) })
    btn3.addEventListener('click', () => { game1.draw_sticks(3) })
});