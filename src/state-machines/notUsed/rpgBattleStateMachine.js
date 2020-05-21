import {Machine, assign, spawn,interpret} from "xstate";
import { rpgBattlePlayerTurnStateMachine} from "./rpgBattlePlayerTurnStateMachine";

// TODO : remove - just for dev

const playerStats = [
    {
        name: "Blue White Mouse",
        isBot: false,
        initColor: {
            r: 200,
            g: 200,
            b: 40,
        },
        position: {
            x: -3,
            y: -2,
            z: 25,
        },
        rotation: {
            x: 0.1,
            y: -0.4,
            z: 0.4,
        },
        attacks: [
            {
                label: ".",
                type: "absorb",
                damage: { r: 255, g: 0, b: 255 },
                dialog: " hmmm hmmm hmmm",
            },
            {
                label: ".",
                type: "absorb",
                damage: { r: 0, g: 255, b: 255 },
                dialog: " 'bytes' the enemy!",
            },
            {
                label: ".",
                type: "absorb",
                damage: { r: 255, g: 255, b: 0 },
                dialog: " 'bytes' the enemy!",
            },
            {
                label: "Focus",
                type: "recharge",
                damage: { r: 0, g: 0, b: 0 },
                dialog: " is feeling a surge of color!",
            },
            {
                label: "Release",
                type: "release",
                damage: { r: 0, g: 0, b: 0 },
                dialog: " realeases every color on the enemy!",
            },
        ],
    },
];
const enemyStats = [

];
const sphereOptions = {
    colors: [
        { r: 255, g: 0, b: 255 },
        { r: 0, g: 255, b: 255 },
        { r: 255, g: 255, b: 0 },
    ],
    startingSize: 0.4,
};


// actions
const changePlayer1 = assign({player: 1});
const changePlayer2 = assign({player: 2});
const addNewPlayer = assign({
    playerActors: (ctx, event) => {
        const newPlayer = {};
        const _playerData = event && event.playerData ? event.playerData : {}
        newPlayer.playerData = {..._playerData};
        newPlayer.playerStats = playerStats[ctx.playerGenerated];
        newPlayer.sphereOptions = {
            color: sphereOptions.colors[ctx.playerGenerated],
            startingSize: sphereOptions.startingSize,
        };
        newPlayer.player = ctx.playerGenerated;
        return  [...ctx.playerActors,spawn(rpgBattlePlayerTurnStateMachine.withContext(newPlayer),`player${ctx.playerGenerated+1}`)]
    },
    playerGenerated: (ctx,_)=> {return ctx.playerGenerated++}
});
// const addActionQueue = assign({
//     actionQueueMachineRef: (ctx) => spawn(actionQueueMachine, 'actionQueueMachine'),
// });

//conds
const existsAvailablePlayerNumberData = (context, _) => {
    return context.playerGenerated < playerStats.length;
};

//state machine
const _rpgBattleMachine = Machine({
    id: "battle",
    initial: "intro",
    context: {
        playerGenerated:0,
        player: 0,
        attack: "",
        playerActors: []
    },
    // entry: addActionQueue,
    states: {
        intro: {
            on: {
                NEW_PLAYER: {
                    actions: [addNewPlayer],
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
                ENEMY_TURN: 'enemyTurn',
                ENEMY_DEATH: 'win',
                PLAYER_DEATH: 'lose',
            },
        },
        enemyTurn: {

            entry: changePlayer2,
            on: {
                PLAYER_TURN: 'playerTurn',
                ENEMY_DEATH: 'win',
                PLAYER_DEATH: 'lose',
            },
        },
        lose: {
            type: 'final'
        },
        win: {
            type: 'final'
        },
    }
});

export const rpgBattleMachine = _rpgBattleMachine;


