import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";
// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class EnemyBulletGeometry extends React.Component {
  sphereMesh;

  initBulletGeometry = () => {
    const { transform, opacity } = this.props;
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? 0xfa7911 : 0x290642
    });
    opacity && (material.opacity = opacity);
    this.sphereMesh = new THREE.Mesh(geometry, material);
    this.sphereMesh.castShadow = true;
    transform.add(this.sphereMesh);
  };

  start = () => {
    this.initBulletGeometry();
  };

  render() {
    return null;
  }
}

EnemyBulletGeometry.propTypes = {
  transform: PropTypes.object.isRequired
};
