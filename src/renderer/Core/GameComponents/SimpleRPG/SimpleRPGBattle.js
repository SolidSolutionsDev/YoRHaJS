import React from "react";
import PropTypes from "prop-types";
import "./SimpleRPGBattle.css";
import * as THREE from "three";
import {destroyGameObjectById, instantiateFromPrefab} from "../../../../stores/scene/actions";
import {uniqueId} from "lodash";

export class SimpleRPGBattle extends React.Component {

    state = {
    };

    graphicElementsPositions= {
        player: {
            model: [1,0,0],
            text:[1,1,0],
            counter:[0.2,0,0],
        },
        enemy: {
            model: [-1,0,0],
            text:[-1,1,0],
            counter:[-0.2,0,0],
        },
        gameMessages:[0,-1,0]
    }

    graphicElements= {
        player: {
            model:null,
            text:null,
            counter:null,
        },
        enemy: {
            model:null,
            text:null,
            counter:null,
        },
        gameMessages:null
    }


    advance = () => {
        const {availableService} = this.props;
        const {stateMachine} = availableService;
        const {game} = stateMachine.stateMachines;
        if (this.state.active) {
            game.service.send("INPUT")
        }
    }

    initListenToStateTransitions = () => {
        if (this.state.init) {
            return;
        }
        const {availableService} = this.props;
        const {stateMachine} = availableService;
        console.log(availableService);
        const {game} = stateMachine.stateMachines;
        game.service.onTransition(current => {
            // console.log("transition background", current,this.state.backgroundObjects);
            const state = current.value;
            const active = state === "playBattle";
            if (active) {
                const battleMachineService = game.service.children.get("battle");
                if (game.service && this.battleService!== battleMachineService){
                    this.battleService= battleMachineService;
                    const a = this.battleService ? this.battleService.onTransition(state=> {
                            // this.stateMachines.battle = {
                            //     service: this.battleService,
                            //     current: state,
                            //     value: state.value,
                            //     context: state.context,
                            // };
                            console.log("transition sub battle",this.state);
                            this.setState({battleService:this.battleService,battleCurrent:state, battleValue: state.value,battleCtx:state.context});
                        })
                        : null;
                }
                this.setState({active, data: current.context, init: true, gameCurrent:current});
            } else {
                this.setState({active, init: true,gameCurrent:current});
            }
        });
        document.addEventListener("shoot_keydown", () => {
            this.advance();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.active && !prevState.active) {
            // console.log(this.state.backgroundObjects.length,"background");
            this.cleanBattle();
            this.changeBattle();
        }
    }

    cleanBattle = () => {
        // const {scene} = this.props.availableComponent;
        // console.log("cleanBackgrounds", this.state.backgroundObjects, this);
        // this.state.backgroundObjects.forEach(backgroundGameObjectId => {
        //         // console.log("cleanBackgrounds cycle",backgroundGameObjectId, this.props.gameObject.id);
        //         scene.enqueueAction(
        //             destroyGameObjectById(backgroundGameObjectId, this.props.gameObject.id)
        //         );
        //     }
        // );
    }

    instantiatePlayer = ()=> {
        const {scene} = this.props.availableComponent;
        const {backGroundPrefabs} = this.state.data;
        console.log(this.state.battleCtx);
        // const newBackgroundObjectIds = backGroundPrefabs.map(backgroundPrefabId => {
        //     const newId = uniqueId(backgroundPrefabId);
        //     scene.enqueueAction(
        //         instantiateFromPrefab(
        //             backgroundPrefabId,
        //             newId,
        //             null,
        //             this.props.gameObject.id,
        //         )
        //     );
        //     return newId;
        // });
        // console.log("newBackgroundObjectIds",newBackgroundObjectIds);
        // this.setState({backgroundObjects: newBackgroundObjectIds});
    }

    changeBattle = () => {
        this.instantiatePlayer();
        // const {scene} = this.props.availableComponent;
        // const {backGroundPrefabs} = this.state.data;
        // const newBackgroundObjectIds = backGroundPrefabs.map(backgroundPrefabId => {
        //     const newId = uniqueId(backgroundPrefabId);
        //     scene.enqueueAction(
        //         instantiateFromPrefab(
        //             backgroundPrefabId,
        //             newId,
        //             null,
        //             this.props.gameObject.id,
        //         )
        //     );
        //     return newId;
        // });
        // // console.log("newBackgroundObjectIds",newBackgroundObjectIds);
        // this.setState({backgroundObjects: newBackgroundObjectIds});
    };

    start = () => {
    }

    update = () => {
        this.initListenToStateTransitions();
    };

    render() {
        const {gameValue, gameCurrent,battleCtx,battleCurrent} = this.state;
        const battleUI = battleCurrent==="playBattle"? <div>BATTLE!
        <div>{battleCurrent}</div>
        <div style={{color:"red"}}>Dice:{battleCtx.diceValue}</div>
        <div>Damage Done {battleCtx.damageDone}</div>
        <div>Player {`${battleCtx.player.name} hp:${battleCtx.player.hp} defense:${battleCtx.player.defense} `}</div>
        <div>Enemy {`${battleCtx.enemy.name} hp:${battleCtx.enemy.hp} defense:${battleCtx.enemy.defense} `}</div>
    </div>:null;
        return <div id={"rpgBattle"}>
            <h2>SimpleRPGBattle</h2>
            {battleUI}
            <div>active: {JSON.stringify(this.state.active)}</div>
            <div>last battle state: {this.state.battleValue}</div>
            <div>last battle battleCtx: {JSON.stringify(this.state.battleCtx)}</div>
        </div>;
    }
}

SimpleRPGBattle.propTypes = {
};
