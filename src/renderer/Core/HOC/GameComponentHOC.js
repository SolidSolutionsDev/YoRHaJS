import React from "react";
import * as _ from "lodash";

import PropTypes from "prop-types";

import * as GameContext from "../../GameContext";

export function makeGameComponent(WrappedComponent, name) {

  return class extends React.Component {
    component;

    state = { started: false };

    uniqueId = _.uniqueId("component"); // for debug purposes

    static propTypes = {
      transform: PropTypes.object.isRequired
    };

    getDisplayName = () =>
      name ||
      WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component";

    constructor(props) {
      super(props);
      this.addDefaultRender(WrappedComponent);
      this.addDefaultStart(WrappedComponent);
      const _displayName = this.getDisplayName();
      props.registerComponent(this, _displayName);
    }

    addDefaultRender = (component) => {
      if (component.prototype.render){
        return;
      }
      component.prototype.render = () => {
        return null;
      }
    };

    addDefaultStart = (component) => {
      if (component.prototype.start){
        return;
      }
      component.prototype.start = () => {
        return null;
      }
    };

    componentWillUnmount() {
      // console.log(this.uniqueId + " component will UNmount ", this.getDisplayName());
      this._onDestroy();
    }

    _onDestroy() {
      this.unmounting = true;
      if (this.component.onDestroy) {
        this.component.onDestroy();
      }
    }

    registerComponent = component => {
      this.component = component;
    };

    start = () => {
      this.component.start();
      this.setState({ started: true });
    };

    update = ( time, deltaTime ) => {
      const { started } = this.state;
      if (this.unmounting) {
        return;
      }
      if (started) {
        this.component.update && this.component.update(time, deltaTime);
        return;
      }
      this.start();
    };

    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return (
        <GameContext.Consumer
          key={`${this.props._parentId}_component_${this.props.id}_consumer`}
        >
          {context => {
            return (
              <WrappedComponent
                key={`${this.props._parentId}_component_${this.props.id}`}
                {...context}
                {...this.props}
                {...this.props.selfSettings}
                ref={this.registerComponent}
              />
            );
          }}
        </GameContext.Consumer>
      );
    }
  };
}
