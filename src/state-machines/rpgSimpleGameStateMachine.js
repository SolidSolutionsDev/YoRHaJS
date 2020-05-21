import {Machine, assign} from "xstate";
import {initialContext} from "./intialContextDnD";
//https://xstate.js.org/viz/?gist=23e0b41518a8268e45c1bbe8cd82ee9b

const resetCurrentTextScene = assign({
    stepsQueue: ctx => {
        return ctx.initialStep ? [ctx.initialStep] : [];
    },
    player: ctx => {
        return {...ctx.constants.player}
    },
    enemies: ctx => {
        return {...ctx.constants.enemies}
    },
    currentTextOption: 0
});
const enqueueTextGoToSteps = assign({
    stepsQueue: (ctx, _) => {
        const _goToSteps = ctx.constants.steps[ctx.stepsQueue[0]].goTo || [];
        return [...ctx.stepsQueue, ..._goToSteps]
    }
});
const enqueueTextOptionGoToSteps = assign({
    stepsQueue: (ctx, _) => {
        const _goToSteps = ctx.constants.steps[ctx.stepsQueue[0]].options[ctx.currentTextOption].goTo || [];
        return [...ctx.stepsQueue, ..._goToSteps]
    }
});
const setNextStep = assign({
    stepsQueue: (ctx, _) => {
        return ctx.stepsQueue.slice(1)
    },
    currentTextOption: 0,
});
const setWinStep = assign({
    stepsQueue: (ctx, _) => {
        return [ctx.winStep]
    }, currentTextOption: 0
});

const setGameOverStep = assign({
    stepsQueue: (ctx, _) => {
        return [ctx.gameOverStep]
    }, currentTextOption: 0
});

const selectPrevTextOption = assign({
    currentTextOption: (ctx, _) => {
        const _options = ctx.constants.steps[ctx.stepsQueue[0]].options;
        const _newTextOption = ctx.currentTextOption <= 0 ? _options.length - 1 : ctx.currentTextOption - 1;
        return _newTextOption
    }
});
const selectNextTextOption = assign({
    currentTextOption: (ctx, _) => {
        const _options = ctx.constants.steps[ctx.stepsQueue[0]].options;
        const _newTextOption = ctx.currentTextOption >= _options.length - 1 ? 0 : ctx.currentTextOption + 1;
        return _newTextOption
    }
});

const setCustomStep = assign({
    stepsQueue: (_, event) => {
        return [event.step];
    }
});

const updateBattleResults = assign({
    player: (_, event) => {
        return event.player;
    },
    enemies: (ctx, event) => {
        const currentEnemyId = ctx.steps[ctx.stepsQueue[0]].enemy;
        return {
            ...ctx.enemies,
            [currentEnemyId]: event.enemy
        };
    }
});

const customStepExists = (ctx, event) => {
    return ctx.constants && ctx.constants.steps && event && ctx.constants.steps[event.step] !== undefined;
};

const startingQueuedStepExists = (ctx) => {
    return ctx.stepsQueue.length > 0;
};
const nextQueuedStepExists = (ctx) => {
    return ctx.stepsQueue.length > 1;
};


const currentStepIsGameOverStep = (ctx) => {
    return ctx.stepsQueue[0] === ctx.gameOverStep;
};
const currentStepIsNotGameOverStep = (ctx) => {
    return ctx.stepsQueue[0] !== ctx.gameOverStep;
};

const currentStepIsWinStep = (ctx) => {
    return ctx.stepsQueue[0] === ctx.winStep;
};

const nextQueuedStepDoesNotExist = (ctx) => {
    return ctx.stepsQueue.length <= 1;
};


const isBattle = (ctx) => {
    const currentStep = ctx.stepsQueue[0];
    return ctx.constants && ctx.constants.steps && ctx.constants.steps[currentStep] && ctx.constants.steps[currentStep].type === "battle";
};

const isAudio = (ctx) => {
    const currentStep = ctx.stepsQueue[0];
    return ctx.constants && ctx.constants.steps && ctx.constants.steps[currentStep] && ctx.constants.steps[currentStep].type === "audio";
};

const isText = (ctx) => {
    const currentStep = ctx.stepsQueue[0];
    return ctx.constants && ctx.constants.steps && ctx.constants.steps[currentStep] && ctx.constants.steps[currentStep].type === "text";
};

const isTextOption = (ctx) => {
    const currentStep = ctx.stepsQueue[0];
    return ctx.constants && ctx.constants.steps && ctx.constants.steps[currentStep] && ctx.constants.steps[currentStep].type === "textOption";
};

const isBackgroundChange = (ctx) => {
    const currentStep = ctx.stepsQueue[0];
    return ctx.constants && ctx.constants.steps && ctx.constants.steps[currentStep] && ctx.constants.steps[currentStep].type === "backgroundChange";
};

const simpleGameStateMachine = Machine({
    id: "text",
    initial: "intro",
    context: {
        ...initialContext
        // constants: {},
        // initialStep: null,
        // gameOverStep: null,
        // stepsQueue: null,
        // winStep: "",
        // player: {},
        // enemies: {},
    },
    states: {
        intro: {
            entry: [resetCurrentTextScene],
            on: {
                SET_STEP: [{
                    actions: setCustomStep,
                    cond: customStepExists,
                }],
                START: {
                    target: "nextStep",
                    cond: startingQueuedStepExists
                },
            },
        },
        nextStep: {
            on: {
                "": [
                    {
                        target: 'playBattle',
                        cond: isBattle
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
                "": [
                    {
                        target: "end",
                        cond: currentStepIsWinStep
                    },
                    {
                        target: "end",
                        cond: currentStepIsGameOverStep
                    },
                    {
                        target: "nextStep",
                        actions: setNextStep,
                        cond: nextQueuedStepExists
                    },
                    {
                        target: "nextStep",
                        actions: setWinStep,
                        cond: nextQueuedStepDoesNotExist
                    }
                ],
            }
        },
        playBattle: {
            on: {
                "NEXT_STEP": {
                    target: "incrementAndNextStep",
                },
                "UPDATE_BATTLE_RESULTS": {
                    actions: "updateBattleResults"
                },
                "GAME_OVER": {
                    target: "nextStep",
                    actions: setGameOverStep,
                    cond:currentStepIsNotGameOverStep
                }
            }
        },
        playText: {
            on: {
                "NEXT_STEP": {
                    target: "incrementAndNextStep",
                    actions: enqueueTextGoToSteps
                },
                "GAME_OVER": {
                    target: "nextStep",
                    actions: setGameOverStep,
                    cond:currentStepIsNotGameOverStep
                }
            }
        },
        playAudio: {
            on: {
                "NEXT_STEP": "incrementAndNextStep",
            }
        },
        changeBackground: {
            on: {
                "NEXT_STEP": "incrementAndNextStep",
            }
        },
        playTextOption: {
            on: {
                "NEXT_STEP": {
                    target: "incrementAndNextStep",
                    actions: enqueueTextOptionGoToSteps
                },
                "SELECT_PREVIOUS_OPTION": {
                    actions: selectPrevTextOption
                },
                "SELECT_NEXT_OPTION": {
                    actions: selectNextTextOption
                },
                "GAME_OVER": {
                    target: "nextStep",
                    actions: setGameOverStep,
                    cond:currentStepIsNotGameOverStep
                }
            }
        },
        invalid: {
            on: {"": "end"}
        },
        end: {
            type: 'final'
        }
    }
});

export const dynamicSimpleGameStateMachine = simpleGameStateMachine.withContext(initialContext);
