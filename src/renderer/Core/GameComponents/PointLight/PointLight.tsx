import React from "react";
import * as THREE from "three";

interface PointLightProps {
  transform: THREE.Object3D;
  castShadow?: boolean;
  color?: number | string;
  intensity?: number;
  distance?: number;
}

export class PointLight extends React.Component<PointLightProps> {
  light: THREE.PointLight | undefined;

  initLight = () => {
    const { transform } = this.props;
    this.light = new THREE.PointLight(0xffffff, 1);
    transform.add(this.light);
  };

  start = () => {
    this.initLight();
    this.updateLight();
  };

  updateLight = () => {
    const { castShadow, color, intensity, distance } = this.props;

    if (!this.light) return;

    if (castShadow) {
      this.light.castShadow = true;
      this.light.shadow.mapSize = new THREE.Vector2(1024, 1024);
    }

    if (color) {
      this.light.color.setHex(color as number);
    }

    if (intensity) {
      this.light.intensity = intensity;
    }

    if (distance) {
      this.light.distance = distance;
    }
  };

  update = () => { };

  render() {
    return null;
  }
}

