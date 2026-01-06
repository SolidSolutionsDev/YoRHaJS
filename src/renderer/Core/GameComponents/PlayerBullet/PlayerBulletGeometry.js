import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class PlayerBulletGeometry extends React.Component {
  cube;

  defaults = {
    color: 0xf8f9e7,
    dimensions: [1, 3, 1]
  };

  initBulletGeometry = () => {
    const { transform, opacity, color, dimensions } = this.props;
    const _dimensions = dimensions || this.defaults.dimensions;
    const geometry = new THREE.BoxGeometry(..._dimensions);
    const material = new THREE.MeshBasicMaterial({
      color: color || this.defaults.color
    });
    opacity && (material.opacity = opacity);
    // material.transparent = true;
    this.cube = new THREE.Mesh(geometry, material);
    transform.add(this.cube);
  };

  update = () => {
    if (this.cube) {
      this.cube.material.opacity = 0.6 + Math.random() * 0.4;
      this.cube.scale.x = 0.8 + Math.random() * 0.4;
      this.cube.scale.z = 0.8 + Math.random() * 0.4;
    }
  };

  start = () => {
    this.initBulletGeometry();
    if (this.cube) {
      this.cube.material.transparent = true;
    }
  };

  render() {
    return null;
  }
}

PlayerBulletGeometry.propTypes = {
  transform: PropTypes.object.isRequired,
  color: PropTypes.number,
  dimensions: PropTypes.array
};
