import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class PlayerBulletGeometry extends React.Component {
  cube;

  initBulletGeometry = () => {
    const { transform, opacity } = this.props;
    const geometry = new THREE.BoxGeometry(1, 3, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xf8f9e7 });
    opacity && (material.opacity = opacity);
    // material.transparent = true;
    this.cube = new THREE.Mesh(geometry, material);
    transform.add(this.cube);
  };


  start = () => {
    this.initBulletGeometry();
  };

  render() {
    return null;
  }
}

PlayerBulletGeometry.propTypes = {
  transform: PropTypes.object.isRequired
};
