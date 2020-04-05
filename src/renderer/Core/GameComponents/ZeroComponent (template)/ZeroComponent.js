import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export class ZeroComponent extends React.Component {

  start = () => {
  };

  update = () => {};

  render() {
    return null;
  }
}

ZeroComponent.propTypes = {
  transform: PropTypes.object.isRequired
};
