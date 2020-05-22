import {Machine, assign, sendParent, send, actions} from "xstate";
import {initialContext} from "./intialContextDnD";

const { cancel } = actions;

/*
taken from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-4.php
 */
const rand = (min, max)=> {
    if (min==null && max==null)
        return 0;

    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
};

const resetPlayerHp = assign({
    player: (ctx) => {
        const player = {...ctx.player};
        player.hp = player.maxHp;
        return player;
    },
    damageDone:0
});

const computeDamageDoneToPlayer = assign({
    player: (ctx) => {
        const player = {...ctx.player};
        const damageDone = rand(player.defense*3,player.defense*4)
        player.hp = player.hp - damageDone;
        return player;
    }
});

const computeExperienceWon = assign({
    player: (ctx) => {
        const player = {...ctx.player};
        player.maxAttack = player.maxAttack + 1;
        player.minAttack = player.minAttack + 1;
        player.defense = player.defense + 1;
        player.maxHp = Math.floor(player.maxHp + 0.05*player.maxHp);
        return player;
    }
});


const computeDamageDoneToEnemy = assign({
    enemy: (ctx) => {
        const enemy = {...ctx.enemy};
        const damageDone = rand(enemy.defense*3,enemy.defense*4)
        enemy.hp = enemy.hp - damageDone;
        return enemy;
    }
});

const playerTurn = assign({
    currentTurn: "player"
});
const enemyTurn = assign({
    currentTurn: "enemy"
});

const resetDiceValue = assign({
    diceValue: (ctx) => {
        const {minAttack} = ctx[ctx.currentTurn];
        return minAttack;
    }
});


const changeToNextDiceValue = assign({
    diceValue: (ctx) => {
        const _diceValue = ctx.diceValue;
        const {maxAttack, minAttack} = ctx[ctx.currentTurn];
        let diceValue = _diceValue + 1;
        diceValue = diceValue > maxAttack ? minAttack : diceValue;
        return diceValue;
    }
});

const updateParentCharacterData = sendParent((context,event) => {return{
    type: "UPDATE_PLAYER",
    data: {...context}
}});

const sendTakenDamage = send('TAKEN_DAMAGE');

// const rollAfterTime = send('ROLL', {
//     delay: 1000,
//     id: 'rollTimer' // give the event a unique ID
// });
//
// const cancelRollTimer = cancel('rollTimer'); // pass the ID of event to cancel

export const rpgSimpleBattle = Machine(
    {
        id: 'simpleBattle',
        initial: 'idle',
        context: {
            // player: {},
            // enemy: {},
            player:{
                name: "Blue White Mouse",
                prefab: "CylinderPrefab",
                hp: 300,
                maxHp:300,
                defense:3,
                attack:0,
                // raises level, raises this ones
                maxAttack:12,
                minAttack:1
            },
            enemy:{
                name: "White Grey Mouse",
                prefab: "SpherePrefab",
                hp: 100,
                maxHp:100,
                defense:2,
                attack:0,
                // raises level, raises this ones
                maxAttack:10,
                minAttack:1
            },
            diceValue: 0,
            damageDone:0,
        },
        states: {
            idle: {
                entry: [resetPlayerHp],
                on: {
                    PLAYER_INPUT: {
                        target: "playerTurn",
                    }
                }
            },
            playerTurn: {
                entry: [playerTurn, updateParentCharacterData, resetDiceValue],
                on: {
                    // Transient transition
                    // Will transition to either 'win' or 'lose' immediately upon
                    // (re)entering 'playing' state if the condition is met.
                    '': [
                        {target: 'win', cond: 'didPlayerWin'},
                        {target: 'lose', cond: 'didPlayerLose'}
                    ],
                    // Self-transition
                    PLAYER_INPUT: {
                        target: 'rollDice',
                        cond:"isRoll"
                    },
                }
            },
            enemyTurn: {
                entry: [enemyTurn, updateParentCharacterData, resetDiceValue],
                on: {
                    // Transient transition
                    // Will transition to either 'win' or 'lose' immediately upon
                    // (re)entering 'playing' state if the condition is met.
                    '': [
                        {target: 'win', cond: 'didPlayerWin'},
                        {target: 'lose', cond: 'didPlayerLose'}
                    ],
                    PLAYER_INPUT:{target:'rollDice',cond:"isRoll"}
                }
            },
            rollDice: {
                after: {
                    // transition to "yellow" after 1 second
                    50: "rollDice"
                },
                entry: [
                    // rollAfterTime,
                    changeToNextDiceValue,
                    updateParentCharacterData
                ],
                on: {
                    "":{
                        target:"computeDamage",
                        // actions: cancelRollTimer,
                        cond:"willEnemyStop"
                    },
                    PLAYER_INPUT: {
                        target: "computeDamage",
                        // actions: cancelRollTimer,
                        cond: "isPlayerTurn"
                    },
                    // ROLL: {
                    //     target: "rollDice",
                    //     actions: changeToNextDiceValue,
                    //     cond:"isRoll"
                    // },
                }
            },
            computeDamage: {
                entry: [updateParentCharacterData],
                on: {
                    "":[
                        {
                            target:"playerTurn",
                            actions:[computeDamageDoneToPlayer,sendTakenDamage,updateParentCharacterData],
                            cond:"hasPlayerTakenDamage"
                        },
                        {
                            target:"enemyTurn",
                            actions:[computeDamageDoneToEnemy,sendTakenDamage,updateParentCharacterData],
                            cond:"hasEnemyTakenDamage"
                        },
                        {
                            target:"playerTurn",
                            cond:"isEnemyTurn"
                        },
                        {
                            target:"enemyTurn",
                            cond:"isPlayerTurn"
                        },
                    ],
                }
            },
            win: {
                entry:computeExperienceWon,
                type: 'final',
                data: {
                    player: (context) => context.player,
                    enemy: (context) => context.enemy,
                }
            },
            lose: {
                type: 'final',
                data: {
                    player: (context) => context.player,
                    enemy: (context) => context.enemy
                }
            }
        }
    },
    {
        guards: {
            didPlayerWin: (ctx) => {
                // check if player won
                return ctx.enemy.hp <= 0;
            },
            didPlayerLose: (ctx) => {
                // check if player lost
                return ctx.player.hp <= 0;
            },
            isPlayerTurn: (ctx) => {
                return ctx.currentTurn === "player";
            },
            isEnemyTurn: (ctx) => {
                return ctx.currentTurn !== "player";
            },
            willEnemyStop: (ctx) => {
                return ctx.currentTurn !== "player" && Math.random() > 0.95;
            },
            hasPlayerTakenDamage: (ctx) => {
                return  ctx.currentTurn !== "player" && ctx.player.defense < ctx.diceValue;
            },
            hasEnemyTakenDamage: (ctx) => {
                return ctx.currentTurn === "player" && ctx.enemy.defense < ctx.diceValue;
            },
            isRoll: () => {
                // TODO: this is just because annonymous group transitions need a cond
                return true;
            }
        },
        // delays: {
        //     ROLL: 1000 // static value
        // },
    }
);