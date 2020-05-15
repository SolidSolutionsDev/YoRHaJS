import React from "react";
import PropTypes from "prop-types";

import "./CSSLabelTo3D.css";

import * as THREE from "three";

//TODO: make this default to all gameObjects
export class CSSLabelTo3D extends React.Component {
  position = new THREE.Vector3(0, 0, 0);

  floatingDiv;
  customDiv = false;

  setHTML = html => {
    this.floatingDiv.dangerouslySetInnerHtml = html;
  };

  start = () => {
    //const { transform } = this.props;
    this.floatingDiv = this.createTextLabel();

    this.setHTML(`Label`);
  };

  onDestroy = () => {
    if (!this.floatingDiv) {
      return;
    }
    this.floatingDiv.parentNode.removeChild(this.floatingDiv);
  };

  get2DCoords = (position, camera) => {
    const vector = position.project(camera);
    vector.x = ((vector.x + 1) / 2) * window.innerWidth;
    vector.y = (-(vector.y - 1) / 2) * window.innerHeight;
    return vector;
  };

  createTextLabel = () => {
    const div = document.createElement("div");
    div.className = "text-label";
    div.style.width = 100;
    div.style.height = 100;
    document.body.appendChild(div);
    return div;
  };

  attachDiv = (divToAttach) => {
    // this.onDestroy();
    this.floatingDiv = divToAttach;
    document.body.appendChild(divToAttach);
    this.customDiv = true;
  };

  update = () => {
    this.updateCSS();
  };

  updateCSS() {
    const {transform, availableComponent, gameObject} = this.props;

    const id = gameObject.id;

    if (transform) {
      transform.getWorldPosition(this.position);
    }

    const coords2d = this.get2DCoords(
        this.position,
        availableComponent.scene.camera._main
    );
    this.floatingDiv.style.position = `absolute`;
    this.floatingDiv.style.pointerEvents = `none`;
    this.floatingDiv.style.left = `${coords2d.x}px`;
    this.floatingDiv.style.top = `${coords2d.y}px`;

    if (this.customDiv) {
      return;
    }

    this.floatingDiv.innerHTML = `${id}<span>${gameObject.id}</span>`;
  }
}

CSSLabelTo3D.propTypes = {
  availableComponent: PropTypes.object,
  registerUpdate: PropTypes.func,
  transform: PropTypes.object
};
