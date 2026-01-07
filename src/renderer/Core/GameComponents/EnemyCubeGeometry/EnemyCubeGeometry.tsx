import React from "react";
import * as THREE from "three";

interface EnemyCubeGeometryProps {
  transform: THREE.Object3D;
  opacity?: number;
  dimensions?: { x?: number; y?: number; z?: number } | number[]; // Can be object or array based on Object.values usage in original code
  color?: number | string;
  tip?: boolean;
  mass?: number;
  specialMaterial?: string;
}

export class EnemyCubeGeometry extends React.Component<EnemyCubeGeometryProps> {
  cube: THREE.Mesh | undefined;

  loadCube = () => {
    const { transform, opacity, dimensions, color, tip } = this.props;
    // @ts-ignore
    const _dimensions = dimensions ? (Object.values(dimensions) as number[]) : [1, 1, 1];

    // Ensure we have 3 dimensions
    if (_dimensions.length < 3) {
      if (_dimensions.length === 0) _dimensions.push(1, 1, 1);
      else if (_dimensions.length === 1) _dimensions.push(_dimensions[0], _dimensions[0]);
    }

    const geometry = new THREE.BoxGeometry(_dimensions[0], _dimensions[1], _dimensions[2]);
    const material = new THREE.MeshLambertMaterial({ color: color as number | string | undefined });
    if (opacity) {
      material.opacity = opacity;
    }
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
      cone.position.y = 2 * 0.9; // Overwrites previous line? Keeping original logic.
      console.log(cone, "cone");
      cone.castShadow = true;
      transform.add(cone);
    }
  };

  start = () => {
    this.loadCube();
  };

  update = () => { };

  render() {
    return null;
  }
}

