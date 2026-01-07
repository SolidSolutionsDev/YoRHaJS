import React from "react";
import * as THREE from "three";

interface SphereGeometryProps {
  transform: THREE.Object3D;
  radius?: number;
  opacity?: number;
  castShadow?: boolean;
  selfSettings?: {
    color?: number | string;
    basicMaterial?: boolean;
  };
}

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class SphereGeometry extends React.Component<SphereGeometryProps> {
  sphereMesh: THREE.Mesh | undefined;

  radius = this.props.radius || 1;

  initSphereGeometry = () => {
    const { transform, opacity, selfSettings } = this.props;
    const settings = selfSettings || {};
    const color =
      settings.color || (Math.random() > 0.5 ? 0xfa7911 : 0x290642);
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = settings.basicMaterial
      ? new THREE.MeshBasicMaterial({
        color: color as number | string
      })
      : new THREE.MeshLambertMaterial({
        color: color as number | string
      });
    if (opacity) {
      material.opacity = opacity;
    }
    this.sphereMesh = new THREE.Mesh(geometry, material);
    this.sphereMesh.castShadow = !!this.props.castShadow;
    transform.add(this.sphereMesh);
  };

  start = () => {
    this.initSphereGeometry();
  };

  render() {
    return null;
  }
}

