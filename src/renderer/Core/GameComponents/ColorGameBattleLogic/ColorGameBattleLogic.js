import React from "react";
import {Machine, interpret} from "xstate";
import {rpgMachine} from "../../../../state-machines/rpgStateMachine";
import "./ColorGameBattleLogic.css"

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class ColorGameBattleLogic extends React.Component {

    service = interpret(rpgMachine).onTransition(current => {
        console.log("transition", current);
        this.setState({current, value: current.value});
    });

    state = {
        current: rpgMachine.initialState,
        value: rpgMachine.initialState.value
    }


    componentDidMount() {

        this.service.start();
    }

    componentWillUnmount() {
        this.service.stop();
    }


    render() {
        const {value, current} = this.state;
        const {send} = this.service;
        const stateChangeButtons = current.nextEvents.map(event => {
            return <button key={event} onClick={() => {
                send(event);
            }}>{event}</button>
        });
        return (<div key={"debug-battle"} className={"debug-battle"}>
                {stateChangeButtons}
                <div>{value}</div>
                <div>{current.context.player}</div>
            </div>
        );
    }
}

ColorGameBattleLogic.propTypes = {};
