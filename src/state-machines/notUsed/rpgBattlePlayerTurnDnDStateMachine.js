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

export const rpgBattlePlayerTurnDnDStateMachine = Machine({
    id: "player",
    initial: "idle",
    context: {
        resolveResult:"",
        player:0,
        attack:0,
        defense:0,
        hp:0,
        attackValue:0,
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