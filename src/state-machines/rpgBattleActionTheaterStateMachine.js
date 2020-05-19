import {Machine, assign, spawn} from "xstate";
import {createPlayerMachine, rpgBattlePlayerTurnStateMachine} from "./playerMachine";

const changePlayer1 = assign({player: 1});
const changePlayer2 = assign({player: 2});

export const rpgMachine = Machine({
    id: "battle",
    initial: "intro",
    context: {
        playerGenerated:0,
        player: 0,
        attack: "",
        playerActors: []
    },
    states: {
        intro: {
            on: {
                NEW_PLAYER: {
                    actions: [
                        assign({
                            playerActors: (ctx, event) => {
                                const newPlayer = event.playerData;
                                return  [...ctx.playerActors,spawn(rpgBattlePlayerTurnStateMachine.withContext(newPlayer))]
                                },
                            playerGenerated: (ctx,event)=> {return ctx.playerGenerated++}
                            }),
                        "persist"
                    ]
                },
                PLAYER_TURN: {
                    target: 'playerTurn',
                },
                ENEMY_TURN: {
                    target: 'enemyTurn',
                }
            },
        },
        playerTurn: {
            entry: changePlayer1,
            on: {
                PLAYER_ATTACK: 'playerAttacking',
            },
        },
        enemyTurn: {

            entry: changePlayer2,
            on: {
                ENEMY_ATTACK: 'enemyAttacking',
            },
        },
        playerAttacking: {
            on: {
                PASS_TURN_TO_ENEMY: 'enemyTurn',
                ENEMY_DEATH: 'enemyDeath',
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


