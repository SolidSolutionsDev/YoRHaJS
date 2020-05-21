import React from "react";
import {Machine, interpret} from "xstate";
import {rpgBattleMachine} from "../../../../state-machines/notUsed/rpgBattleStateMachine";
import "./PokemonColorGameBattleLogic.css"

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class PokemonColorGameBattleLogic extends React.Component {

    service = interpret(rpgBattleMachine, { devTools: true}).onTransition(current => {
        console.log("transition", current);
        this.setState({current, value: current.value,currentPlayer:current.context.player});
    });

    state = {
        current: rpgBattleMachine.initialState,
        value: rpgBattleMachine.initialState.value
    }


    componentDidMount() {

        this.service.start();
    }

    componentWillUnmount() {
        this.service.stop();
    }


    render() {
        const {value, current,currentPlayer} = this.state;
        const {send} = this.service;
        const stateChangeButtons = current.nextEvents.map(event => {
            return <button key={event} onClick={() => {
                send(event);
            }}>{event}</button>
        });
        return (<div key={"debug-battle"} className={"debug-battle"}>
                {stateChangeButtons}
                <div>{value}</div>
                <div>{currentPlayer}</div>
            </div>
        );
    }
}

PokemonColorGameBattleLogic.propTypes = {};
