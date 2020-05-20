import {Machine, assign} from "xstate";
/*
{
  "type": "LOAD_STEPS",
  "steps": [
    {
      "type": "audio"
    },
    {
      "type": "text"
    }
  ]
}
*/
const setSteps = assign(
     {
        steps: (_,event)=>{return event && event.steps ? event.steps :[]},
        currentTextSceneStep: 0
     }
        );

const goToStep = assign({currentTextSceneStep:(_, event) =>  { return event.step}});

const resetCurrentTextScene = assign({currentTextSceneStep: 0});

// const setCurrentTextScene = assign((_, event) => {
//     return {
//         currentTextSceneStep: 0,
//         currentTextScene: event.currentTextScene
//     }
// });

const increaseStep = assign({currentTextSceneStep:(ctx, _) =>  {return ctx.currentTextSceneStep+1}});

const currentStepIsPossible = (ctx, _) => {
    return ctx.currentTextSceneStep < ctx.steps.length && ctx.currentTextSceneStep>=0;
};
const newStepIsPossible = (ctx, event) => {
    return event.step < ctx.steps.length && event.step>=0;
};

const currentStepIsImpossible = (ctx, _,condMeta) => {
    return ctx.currentTextSceneStep >= ctx.steps.length || ctx.currentTextSceneStep<0;
};
const newStepIsImpossible = (ctx, event) => {
    return event.step >= ctx.steps.length ||  event.step<0;
};

const isAudio = (ctx,_,condMeta) => {
    return ctx.steps[ctx.currentTextSceneStep] && ctx.steps[ctx.currentTextSceneStep].type === "audio";
};

const isText = (ctx,event) => {
    console.log(ctx,event,"isText");
    return ctx.steps[ctx.currentTextSceneStep] && ctx.steps[ctx.currentTextSceneStep].type === "text";
};

const isTextOption = (ctx,_) => {
    console.log(ctx,"isTextOption");
    return ctx.steps[ctx.currentTextSceneStep] && ctx.steps[ctx.currentTextSceneStep].type === "textOption";
};

const isBackgroundChange = (ctx,_) => {
    console.log(ctx,"isBackgroundChange");
    return ctx.steps[ctx.currentTextSceneStep] && ctx.steps[ctx.currentTextSceneStep].type === "backgroundChange";
};

export const textMachine = Machine({
    id: "text",
    initial: "intro",
    context: {
        currentTextScene: 0,
        currentTextSceneStep: 0,
        steps: [],
    },
    states: {
        intro: {
            on: {
                LOAD_STEPS: {
                    // target: 'intro',
                    internal: true,
                    actions: setSteps
                },
                SET_STEP: [{target: "intro", cond: newStepIsPossible,actions:goToStep}],
                START: "nextStep",
            },
        },
        nextStep: {
            on: {
                "": [
                    {
                        target: 'end',
                        cond: currentStepIsImpossible
                    },
                    {
                        target: 'playAudio',
                        cond: isAudio
                    },
                    {
                        target: 'playText',
                        cond: isText
                    },
                    {
                        target: 'changeBackground',
                        cond: isBackgroundChange
                    },
                    {
                        target: 'playTextOption',
                        cond: isTextOption
                    },
                    {
                        target: 'invalid'
                    }
                ],
            }
        },
        incrementAndNextStep: {
            on: {
                "":{
                    target:"nextStep",
                    actions:increaseStep
                }
            }
        },
        playText:{
            on: {
                "NEXT_STEP": "incrementAndNextStep"
            }
        },
        playAudio:{
            on: {
                "NEXT_STEP": "incrementAndNextStep"
            }
        },
        changeBackground:{
            on: {
                "NEXT_STEP": "incrementAndNextStep"
            }
        },
        playTextOption:{
            on: {
                "GO_TO_STEP": {
                target:"nextStep",
                cond:newStepIsPossible,
                actions:goToStep
                }
            }
        },
        invalid :{
            on: {"":"end"}
        },
        end:{
            type: 'final'
        }
    }
});


