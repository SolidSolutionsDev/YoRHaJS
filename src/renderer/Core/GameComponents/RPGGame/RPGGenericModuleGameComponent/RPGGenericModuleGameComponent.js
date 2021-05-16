import React from "react";
import PropTypes from "prop-types";

/**
 * This is the RPGModuleGaameComponent super class
 * All RPGModules except kernel ? should derive from this
 */
export class RPGGenericModuleGameComponent extends React.Component {
  rpgKernelModule = this.props.parent.getComponent("RPGKernelComponent");
  state = {
    active: false
  };

  activate = () => {
    this.setState({ active: true });
    console.log(this.props.type, " activate ", this.state);
  };

  deactivate = () => {
    this.setState({ active: false });
    console.log(this.props.type, " deactivate ", this.state);
  };

  updateModule = (time, deltaTime) => {
    console.log("updating Module ", this.props.type);
  };

  start = () => {
    const { type } = this.props;
    this.rpgKernelModule.registerModule(type, this);
  };

  render = () => {
    const { active } = this.state;
    return (
      <div key={"module"} className={`menu ${active ? "" : "hidden"}`}>
        {this.props.type} Active : {active.toString()}
      </div>
    );
  };
}

RPGGenericModuleGameComponent.propTypes = {
  type: PropTypes.string.isRequired
};
