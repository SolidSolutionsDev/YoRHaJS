import React from "react";
import { Camera } from "../../render/Camera";
import { isTraveler } from "../components/TravelerComponent";

import * as THREE from "three"; // TODO:Remove debug

export class DynamicCameraPrefab extends Camera {
  componentDidMount() {
    super.componentDidMount();
    Object.assign(this, isTraveler(this.mesh));
    document.addEventListener("camera_change", () => {
      this.randomTravel();
      this.playSound();
    });
  }

  randomTravel = () => {
    this.travel.travelTo(
      new THREE.Vector3(
        60 - 120 * Math.random(),
        60 - 120 * Math.random(),
        60 - 120 * Math.random()
      ),
      1000,
      { target: new THREE.Vector3(0, 0, 0) }
    );
  };

  render() {
    return <div>DynamicCameraPrefab</div>;
  }
}
