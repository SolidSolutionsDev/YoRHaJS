import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

export class DirectionalLight extends React.Component {
  light;

  initLight = () => {
    const { transform } = this.props;
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    transform.add(this.light);
  };

  start = () => {
    this.initLight();
    this.updateLight();
  };

  updateLight = () => {
    const { castShadow, color, intensity, position } = this.props;

    if (castShadow) {
      this.light.castShadow = true;
      this.light.shadow.mapSize = new THREE.Vector2(1024, 1024);
    }

    if (color) {
      this.light.color.setHex(color);
    }

    if (intensity) {
      this.light.intensity = intensity;
    }

    if (position) {
      this.light.position.x = position.x || this.light.position.x ;
      this.light.position.y = position.y || this.light.position.y ;
      this.light.position.z = position.z || this.light.position.z ;
    }
  };

  update = () => {
  };

  render() {
    return null;
  }
}

DirectionalLight.propTypes = {
  transform: PropTypes.object.isRequired,
};
