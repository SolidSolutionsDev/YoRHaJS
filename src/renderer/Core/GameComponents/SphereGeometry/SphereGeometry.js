import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";
import {rgbToHex} from "../../../../utils/unitConvertUtils";
// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class SphereGeometry extends React.Component {
  mesh;

  radius = this.props.radius || 1;
  color = new THREE.Color();

  updateColor = () => {
    const { selfSettings } = this.props;
    const { color } = selfSettings;
    // TODO: this random is to test for Yorha bullets, remove later
    let _color = Math.random() > 0.5 ? 0xfa7911 : 0x290642;
    if (color) {
      color.r ?
          this.color.setRGB(color.r, color.g, color.b) :
          this.color.setHex( color );
    }
    return color;
  }

  initSphereGeometry = () => {
    const { transform, opacity, selfSettings } = this.props;
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = selfSettings.basicMaterial
      ? new THREE.MeshBasicMaterial({
          color: this.color
        })
      : new THREE.MeshLambertMaterial({
          color: this.color
        });
    this.updateColor();
    opacity && (material.opacity = opacity);
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = this.props.castShadow;
    transform.add(this.mesh);
  };


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selfSettings.color !== this.props.selfSettings.color) {
      this.updateColor();
    }
  }

  update = ()=> {
  }

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
