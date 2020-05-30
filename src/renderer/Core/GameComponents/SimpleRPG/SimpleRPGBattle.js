import React from "react";
import PropTypes from "prop-types";
import "./SimpleRPGBattle.css";
import * as THREE from "three";
import {
    destroyGameObjectById, emitLoadingAsset,
    instantiateFromPrefab,
    updateGameObject,
    updateGameObjectComponent
} from "../../../../stores/scene/actions";
import {uniqueId} from "lodash";

export class SimpleRPGBattle extends React.Component {

    battleGroup = new THREE.Group();

    state = {
    };

    entitiesIds= {
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
        gameMessages:{text:null}
    };

    persistentObjects=[];

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

    // TODO: clean up this and create a more generic component to connect to store
    initListenToStateTransitions = () => {
        if (this.state.init) {
            return;
        }
        const {availableService} = this.props;
        const {stateMachine} = availableService;
        const {game} = stateMachine.stateMachines;
        this.gameService = game;
        game.service.onTransition(current => {
            const state = current.value;
            const active = state === "playBattle" || state === "resolveBattle";
            if (active) {
                const battleMachineService = game.service.children.get("battle");
                if (game.service && this.battleService!== battleMachineService){
                    this.battleService= battleMachineService;
                    console.log("shouldnt be here n times");
                    console.log(this.battleService);
                    if (battleMachineService) {
                        this.activateTextElements();
                        this.updateEntitiesTexts();
                        this.updateMessagesText(this.battleService.state.context.statusMessage,current.context);
                    }
                    console.log(this.battleService);
                    const a = this.battleService ? this.battleService.onTransition(newBattleState=> {
                        // console.log("battletransition",newBattleState);
                            const counterExists = this.entitiesIds.player.counter!== null;
                            if (newBattleState.context.statusMessage) {
                                this.updateMessagesText(newBattleState.context.statusMessage,current.context);
                            }
                        const turnHasChanged = this.state.battleCtx && this.state.battleCtx.currentTurn !==newBattleState.context.currentTurn && newBattleState.context.currentTurn;
                            // console.log("currentTurn"+newBattleState.context.currentTurn);
                            if (counterExists && turnHasChanged) {
                                    this.activateTextElements();
                                    this.updateEntitiesTexts();
                            }
                            this.setState({active, gameCurrent:current, gameCtx: current.context,battleService:this.battleService,battleCurrent:newBattleState, battleValue: newBattleState.value,battleCtx:newBattleState.context});
                        })
                        : null;
                }
                this.setState({active, gameCtx: current.context, init: true, gameCurrent:current});
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
            this.changeBattle();
        }

        if (!this.state.active && prevState.active) {
            this.cleanBattle();
        }

        if (this.state.battleCtx){
            if (this.state.battleValue !== prevState.battleValue){
                // this.updateMessagesText();
            }

        const {scene} = this.props.availableComponent;
        if (this.persistentObjects.length && this.state.battleCtx.diceValue && this.state.battleCtx.diceValue!== prevState.battleCtx.diceValue) {
            const battleConstants = this.state.gameCtx.constants.battle;
            const {currentTurn} = this.state.battleCtx;
            scene.enqueueAction(
                updateGameObjectComponent(
                    this.entitiesIds[currentTurn].counter,
                    battleConstants.gameComponents.counter,
                    {value:this.state.battleCtx.diceValue}
                )
            )
            // counterToUse.counter.update(deltaTime);
        }
        }

    }

    updateEntitiesTexts = ()=>{
        this.updateEntityText("player");
        this.updateEntityText("enemy");
    }


    updateMessagesText = (message="",gameContext = this.state.gameCtx) => {
        const battleConstants = gameContext.constants.battle;
        const {scene} = this.props.availableComponent;
        scene.enqueueAction(
            updateGameObjectComponent(
                this.entitiesIds.gameMessages.text,
                battleConstants.gameComponents.text,
                {value:message}
            )
        )
    }

    updateEntityText = (entity) => {
        const entityData = this.battleService.state.context[entity];
        const text = entityData.name + "\nHP:"+entityData.hp+"/"+entityData.maxHp+"\nDefense:"+entityData.defense;
        const battleConstants = this.gameService.context.constants.battle;
        const {scene} = this.props.availableComponent;

        scene.enqueueAction(
            updateGameObjectComponent(
                this.entitiesIds[entity].text,
                battleConstants.gameComponents.text,
                {value:text}
            )
        )
    }

    activateTextElements = ()=> {
        if (this.persistentObjects.length) {
            this.persistentObjects.forEach((persistentObjectId)=>this.showObject(persistentObjectId));
    }
        else {
            this.instantiateTextualGraphicElements();
            this.updateEntitiesTexts();
        }
    }

    getText = (entity)=> {
        let _text, _data;
        switch (entity){
        case "gameMessages":
            _text = this.battleService.state.context.statusMessage
            break;
            case "player":
                _data = this.battleService.state.context[entity];
                _text = _data.name + "\nHP:"+_data.hp+"/"+_data.maxHp+"\nDefense:"+_data.defense
                break;
            case "enemy":
                _data = this.battleService.state.context[entity];
                _text = _data.name + "\nHP:"+_data.hp+"/"+_data.maxHp+"\nDefense:"+_data.defense
                break;
            default:
                break;
        }
        return _text;
    }

    instantiateTextualGraphicElements = ()=> {
        this.instantiateTextualGraphicElement("player","counter");
        this.instantiateTextualGraphicElement("player","text", this.getText("player"));
        this.instantiateTextualGraphicElement("enemy","counter");
        this.instantiateTextualGraphicElement("enemy","text", this.getText("enemy"));
        this.instantiateTextualGraphicElement("gameMessages","text", this.getText("gameMessages"));
    }

    instantiateTextualGraphicElement = (battleEntity = "player", graphicElement="counter", value="") => {

        const battleConstants = this.gameService.context.constants.battle;
        const gameConstants = this.gameService.context.constants;

        const graphicElementPosition = battleConstants.graphicElementsPositions[battleEntity][graphicElement];
        const graphicElementScale = battleConstants.graphicElementsScales[battleEntity][graphicElement];
        const {scene} = this.props.availableComponent;

        console.log("instantiateTextualGraphicElement",battleEntity,graphicElement);
        const newId = uniqueId(battleConstants.prefabs[graphicElement]);
        this.entitiesIds[battleEntity][graphicElement] = newId;
        scene.enqueueAction(
            instantiateFromPrefab(
                battleConstants.prefabs[graphicElement],
                newId,
                {
                    position: {
                        x:graphicElementPosition[0], y:graphicElementPosition[1], z:graphicElementPosition[2]},
                    scale:{
                        x:graphicElementScale,y:graphicElementScale,z:graphicElementScale
                    },
                    },
                this.props.gameObject.id,
                null,
                {
                    [battleConstants.gameComponents[graphicElement]]:{
                        fill:gameConstants.colors[battleEntity],
                        value
                    }
                }
            )
        );

        this.persistentObjects.push(newId);
    }

    instantiateModel = (character) => {
        const characterGameData = this.state.battleCtx[character];
        const constantsData = this.state.gameCtx.constants.battle;
        const {model} = constantsData.graphicElementsPositions[character];
        const {scene} = this.props.availableComponent;

            const newId = uniqueId(character+characterGameData.prefab);
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
        this.activateTextElements();
        this.instantiateModel("player");
        this.instantiateModel("enemy");
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

        this.persistentObjects.forEach(persistentObjectId=>this.hideObject(persistentObjectId));

        this.destroyModel("player");
        this.destroyModel("enemy");
    }

    hideObject= (objectId)=>{
        const { scene } = this.props.availableComponent;
        scene.enqueueAction(updateGameObject(
            objectId,
            {enabled:false}
        ))
    }

    showObject= (objectId)=>{
        const { scene } = this.props.availableComponent;
        scene.enqueueAction(updateGameObject(
            objectId,
            {enabled:true}
        ))
    }

    start = () => {
        this.props.transform.add(this.battleGroup);
    }

    update = (deltaTime) => {
        this.initListenToStateTransitions();
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
