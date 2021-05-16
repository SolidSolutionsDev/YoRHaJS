import React from "react";
import "./SimpleRPGIntro.css";

export class SimpleRPGIntro extends React.Component {
  state = {
    init: false
  };

  componentDidMount() {}

  update = () => {
    if (this.state.init) {
      return;
    }
    const { availableService } = this.props;
    const { stateMachine } = availableService;
    const { game } = stateMachine.stateMachines;
    game.service.onTransition(current => {
      this.setState({
        active: current.value === "intro",
        data: current.context.constants.intro,
        init: true
      });
    });
    document.addEventListener("shoot_keydown", () => {
      if (this.state.active) {
        game.service.send("START");
      }
    });
  };

  render() {
    if (!this.state.init) {
      return null;
    }
    return (
      <div id="rpgIntro" className={this.state.active ? "" : "inactive"}>
        <h1 className={"rpgIntro-subTitle"}>{this.state.data.title}</h1>
        <h2 style={{ border: "none" }}>{this.state.data.subTitle}</h2>
      </div>
    );
  }
}

SimpleRPGIntro.propTypes = {};
