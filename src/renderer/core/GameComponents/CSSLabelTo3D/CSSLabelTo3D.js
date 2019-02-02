import React from "react";
import PropTypes from "prop-types";

import "./CSSLabelTo3D.css";

import * as THREE from "three";

export class CSSLabelTo3D extends React.Component {
  position = new THREE.Vector3(0, 0, 0);

  text;

  setHTML = (html) => {
    this.text.dangerouslySetInnerHtml = html;
  };

  start = () => {
    const { transform } = this.props;
    this.text = this.createTextLabel();

    this.setHTML(`Label`);
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

  update = () => {
    const { transform, availableComponent, objectInputData } = this.props;

    const id = objectInputData.id;

    if (transform) {
      transform.getWorldPosition(this.position);
    }

    const coords2d = this.get2DCoords(
      this.position,
      availableComponent.camera.camera,
    );
    this.text.style.left = `${coords2d.x}px`;
    this.text.style.top = `${coords2d.y}px`;

    this.text.innerHTML = `${id}<span>${objectInputData.objectType}</span>`;
  };

  render = () => null;
}

CSSLabelTo3D.propTypes = {
  objectInputData: PropTypes.object,
  availableComponent: PropTypes.object,
  registerUpdate: PropTypes.func,
  transform: PropTypes.object,
};
