import React from "react";
import PropTypes from "prop-types";
import "./SimpleRPGBackground.css";
import * as THREE from "three";
import {
  destroyGameObjectById,
  instantiateFromPrefab
} from "../../../../stores/scene/actions";
import { uniqueId } from "lodash";

// import { BackgroundCity } from "../../Nodes/backgroundCity";
// import TETSUO from "@SolidSolutionsDev/tetsuo";

export class SimpleRPGBackground extends React.Component {
  state = {
    init: false,
    soundPlaying: false,
    backgroundObjects: []
  };

  advance = () => {
    const { availableService } = this.props;
    const { stateMachine } = availableService;
    const { game } = stateMachine.stateMachines;
    if (this.state.active) {
      game.service.send("NEXT_STEP");
    }
  };

  initListenToStateTransitions = () => {
    if (this.state.init) {
      return;
    }
    const { availableService } = this.props;
    const { stateMachine } = availableService;
    const { game } = stateMachine.stateMachines;
    game.service.onTransition(current => {
      const stepId = current.context.stepsQueue[0];
      const stepData = current.context.constants.steps[stepId];
      const state = current.value;
      const active = current.value === "changeBackground";
      if (active) {
        this.setState({ active, stepId, data: stepData, init: true });
      } else {
        this.setState({ active: active, init: true });
      }
    });
    document.addEventListener("shoot_keydown", () => {
      this.advance();
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.active && !prevState.active) {
      this.cleanBackgrounds();
      this.changeBackground();
      this.advance();
    }
  }

  cleanBackgrounds = () => {
    const { scene } = this.props.availableComponent;
    this.state.backgroundObjects.forEach(backgroundGameObjectId => {
      scene.enqueueAction(
        destroyGameObjectById(backgroundGameObjectId, this.props.gameObject.id)
      );
    });
    // this.setState({backgroundObjects: []});
  };

  changeBackground = () => {
    const { scene } = this.props.availableComponent;
    const { backGroundPrefabs } = this.state.data;
    const newBackgroundObjectIds = backGroundPrefabs.map(backgroundPrefabId => {
      const newId = uniqueId(backgroundPrefabId);
      scene.enqueueAction(
        instantiateFromPrefab(
          backgroundPrefabId,
          newId,
          null,
          this.props.gameObject.id
        )
      );
      return newId;
    });
    this.setState({ backgroundObjects: newBackgroundObjectIds });
  };

  start = () => {};

  update = () => {
    this.initListenToStateTransitions();
    // const {scene} = this.props.availableComponent;
    // scene.scene.fog.near = 105 * Math.abs(Math.sin(time/100));
    // scene.scene.fog.far =  Math.max(scene.scene.fog.near,(400 *Math.sin(time/1000)));
  };

  render() {
    if (!this.props.debug) {
      return null;
    }
    return (
      <div id={"rpgBackground"}>
        <h2>SimpleRPGBackground</h2>
        <div>active: {JSON.stringify(this.state.active)}</div>
        <div>last background step: {this.state.stepId}</div>
        <div>last background data: {JSON.stringify(this.state.data)}</div>
        <div>
          background backGroundObjects:{" "}
          {JSON.stringify(this.state.backGroundObjects)}
        </div>
      </div>
    );
  }
}

SimpleRPGBackground.propTypes = {};
