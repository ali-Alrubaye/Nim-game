class Player {
    constructor(name, myTurn) {
        this.name = name;
        this.mySticks = 0;
        this.score = 0;
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
    get_player() {
        return this.players;
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
    }
    computeMove() {
        let move_stick = 0;
        let stack = this.stack;
        for (let i = 3; i > 0; i--) {
            let test = stack - i;
            if (test % 2 === 1 && stack > 0) {
                move_stick = i;
                setTimeout(() => {
                    this.draw_sticks(move_stick)
                }, 1000);
                break;
            } else if (stack == 1) {
                this.draw_sticks(i)
            }
        }
        console.log('move_stick', move_stick)
        console.log('sticks', stack)
        console.log('Stack - move_stick ', stack - move_stick);

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
    start_over() {
        // to reset game => start over game
        this.stack = 21;
        let player_reset = document.querySelectorAll('.player_sticks');
        for (let i = 0; i < this.players.length; i++) {
            const element = this.players[i];
            element.mySticks = 0
            player_reset[i].innerHTML = '';
        }
        this.player_is_active();
        this.throw();
    }
    start_twoPlayers() {
        // let player1 = 'Player 1'; // Test Data
        // let player2 = 'Player 2'; // Test Data
        // let player1 = prompt("Name of player one?");
        // let player2 = prompt("Name of player two?");
        swal("Name of player one?", {
                content: "input",
            })
            .then((player1) => {
                let p1 = player1 == '' ? 'Player 1' : player1
                this.addPlayer(p1);
                let player_one = document.getElementById("name_one");
                player_one.innerHTML = p1;
                player_one.parentElement.dataset.name = p1;
            }).then(() => {
                swal("Name of player two?", {
                    content: "input",
                }).then((player2) => {
                    let p2 = player2 == '' ? 'Player 2' : player2
                    this.addPlayer(p2);
                    let player_two = document.getElementById("name_two");
                    player_two.innerHTML = p2;
                    player_two.parentElement.dataset.name = p2;
                }).then(() => {
                    this.player_is_active();
                    this.throw();
                })
            });
    }
    startGame() {
        swal("Select Game Mode:", {
                buttons: {
                    cancel: "Cancel",
                    catch: {
                        text: "vs. Computer",
                        value: "Computer",
                    },
                    defeat: {
                        text: "Two Players",
                        value: "two",
                    },
                },
            })
            .then((value) => {
                switch (value) {
                    case "two":
                        this.start_twoPlayers()
                        break;
                    case "Computer":
                        swal("Name of player one?", {
                                content: "input",
                            })
                            .then((player1) => {
                                let p1 = player1 == '' ? 'Player 1' : player1
                                this.addPlayer(p1);
                                let player_one = document.getElementById("name_one");
                                player_one.innerHTML = p1;
                                player_one.parentElement.dataset.name = p1;
                            }).then(() => {

                                let p2 = 'Computer';
                                this.addPlayer(p2);
                                let player_two = document.getElementById("name_two");
                                player_two.innerHTML = p2;
                                player_two.parentElement.dataset.name = p2;

                            }).then(() => {
                                this.player_is_active();
                                this.throw();
                            });
                        break;
                    default:
                        swal("Godbey ", {
                            buttons: false,
                            timer: 1000,
                        });
                }
            });
    }
    player_is_active() {
        let player_active = document.querySelectorAll('.player');
        player_active.forEach((x, index) => {
            x.classList.remove('active');
            if (this.players[index].myTurn == true) {
                x.classList.add('active');
            }
            if (this.players[index].name == 'Computer' && this.players[index].myTurn == true) {
                if (this.stack > 0) {
                    this.computeMove()
                }
            }
        })
    }
    endGame() {
        if (this.stack <= 0) {
            this.players.forEach(p => {
                if (p.myTurn) {
                    p.score = p.score + 2;
                    let win = `You  winner ${p.name}`;
                    swal(win)
                        .then((value) => {
                            if (value) {
                                swal('Do you want play again?')
                                    .then((value) => {
                                        if (value) {
                                            this.start_over(); // Starta spelet med samma namn
                                        }
                                    });
                            }
                        });
                }
            });
        }
        // let play_again = confirm('Do you want play again?'); // fråga om vinnare vill har spela igen 
        // if (play_again) {
        //     this.start_over(); // Starta spelet med samma namn
        // } else {
        //     console.log('End Game')
        // }
    }
};

let game1 = new Game();

document.addEventListener("DOMContentLoaded", function(e) {

    game1.startGame();

    let btn1 = document.getElementById('btn1');
    let btn2 = document.getElementById('btn2');
    let btn3 = document.getElementById('btn3');

    btn1.addEventListener('click', () => { game1.draw_sticks(1) })
    btn2.addEventListener('click', () => { game1.draw_sticks(2) })
    btn3.addEventListener('click', () => { game1.draw_sticks(3) })

    let start_over_game = document.getElementById('btn_over');
    start_over_game.addEventListener('click', () => {
        game1.start_over();
    });

    let hig_btn = document.getElementById('hig_btn');
    hig_btn.addEventListener('click', showHighscore);

    let high = document.getElementById("highscoreID");

    function showHighscore() {
        high.classList.toggle('highscoreHid')
        let player_one_score = document.getElementById("player1score");
        player_one_score.innerHTML = ''
        game1.get_player().forEach((player, index) => {
            if (player.score > 0) {
                let span = document.createElement('span');
                let text = document.createTextNode(`- ${player.name}'s score is ${player.score}`);
                span.appendChild(text)
                player_one_score.appendChild(span);
            }
        })
    }

    function misereNimBool() {
        let xorsum = 0;
        let stack = game1.stack;
        stack -= 4;
        for (let i = 0; i < stack; i++) {
            xorsum ^= i;
        }
        if (xorsum !== 0) {
            console.log('First Win')
            for (let i = 0; i < stack; i++) {
                if (i > (i ^ xorsum)) {
                    console.log(`First Move ${(i - (i ^ xorsum))} stones from ${i}`);
                    break;
                }
            }
        } else {
            console.log('Second win')
        }
    }
    // misereNimBool()


});

/**
 * if current Xor != 0 => I can win.
 * So if you are in a game state, make the move that makes the next state XOR = 0.
 * Hence user in losing state.
 * whatever he did, he will return me to xor != 0.
 * Again and again till all piles = 0.
 */