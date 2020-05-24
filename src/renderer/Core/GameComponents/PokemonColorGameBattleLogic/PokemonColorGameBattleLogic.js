import React from "react";
import {Machine, interpret} from "xstate";
import {rpgBattleMachine} from "../../../../state-machines/notUsed/rpgBattleStateMachine";
import {rpgSimpleGameStateMachine} from "../../../../state-machines/simpleRpg/rpgSimpleGameStateMachine";
import "./PokemonColorGameBattleLogic.css"

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class PokemonColorGameBattleLogic extends React.Component {

    // service = interpret(rpgBattleMachine, ).onTransition(current => {
    //     // console.log("transition", current);
    //     this.setState({current, value: current.value,currentPlayer:current.context.player});
    // });

    service2 = interpret(rpgSimpleGameStateMachine, ).onTransition(current => {
        console.log("transition simple", current);
        const battleCurrent = {};
        if (this.service2 && this.battleService!== this.service2.children.get("battle")){
            this.battleService= this.service2.children.get("battle");
            const a = this.battleService ? this.battleService.onTransition(state=> {
                console.log("sub battle",this.battleService,state,state.value)
                    this.setState({battleCurrent:state, battleValue: state.value,battleCtx:state.context});
            })
                : null;
        }
        this.setState({current2:current, value2: current.value,ctx:current.context});
    });

    battleService;

    state = {
        current: rpgBattleMachine.initialState,
        value: rpgBattleMachine.initialState.value,
        current2: rpgSimpleGameStateMachine.initialState,
        value2: rpgSimpleGameStateMachine.initialState.value,
        battleCurrent:null,
        battleValue:null,
        battleCtx:null,

    }


    componentDidMount() {

        // this.service.start();
        // this.service2.start();
    }

    componentWillUnmount() {
        // this.service.stop();
        // this.service2.stop();
    }


    render() {
        const {value2, current2,currentPlayer,battleCtx,battleValue} = this.state;
        const {send} = this.service2;
        console.log(this.service2,this.state,this.service2.children);
        const stateChangeButtons = current2.nextEvents.map(event => {
            return <button key={event} onClick={() => {
                send(event);
            }}>{event}</button>
        });
        const battleUI = value2==="playBattle"? <div>BATTLE!
            <div>{battleValue}</div>
            <div style={{color:"red"}}>Dice:{battleCtx.diceValue}</div>
            <div>Damage Done {battleCtx.damageDone}</div>
            <div>Player {`${battleCtx.player.name} hp:${battleCtx.player.hp} defense:${battleCtx.player.defense} `}</div>
            <div>Enemy {`${battleCtx.enemy.name} hp:${battleCtx.enemy.hp} defense:${battleCtx.enemy.defense} `}</div>
        </div>:null;
        const currentStep= current2.context.stepsQueue[0];
        const currentStepInfo = current2.context.constants.steps[currentStep]
        return (<div key={"debug-battle"} className={"debug-battle"}>
                {stateChangeButtons}
                <div>{value2}</div>
                <div>{`initialStep:${current2.context.initialStep}`}</div>
                <div>{JSON.stringify(current2.context.stepsQueue)}</div>
                <div>{`currentTextOption:${current2.context.currentTextOption}`}</div>
                <div>{`currentStep details:${JSON.stringify(currentStepInfo)}`}</div>
                {battleUI}

            </div>
        );
    }
}

PokemonColorGameBattleLogic.propTypes = {};
