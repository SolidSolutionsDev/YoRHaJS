import {Machine, assign} from "xstate";
import {actionMachine} from "./rpgBattleActionStateMachine";
//
// const setAction = assign({
//     action: (_, event) => {return event.action}
// })
//
// const allowedActions = (ctx,event)=> {return (event && event.action < ctx.playerStats.attacks.length && event.action >= 0);}

export const rpgBattlePlayerSphereStateMachine = Machine({
    id: "sphere",
    initial: "initing",
    context: {
        size:null,
        sizeChangeRation:null,
        sphereSpeedIndex:null,
    },
    states:{
        initing: {
            on: {
                START_ROTATION: {
                    target:'rotating',
                },
            },
        },
        rotating: {
            on: {
                LAUNCH_ATTACK: {
                    target: "attacking",
                }
            }
        },
        attacking:{
            on: {
                DELIVER_ATTACK: {
                    target: "exploding",
                }
            }
        },
        exploding:{
            on: {
                DESTROY_SPHERE: {
                    target: "dead",
                }
            }
            },
        dead:{
            type:"final"
        },
    }
});