import React, {Component} from "react";
import {interpret} from "xstate";
import {rpgSimpleGameStateMachine} from "../../state-machines/simpleRpg/rpgSimpleGameStateMachine";

export class SimpleRPGStateMachineService extends Component {
    debug = false;
    stateMachines = {
        battle: {},
        game: {
            service: interpret(rpgSimpleGameStateMachine
                // , { devTools: true}
            ),
        },
    }

    state = {
        gameCurrent: rpgSimpleGameStateMachine.initialState,
        gameValue: rpgSimpleGameStateMachine.initialState.value,
    }

    componentWillUnmount() {
        this.stateMachines.game.service.stop();
    }

    registerTransitionListener = () => {
        this.stateMachines.game.service.onTransition(gameState => {
            this.stateMachines.game = {
                service: this.stateMachines.game.service,
                current: gameState,
                value: gameState.value,
                context: gameState.context,
            };
            const transitionedToANewBattleState = this.battleService !== this.stateMachines.game.service.children.get("battle");
            if (transitionedToANewBattleState) {
                this.battleService = this.stateMachines.game.service.children.get("battle");
                const a = this.battleService ? this.battleService.onTransition(state => {
                        this.stateMachines.battle = {
                            service: this.battleService,
                            current: state,
                            value: state.value,
                            context: state.context,
                        };
                        this.setState({battleCurrent: state, battleValue: state.value, battleCtx: state.context});
                    })
                    : null;
            }
            this.setState({gameCurrent: gameState, gameValue: gameState.value, gameCtx: gameState.context});
        });
    }

    renderDebugMachine() {
        const {gameValue, gameCurrent, battleCtx, battleValue} = this.state;
        const {send} = this.stateMachines.game.service;
        // console.log(this.stateMachines.game.service,this.state,this.stateMachines.game.service.children);
        const stateChangeButtons = gameCurrent.nextEvents.map(event => {
            return <button key={event} onClick={() => {
                send(event);
            }}>{event}</button>
        });
        const battleUI = gameValue === "playBattle" ? <div>BATTLE!
            <div>{battleValue}</div>
            <div style={{color: "red"}}>Dice:{battleCtx.diceValue}</div>
            <div>Damage Done {battleCtx.damageDone}</div>
            <div>Player {`${battleCtx.player.name} hp:${battleCtx.player.hp} defense:${battleCtx.player.defense} `}</div>
            <div>Enemy {`${battleCtx.enemy.name} hp:${battleCtx.enemy.hp} defense:${battleCtx.enemy.defense} `}</div>
        </div> : null;
        const currentStep = gameCurrent.context.stepsQueue[0];
        const currentStepInfo = gameCurrent.context.constants.steps[currentStep]
        return (<div key={"debug-battle"} className={"debug-battle"}>
                <div>State Machine Servicio</div>
                {stateChangeButtons}
                <div>{gameValue}</div>
                <div>{`initialStep:${gameCurrent.context.initialStep}`}</div>
                <div>{JSON.stringify(gameCurrent.context.stepsQueue)}</div>
                <div>{`currentTextOption:${gameCurrent.context.currentTextOption}`}</div>
                <div>{`currentStep details:${JSON.stringify(currentStepInfo)}`}</div>
                {battleUI}

            </div>
        );
    }

    componentDidMount() {
        this.registerTransitionListener();
        this.stateMachines.game.service.start();
    }

    render() {
        return <div>
            {this.debug ? this.renderDebugMachine() : null}
        </div>
    }
}