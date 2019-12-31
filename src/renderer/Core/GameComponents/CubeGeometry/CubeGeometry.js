import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

export class CubeGeometry extends React.Component {
  cube;

  loadCube = () => {
    const { transform, opacity, dimensions, color, tip } = this.props;
    const _dimensions = Object.values(dimensions) || [1, 1, 1];
    const geometry = new THREE.BoxGeometry(..._dimensions);
    const material = new THREE.MeshLambertMaterial({ color });
    opacity && (material.opacity = opacity);
    material.transparent = true;
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.castShadow = true;
    transform.add(this.cube);

    if (tip) {
      const height = _dimensions[1] * 0.7;
      const coneGeometry = new THREE.ConeBufferGeometry(
        _dimensions[0] * 0.7,
        height,
        4,
        1,
        false,
        Math.PI / 4
      );
      const cone = new THREE.Mesh(coneGeometry, material);
      cone.position.y = height;
      cone.position.y = 2 * 0.9;
      console.log(cone, "cone");
      cone.castShadow = true;
      transform.add(cone);
    }
  };

  start = () => {
    this.loadCube();
  };

  update = () => {};

  render() {
    return null;
  }
}

CubeGeometry.propTypes = {
  dimensions: PropTypes.object,
  mass: PropTypes.number,
  color: PropTypes.number,
  specialMaterial: PropTypes.string,
  tip: PropTypes.bool
};
