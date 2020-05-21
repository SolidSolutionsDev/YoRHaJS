import {Machine, assign} from "xstate";
import {actionMachine} from "./rpgBattleActionStateMachine";

const setAction = assign({
    action: (_, event) => {return event.action}
})

const allowedActions = (ctx,event)=> {return (event && event.action < ctx.playerStats.attacks.length && event.action >= 0);}

const setResolve = assign({
    resolveResult: (ctx, event) => {
        console.log(event);
        return event.data.resolveResult
    },
});
export const rpgBattlePlayerTurnStateMachine = Machine({
    id: "player",
    initial: "idle",
    context: {
        resolveResult:"",
        player:0,
        attack:"",
        action:0,
        balls:[],
        playerStats:{
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
    },
    states:{
        idle: {
            on: {
                START_TURN: {
                    target:'selectAction',
                },
            },
        },
        selectAction: {
            on: {
                ACTION: {
                    target: "executeAction",
                    cond:   allowedActions,
                    actions: setAction
                }
            }
        },
        executeAction:{
            invoke: {
                id: 'action-player',
                src: actionMachine,
                data: {
                    actionId: (context, event) => context.action
                },
                onDone: {
                    //TODO:inform parent of resolve - onTransition ?
                    target: 'informResolve',
                    actions:  assign({
                        resolveResult: (ctx, event) => {
                            console.log(event);
                            return event.data.resolveResult
                        },
                    }),
                },
            },
        },
        battleFinished:{},
        informResolve:{
            type:"final"
        },
    }
});