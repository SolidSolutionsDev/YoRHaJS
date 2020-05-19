import {Machine, assign, spawn} from "xstate";
import {createPlayerMachine, rpgBattlePlayerTurnStateMachine} from "./playerMachine";
import {playerStats, sphereOptions} from "../solid-solutions-backend/constants/states";

const changePlayer1 = assign({player: 1});
const changePlayer2 = assign({player: 2});

const addNewPlayer = assign({
    playerActors: (ctx, event) => {
        const newPlayer = event.playerData;
        newPlayer.playerStats = playerStats[ctx.playerGenerated];
        newPlayer.sphereOptions = {
            color: sphereOptions.colors[ctx.playerGenerated],
            startingSize: sphereOptions.startingSize,
        };
        return  [...ctx.playerActors,spawn(rpgBattlePlayerTurnStateMachine.withContext(newPlayer))]
    },
    playerGenerated: (ctx,_)=> {return ctx.playerGenerated++}
});

const existsAvailablePlayerNumberData = (context, _) => {
    return context.playerGenerated < playerStats.length;
};

export const rpgBattleMachine = Machine({
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
                    actions: [addNewPlayer
                        // ,
                        // "persist"
                    ],
                    cond: existsAvailablePlayerNumberData
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


