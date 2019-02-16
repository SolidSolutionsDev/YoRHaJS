import React, { Component } from "react";

import PropTypes from "prop-types";

import * as GameContext from "../../GameContext";

export function makeGameComponent(WrappedComponent, name) {
  return class extends React.Component {
    component;

    state = { started: false };

    static propTypes = {
      transform: PropTypes.object.isRequired,
    };

    getDisplayName = () =>
      name ||  WrappedComponent.displayName || WrappedComponent.name || "Component";

    componentWillMount = () => {
      const _displayName = this.getDisplayName();
      this.props.registerComponent(this, _displayName);
    };

    componentWillUnmount() {
      console.log("component will unmount", this);
      this._onDestroy();
    }

    _onDestroy () {
      this.unmounting = true;
      if (this.onDestroy) {
        this.onDestroy();
      }
    }

    registerComponent = (component) => {
      this.component = component;
    };

    start = () => {
      this.component.start();
      this.setState({ started: true });
    };

    update = () => {
      const { started } = this.state;
      if (this.unmounting) {
        return;
      }
      if (started) {
        this.component.update();
        return;
      }
      this.start();
    };

    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return (
      <GameContext.Consumer>
        {(context) => { console.log(context); return (
          <WrappedComponent {...context} {...this.props} {...this.props.selfSettings} ref={this.registerComponent} />
        )}}
      </GameContext.Consumer>

      )
    }
  };
}

