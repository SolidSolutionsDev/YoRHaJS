import React from "react";
import PropTypes from "prop-types";
import "./SimpleRPGBackground.css";
import * as THREE from "three";
import {instantiateFromPrefab} from "../../../../stores/scene/actions";

export class SimpleRPGBackground extends React.Component {

    state = {
        init: false,
        soundPlaying: false,
        prefabs :{},
    };


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
            console.log("transition", current);
            const stepId = current.context.stepsQueue[0];
            const stepData = current.context.constants.steps[stepId];
            const state = current.value;
            const active = current.value === "changeBackground";
            if (active) {
                this.setState({active, stepId, data: stepData, init: true});
            } else {
                this.setState({active, init: true});
            }
        });
        console.log("here", this.state.init);
        document.addEventListener("shoot_keydown", () => {
            console.log("background next step", this.state.active);
            this.advance();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.active && !prevState.active) {
            this.changeBackground();
        }
    }

    changeBackground = () => {

        // scene.enqueueAction(
        //     instantiateFromPrefab(
        //         this.bulletPrefab,
        //         currentBulletId,
        //         {
        //             position,
        //             rotation: _rotation,
        //             scale
        //         },
        //         null,
        //         null,
        //         {
        //             bulletMovement: {
        //                 around: this.aroundBullets > 1,
        //                 initTime: startTimeForThisBullet,
        //                 bulletIndex,
        //                 moveRatio,
        //                 displacementRatio,
        //                 shooterId: gameObject.id,
        //                 shooterTag: gameObject._tags[0],
        //                 shooterComponentId: this.props.id
        //             }
        //         }
        //     )
        // );
    };

    update = (time) => {
        this.initListenToStateTransitions();
        const { scene } = this.props.availableComponent;
        // scene.scene.fog.near = 105 * Math.abs(Math.sin(time/100));
        scene.scene.fog.far =  Math.max(scene.scene.fog.near,(400 *Math.sin(time/1000)));
    };

    render() {
        return <div id={"rpgBackground"}>
            <h2>SimpleRPGBackground</h2>
            <div>active: {JSON.stringify(this.state.active)}</div>
            <div>last background step: {this.state.stepId}</div>
            <div>last background data: {JSON.stringify(this.state.data)}</div>
        </div>;
    }
}

SimpleRPGBackground.propTypes = {
    // transform: PropTypes.object.isRequired,
    // assetId: PropTypes.string.isRequired
};
