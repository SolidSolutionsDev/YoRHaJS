import React from "react";
import PropTypes from "prop-types";

import "./CSSLabelTo3D.css";

import * as THREE from "three";

//TODO: make this default to all gameObjects
export class CSSLabelTo3D extends React.Component {
  position = new THREE.Vector3(0, 0, 0);

  floatingDivs = [];
  customDiv = false;

  setHTML = html => {
    this.floatingDivs[0].dangerouslySetInnerHtml = html;
  };

  start = () => {
    //const { transform } = this.props;
    this.floatingDivs.push(this.createTextLabel());

    this.setHTML(`Label`);
  };

  onDestroy = () => {
    if (!this.floatingDivs) {
      return;
    }
    this.floatingDivs.forEach(floatingDiv =>
      floatingDiv.parentNode.removeChild(floatingDiv)
    );
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

  attachDiv = divToAttach => {
    // this.onDestroy();
    this.floatingDivs.push(divToAttach);
    document.body.appendChild(divToAttach);
    this.customDiv = true;
  };

  update = () => {
    this.updateCSS();
  };

  updateCSS() {
    const { transform, availableComponent, gameObject } = this.props;

    const id = gameObject.id;

    if (transform) {
      transform.getWorldPosition(this.position);
    }

    const coords2d = this.get2DCoords(
      this.position,
      availableComponent.scene.camera._main
    );
    this.floatingDivs.forEach(floatingDiv => {
      floatingDiv.style.position = `absolute`;
      floatingDiv.style.pointerEvents = `none`;
      floatingDiv.style.left = `${coords2d.x}px`;
      floatingDiv.style.top = `${coords2d.y}px`;
    });
    if (this.customDiv) {
      return;
    }

    this.floatingDivs[0].innerHTML = `${id}<span>${gameObject.id}</span>`;
  }
}

CSSLabelTo3D.propTypes = {
  availableComponent: PropTypes.object,
  registerUpdate: PropTypes.func,
  transform: PropTypes.object
};
