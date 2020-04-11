import React, { Component } from "react";

import * as THREE from "three";

export class GeometryUtilsService extends Component {

  getObjectTopParent = (object3D) => {
    const {parent} =  object3D;

    if (parent === null) {
      return object3D;
    }
    return this.getObjectTopParent(parent);
  };

  hardLookAt= (originObject,destinationObject) => {
    const sceneThree  = this.getObjectTopParent(originObject);
    const originalParent = originObject.parent;

    sceneThree.attach(originObject);

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    destinationObject.matrixWorld.decompose( position, quaternion, scale );
    originObject.quaternion.copy( quaternion );
    destinationObject.updateMatrixWorld( true );
    originObject.updateMatrix();

    originalParent.attach(originObject);
  };


  update = time => {
  };


  render() {
    return null;
  }
}
