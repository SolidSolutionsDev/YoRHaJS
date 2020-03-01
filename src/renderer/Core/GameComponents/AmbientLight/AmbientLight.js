import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

export class AmbientLight extends React.Component {
  light;

  initLight = () => {
    const { transform } = this.props;
    this.light = new THREE.AmbientLight(0xffffff, 1);
    transform.add(this.light);
  };

  start = () => {
    this.initLight();
    this.updateLight();
  };

  updateLight = () => {
    const { color, intensity } = this.props;

    if (color) {
      this.light.color.setHex(color);
    }

    if (intensity) {
      this.light.intensity = intensity;
    }
  };

  update = () => {};

  render() {
    return null;
  }
}

AmbientLight.propTypes = {
  transform: PropTypes.object.isRequired
};
