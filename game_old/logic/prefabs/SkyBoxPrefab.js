import React, { Component } from "react";
import { GameObject } from "../GameObject";
import { isSkybox } from "../components/SkyboxComponent";

export class SkyboxPrefab extends GameObject {
  buildComponents = () => {
    this.parameters = this.props.parameters ? this.props.parameters : {};
    this.parameters = Object.assign({ skybox: {} }, this.parameters);
    Object.assign(this.components, isSkybox(this, this.parameters.skybox));
  };

  initComponents() {
    this.mesh.add(this.components.skybox.mesh);
  }

  update = () => {
    this.mesh.rotation.y += 0.0001;
  };

  render() {
    return null;
  }
}
