import {Machine, assign, spawn} from "xstate";
import {createPlayerMachine, rpgBattlePlayerTurnStateMachine} from "./playerMachine";

const setNewGameData = assign({startScene: 0});
const changePlayer2 = assign({player: 2});

export const rpgMachine = Machine({
    id: "game",
    initial: "intro",
    context: {
    },
    states: {
        intro: {
            on: {
                GO_TO_MAIN_MENU: {
                    target: 'mainMenu',
                },
            },
        },
        mainMenu: {
            on: {
                START_NEW_GAME: 'startNewGame',
                LOAD_GAME: 'loadGame',
            },
        },
        startGame: {
            entry: setNewGameData,
            on: {
                GO_TO_MAIN_MENU: 'mainMenu',
            },
        },
        loadGame: {
            on: {
                GO_TO_MAIN_MENU: 'mainMenu',
                LOAD_SELECTED_GAME: 'enemyDeath',
            },
        },
        enemyAttacking: {
            on: {
                PASS_TURN_TO_PLAYER: 'playerTurn',
                PLAYER_DEATH: 'playerDeath',
            },
        },
        playerDeath: {
            on: {
                END_BATTLE: 'gameOver',
            },
        },
        enemyDeath: {
            on: {
                END_BATTLE: 'battleFinished',
            },
        },
        battleFinished: {},
        gameOver: {},
    }
});


