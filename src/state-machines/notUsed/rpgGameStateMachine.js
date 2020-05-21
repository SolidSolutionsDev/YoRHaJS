import {Machine, assign, spawn} from "xstate";
import {createPlayerMachine, rpgBattlePlayerTurnStateMachine} from "./playerMachine";
import {playerStats} from "../../solid-solutions-backend/constants/states";

const setNewGameData = assign((_,event)=>{
    return {startScene: event && event.startScene ? event.startScene : 0}});


const submittedTargetScene = (_, event) => {
    return event.startScene!== undefined;
};

export const rpgGameStateMachine = Machine({
    id: "game",
    initial: "intro",
    context: {
    },
    states: {
        intro: {
            on: {
                GO_TO_MAIN_MENU: {
                    target: 'mainMenu',
                },
            },
        },
        mainMenu: {
            on: {
                START_NEW_GAME: 'startNewGame',
                LOAD_GAME: 'loadGame',
                PLAY_INTRO: 'intro',
            },
        },
        //TODO : add started game state as this is kind of an action
        startNewGame: {
            entry: setNewGameData,
            on: {
                GO_TO_MAIN_MENU: 'mainMenu',
            },
        },
        loadGame: {
            on: {
                GO_TO_MAIN_MENU: 'mainMenu',
                //TODO: send loaded data
                LOAD_SELECTED_SCENE: [{target:"startGame",cond:submittedTargetScene}],
            },
        },
        startGame: {},
    }
});


