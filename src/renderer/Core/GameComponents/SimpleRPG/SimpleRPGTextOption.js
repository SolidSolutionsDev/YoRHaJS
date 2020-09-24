import React from "react";

import { TextScreen } from "../../TETSUOComponents/textScreen";

import "./SimpleRPGTextOption.css";

export class SimpleRPGTextOption extends React.Component {
  defaultCommandIndex = 0;
  debug = true;
  textScreen;
  ready = false;
  materialNode = new TETSUO.MaterialNode();

  state = {
    init: false,
    selectedCommand: this.defaultCommandIndex,
    activeShoot: false,
    activeUp: false,
    activeDown: false,
  };

  initTetsuoScreen = () => {
    // init the text screen
    console.log("before new TextScreen");
    this.textScreen = new TextScreen({
      width: 1720,
      height: 720,

      // optional options
      backgroundColor: 0x1c1e1c,
      marginTop: 20,
      marginLeft: 6,
      paddingBottom: 400,
      paddingLeft: 400,
      opacity: 0.9,

      defaultTextStyle: {
        fontSize: 24,
        fill: 0x3cdc7c,
      },
    });

    console.log("___ after new TextScreen", this.textScreen);

    // build and prepare for render
    this.textScreen.prepare().then((mesh) => {
      console.log("___ after prepare", this.textScreen, this.materialNode);
      // this.materialNode.addItem("textScreen", this.textScreen.getNode());
      this.textScreen.getNode().connectTo(this.materialNode);
      // this.textScreen.quad.material.transparent = true;
      // // this.textScreen.quad.material.opacity = 0.6;
      // // add the output quad to the scene
      // // quad = textScreen.quad;
      // this.textScreen.quad.position.z = 0.2;
      // this.textScreen.quad.material.transparent = true;
      // this.props.transform.add(this.textScreen.quad);
      // this.ready = true;
    });
  };

  advance = () => {
    const { availableService } = this.props;
    const { stateMachine } = availableService;
    const { game } = stateMachine.stateMachines;
    if (this.state.active) {
      // console.log("text advance");
      game.service.send("NEXT_STEP");
    }
  };

  selectPreviousOption = () => {
    const { availableService } = this.props;
    const { stateMachine } = availableService;
    const { game } = stateMachine.stateMachines;
    if (this.state.active && this.state.value === "playTextOption") {
      // console.log("text selectPreviousOption");
      game.service.send("SELECT_PREVIOUS_OPTION");
    }
  };

  selectNextOption = () => {
    const { availableService } = this.props;
    const { stateMachine } = availableService;
    const { game } = stateMachine.stateMachines;
    if (this.state.active && this.state.value === "playTextOption") {
      // console.log("text selectNextOption");
      game.service.send("SELECT_NEXT_OPTION");
    }
  };

  initListenToStateTransitions = () => {
    if (this.state.init || !this.ready) {
      return;
    }
    const { availableService } = this.props;
    const { stateMachine } = availableService;
    // console.log(availableService);
    const { game } = stateMachine.stateMachines;
    game.service.onTransition((current) => {
      // console.log("transition", current);
      const stepId = current.context.stepsQueue[0];
      const stepData = current.context.constants.steps[stepId];
      const currentTextOption = current.context.currentTextOption;
      const state = current.value;
      const active =
        current.value === "playText" || current.value === "playTextOption";
      if (active) {
        this.setState({
          active,
          stepId,
          data: stepData,
          init: true,
          value: current.value,
          selectedCommand: currentTextOption,
        });
      } else {
        this.setState({ active, init: true, value: current.value });
      }
    });
    // console.log("here", this.state.init);
    this.registerEvents();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.ready) {
      // console.log("componentDidUpdate ready");
      if (this.state.active) {
        const textData = this.state.data;
        if (textData.text && textData.text.length === 0) {
          this.textScreen.clear();
          this.advance();
          return;
        }
        if (this.state.value === "playText") {
          const text = textData.text.join("\n");
          this.textScreen.addText(text);
        }
        if (this.state.value === "playTextOption") {
          const text = textData.question.text.join("\n");
          if (textData === prevState.data) {
            this.textScreen.selectAnswer(this.state.selectedCommand.toString());
          } else {
            const answers = textData.options.map((textOption, index) => {
              return { id: index.toString(), textContent: textOption.text };
            });
            this.textScreen.addQuestion(text, answers, textData.question);
          }
        }
      } else {
        if (this.state.value === "playBattle") {
          this.textScreen.clear();
        }
      }
    }

    // console.log("componentDidUpdate exit");
  }

  registerEvents = () => {
    Object.keys(this.eventsMap).forEach((event) => {
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
    },
  };

  start = () => {
    this.initTetsuoScreen();
  };

  updated = (time, deltaTime) => {
    if (this.ready) {
      this.initListenToStateTransitions();
      this.textScreen.update(deltaTime);
    }
  };

  buildCommandList = () => {
    if (this.state.value === "playTextOption") {
      return this.state.data.options.map((option, index) => {
        const textToFill = option.text;
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

SimpleRPGTextOption.propTypes = {
  // transform: PropTypes.object.isRequired,
  // assetId: PropTypes.string.isRequired
};
