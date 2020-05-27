import React from "react";
import PropTypes from "prop-types";
import "./SimpleRPGBattle.css";
import * as THREE from "three";
import {destroyGameObjectById, instantiateFromPrefab} from "../../../../stores/scene/actions";
import {uniqueId} from "lodash";

export class SimpleRPGBattle extends React.Component {

    battleGroup = new THREE.Group();

    state = {
    };

    graphicElementsPositions = {
        player: {
            text:[-.5,.5,0.00],
            model: [-.5,0.,0.5],
            counter:[-.2,-.5,0.00],
        },
        enemy: {
            text:[.5,.5,0.00],
            model: [.5,0. ,0.5],
            counter:[.2,-.5,0.00],
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
        console.log(this.state);
        if (this.state.active ) {
            const commandToSend = this.state.gameCurrent.value === "playBattle" ? "INPUT" : "NEXT_STEP"
            game.service.send(commandToSend)
        }
    }

    initListenToStateTransitions = () => {
        if (this.state.init) {
            return;
        }
        const {availableService} = this.props;
        const {stateMachine} = availableService;
        // console.log(availableService);
        const {game} = stateMachine.stateMachines;
        game.service.onTransition(current => {
            // console.log("transition background", current,this.state.backgroundObjects);
            const state = current.value;
            const active = state === "playBattle" || state === "resolveBattle";
            if (active) {
                const battleMachineService = game.service.children.get("battle");
                if (game.service && this.battleService!== battleMachineService){
                    this.battleService= battleMachineService;
                    console.log("battle service:" , battleMachineService);
                    const a = this.battleService ? this.battleService.onTransition(newBattleState=> {
                            // this.stateMachines.battle = {
                            //     service: this.battleService,
                            //     current: state,
                            //     value: state.value,
                            //     context: state.context,
                            // };

                            if (this.graphicElements.player.counter !== null && this.state.battleCtx && this.state.battleCtx.currentTurn !==newBattleState.context.currentTurn) {
                            console.log(this.graphicElements.player.counter.quad.material);
                                if ( newBattleState.context.currentTurn=== "player" ) {
                                    this.updatePlayerText();
                                // this.graphicElements.player.counter.quad.material.color.setHex(0x00ff00);
                                }
                            else {

                                    this.updateEnemyText();
                                // this.graphicElements.player.counter.quad.material.color.setHex(0xff0000);
                                }

                            }
                            // console.log("transition sub battle",this.state);
                            this.setState({battleService:this.battleService,battleCurrent:newBattleState, battleValue: newBattleState.value,battleCtx:newBattleState.context});
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
            // this.cleanBattle();
            this.changeBattle();
        }

        if (!this.state.active && prevState.active) {
            // console.log(this.state.backgroundObjects.length,"background");
            this.cleanBattle();
        }
    }

    updatePlayerText = () => {
        const {player} = this.state.battleCtx;
        const text = player.name + "\nHP:"+player.hp+"/"+player.maxHp;
        this.graphicElements.player.text.addText(text);
    }

    updateEnemyText = () => {
        const {enemy} = this.state.battleCtx;
        const text = enemy.name + "\nHP:"+enemy.hp+"/"+enemy.maxHp;
        this.graphicElements.enemy.text.addText(text);
    }

    instantiatePlayer = ()=> {
        const {scene} = this.props.availableComponent;
        const {backGroundPrefabs} = this.state.data;
        // console.log(this.state.battleCtx);

        this.graphicElements.player.text = new window.TETSUO.Premade.TextScreen({
            width: window.screen.width/4,
            height: window.screen.height/4,

            // optional options
            backgroundColor: 0x1c1e1c,
            marginTop: 0,
            marginLeft: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            opacity:.01,

            defaultTextStyle: {
                fontSize: 32,
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
            opacity:.01,

            defaultTextStyle: {
                fontSize: 32,
                fill: 0xdc3c7c,
            },
        });

        // build and prepare for render
        this.graphicElements.player.text.prepare();
        this.graphicElements.enemy.text.prepare();


        this.graphicElements.player.text.quad.scale.set(0.3,0.3,0.3);
        this.graphicElements.enemy.text.quad.scale.set(0.3,0.3,0.3);

        // add the output quad to the scene
        // quad = textScreen.quad;
        this.battleGroup.add(this.graphicElements.player.text.quad);
        this.graphicElements.player.text.quad.position.set(...this.graphicElementsPositions.player.text);
        this.graphicElements.player.text.quad.material.transparent = true;

        this.battleGroup.add(this.graphicElements.enemy.text.quad);
        this.graphicElements.enemy.text.quad.position.set(...this.graphicElementsPositions.enemy.text);
        this.graphicElements.enemy.text.quad.material.transparent = true;

        this.updatePlayerText();
        this.updateEnemyText();

    }

    instantiateDice = () => {

            this.graphicElements.player.counter = new window.TETSUO.Premade.TimeCounter({
                width: window.screen.width / 4,
                height: window.screen.height / 4,

                // // optional options
                // backgroundColor: 0x1c1e1c,
                // marginTop: 0,
                // marginLeft: 0,
                // paddingBottom: 0,
                // paddingLeft: 0,
                opacity: .01,
                //
                defaultTextStyle: {
                    fontSize: 128,
                    fill: 0x3cdc7c,
                },
            });

            this.graphicElements.player.counter.prepare();

            // add the output quad to the scene
            // quad = textScreen.quad;
            this.battleGroup.add(this.graphicElements.player.counter.quad);

            this.graphicElements.player.counter.quad.material.transparent = true;
            this.graphicElements.player.counter.quad.position.set(...this.graphicElementsPositions.player.counter);
            this.graphicElements.player.counter.quad.material.transparent = true;


            this.graphicElements.enemy.counter = new window.TETSUO.Premade.TimeCounter({
                width: window.screen.width / 8,
                height: window.screen.height / 8,

                // // optional options
                // backgroundColor: 0x1c1e1c,
                // marginTop: 0,
                // marginLeft: 0,
                // paddingBottom: 0,
                // paddingLeft: 0,
                opacity: .01,
                //
                defaultTextStyle: {
                    fontSize: 72,
                    fill: 0xdc3c7c,
                },
            });

            this.graphicElements.enemy.counter.prepare();

            // add the output quad to the scene
            // quad = textScreen.quad;
            this.battleGroup.add(this.graphicElements.enemy.counter.quad);
            this.graphicElements.enemy.counter.quad.position.set(...this.graphicElementsPositions.enemy.counter);
            this.graphicElements.enemy.counter.quad.material.transparent = true;

            this.graphicElements.player.counter.quad.scale.set(0.3, 0.3, 0.3);
            this.graphicElements.enemy.counter.quad.scale.set(0.3, 0.3, 0.3);

    }

    instantiateModel = (character = "player") => {
        const characterGameData = this.state.battleCtx[character];

        const {model} = this.graphicElementsPositions[character];
        const {scene} = this.props.availableComponent;

            const newId = uniqueId(characterGameData.prefab);
            scene.enqueueAction(
                instantiateFromPrefab(
                    characterGameData.prefab,
                    newId,
                    {position: { x:model[0], y:model[1], z:model[2]}},
                    this.props.gameObject.id,
                )
            );
        this.graphicElements[character].model = newId;
        return newId;
    }

    changeBattle = () => {
        this.instantiatePlayer();
        this.instantiateDice();
        this.instantiateModel("player");
        this.instantiateModel("enemy");
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

    destroyModel = (modelType = "player") => {
        const { scene } = this.props.availableComponent;
        scene.enqueueAction(
            destroyGameObjectById(
                this.graphicElements[modelType].model, this.props.gameObject.id)
        );
    }

    cleanBattle = () => {
        const { scene } = this.props.availableComponent;

        this.battleGroup.remove.apply(this.battleGroup, this.battleGroup.children);

        this.destroyModel("player");
        this.destroyModel("enemy");

    }


    updatePlayer= (deltaTime) => {
        const {player, enemy} = this.graphicElements;
        if (this.graphicElements.player.counter && this.state.battleCtx && this.state.battleCtx.diceValue) {
            const counterToUse = this.state.battleCtx.currentTurn === "player" ? player : enemy;
            counterToUse.counter.setTime(this.state.battleCtx.diceValue);
            counterToUse.counter.update(deltaTime);
        }
        if (this.graphicElements.player.text) {
            this.graphicElements.player.text.update(deltaTime);
        }
        if (this.graphicElements.enemy.text) {
            this.graphicElements.enemy.text.update(deltaTime);
        }
    }


    start = () => {
        this.props.transform.add(this.battleGroup);
    }

    update = (deltaTime) => {
        this.initListenToStateTransitions();
        this.updatePlayer(deltaTime);
    };

    render() {

        if (!this.props.debug) { return null; }
        const {gameCurrent,battleCtx,battleCurrent} = this.state;
        const battleUI = gameCurrent && gameCurrent.value==="playBattle"? <div>BATTLE!
        <div>{gameCurrent.value+" -> "+battleCurrent.value}</div>
        <div style={{color:battleCtx.currentTurn === "player" ? "green" : "red"}}>Dice:{battleCtx.diceValue}</div>
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
