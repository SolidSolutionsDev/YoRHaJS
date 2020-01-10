import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";
// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class SphereGeometry extends React.Component {
  sphereMesh;

  radius = this.props.radius || 1;

  initSphereGeometry = () => {
    const { transform, opacity, selfSettings } = this.props;
    const color =
      selfSettings.color || (Math.random() > 0.5 ? 0xfa7911 : 0x290642);
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = selfSettings.basicMaterial
      ? new THREE.MeshBasicMaterial({
          color: color
        })
      : new THREE.MeshLambertMaterial({
          color: color
        });
    opacity && (material.opacity = opacity);
    this.sphereMesh = new THREE.Mesh(geometry, material);
    this.sphereMesh.castShadow = this.props.castShadow;
    transform.add(this.sphereMesh);
  };

  start = () => {
    this.initSphereGeometry();
  };

  render() {
    return null;
  }
}

SphereGeometry.propTypes = {
  transform: PropTypes.object.isRequired
};
