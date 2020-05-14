import {Machine} from "xstate";

export const rpgMachine = Machine({
    id: "battle",
    initial: "intro",
    states:{
        intro: {
            on: {
                PLAYER_1_TURN: 'player1Turn',
                PLAYER_2_TURN: 'player2Turn'
            },
        },
        player1Turn: {
            on: {
                PLAYER_1_ATTACK: 'player1Attack',
            },
        },
        player2Turn: {
            on: {
                PLAYER_2_ATTACK: 'player2Attack',
            },
        },
        player1Attack: {
            on: {
                PLAYER_2_TURN: 'player2Turn',
                PLAYER_2_DEATH: 'player2Death',
            },
        },
        player2Attack: {
            on: {
                PLAYER_1_TURN: 'player1Turn',
                PLAYER_1_DEATH: 'player1Death',
            },
        },
        player1Death: {
            on: {
                END_BATTLE: 'battleFinished',
            },
        },
        player2Death: {
            on: {
                END_BATTLE: 'battleFinished',
            },
        },
        battleFinished:{}
    }
});