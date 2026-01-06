import React from "react";
import "./SimpleRPGTextOption.css";

export class SimpleRPGTextOption extends React.Component {
  defaultCommandIndex = 0;
  debug = true;
  textScreen;
  ready = false;

  textMesh;

  state = {
    init: false,
    selectedCommand: this.defaultCommandIndex,
    activeShoot: false,
    activeUp: false,
    activeDown: false
  };

  initTetsuoScreen = () => {
    // Stubbed: TextScreen was a Tetsuo component
    this.ready = true;
  };

  advance = () => {
    const { availableService } = this.props;
    const { stateMachine } = availableService;
    const { game } = stateMachine.stateMachines;
    if (this.state.active) {
      game.service.send("NEXT_STEP");
    }
  };

  selectPreviousOption = () => {
    const { availableService } = this.props;
    const { stateMachine } = availableService;
    const { game } = stateMachine.stateMachines;
    if (this.state.active && this.state.value === "playTextOption") {
      game.service.send("SELECT_PREVIOUS_OPTION");
    }
  };

  selectNextOption = () => {
    const { availableService } = this.props;
    const { stateMachine } = availableService;
    const { game } = stateMachine.stateMachines;
    if (this.state.active && this.state.value === "playTextOption") {
      game.service.send("SELECT_NEXT_OPTION");
    }
  };

  initListenToStateTransitions = () => {
    if (this.state.init || !this.ready) {
      return;
    }
    const { availableService } = this.props;
    const { stateMachine } = availableService;
    const { game } = stateMachine.stateMachines;
    game.service.onTransition(current => {
      const stepId = current.context.stepsQueue[0];
      const stepData = current.context.constants.steps[stepId];
      const currentTextOption = current.context.currentTextOption;
      const active =
        current.value === "playText" || current.value === "playTextOption";
      if (active) {
        this.setState({
          active,
          stepId,
          data: stepData,
          init: true,
          value: current.value,
          selectedCommand: currentTextOption
        });
      } else {
        this.setState({ active, init: true, value: current.value });
      }
    });
    this.registerEvents();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Stubbed: No longer updating Tetsuo text screen
  }

  registerEvents = () => {
    Object.keys(this.eventsMap).forEach(event => {
      document.addEventListener(event, this.eventsMap[event]);
    });
  };

  eventsMap = {
    shoot_keydown: () => {
      this.advance();
    },
    moveUp_keydown: () => {
      this.selectPreviousOption();
    },
    moveDown_keydown: () => {
      this.selectNextOption();
    }
  };

  start = () => {
    this.initTetsuoScreen();
  };

  update = (time, deltaTime) => {
    if (this.ready) {
      this.initListenToStateTransitions();
    }
  };

  buildCommandList = () => {
    if (this.state.value === "playTextOption") {
      return this.state.data.options.map((option, index) => {
        const selected = index === this.state.selectedCommand;
        const className = selected ? "selectedOption" : "";
        return (
          <div key={"option" + index} className={className}>
            -{option.text}
          </div>
        );
      });
    }
    return null;
  };

  render() {
    if (!this.props.debug) {
      return null;
    }
    const commands = this.buildCommandList();
    return (
      <div id={"rpgText"}>
        <h2>SimpleRPGTextOption</h2>
        <div>active: {JSON.stringify(this.state.active)}</div>
        <div>type: {JSON.stringify(this.state.value)}</div>
        <div>selectedCommand: {JSON.stringify(this.state.selectedCommand)}</div>
        <div>{commands}</div>
        <div>last text step: {this.state.stepId}</div>
        <div>last text data: {JSON.stringify(this.state.data)}</div>
      </div>
    );
  }
}

SimpleRPGTextOption.propTypes = {};
