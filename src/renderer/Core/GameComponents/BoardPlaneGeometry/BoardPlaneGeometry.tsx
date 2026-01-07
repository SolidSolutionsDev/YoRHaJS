import React from "react";
import * as THREE from "three";

interface BoardPlaneGeometryProps {
  transform: THREE.Object3D;
  gameObject: any;
  dimensions: { x: number; y: number; z: number };
  availableService: any; // Ideally this should be typed with IPhysicsService
  // pivot?: THREE.Object3D; // inferred from update method in original JS, seemingly unused though
}

export class BoardPlaneGeometry extends React.Component<BoardPlaneGeometryProps> {
  mesh: THREE.Mesh | undefined;

  initBoard = () => {
    const { transform, gameObject } = this.props;
    // let geometry = new THREE.PlaneGeometry( 50, 50, 32 );
    let geometry = new THREE.BoxGeometry(
      this.props.dimensions.x,
      this.props.dimensions.y,
      this.props.dimensions.z
    );
    let material = new THREE.MeshLambertMaterial({
      color: 0xd1cdb7,
      side: THREE.DoubleSide
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.receiveShadow = true;
    transform.add(this.mesh);

    if (this.props.availableService && this.props.availableService.physics) {
      this.props.availableService.physics.addNewBoxBody(
        gameObject.transform,
        this.props,
        this
      );
    }
  };

  start = () => {
    this.initBoard();
  };

  update = () => {
    // this.props.pivot.rotation.y += 0.01;
  };

  render() {
    // Wraps the input component in a container, without mutating it. Good!
    return null;
  }
}

