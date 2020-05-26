import React from "react";
import PropTypes from "prop-types";
import "./SimpleRPGBattle.css";
import * as THREE from "three";
import {destroyGameObjectById, instantiateFromPrefab} from "../../../../stores/scene/actions";
import {uniqueId} from "lodash";

export class SimpleRPGBattle extends React.Component {

    state = {
    };

    graphicElementsPositions = {
        player: {
            model: [-2,0,0],
            text:[-2,1,0],
            counter:[0.2,-1,0.5],
        },
        enemy: {
            model: [2,0,0],
            text:[2,1,0],
            counter:[-0.2,0,0],
        },
        gameMessages:[0,-1,0]
    };

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

        this.graphicElements.player.text = new window.TETSUO.Premade.TextScreen({
            width: window.screen.width/4,
            height: window.screen.height/4,

            // optional options
            backgroundColor: 0x1c1e1c,
            marginTop: 0,
            marginLeft: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            opacity:.0,

            defaultTextStyle: {
                fontSize: 24,
                fill: 0x3cdc7c,
            },
        });
        this.graphicElements.enemy.text = new window.TETSUO.Premade.TextScreen({
            width: window.screen.width/4,
            height: window.screen.height/4,

            // optional options
            backgroundColor: 0x1c1e1c,
            marginTop: 0,
            marginLeft: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            opacity:.0,

            defaultTextStyle: {
                fontSize: 24,
                fill: 0x3cdc7c,
            },
        });

        // build and prepare for render
        this.graphicElements.player.text.prepare();
        this.graphicElements.enemy.text.prepare();

        // add the output quad to the scene
        // quad = textScreen.quad;
        this.props.transform.add(this.graphicElements.player.text.quad);
        this.graphicElements.player.text.quad.position.set(...this.graphicElementsPositions.player.text);

        this.props.transform.add(this.graphicElements.enemy.text.quad);
        this.graphicElements.enemy.text.quad.position.set(...this.graphicElementsPositions.enemy.text);

        const {player} = this.state.battleCtx;
        const text = player.name + "\nHP:"+player.hp+"/"+player.maxHp;
        this.graphicElements.player.text.addText(text);

        const {enemy} = this.state.battleCtx;
        const textEnemy = enemy.name + "\nHP:"+enemy.hp+"/"+enemy.maxHp;
        this.graphicElements.enemy.text.addText(textEnemy);



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

    instantiateDice = () => {

        const {scene} = this.props.availableComponent;
        const {backGroundPrefabs} = this.state.data;
        console.log(this.state.battleCtx);

        this.graphicElements.player.counter = new window.TETSUO.Premade.TimeCounter({
            width: window.screen.width/4,
            height: window.screen.height/4,

            // // optional options
            // backgroundColor: 0x1c1e1c,
            // marginTop: 0,
            // marginLeft: 0,
            // paddingBottom: 0,
            // paddingLeft: 0,
            // opacity:.0,
            //
            defaultTextStyle: {
                fontSize: 48,
                fill: 0xff0000,
            },
        });

        this.graphicElements.player.counter.prepare();

        // add the output quad to the scene
        // quad = textScreen.quad;
        this.props.transform.add(this.graphicElements.player.counter.quad);
        this.graphicElements.player.counter.quad.position.set(...this.graphicElementsPositions.player.counter);


    }

    updatePlayer= (deltaTime) => {
        console.log(this.state.battleCtx);
        if (this.graphicElements.player.counter && this.state.battleCtx && this.state.battleCtx.diceValue) {
            this.graphicElements.player.counter.setTime(this.state.battleCtx.diceValue);
            this.graphicElements.player.counter.update(deltaTime);
        }
        if (this.graphicElements.player.text) {
            this.graphicElements.player.text.update(deltaTime);
        }
        if (this.graphicElements.enemy.text) {
            this.graphicElements.enemy.text.update(deltaTime);
        }
    }

    changeBattle = () => {
        this.instantiatePlayer();
        this.instantiateDice();
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

    update = (deltaTime) => {
        this.initListenToStateTransitions();
        this.updatePlayer(deltaTime);
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
