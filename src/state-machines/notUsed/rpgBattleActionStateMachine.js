import {Machine,} from "xstate";

export const actionMachine = Machine({
    id: "action",
    initial: "idle",
    context:{
        actionId: "",
        animation: null,
        resolveResult: 1,
    },
    states: {
        idle: {
            on: {
                START_ACTION: {
                    target: "playAnimation"
                }
            }
        },
        playAnimation: {
            on: {
                RESOLVE_ACTION: {
                    target: "resolveAction"
                }
            }
        },
        resolveAction: {
            on: {
                RESOLVE_DONE: {
                    target: "end"
                }
            }
        },
        end: {
            type: "final",
            data: {resolveResult: (context) => context.resolveResult}
        }
    }
});
