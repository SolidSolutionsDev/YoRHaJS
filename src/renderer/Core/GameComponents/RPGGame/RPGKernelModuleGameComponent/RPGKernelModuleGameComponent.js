import React from "react";
import PropTypes from "prop-types";

// modules load and share, game logic, sound, launch events
// TODO: split these in the future?
export class RPGKernelModuleGameComponent extends React.Component {
  state = {
    modules: {},
    activeModule: undefined
  };
  rpgModuleManager = this.props.parent.getComponent("RPGGameComponent");

  update = (time, deltaTime) => {
    if (this.rpgModuleManager.isReady() && this.state.activeModule) {
      this.state.activeModule.updateModule(time, deltaTime);
    }
  };

  getCurrentModuleSceneId = () => {
    return this.props.currentModuleScene;
  };

  getCurrentModuleSceneType = () => {
    console.log(this.props.moduleScenes, this.props.currentModuleScene);
    return this.props.moduleScenes[this.getCurrentModuleSceneId()].type;
  };

  getCurrentModuleSceneInitData = () => {
    return this.props.moduleScenes[this.getCurrentModuleSceneId()];
  };

  init = modules => {
    const sceneId = this.getCurrentModuleSceneId();
    const sceneType = this.getCurrentModuleSceneType();
    this.setState({ modules: modules, sceneId, sceneType });
    this.swapModule(modules);
  };

  changeCurrentModuleScene = newSceneId => {
    const { availableComponent, enqueueUpdateSelf } = this.props;
    const { scene } = availableComponent;
    enqueueUpdateSelf({
      currentModuleScene: newSceneId
    });
  };

  swapModule = (modules = this.state.modules) => {
    console.log("[RPGKernel] - swapping Module", this);
    // const {modules} = this.state;
    const { currentModuleScene } = this.props;
    const _currentModuleType = this.getCurrentModuleSceneType();
    const _newActiveModule = modules[_currentModuleType];
    console.log(modules, currentModuleScene, _newActiveModule);
    this.setState({ activeModule: _newActiveModule });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      !this.state.activeModule ||
      this.props.currentModuleScene !== prevProps.currentModuleScene
    ) {
      console.log(this.props.currentModuleScene, prevProps.currentModuleScene);
      this.swapModule();
      return;
    }
    if (
      this.state.activeModule &&
      this.state.activeModule !== prevState.activeModule
    ) {
      console.log(this.state.activeModule, prevState.activeModule);
      if (prevState.activeModule) {
        prevState.activeModule.deactivate();
      }
      this.state.activeModule.activate();
    }
  }

  registerModule = (type, module) => {
    this.rpgModuleManager.registerModule(type, module);
  };

  playMusic = () => {};
  stopMusic = () => {};
  changeMusic = () => {};
  resumeMusic = () => {};
  restartMusic = () => {};

  start = () => {
    const { type } = this.props;
    this.rpgModuleManager.registerModule(type, this);
  };

  render = () => {
    return this.state.ready ? (
      <div key={"module"}>Kernel {this.state.activeModule}</div>
    ) : null;
  };
}

// todo : use typescript to split types
const moduleScenePropTypeShape = {
  type: PropTypes.string.isRequired,
  ai: PropTypes.bool,
  // battle
  enemiesParty: PropTypes.array,
  // menu
  defaultEntry: PropTypes.string,
  entries: PropTypes.array,
  // field
  availableBattles: PropTypes.object,
  triggers: PropTypes.object,
  scenario: PropTypes.string.isRequired,
  defaultConnection: PropTypes.string.isRequired
};

RPGKernelModuleGameComponent.propTypes = {
  // initializationData: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  // soundPlayer:PropTypes.string.isRequired,
  // battleModule:PropTypes.string.isRequired,
  // menuModule:PropTypes.string.isRequired,
  // fieldModule:PropTypes.string,
  currentModuleScene: PropTypes.string.isRequired,
  moduleScenes: PropTypes.objectOf(PropTypes.shape(moduleScenePropTypeShape))
};
