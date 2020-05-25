import React from "react";
import PropTypes from "prop-types";
import "./SimpleRPGBackground.css";
import * as THREE from "three";
import {destroyGameObjectById, instantiateFromPrefab} from "../../../../stores/scene/actions";
import {uniqueId} from "lodash";

export class SimpleRPGBackground extends React.Component {

    state = {
        init: false,
        soundPlaying: false,
        backgroundObjects: [],
    };

    initTetsuoBackground = () => {
        const {transform} = this.props;

        this.background = new window.TETSUO.Premade.BackgroundCity({
            width: 1280,
            height: 720,
        });

        this.background.prepare();
        // transform.add(this.background.quad);
        // this.background.quad.position.x+=3
        const geometry = new THREE.PlaneGeometry( 2, 2, 32 );
        const material = new THREE.MeshLambertMaterial( {
            map:new THREE.Texture(this.background.texture),
            side: THREE.DoubleSide} );
        this.plane = new THREE.Mesh( geometry, material );
        this.quadToUse =  this.background.quad.clone();
        transform.add( this.plane);
        transform.add( this.quadToUse);
        // transform.add(  );
        // this.background.quad.material = this.plane.material;
        console.log(this.background,this.plane);
        console.log(this.background.quad.material,"material");
        this.plane.position.x+=2
        this.quadToUse.position.x-=2

    }


    advance = () => {
        const {availableService} = this.props;
        const {stateMachine} = availableService;
        const {game} = stateMachine.stateMachines;
        if (this.state.active) {
            game.service.send("NEXT_STEP")
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
            const stepId = current.context.stepsQueue[0];
            const stepData = current.context.constants.steps[stepId];
            const state = current.value;
            const active = current.value === "changeBackground";
            if (active) {
                this.setState({active, stepId, data: stepData, init: true});
            } else {
                this.setState({active:active, init: true});
            }
        });
        console.log("here", this.state.init);
        document.addEventListener("shoot_keydown", () => {
            // console.log("background next step", this.state.active);
            this.advance();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.active && !prevState.active) {
            // console.log(this.state.backgroundObjects.length,"background");
            this.cleanBackgrounds();
            this.changeBackground();
        }
    }

    cleanBackgrounds = () => {
        const {scene} = this.props.availableComponent;
        console.log("cleanBackgrounds",this.state.backgroundObjects,this);
        this.state.backgroundObjects.forEach(backgroundGameObjectId =>{
            // console.log("cleanBackgrounds cycle",backgroundGameObjectId, this.props.gameObject.id);
            scene.enqueueAction(
                destroyGameObjectById(backgroundGameObjectId, this.props.gameObject.id)
            );
            }
        );
        // this.setState({backgroundObjects: []});
    }

    changeBackground = () => {
        const {scene} = this.props.availableComponent;
        const {backGroundPrefabs} = this.state.data;
        const newBackgroundObjectIds = backGroundPrefabs.map(backgroundPrefabId => {
            const newId = uniqueId(backgroundPrefabId);
            scene.enqueueAction(
                instantiateFromPrefab(
                    backgroundPrefabId,
                    newId,
                    null,
                    this.props.gameObject.id,
                )
            );
            return newId;
        });
        // console.log("newBackgroundObjectIds",newBackgroundObjectIds);
        this.setState({backgroundObjects: newBackgroundObjectIds});
    };

    start = () => {
        this.initTetsuoBackground()
    }

    update = (time, deltaTime) => {
        this.initListenToStateTransitions();
        const {scene} = this.props.availableComponent;

        this.background.update(deltaTime);

        if (this.background &&  this.plane && this.background)  {
            this.plane.material.map = new THREE.CanvasTexture(this.background._renderer.renderer.domElement);
            this.quadToUse.material = this.plane.material;
            // this.quadToUse.material.map = new THREE.CanvasTexture(this.background._renderer.renderer.domElement);
        }

        // scene.scene.fog.near = 105 * Math.abs(Math.sin(time/100));
        // scene.scene.fog.far =  Math.max(scene.scene.fog.near,(400 *Math.sin(time/1000)));
    };

    render() {
        return <div id={"rpgBackground"}>
            <h2>SimpleRPGBackground</h2>
            <div>active: {JSON.stringify(this.state.active)}</div>
            <div>last background step: {this.state.stepId}</div>
            <div>last background data: {JSON.stringify(this.state.data)}</div>
            <div>background backGroundObjects: {JSON.stringify(this.state.backGroundObjects)}</div>
        </div>;
    }
}

SimpleRPGBackground.propTypes = {
    // transform: PropTypes.object.isRequired,
    // assetId: PropTypes.string.isRequired
};
