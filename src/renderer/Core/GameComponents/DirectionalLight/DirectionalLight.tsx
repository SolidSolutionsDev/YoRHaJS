import React from "react";
import * as THREE from "three";

interface DirectionalLightProps {
  transform: THREE.Object3D;
  castShadow?: boolean;
  color?: number | string;
  intensity?: number;
  position?: { x?: number; y?: number; z?: number };
}

export class DirectionalLight extends React.Component<DirectionalLightProps> {
  light: THREE.DirectionalLight | undefined;

  initLight = () => {
    const { transform } = this.props;
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    transform.add(this.light);
  };

  start = () => {
    this.initLight();
    this.updateLight();
  };

  updateLight = () => {
    const { castShadow, color, intensity, position } = this.props;

    if (!this.light) return;

    if (castShadow) {
      this.light.castShadow = true;
      this.light.shadow.mapSize = new THREE.Vector2(2048, 2048);
      // @ts-ignore
      this.light.shadow.darkness = 0.5; // Deprecated property
      // console.log(this.light);

      this.light.shadow.camera.left = -130;
      this.light.shadow.camera.right = 130;
      this.light.shadow.camera.top = 130;
      this.light.shadow.camera.bottom = -150;
    }

    if (color) {
      this.light.color.setHex(color as number);
    }

    if (intensity) {
      this.light.intensity = intensity;
    }

    if (position) {
      this.light.position.x = position.x || this.light.position.x;
      this.light.position.y = position.y || this.light.position.y;
      this.light.position.z = position.z || this.light.position.z;
    }
  };

  update = () => { };

  render() {
    return null;
  }
}

