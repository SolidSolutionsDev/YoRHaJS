import { Machine, assign, sendParent, send, actions } from "xstate";
import { initialContext } from "./intialContextDnD";

const { cancel } = actions;

/*
taken from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-4.php
 */
const rand = (min, max) => {
  if (min == null && max == null) return 0;

  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};

const idleMessage = assign({
    statusMessage:(ctx) =>{
        return "Cleaner:"+ctx.enemy.introMessage;
    }
});
const computeDamageMessage = assign({
    statusMessage:(ctx,event,actionMeta) =>{
        const currentState = actionMeta.state ? actionMeta.state.value:null;
        const inverseTurn = ctx.currentTurn === "player" ? "enemy": "player";
        let introMessage = ctx[inverseTurn].damageTaken > 0 ? "Success" : "Failed";
        introMessage+=" to  exceed " + inverseTurn + " defenses!\n"
        return introMessage+`Damage done by ${ctx.currentTurn}: ${ctx[inverseTurn].damageTaken}`;;
    }
});
const rollDiceMessage = assign({
    statusMessage:(ctx) =>{
         return `Ongoing ${ctx.currentTurn} attack!\n${ctx.currentTurn === "player"? "Press space to stop counter!": "Waiting..."}`
    }
});
const playerTurnMessage = assign({
    statusMessage:(ctx) =>{
         return `Your turn. Press space to start attack!`
    }
});
const enemyTurnMessage = assign({
    statusMessage:(ctx) =>{
         return `Enemy turn. Press space to start attack!`
    }
});
const winMessage = assign({
  statusMessage: ctx => {
    return ctx.enemy.winMessage;
  }
});
const loseMessage = assign({
  statusMessage: ctx => {
    return ctx.enemy.loseMessage;
  }
});

const resetPlayerHp = assign({
  player: ctx => {
    const player = { ...ctx.player };
    player.hp = player.maxHp;
    return player;
  }
});

const resetEnemyHp = assign({
  enemy: ctx => {
    const enemy = { ...ctx.enemy };
    enemy.hp = enemy.maxHp;
    return enemy;
  }
});

const computeDamageDone = assign({
  player: ctx => {
    if (ctx.currentTurn === "player") {
      return ctx.player;
    }
    const player = { ...ctx.player };
    const damageDone =
      ctx.diceValue > ctx.player.defense
        ? rand(player.defense * 3, player.defense * 4)
        : 0;
    player.hp = player.hp - damageDone;
    player.damageTaken = damageDone;
    return player;
  },
  enemy: ctx => {
    if (ctx.currentTurn === "enemy") {
      return ctx.enemy;
    }
    const enemy = { ...ctx.enemy };
    const damageDone =
      ctx.diceValue > ctx.enemy.defense
        ? rand(enemy.defense * 3, enemy.defense * 4)
        : 0;
    enemy.hp = enemy.hp - damageDone;
    enemy.damageTaken = damageDone;
    return enemy;
  }
});

const computeDamageDoneToPlayer = assign({
  player: ctx => {
    const player = { ...ctx.player };
    const damageDone = rand(player.defense * 3, player.defense * 4);
    player.hp = player.hp - damageDone;
    player.damageTaken = damageDone;
    return player;
  }
});

const computeDamageDoneToEnemy = assign({
  enemy: ctx => {
    const enemy = { ...ctx.enemy };
    const damageDone = rand(enemy.defense * 3, enemy.defense * 4);
    enemy.hp = enemy.hp - damageDone;
    enemy.damageTaken = damageDone;
    return enemy;
  }
});

const computeExperienceWon = assign({
  player: ctx => {
    const player = { ...ctx.player };
    player.maxAttack = player.maxAttack + 1;
    player.minAttack = player.minAttack + 1;
    player.defense = player.defense + 1;
    player.maxHp = Math.floor(player.maxHp + 0.05 * player.maxHp);
    return player;
  }
});

const playerTurn = assign({
  currentTurn: "player"
});
const enemyTurn = assign({
  currentTurn: "enemy"
});

const resetDiceValue = assign({
  diceValue: ctx => {
    const { minAttack } = ctx[ctx.currentTurn];
    return minAttack;
  }
});

const changeToNextDiceValue = assign({
  diceValue: ctx => {
    const _diceValue = ctx.diceValue;
    const { maxAttack, minAttack } = ctx[ctx.currentTurn];
    let diceValue = _diceValue + 1;
    diceValue = diceValue > maxAttack ? minAttack : diceValue;
    return diceValue;
  }
});

const updateParentCharacterData = sendParent((context, event) => {
  return {
    type: "UPDATE_PLAYER",
    data: { ...context }
  };
});

const sendTakenDamage = send("TAKEN_DAMAGE");

// const rollAfterTime = send('ROLL', {
//     delay: 1000,
//     id: 'rollTimer' // give the event a unique ID
// });
//
// const cancelRollTimer = cancel('rollTimer'); // pass the ID of event to cancel

