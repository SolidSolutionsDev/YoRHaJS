import React from "react";
import * as THREE from "three";

interface AmbientLightProps {
  transform: THREE.Object3D;
  color?: number | string;
  intensity?: number;
}

export class AmbientLight extends React.Component<AmbientLightProps> {
  light: THREE.AmbientLight | undefined;

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

    if (this.light && color) {
      this.light.color.setHex(color as number);
    }

    if (this.light && intensity) {
      this.light.intensity = intensity;
    }
  };

  update = () => { };

  render() {
    return null;
  }
}

