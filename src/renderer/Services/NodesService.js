import { Component } from "react";
import * as THREE from "three";

export class NodesService extends Component {
  getTextureFromPremade = premade => {
    return null;
  };

  getMaterialFromPremade = premade => {
    return new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  };

  update = time => { };

  render() {
    return null;
  }
}
