import React from "react";

import PropTypes from "prop-types";
import * as THREE from "three";

export class PlayerShooterGeometry extends React.Component {
  mesh;

  pointer;
  leftEnergy;
  rightEnergy;
  centerSphere;

  start = () => {
    const { transform, gameObject } = this.props;
    // let geometry = new THREE.PlaneGeometry( 50, 50, 32 );
    // let geometry = new THREE.TetrahedronGeometry( this.props.dimensions.x, 0 );
    /*    let geometry = new THREE.BoxGeometry(
                  this.props.dimensions.x,
                  this.props.dimensions.y,
                  this.props.dimensions.z
                );*/

    // pointer
    let material = new THREE.MeshLambertMaterial({
      color: 0xefefef
      // side: THREE.DoubleSide
    });

    let path = new THREE.Shape();

    path.lineTo(0, 3);
    path.lineTo(1, 0.5);
    path.lineTo(0, 0);
    path.lineTo(-1, 0.5);
    path.lineTo(0, 3);

    let extrudeSettings = {
      amount: 0.75,
      bevelEnabled: false,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 1,
      bevelThickness: 1
    };

    let geometry = new THREE.ExtrudeGeometry(path, extrudeSettings);

    this.pointer = new THREE.Mesh(geometry, material);
    // this.pointer.position.set(0, 0, -1);

    this.pointer.castShadow = true;
    transform.add(this.pointer);

    // left part

    path = new THREE.Shape();

    path.lineTo(-0.1, -1);
    path.lineTo(-1.2, 0);
    path.lineTo(-1, 0.4);
    path.lineTo(0.1, 0);
    path.lineTo(-0.1, -1);

    extrudeSettings = {
      amount: 0.75,
      bevelEnabled: false,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 1,
      bevelThickness: 1
    };

    geometry = new THREE.ExtrudeGeometry(path, extrudeSettings);

    this.leftEnergy = new THREE.Mesh(geometry, material);
    // this.leftEnergy.position.set(0, 0, -1);

    this.leftEnergy.castShadow = true;
    transform.add(this.leftEnergy);

    // right part

    path = new THREE.Shape();

    path.lineTo(0.1, -1);
    path.lineTo(1.2, 0);
    path.lineTo(1, 0.4);
    path.lineTo(0.1, 0);
    path.lineTo(0.1, -1);

    extrudeSettings = {
      amount: 0.75,
      bevelEnabled: false,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 1,
      bevelThickness: 1
    };

    geometry = new THREE.ExtrudeGeometry(path, extrudeSettings);

    this.rightEnergy = new THREE.Mesh(geometry, material);
    // this.rightEnergy.position.set(0, 0, -1);

    this.rightEnergy.castShadow = true;
    transform.add(this.rightEnergy);

    geometry = new THREE.SphereGeometry(0.5, 32, 32);
    material = new THREE.MeshLambertMaterial({ color: 0x666666 });
    this.centerSphere = new THREE.Mesh(geometry, material);

    this.centerSphere.position.set(0, 0, 0.5);
    transform.add(this.centerSphere);

    this.props.availableService.physics.addNewBoxBody(
      gameObject.transform,
      { ...this.props, position: transform.position, collisionFilterGroup: 1 },
      this
    );
  };

  update = () => {
    // this.props.pivot.rotation.y += 0.01;
  };

  render() {
    // Wraps the input component in a container, without mutating it. Good!
    return null;
  }
}

PlayerShooterGeometry.propTypes = {
  dimensions: PropTypes.object.isRequired
};
