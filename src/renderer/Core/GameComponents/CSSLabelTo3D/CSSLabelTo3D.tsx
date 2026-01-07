import React from "react";
import "./CSSLabelTo3D.css";
import * as THREE from "three";

interface CSSLabelTo3DProps {
  transform?: THREE.Object3D;
  availableComponent: any;
  objectInputData: {
    id: string;
    objectType: string;
  };
  registerUpdate?: any;
}

export class CSSLabelTo3D extends React.Component<CSSLabelTo3DProps> {
  position = new THREE.Vector3(0, 0, 0);

  text: HTMLDivElement | undefined;

  setHTML = (html: string) => {
    // Original code had text.dangerouslySetInnerHtml = html which is invalid on DOM element.
    // It should be innerHTML on the DOM element.
    if (this.text) {
      this.text.innerHTML = html;
    }
  };

  start = () => {
    //const { transform } = this.props;
    this.text = this.createTextLabel();

    this.setHTML(`Label`);
  };

  onDestroy = () => {
    if (this.text && this.text.parentNode) {
      this.text.parentNode.removeChild(this.text);
    }
  };

  get2DCoords = (position: THREE.Vector3, camera: THREE.Camera) => {
    const vector = position.clone().project(camera);
    vector.x = ((vector.x + 1) / 2) * window.innerWidth;
    vector.y = (-(vector.y - 1) / 2) * window.innerHeight;
    return vector;
  };

  createTextLabel = () => {
    const div = document.createElement("div");
    div.className = "text-label";
    div.style.width = "100px"; // Added px
    div.style.height = "100px"; // Added px
    document.body.appendChild(div);
    return div;
  };

  update = () => {
    const { transform, availableComponent, objectInputData } = this.props;

    const id = objectInputData.id;

    if (transform) {
      transform.getWorldPosition(this.position);
    }

    const camera = availableComponent.scene.camera._main;
    if (!camera || !this.text) return;

    const coords2d = this.get2DCoords(
      this.position,
      camera
    );
    this.text.style.left = `${coords2d.x}px`;
    this.text.style.top = `${coords2d.y}px`;

    this.text.innerHTML = `${id}<span>${objectInputData.objectType}</span>`;
  };

  render = () => null;
}