export const rpgSimpleBattle = Machine(
  {
    id: "simpleBattle",
    initial: "idle",
    context: {
      // player: {},
      // enemy: {},
      player: {
        name: "Blue White Mouse",
        prefab: "CylinderPrefab",
        hp: 300,
        maxHp: 300,
        defense: 3,
        attack: 0,
        // raises level, raises this ones
        maxAttack: 12,
        minAttack: 1
      },
      enemy: {
        name: "White Grey Mouse",
        prefab: "SpherePrefab",
        hp: 100,
        maxHp: 100,
        defense: 2,
        attack: 0,
        // raises level, raises this ones
        maxAttack: 10,
        minAttack: 1
      },
      diceValue: 0,
      damageDone: 0
    },
    states: {
      idle: {
        entry: [resetPlayerHp, resetEnemyHp, idleMessage],
        on: {
          PLAYER_INPUT: {
            target: "playerTurn"
          }
        }
      },
      playerTurn: {
        entry: [
          playerTurn,
          updateParentCharacterData,
          resetDiceValue,
          playerTurnMessage
        ],
        exit: [resetDiceValue],
        on: {
          // Transient transition
          // Will transition to either 'win' or 'lose' immediately upon
          // (re)entering 'playing' state if the condition is met.
          "": [
            { target: "win", cond: "didPlayerWin" },
            { target: "lose", cond: "didPlayerLose" }
          ],
          // Self-transition
          PLAYER_INPUT: {
            target: "rollDice",
            cond: "isRoll"
          }
        }
      },
      enemyTurn: {
        entry: [
          enemyTurn,
          updateParentCharacterData,
          resetDiceValue,
          enemyTurn
        ],
        exit: [resetDiceValue],
        on: {
          // Transient transition
          // Will transition to either 'win' or 'lose' immediately upon
          // (re)entering 'playing' state if the condition is met.
          "": [
            { target: "win", cond: "didPlayerWin" },
            { target: "lose", cond: "didPlayerLose" }
          ],
          PLAYER_INPUT: { target: "rollDice", cond: "isRoll" }
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
          updateParentCharacterData,
          rollDiceMessage
        ],
        on: {
          "": {
            target: "computeDamage",
            // actions: cancelRollTimer,
            cond: "willEnemyStop"
          },
          PLAYER_INPUT: {
            target: "computeDamage",
            // actions: cancelRollTimer,
            cond: "isPlayerTurn"
          }
        }
      },
      computeDamage: {
        entry: [
          updateParentCharacterData,
          computeDamageDone,
          sendTakenDamage,
          updateParentCharacterData,
          computeDamageMessage
        ],
        on: {
          PLAYER_INPUT: [
            {
              target: "playerTurn",
              cond: "isEnemyTurn"
            },
            playerTurn: {
                entry: [playerTurn, updateParentCharacterData,resetDiceValue,playerTurnMessage],
                exit:[resetDiceValue],
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
                entry: [enemyTurn, updateParentCharacterData,resetDiceValue,enemyTurn,enemyTurnMessage],
                exit:[resetDiceValue],
                on: {
                    // Transient transition
                    // Will transition to either 'win' or 'lose' immediately upon
                    // (re)entering 'playing' state if the condition is met.
                    '': [
                        {target: 'win', cond: 'didPlayerWin'},
                        {target: 'lose', cond: 'didPlayerLose'}
                    ],
                    PLAYER_INPUT:{target:'rollDice',cond:"isRoll"}
                },
            },
            rollDice: {
                after: {
                    // transition to "yellow" after 1 second
                    50: "rollDice"
                },
                entry: [
                    // rollAfterTime,
                    changeToNextDiceValue,
                    updateParentCharacterData,
                    rollDiceMessage
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
                }
            },
            computeDamage: {
                entry: [updateParentCharacterData,computeDamageDone,sendTakenDamage,updateParentCharacterData,computeDamageMessage],
                on: {
                    PLAYER_INPUT:[
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
                entry:[computeExperienceWon,winMessage],
                type: 'final',
                data: {
                    player: (context) => context.player,
                    enemy: (context) => context.enemy,
                }
            },
            lose: {
                entry:[loseMessage],
                type: 'final',
                data: {
                    player: (context) => context.player,
                    enemy: (context) => context.enemy
                }
            }
          ]
        }
      },
      win: {
        entry: [computeExperienceWon, winMessage],
        type: "final",
        data: {
          player: context => context.player,
          enemy: context => context.enemy
        }
      },
      lose: {
        entry: [loseMessage],
        type: "final",
        data: {
          player: context => context.player,
          enemy: context => context.enemy
        }
      }
    }
  },
  {
    guards: {
      didPlayerWin: ctx => {
        // check if player won
        return ctx.enemy.hp <= 0;
      },
      didPlayerLose: ctx => {
        // check if player lost
        return ctx.player.hp <= 0;
      },
      isPlayerTurn: ctx => {
        return ctx.currentTurn === "player";
      },
      isEnemyTurn: ctx => {
        return ctx.currentTurn !== "player";
      },
      willEnemyStop: ctx => {
        return ctx.currentTurn !== "player" && Math.random() > 0.97;
      },
      hasPlayerTakenDamage: ctx => {
        return (
          ctx.currentTurn !== "player" && ctx.player.defense < ctx.diceValue
        );
      },
      hasEnemyTakenDamage: ctx => {
        return (
          ctx.currentTurn === "player" && ctx.enemy.defense < ctx.diceValue
        );
      },
      isRoll: () => {
        // TODO: this is just because annonymous group transitions need a cond
        return true;
      }
    }
    // delays: {
    //     ROLL: 1000 // static value
    // },
  }
);
