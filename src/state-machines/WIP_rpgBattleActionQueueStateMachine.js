import {Machine, assign, send} from "xstate";
import {actionMachine} from "./rpgBattleActionStateMachine";

const enqueueAction = assign({
    actionsQueue: (ctx, event) => {return [event.action,...ctx.actionsQueue]}
})

const validAction = (_,event)=> {return (event.action);}


const readyCurrentAction = assign({
    action:(ctx,_)=>{return ctx.actionsQueue[0]},
    actionsQueue:(ctx,_)=>{return ctx.actionsQueue.slice(1)}
});
const orderActionToStart = send("START_ACTION",{to:"action-player"});
const setResolve = assign({
        resolve: (ctx, event) => event.data.resolve,
    });

export const actionQueueMachine = Machine({
    id: "actionQueue",
    initial: "idle",
    context: {
        actionsQueue: [],
        resolve: null,
        action:null,
    },
    states: {
        idle: {
            on: {
                ENQUEUE_ACTION: {
                    target:"executingAction",
                    actions: [enqueueAction],
                    cond: validAction,
                },
            },
        },
        executingAction: {
            invoke: {
                id: 'action-player',
                src: actionMachine,
                data: {
                    actionId: (context, event) => context.action
                },
                onDone: {
                    target: 'informResolve',
                    actions: [setResolve]
                },
            },
            entry:[
                readyCurrentAction,
                orderActionToStart
            ],
            on: {
                ENQUEUE_ACTION: {
                    actions: [enqueueAction],
                    cond: validAction,
                },
            },
        },
        informResolve: {
            entry:["informParent"]
        },
        battleFinished: {},
        gameOver: {},
    }
});


