import React, { Component } from "react";

import * as THREE from "three";
import { ExplodeModifier } from "three/examples/jsm/modifiers/ExplodeModifier";
import { TessellateModifier } from "three/examples/jsm/modifiers/TessellateModifier";

export class GeometryUtilsService extends Component {

  getObjectTopParent = (object3D) => {
    const {parent} =  object3D;

    if (parent === null) {
      return object3D;
    }
    return this.getObjectTopParent(parent);
  };


  hardLookAt = (originObject,destinationObject) => {
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


  randomExplosionDirectionFunction = () => {
    const faceDisplacement = 10 * ( 0.5 - Math.random() );
    return new THREE.Vector3(faceDisplacement,faceDisplacement,faceDisplacement);
  }


    explosionDirectionFunctions = {
        random: this.randomExplosionDirectionFunction,
        default: this.randomExplosionDirectionFunction,
    }
  generateExplodableBufferGeometryFromGeometry = (geometry, displacementFunctionId) => {

      const tessellateModifier = new TessellateModifier( 8 );

      for ( let i = 0; i < 6; i ++ ) {

          tessellateModifier.modify( geometry );

      }

      const explodeModifier = new ExplodeModifier();
      explodeModifier.modify( geometry );

      const numFaces = geometry.faces.length;
      const _newGeometry = new THREE.BufferGeometry().fromGeometry( geometry );
      const displacement = new Float32Array( numFaces * 3 * 3 );

      for ( let faceId = 0; faceId < numFaces; faceId ++ ) {

          let index = 9 * faceId;

          const faceDisplacement = this.explosionDirectionFunctions[displacementFunctionId] ? this.explosionDirectionFunctions[displacementFunctionId](): this.explosionDirectionFunctions.default();

          for ( let i = 0; i < 3; i ++ ) {
              displacement[ index + ( 3 * i )     ] = faceDisplacement.x;
              displacement[ index + ( 3 * i ) + 1 ] = faceDisplacement.y;
              displacement[ index + ( 3 * i ) + 2 ] = faceDisplacement.z;
          }

      }
      _newGeometry.setAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );
      return _newGeometry;

  }


  update = time => {
  };


  render() {
    return null;
  }
}
