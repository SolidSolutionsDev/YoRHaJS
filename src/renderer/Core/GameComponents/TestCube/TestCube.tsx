import React from "react";
import * as THREE from "three";

interface TestCubeProps {
  transform: THREE.Object3D;
  gameObject: any;
  opacity?: number;
  rotationX?: number;
}

export class TestCube extends React.Component<TestCubeProps> {
  cube: THREE.Mesh | undefined;

  loadCube = () => {
    const { transform, opacity } = this.props;
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    if (opacity) {
      material.opacity = opacity;
    }
    material.transparent = true;
    this.cube = new THREE.Mesh(geometry, material);
    transform.add(this.cube);
  };

  start = () => {
    this.loadCube();
  };

  update = (_time: number, deltaTime: number) => {
    if (this.props.rotationX) {
      this.props.gameObject.transform.rotation.x += (this.props.rotationX * (deltaTime / 10));
    }
  };

  render() {
    return null;
  }
}

