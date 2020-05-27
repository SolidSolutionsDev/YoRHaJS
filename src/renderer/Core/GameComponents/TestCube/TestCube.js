import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

export class TestCube extends React.Component {
  cube;

  loadCube = () => {
    const { transform, opacity } = this.props;
    const geometry = new THREE.BoxGeometry(.3, .3, .3);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    opacity && (material.opacity = opacity);
    material.transparent = true;
    this.cube = new THREE.Mesh(geometry, material);
    transform.add(this.cube);
  };

  start = () => {
    this.loadCube();
  };

  update = (time, deltaTime) => {
    this.props.gameObject.transform.rotation.x += (this.props.rotationX * (deltaTime/10));
    this.props.gameObject.transform.rotation.z += (this.props.rotationZ * (deltaTime/3));
  };

  render() {
    return null;
  }
}

TestCube.propTypes = {
  transform: PropTypes.object.isRequired
};
